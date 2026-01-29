import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔐 Secret code for canteen managers (keep this private!)
const MANAGER_CODE = "CANTEEN2025";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    // Get user details from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    const { role, code } = await req.json();

    // Validate role - map canteen_manager to manager for database
    if (!["student", "canteen_manager"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // 🔐 SECURITY: Verify manager code if selecting canteen_manager
    if (role === "canteen_manager") {
      if (code !== MANAGER_CODE) {
        return NextResponse.json(
          { error: "Invalid manager verification code" },
          { status: 403 }
        );
      }
    }

    // Map role to database enum value
    const dbRole = role === "canteen_manager" ? "manager" : "student";

    // Get user info from Clerk
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
    const userName = clerkUser.firstName 
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
      : clerkUser.username || "User";

    // Update or create user's profile in database
    await prisma.profile.upsert({
      where: { id: userId },
      update: { role: dbRole },
      create: { 
        id: userId, 
        name: userName,
        email: userEmail,
        role: dbRole 
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
