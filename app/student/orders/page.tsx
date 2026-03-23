"use client";

import { useEffect, useRef, useState } from "react";
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

interface StudentNotification {
  id: string;
  orderId: string | null;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
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
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);
  const seenNotificationIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, notificationsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/notifications"),
        ]);

        const ordersData = await ordersRes.json();
        const notificationsData = await notificationsRes.json();

        const nextOrders = Array.isArray(ordersData) ? ordersData : [];
        const nextNotifications = Array.isArray(notificationsData) ? notificationsData : [];

        setOrders(nextOrders);
        setNotifications(nextNotifications);

        const unread = nextNotifications.filter((n) => !n.isRead);
        if (!initializedRef.current) {
          unread.forEach((n) => seenNotificationIdsRef.current.add(n.id));
          initializedRef.current = true;
        } else {
          const latestNewUnread = unread.find((n) => !seenNotificationIdsRef.current.has(n.id));
          if (latestNewUnread) {
            seenNotificationIdsRef.current.add(latestNewUnread.id);
            setToast({ title: latestNewUnread.title, message: latestNewUnread.message });
            if (typeof window !== "undefined" && "Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification(latestNewUnread.title, { body: latestNewUnread.message });
              }
            }
          }
        }
      } catch {
        // no-op
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 15_000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    } catch {
      // no-op
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
    } catch {
      // no-op
    }
  };

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
        {toast && (
          <div className="mb-4 rounded-xl border border-green-700/50 bg-green-900/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-green-300">{toast.title}</p>
                <p className="text-sm text-green-100">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-xs text-green-200 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 rounded-xl bg-[#1c1f26] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-100">Notifications</h2>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300">
                {unreadCount} unread
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-orange-300 hover:text-orange-200"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications yet.</p>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className={`rounded-lg p-3 ${
                    n.isRead ? "bg-[#222631]" : "bg-orange-900/20 border border-orange-700/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-100">{n.title}</p>
                      <p className="text-xs text-gray-300 mt-0.5">{n.message}</p>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-xs text-orange-300 hover:text-orange-200"
                      >
                        Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
