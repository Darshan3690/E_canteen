import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";

export default async function StudentPage() {
  const role = await getUserRole();

  // Not logged in
  if (role === null) {
    redirect("/");
  }

  // Has role but not student - redirect to home
  if (role && role !== "student") {
    redirect("/");
  }

  // No role assigned - show message instead of redirect loop
  if (!role) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p>Your role has not been assigned yet.</p>
        <a href="/">Go back to home</a>
      </div>
    );
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
