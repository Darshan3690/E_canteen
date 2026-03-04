import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CanteensStudentView from "./CanteensStudentView";

// Determine if canteen is currently open based on working days + hours
function isOpenNow(canteen: {
  workingDays: string;
  openingTime: string;
  closingTime: string;
}): boolean {
  try {
    const now = new Date();
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const today = days[now.getDay()];
    const workingDays: string[] = JSON.parse(canteen.workingDays);
    if (!workingDays.includes(today)) return false;

    const [openH, openM] = canteen.openingTime.split(":").map(Number);
    const [closeH, closeM] = canteen.closingTime.split(":").map(Number);
    const cur = now.getHours() * 60 + now.getMinutes();
    return cur >= openH * 60 + openM && cur < closeH * 60 + closeM;
  } catch {
    return false;
  }
}

export default async function CanteensPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const canteens = await prisma.canteen.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const processedCanteens = canteens.map((c) => ({
    ...c,
    isOpenNow: isOpenNow(c),
  }));
  return <CanteensStudentView canteens={processedCanteens} />;
}
