import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import CanteenMenuClient from "./CanteenMenuClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CanteenMenuPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { id } = await params;

  const canteen = await prisma.canteen.findUnique({
    where: { id },
    include: {
      menuItems: {
        where: { isAvailable: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!canteen || !canteen.isActive) notFound();

  // Serialize dates to plain objects for client
  const safeCanteen = {
    id: canteen.id,
    name: canteen.name,
    description: canteen.description,
    location: canteen.location,
    openingTime: canteen.openingTime,
    closingTime: canteen.closingTime,
    isOpenNow: canteen.isOpenNow,
    logoUrl: canteen.logoUrl,
    tokenPrefix: canteen.tokenPrefix,
    menuItems: canteen.menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      prepTime: item.prepTime,
      isAvailable: item.isAvailable,
    })),
  };

  return <CanteenMenuClient canteen={safeCanteen} />;
}
// 2
