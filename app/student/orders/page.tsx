"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  priceAtTime: number;
  menuItem: { id: string; name: string; price: number };
}

interface Order {
  id: string;
  orderNumber: string | null;
  totalAmount: number;
  status: string;
  completedAt: string | null;
  canteen: { id: string; name: string; tokenPrefix: string } | null;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-slate-700 text-slate-200",
  PREPARING: "bg-amber-900/40 text-amber-300",
  READY: "bg-green-900/40 text-green-300",
  COLLECTED: "bg-indigo-900/40 text-indigo-300",
  CANCELLED: "bg-red-900/40 text-red-300",
};

export default function StudentOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0f1116] min-h-screen text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0f1116]/95 backdrop-blur border-b border-gray-800 px-5 py-4 flex items-center gap-3">
        <Link href="/canteens" className="text-gray-400 hover:text-white text-lg">
          ←
        </Link>
        <div>
          <h1 className="text-lg font-bold">My Orders</h1>
          <p className="text-xs text-gray-400">Track your order history</p>
        </div>
      </div>

      <div className="px-5 py-6">
        {loading ? (
          <div className="text-center py-24 text-gray-500">
            <div className="text-4xl mb-3 animate-pulse">⏳</div>
            <p>Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-xl font-semibold text-gray-400">No orders yet</p>
            <p className="text-sm mt-2 mb-6">Place your first order!</p>
            <Link href="/canteens">
              <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold">
                Browse Canteens
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#1c1f26] rounded-xl p-5">
                {/* Top row */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-lg font-bold text-orange-400">
                      {order.orderNumber ?? order.id.slice(0, 8)}
                    </span>
                    {order.canteen && (
                      <p className="text-xs text-gray-400 mt-0.5">{order.canteen.name}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[order.status] ?? "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-300">
                      <span>
                        {item.menuItem.name}{" "}
                        <span className="text-gray-500">×{item.quantity}</span>
                      </span>
                      <span>₹{item.priceAtTime * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="font-bold text-white">₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
