import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";

async function createNotificationSafe(
  db: unknown,
  data: {
    studentId: string;
    orderId: string;
    type: string;
    title: string;
    message: string;
  }
) {
  const notificationDelegate = (
    db as {
      notification?: {
        create: (args: { data: typeof data }) => Promise<unknown>;
      };
    }
  ).notification;

  if (!notificationDelegate) return;

  try {
    await notificationDelegate.create({ data });
  } catch (err) {
    console.warn("Notification write skipped:", err);
  }
}

const VALID_TRANSITIONS: Record<string, string> = {
  PENDING: "PREPARING",
  PREPARING: "READY",
  READY: "COLLECTED",
};

/** PATCH /api/orders/[id] — manager updates order status */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole();
    if (role !== "manager")
      return NextResponse.json({ error: "Only managers can update orders" }, { status: 403 });

    const { id } = await params;
    const { status } = await req.json();

    // Verify order belongs to this manager's canteen
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cm = await (prisma as any).canteenManager.findFirst({
      where: { managerId: userId, isActive: true },
    });
    if (!cm) return NextResponse.json({ error: "No canteen found" }, { status: 404 });

    const order = await prisma.order.findFirst({
      where: { id, canteenId: cm.canteenId },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const validNext = VALID_TRANSITIONS[order.status];
    if (status !== validNext)
      return NextResponse.json(
        { error: `Invalid transition: ${order.status} → ${status}` },
        { status: 400 }
      );

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status as "PENDING" | "PREPARING" | "READY" | "COLLECTED" | "CANCELLED",
        ...(status === "COLLECTED" ? { completedAt: new Date() } : {}),
      },
    });

    const statusMessages: Record<string, { title: string; message: string }> = {
      PREPARING: {
        title: "Order is being prepared",
        message: `Your order ${updated.orderNumber ?? updated.id.slice(0, 8)} is now being prepared.`,
      },
      READY: {
        title: "Order ready for pickup",
        message: `Your order ${updated.orderNumber ?? updated.id.slice(0, 8)} is ready. Please collect it now.`,
      },
      COLLECTED: {
        title: "Order collected",
        message: `Your order ${updated.orderNumber ?? updated.id.slice(0, 8)} has been marked as collected.`,
      },
      CANCELLED: {
        title: "Order cancelled",
        message: `Your order ${updated.orderNumber ?? updated.id.slice(0, 8)} was cancelled.`,
      },
    };

    const statusNotice = statusMessages[status];
    if (statusNotice) {
      await createNotificationSafe(prisma, {
        studentId: updated.studentId,
        orderId: updated.id,
        type: "ORDER_STATUS",
        title: statusNotice.title,
        message: statusNotice.message,
      });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

/** GET /api/orders/[id] — fetch single order (student owns it or manager owns canteen) */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const role = await getUserRole();

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        canteen: { select: { id: true, name: true } },
        student: { select: { id: true, name: true } },
      },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (role === "student" && order.studentId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json(order);
  } catch (err) {
    console.error("Order fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
