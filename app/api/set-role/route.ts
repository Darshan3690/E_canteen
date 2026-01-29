import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
    if (!["student", "canteen_manager"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Map role to simple value
    const dbRole = role === "canteen_manager" ? "manager" : "student";

    // Store role in Clerk's public metadata (no database needed)
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role: dbRole },
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
