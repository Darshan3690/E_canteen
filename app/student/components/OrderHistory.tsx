"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { OrderStatus } from "./OrderStatusSection";

interface PastOrder {
  id: string;
  tokenNumber: string;
  status: OrderStatus;
  totalAmount: number;
  items: string[];
  date: Date;
}

interface OrderHistoryProps {
  orders: PastOrder[];
}

const statusBadge = {
  preparing: "bg-amber-100 text-amber-700",
  ready: "bg-emerald-100 text-emerald-700",
  collected: "bg-slate-100 text-slate-600",
};

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.8 }
      );
    }
  }, []);

  if (orders.length === 0) return null;

  return (
    <div ref={sectionRef} id="orders" className="mt-10 sm:mt-12">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4">
        Order History
      </h2>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
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
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800">
                      {order.tokenNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                        >
                          {item}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="px-2 py-0.5 text-xs text-slate-500">
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        statusBadge[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800">
                      ₹{order.totalAmount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {order.date.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="sm:hidden divide-y divide-slate-100">
          {orders.map((order) => (
            <div key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-semibold text-slate-800">
                    {order.tokenNumber}
                  </span>
                  <span className="ml-2 text-sm text-slate-500">
                    {order.date.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                    statusBadge[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {order.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-slate-800">
                ₹{order.totalAmount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
