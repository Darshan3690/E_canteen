"use server";

/**
 * Server Actions for Manager Onboarding Wizard
 * All data validation and database operations happen server-side
 */

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import {
  validateBasicInfo,
  validateBranding,
  validateOperatingHours,
  validateTokenConfig,
  validateMenuItem,
  isCanteenOpenNow,
  BasicInfoData,
  BrandingData,
  OperatingHoursData,
  TokenConfigData,
  MenuItemData,
  OnboardingErrors,
} from "@/lib/onboarding-validation";

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function parseDataUrl(dataUrl: string): { mime: string; bytes: Buffer } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image data URL");
  }
  const mime = match[1];
  const base64 = match[2];
  return { mime, bytes: Buffer.from(base64, "base64") };
}

function extensionFromMime(mime: string) {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    default:
      return "bin";
  }
}

async function getClerkNameAndEmail(userId: string): Promise<{ name: string; email: string }> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const name =
      user.fullName ??
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ??
      "";

    const primary = user.emailAddresses?.find(
      (e: { id: string; emailAddress: string }) => e.id === user.primaryEmailAddressId
    );
    const email = primary?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "";

    return {
      name: name || "Manager",
      email: email || `${userId}@local.invalid`,
    };
  } catch {
    return {
      name: "Manager",
      email: `${userId}@local.invalid`,
    };
  }
}

async function uploadBrandingDataUrl(params: {
  userId: string;
  folder: "logos" | "covers";
  dataUrl: string;
  filenamePrefix: string;
}): Promise<string> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage upload requires server credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, then restart the dev server."
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { mime, bytes } = parseDataUrl(params.dataUrl);
  const ext = extensionFromMime(mime);
  const bucket = params.folder;
  const objectPath = `${params.userId}/${Date.now()}-${sanitizeFilename(params.filenamePrefix)}.${ext}`;

  const blob = new Blob([new Uint8Array(bytes)], { type: mime });
  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, blob, {
    contentType: mime,
    upsert: true,
  });

  if (uploadError) {
    throw new Error(uploadError.message || "Failed to upload image to storage");
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  if (!publicData?.publicUrl) {
    throw new Error("Upload succeeded but failed to generate public URL");
  }

  return publicData.publicUrl;
}

/**
 * Step 1: Validate and store basic canteen information
 */
export async function validateBasicInfoAction(
  data: BasicInfoData
): Promise<{ success: boolean; errors?: OnboardingErrors }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, errors: { auth: "Not authenticated" } };
  }

  const errors = await validateBasicInfo(data, prisma);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}

/**
 * Step 2: Validate branding data
 */
export async function validateBrandingAction(
  data: BrandingData
): Promise<{ success: boolean; errors?: OnboardingErrors }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, errors: { auth: "Not authenticated" } };
  }

  const errors = validateBranding(data);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}

/**
 * Step 3: Validate operating hours
 */
export async function validateOperatingHoursAction(
  data: OperatingHoursData
): Promise<{ success: boolean; errors?: OnboardingErrors }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, errors: { auth: "Not authenticated" } };
  }

  const errors = validateOperatingHours(data);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}

/**
 * Step 4: Validate token configuration
 */
export async function validateTokenConfigAction(
  data: TokenConfigData
): Promise<{ success: boolean; errors?: OnboardingErrors }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, errors: { auth: "Not authenticated" } };
  }

  const errors = await validateTokenConfig(data, prisma);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}

/**
 * Final Action: Complete onboarding and create canteen
 * This transaction creates:
 * 1. Canteen record
 * 2. CanteenManager mapping
 * 3. Updates Profile.onboarded = true
 * 4. First menu item (optional)
 */
export async function completeOnboardingAction(
  onboardingData: {
    basic: BasicInfoData;
    branding: BrandingData;
    hours: OperatingHoursData;
    token: TokenConfigData;
    menuItem?: MenuItemData;
  }
): Promise<{ success: boolean; canteenId?: string; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Re-validate all data server-side
    const basicErrors = await validateBasicInfo(onboardingData.basic, prisma);
    const brandingErrors = validateBranding(onboardingData.branding);
    const hoursErrors = validateOperatingHours(onboardingData.hours);
    const tokenErrors = await validateTokenConfig(onboardingData.token, prisma);

    const allErrors = { ...basicErrors, ...brandingErrors, ...hoursErrors, ...tokenErrors };

    if (Object.keys(allErrors).length > 0) {
      return { success: false, error: "Validation failed" };
    }

    // Optional menu item validation
    if (onboardingData.menuItem) {
      const menuErrors = validateMenuItem(onboardingData.menuItem);
      if (Object.keys(menuErrors).length > 0) {
        return { success: false, error: "Menu item validation failed" };
      }
    }

    // Ensure we have required Profile fields available (outside transaction)
    const clerkProfile = await getClerkNameAndEmail(userId);

    // Step 1 — Upload images (outside transaction)
    const isDataUrl = (value?: string) => !!value && value.startsWith("data:");

    const logoUrl = onboardingData.branding.logoUrl && !onboardingData.branding.skipBranding
      ? isDataUrl(onboardingData.branding.logoUrl)
        ? await uploadBrandingDataUrl({
            userId,
            folder: "logos",
            dataUrl: onboardingData.branding.logoUrl,
            filenamePrefix: "logo",
          })
        : onboardingData.branding.logoUrl
      : null;

    const coverUrl = onboardingData.branding.coverImageUrl && !onboardingData.branding.skipBranding
      ? isDataUrl(onboardingData.branding.coverImageUrl)
        ? await uploadBrandingDataUrl({
            userId,
            folder: "covers",
            dataUrl: onboardingData.branding.coverImageUrl,
            filenamePrefix: "cover",
          })
        : onboardingData.branding.coverImageUrl
      : null;

    // Transaction: Create canteen, manager mapping, and optional menu item
    const result = await prisma.$transaction(async (tx: any) => {
      // Ensure Profile exists for this Clerk user (required for FK on CanteenManager.managerId)
      await tx.profile.upsert({
        where: { id: userId },
        update: {
          name: clerkProfile.name,
          email: clerkProfile.email,
          role: "manager",
        },
        create: {
          id: userId,
          name: clerkProfile.name,
          email: clerkProfile.email,
          role: "manager",
        },
      });

      // Create Canteen
      const canteen = await tx.canteen.create({
        data: {
          name: onboardingData.basic.name.trim(),
          description: onboardingData.basic.description?.trim(),
          location: onboardingData.basic.location.trim(),
          contactNumber: onboardingData.basic.contactNumber.trim(),
          contactEmail: onboardingData.basic.contactEmail?.trim(),
          logoUrl: logoUrl || undefined,
          coverImageUrl: coverUrl || undefined,
          openingTime: onboardingData.hours.openingTime,
          closingTime: onboardingData.hours.closingTime,
          workingDays: JSON.stringify(onboardingData.hours.workingDays),
          tokenPrefix: onboardingData.token.tokenPrefix,
          startingTokenNumber: onboardingData.token.startingTokenNumber,
          currentTokenNumber: onboardingData.token.startingTokenNumber,
          isActive: true,
          isOpenNow: isCanteenOpenNow(
            onboardingData.hours.openingTime,
            onboardingData.hours.closingTime,
            onboardingData.hours.workingDays
          ),
        },
      });

      // Create CanteenManager mapping
      await tx.canteenManager.create({
        data: {
          managerId: userId,
          canteenId: canteen.id,
          role: "OWNER",
          isActive: true,
        },
      });

      // Mark profile as onboarded
      await tx.profile.update({
        where: { id: userId },
        data: { onboarded: true } as any,
      });

      // Create first menu item if provided
      if (onboardingData.menuItem) {
        await tx.menuItem.create({
          data: {
            name: onboardingData.menuItem.name.trim(),
            description: onboardingData.menuItem.description?.trim() || null,
            price: onboardingData.menuItem.price,
            prepTime: onboardingData.menuItem.prepTime || null,
            isAvailable: true,
            canteenId: canteen.id,
          } as any,
        });
      }

      return canteen;
    });

    return { success: true, canteenId: result.id };
  } catch (error) {
    console.error("Onboarding completion error:", error);
    return { success: false, error: "Failed to complete onboarding" };
  }
}

/**
 * Check if user already has a canteen (if they reload during wizard)
 */
export async function getUserCanteenId(): Promise<string | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const canteenManager = await (prisma as any).canteenManager.findFirst({
      where: { managerId: userId, isActive: true },
    });

    return canteenManager?.canteenId || null;
  } catch (error) {
    console.error("Error fetching canteen:", error);
    return null;
  }
}

/**
 * Upload file to Supabase Storage
 * This would be a separate server action or API route
 * For now, returning a placeholder URL
 */
export async function uploadToSupabaseStorage(file: File, folder: string): Promise<string> {
  // This would integrate with Supabase client
  // For now, returning placeholder
  console.log(`File upload placeholder: ${file.name} to ${folder}`);
  return `https://placeholder-cdn.example.com/${folder}/${file.name}`;
}
