import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      name: name || "",
      email: email || `${userId}@local.invalid`,
    };
  } catch {
    return {
      name: "",
      email: `${userId}@local.invalid`,
    };
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const { role } = await req.json();

    // Validate role
    if (!["student", "canteen_manager", "manager"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Map role to simple value stored in our database
    const dbRole = role === "canteen_manager" ? "manager" : role === "manager" ? "manager" : "student";

    const clerkProfile = await getClerkNameAndEmail(userId);

    // Persist role and basic user data in Prisma (Supabase Postgres)
    // Upsert ensures record exists even if signup step was skipped
    await prisma.profile.upsert({
      where: { id: userId },
      update: {
        role: dbRole as any,
        // Keep Profile fields valid if they were previously empty
        name: clerkProfile.name || undefined,
        email: clerkProfile.email || undefined,
      },
      create: {
        id: userId,
        name: clerkProfile.name || "",
        email: clerkProfile.email,
        role: dbRole as any,
      },
    });

    return NextResponse.json({ success: true, role: dbRole });
  } catch (error) {
    console.error("Error setting role:", error);
    return NextResponse.json(
      { error: "Failed to set role" },
      { status: 500 }
    );
  }
}
