import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPage from "./LandingPage";

export default async function HomePage() {
  const { userId } = await auth();

  // Not logged in → show landing page
  if (!userId) {
    return <LandingPage />;
  }

  // Logged in → get role
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role as string | undefined;

  // No role assigned → redirect to role selection
  if (!role) {
    redirect("/select-role");
  }

  // Redirect based on role
  if (role === "manager") {
    redirect("/manager");
  }

  // Default: student
  redirect("/student");
}
