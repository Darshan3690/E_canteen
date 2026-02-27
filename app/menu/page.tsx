import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/auth";

export default async function MenuPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const role = await getUserRole();
  if (!role) redirect("/select-role");
  if (role === "manager") redirect("/manager");

  // Students go to canteen marketplace
  redirect("/canteens");
}