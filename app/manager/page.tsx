import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import ManagerDashboard from "./ManagerDashboard";

export default async function ManagerPage() {
  const { userId } = await auth();

  // Not logged in - redirect to login
  if (!userId) {
    redirect("/login");
  }

  // Get user role from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role as string | undefined;

  // No role assigned - redirect to select role
  if (!role) {
    redirect("/select-role");
  }

  // Has role but not manager - redirect to menu (student page)
  if (role !== "manager") {
    redirect("/menu");
  }

  return <ManagerDashboard />;
}
