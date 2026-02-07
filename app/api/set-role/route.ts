import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Map role to simple value
    const dbRole = role === "canteen_manager" ? "manager" : role === "manager" ? "manager" : "student";

    // Store role in Clerk's public metadata (no database needed)
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    await client.users.updateUser(userId, {
      publicMetadata: { role: dbRole },
    });

    // Persist role and basic user data in Prisma (Supabase Postgres)
    // Upsert ensures record exists even if signup step was skipped
    await prisma.profile.upsert({
      where: { id: userId },
      update: { role: dbRole as any },
      create: {
        id: userId,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || user.username || "",
        email: user.emailAddresses?.[0]?.emailAddress || "",
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
