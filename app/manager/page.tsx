import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { checkManagerRole } from "@/lib/auth-guards";

export const metadata = {
  title: "Manager Dashboard - E-Canteen",
  description: "Manage your canteen, orders, and menu",
};

export default async function ManagerPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  // Check manager role
  const roleCheck = await checkManagerRole();

  if (!roleCheck.role) {
    redirect("/select-role");
  }

  // If everything is fine, redirect to the dashboard overview
  redirect("/manager/dashboard");
}
