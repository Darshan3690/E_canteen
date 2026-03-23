import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";

/** PATCH /api/notifications/read-all — mark all notifications as read */
export async function PATCH() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole();
    if (role !== "student") {
      return NextResponse.json({ error: "Only students can update notifications" }, { status: 403 });
    }

    const result = await prisma.notification.updateMany({
      where: { studentId: userId, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ updated: result.count });
  } catch (err) {
    console.error("Read-all notification error:", err);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
