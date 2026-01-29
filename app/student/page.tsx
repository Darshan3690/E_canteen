import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

  return (
    <div style={{ padding: 24 }}>
      <h1>🍽️ Student Menu Dashboard</h1>
      <p>Browse menu and place orders</p>
      
      <div style={{ marginTop: 24 }}>
        <h2>Today's Menu</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: 12, border: '1px solid #333', marginBottom: 8, borderRadius: 8 }}>
            🍔 Burger - ₹50
          </li>
          <li style={{ padding: 12, border: '1px solid #333', marginBottom: 8, borderRadius: 8 }}>
            🍕 Pizza - ₹80
          </li>
          <li style={{ padding: 12, border: '1px solid #333', marginBottom: 8, borderRadius: 8 }}>
            🥪 Sandwich - ₹40
          </li>
          <li style={{ padding: 12, border: '1px solid #333', marginBottom: 8, borderRadius: 8 }}>
            ☕ Coffee - ₹20
          </li>
        </ul>
      </div>
    </div>
  );
}
