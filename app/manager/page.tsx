import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";

export default async function ManagerPage() {
  const role = await getUserRole();

  // Not logged in
  if (role === null) {
    redirect("/");
  }

  // Has role but not manager - redirect to home
  if (role && role !== "canteen_manager") {
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
      <h1>🏪 Canteen Manager Dashboard</h1>
      <p>Manage menu, orders, and inventory</p>
      
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div style={{ padding: 20, border: '1px solid #333', borderRadius: 8 }}>
          <h3>📋 Menu Items</h3>
          <p style={{ fontSize: 32, fontWeight: 'bold' }}>12</p>
        </div>
        <div style={{ padding: 20, border: '1px solid #333', borderRadius: 8 }}>
          <h3>📦 Pending Orders</h3>
          <p style={{ fontSize: 32, fontWeight: 'bold' }}>5</p>
        </div>
        <div style={{ padding: 20, border: '1px solid #333', borderRadius: 8 }}>
          <h3>💰 Today's Sales</h3>
          <p style={{ fontSize: 32, fontWeight: 'bold' }}>₹2,450</p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Add Menu Item</button>
          <button style={{ padding: '10px 20px', cursor: 'pointer' }}>View Orders</button>
          <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Inventory</button>
        </div>
      </div>
    </div>
  );
}
