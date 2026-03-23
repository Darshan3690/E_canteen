import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";

/** GET /api/notifications — student notifications */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole();
    if (role !== "student") {
      return NextResponse.json({ error: "Only students can view notifications" }, { status: 403 });
    }

    const notifications = await prisma.notification.findMany({
      where: { studentId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(notifications);
  } catch (err) {
    console.error("Notifications fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
