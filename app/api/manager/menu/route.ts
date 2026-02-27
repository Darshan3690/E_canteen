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

/** GET /api/manager/menu — list menu items for manager's canteen */
export async function GET() {
  try {
    const role = await getUserRole();
    if (role !== "manager")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const canteenId = await getManagerCanteenId();
    if (!canteenId)
      return NextResponse.json({ error: "No canteen" }, { status: 404 });

    const items = await prisma.menuItem.findMany({
      where: { canteenId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}

/** POST /api/manager/menu — add menu item */
export async function POST(req: Request) {
  try {
    const role = await getUserRole();
    if (role !== "manager")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const canteenId = await getManagerCanteenId();
    if (!canteenId)
      return NextResponse.json({ error: "No canteen" }, { status: 404 });

    const body = await req.json();
    const { name, description, price, category, prepTime, image } = body;

    if (!name || price == null)
      return NextResponse.json({ error: "Name and price required" }, { status: 400 });

    const item = await prisma.menuItem.create({
      data: {
        name,
        description: description ?? null,
        price: Number(price),
        prepTime: prepTime ? Number(prepTime) : null,
        image: image ?? null,
        isAvailable: true,
        canteenId,
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
