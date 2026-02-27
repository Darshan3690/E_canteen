import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserRole } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = await getUserRole();

    return NextResponse.json({ role: role || null });
  } catch (error) {
    console.error("Error verifying role:", error);
    return NextResponse.json(
      { error: "Failed to verify role" },
      { status: 500 }
    );
  }
}
