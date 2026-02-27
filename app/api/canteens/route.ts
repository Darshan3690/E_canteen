import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const canteens = await prisma.canteen.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        logoUrl: true,
        coverImageUrl: true,
        openingTime: true,
        closingTime: true,
        workingDays: true,
        isOpenNow: true,
        contactNumber: true,
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(canteens);
  } catch {
    return NextResponse.json({ error: "Failed to fetch canteens" }, { status: 500 });
  }
}
