import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";

/** PATCH /api/notifications/[id] — mark one notification read */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole();
    if (role !== "student") {
      return NextResponse.json({ error: "Only students can update notifications" }, { status: 403 });
    }

    const { id } = await params;

    const notification = await prisma.notification.findFirst({
      where: { id, studentId: userId },
      select: { id: true },
    });
    if (!notification) return NextResponse.json({ error: "Notification not found" }, { status: 404 });

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Notification update error:", err);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
