"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { OrderStatus } from "./LiveOrders";

interface CompletedOrder {
  id: string;
  tokenNumber: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  completedAt: Date;
  status: OrderStatus;
}

interface OrderHistoryProps {
  orders: CompletedOrder[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const todayTotal = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Order History</h2>
          <p className="text-sm text-slate-500">
            {orders.length} orders completed today · ₹{todayTotal.toLocaleString()} total
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-slate-500">No completed orders yet</p>
          <p className="text-sm text-slate-400 mt-1">Completed orders will appear here</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Token
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">{order.tokenNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                          >
                            {item.quantity}× {item.name}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">₹{order.totalAmount}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {order.completedAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-slate-100 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800">{order.tokenNumber}</span>
                  <span className="text-sm text-slate-500">
                    {order.completedAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {order.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                    >
                      {item.quantity}× {item.name}
                    </span>
                  ))}
                </div>
                <p className="font-medium text-slate-800">₹{order.totalAmount}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
