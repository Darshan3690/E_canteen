import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  // Not logged in → show landing page
  if (!userId) {
    return (
      <main style={{ padding: 24, textAlign: 'center' }}>
        <h1>Welcome to E-Canteen</h1>
        <p>College Canteen Management System</p>
        <p style={{ marginTop: 16, color: '#888' }}>Please sign in to continue</p>
      </main>
    );
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
  if (role === "canteen_manager") {
    redirect("/manager");
  }

  // Default: student
  redirect("/student");
}
