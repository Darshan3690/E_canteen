import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { id: "asc" },
      take: 100,
    });
    return NextResponse.json({ count: profiles.length, profiles });
  } catch (error) {
    console.error("Profiles GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}
