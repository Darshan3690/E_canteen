import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPage from "./LandingPage";
import { getUserRole } from "@/lib/auth";

export default async function HomePage() {
  const { userId } = await auth();

  // Not logged in → show landing page
  if (!userId) {
    return <LandingPage />;
  }

  // Logged in → get role from database profile
  const role = await getUserRole();

  // No role assigned → redirect to role selection
  if (!role) {
    redirect("/select-role");
  }

  // Redirect based on role
  if (role === "manager") {
    redirect("/manager");
  }

  // Default: student
  redirect("/canteens");
}
