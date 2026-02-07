import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import StudentDashboard from "./StudentDashboard";

export default async function StudentPage() {
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

  // Has role but not student - redirect to their dashboard
  if (role === "manager") {
    redirect("/manager");
  }

  return <StudentDashboard />;
}
