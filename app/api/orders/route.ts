import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";

/** POST /api/orders — student places an order */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole();
    if (role !== "student")
      return NextResponse.json({ error: "Only students can place orders" }, { status: 403 });

    const body = await req.json();
    const { canteenId, items } = body as {
      canteenId: string;
      items: { menuItemId: string; quantity: number }[];
    };

    if (!canteenId || !items?.length)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    // Fetch canteen for token generation
    const canteen = await prisma.canteen.findUnique({ where: { id: canteenId } });
    if (!canteen || !canteen.isActive)
      return NextResponse.json({ error: "Canteen not found or inactive" }, { status: 404 });

    // Validate all menu items belong to this canteen and are available
    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, canteenId, isAvailable: true },
    });

    if (menuItems.length !== menuItemIds.length)
      return NextResponse.json(
        { error: "Some items are unavailable or do not belong to this canteen" },
        { status: 400 }
      );

    // Calculate total
    const totalAmount = items.reduce((sum, item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
      return sum + menuItem.price * item.quantity;
    }, 0);

    // Generate token number
    const tokenNumber = `${canteen.tokenPrefix}${canteen.currentTokenNumber}`;

    // Create order + increment token in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: tokenNumber,
          studentId: userId,
          canteenId,
          totalAmount,
          status: "PENDING",
          items: {
            create: items.map((item) => {
              const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
              return {
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                priceAtTime: menuItem.price,
              };
            }),
          },
        },
        include: { items: { include: { menuItem: true } } },
      });

      await tx.canteen.update({
        where: { id: canteenId },
        data: { currentTokenNumber: { increment: 1 } },
      });

      return newOrder;
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

/** GET /api/orders — student: own orders; manager: canteen orders */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole();

    if (role === "student") {
      const orders = await prisma.order.findMany({
        where: { studentId: userId },
        include: {
          items: { include: { menuItem: { select: { id: true, name: true, price: true } } } },
          canteen: { select: { id: true, name: true, tokenPrefix: true } },
        },
        orderBy: { id: "desc" },
      });
      return NextResponse.json(orders);
    }

    if (role === "manager") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cm = await (prisma as any).canteenManager.findFirst({
        where: { managerId: userId, isActive: true },
      });
      if (!cm) return NextResponse.json({ error: "No canteen" }, { status: 404 });

      const orders = await prisma.order.findMany({
        where: { canteenId: cm.canteenId },
        include: {
          items: { include: { menuItem: { select: { id: true, name: true, price: true } } } },
          student: { select: { id: true, name: true } },
        },
        orderBy: { id: "desc" },
        take: 100,
      });
      return NextResponse.json(orders);
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 403 });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
