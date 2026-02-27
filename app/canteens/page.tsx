import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserProfileBar from "@/app/components/UserProfileBar";
import CanteenGrid from "@/app/components/student/CanteenGrid";
import { Utensils } from "lucide-react";

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

  const processedCanteens = canteens.map(c => ({
    ...c,
    isOpenNow: isOpenNow(c)
  }));

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Utensils className="w-5 h-5" />
             </div>
             <div>
                <h1 className="text-xl font-bold leading-none text-foreground">Campus Canteens</h1>
                <p className="text-sm text-muted-foreground mt-1">Order food across campus</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/student/orders">
              <button className="hidden md:flex items-center gap-2 text-sm font-medium text-primary hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                My Orders
              </button>
            </Link>
            <div className="h-8 w-px bg-border mx-2 hidden md:block" />
            <UserProfileBar variant="light" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                Available Spots 
                <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-full">{canteens.length}</span>
            </h2>
            
            {/* Filter Placeholder - could be added later */}
            <div className="flex gap-2">
                {/* <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium shadow-sm hover:translate-y-[-1px] transition-all">
                   Filter
                </button> */}
            </div>
        </div>

        <CanteenGrid canteens={processedCanteens} />
      </main>
    </div>
  );
}
