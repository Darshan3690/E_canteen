import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserProfileBar from "@/app/components/UserProfileBar";

export const metadata = {
  title: "Admin Dashboard - E-Canteen",
};

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/login");

  // Only allow admins — set publicMetadata.role = "admin" in Clerk dashboard
  const isAdmin = (user.publicMetadata as Record<string, string>)?.role === "admin";
  if (!isAdmin) redirect("/");

  const [
    totalStudents,
    totalManagers,
    totalCanteens,
    activeCanteens,
    totalOrders,
    recentOrders,
    canteens,
  ] = await Promise.all([
    prisma.profile.count({ where: { role: "student" } }),
    prisma.profile.count({ where: { role: "manager" } }),
    prisma.canteen.count(),
    prisma.canteen.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { id: "desc" },
      include: {
        student: { select: { name: true } },
        canteen: { select: { name: true } },
      },
    }),
    prisma.canteen.findMany({
      include: {
        canteenManagers: {
          include: { manager: { select: { name: true, email: true } } },
        },
        _count: { select: { orders: true, menuItems: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const revenueResult = await prisma.order.aggregate({ _sum: { totalAmount: true } });
  const totalRevenue = revenueResult._sum.totalAmount ?? 0;

  const activeOrders = await prisma.order.count({
    where: { status: { in: ["PENDING", "PREPARING", "READY"] } },
  });

  const statusColors: Record<string, string> = {
    PENDING: "bg-slate-100 text-slate-700",
    PREPARING: "bg-amber-100 text-amber-700",
    READY: "bg-green-100 text-green-700",
    COLLECTED: "bg-indigo-100 text-indigo-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">👑 Admin Dashboard</h1>
          <p className="text-sm text-slate-500">
            E-Canteen System Control Panel
            {user.firstName && (
              <span className="text-slate-400"> · Welcome, {user.firstName}</span>
            )}
          </p>
        </div>
        <UserProfileBar />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Stats */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Students" value={totalStudents} icon="🎓" color="bg-blue-50 border-blue-200" />
            <StatCard label="Managers" value={totalManagers} icon="🧑‍🍳" color="bg-purple-50 border-purple-200" />
            <StatCard label="Total Canteens" value={totalCanteens} icon="🏪" color="bg-amber-50 border-amber-200" />
            <StatCard label="Active Canteens" value={activeCanteens} icon="🟢" color="bg-green-50 border-green-200" />
            <StatCard label="Total Orders" value={totalOrders} icon="📋" color="bg-indigo-50 border-indigo-200" />
            <StatCard label="Active Orders" value={activeOrders} icon="⚡" color="bg-orange-50 border-orange-200" />
            <StatCard label="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} icon="💰" color="bg-emerald-50 border-emerald-200" />
          </div>
        </section>

        {/* Canteen Management */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Canteen Management</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {canteens.length === 0 ? (
              <p className="text-slate-500 p-6">No canteens registered yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Canteen", "Location", "Manager", "Items", "Orders", "Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {canteens.map((canteen) => (
                    <tr key={canteen.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{canteen.name}</div>
                        <div className="text-xs text-slate-400">Token: {canteen.tokenPrefix}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{canteen.location}</td>
                      <td className="px-4 py-3">
                        {canteen.canteenManagers.length > 0 ? (
                          canteen.canteenManagers.map((cm) => (
                            <div key={cm.id}>
                              <p className="text-slate-700">{cm.manager.name}</p>
                              <p className="text-xs text-slate-400">{cm.manager.email}</p>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs">No manager</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{canteen._count.menuItems}</td>
                      <td className="px-4 py-3 text-slate-600">{canteen._count.orders}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${canteen.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {canteen.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Recent Orders */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Recent Orders</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {recentOrders.length === 0 ? (
              <p className="text-slate-500 p-6">No orders placed yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Token", "Student", "Canteen", "Amount", "Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-semibold text-orange-600">
                        {order.orderNumber ?? order.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{order.student?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{order.canteen?.name ?? "—"}</td>
                      <td className="px-4 py-3 font-medium">₹{order.totalAmount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className={`rounded-xl border p-5 ${color}`}>
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}