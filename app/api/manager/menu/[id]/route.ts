import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";

async function getManagerCanteenId() {
  const { userId } = await auth();
  if (!userId) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cm = await (prisma as any).canteenManager.findFirst({
    where: { managerId: userId, isActive: true },
  });
  return cm?.canteenId ?? null;
}

/** Verify item belongs to manager's canteen */
async function verifyOwnership(itemId: string): Promise<boolean> {
  const canteenId = await getManagerCanteenId();
  if (!canteenId) return false;
  const item = await prisma.menuItem.findFirst({ where: { id: itemId, canteenId } });
  return !!item;
}

/** PUT /api/manager/menu/[id] — update item */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const role = await getUserRole();
    if (role !== "manager")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!(await verifyOwnership(id)))
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const { name, description, price, prepTime, image, isAvailable } = body;

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(prepTime !== undefined && { prepTime: prepTime ? Number(prepTime) : null }),
        ...(image !== undefined && { image }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

/** DELETE /api/manager/menu/[id] — delete item */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const role = await getUserRole();
    if (role !== "manager")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!(await verifyOwnership(id)))
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

/** PATCH /api/manager/menu/[id] — toggle availability */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const role = await getUserRole();
    if (role !== "manager")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!(await verifyOwnership(id)))
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: body.isAvailable },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to toggle availability" }, { status: 500 });
  }
}
