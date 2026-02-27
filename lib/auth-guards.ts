/**
 * Authorization Guard Function
 * Server-side check for manager canteen access
 * Used in app/manager page to ensure only onboarded managers access dashboard
 */

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface CanteenAuthResult {
  isAuthorized: boolean;
  canteenId?: string;
  canteenName?: string;
  userRole?: string;
  message?: string;
}

/**
 * Check if user is an authorized canteen manager with an active canteen
 */
export async function checkCanteenAuth(): Promise<CanteenAuthResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        isAuthorized: false,
        message: "Not authenticated",
      };
    }

    // Check if user has a canteen
    const canteenManager = await (prisma as any).canteenManager.findFirst({
      where: {
        managerId: userId,
        isActive: true,
      },
      include: {
        canteen: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    });

    if (!canteenManager || !canteenManager.canteen?.isActive) {
      return {
        isAuthorized: false,
        message: "No active canteen found",
      };
    }

    return {
      isAuthorized: true,
      canteenId: canteenManager.canteen.id,
      canteenName: canteenManager.canteen.name,
      userRole: canteenManager.role,
    };
  } catch (error) {
    console.error("Auth check error:", error);
    return {
      isAuthorized: false,
      message: "Authorization check failed",
    };
  }
}

/**
 * Verify user has role and check if need onboarding
 */
export async function checkManagerRole(): Promise<{ role: string | null; needsOnboarding: boolean }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { role: null, needsOnboarding: false };
    }

    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!profile?.role) {
      return { role: null, needsOnboarding: false };
    }

    if (profile.role !== "manager") {
      return { role: profile.role, needsOnboarding: false };
    }

    // Check if has completed onboarding (has canteen)
    const canteenManager = await (prisma as any).canteenManager.findFirst({
      where: { managerId: userId, isActive: true },
    });

    return {
      role: profile.role,
      needsOnboarding: !canteenManager,
    };
  } catch (error) {
    console.error("Manager role check error:", error);
    return { role: null, needsOnboarding: false };
  }
}
