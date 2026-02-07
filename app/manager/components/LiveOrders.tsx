"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type OrderStatus = "pending" | "preparing" | "ready" | "collected";

export interface Order {
  id: string;
  tokenNumber: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  status: OrderStatus;
  orderTime: Date;
  studentName?: string;
}

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-slate-100 text-slate-700",
    nextAction: "Start Preparing",
    nextStatus: "preparing" as OrderStatus,
  },
  preparing: {
    label: "Preparing",
    color: "bg-amber-100 text-amber-700",
    nextAction: "Mark Ready",
    nextStatus: "ready" as OrderStatus,
  },
  ready: {
    label: "Ready",
    color: "bg-emerald-100 text-emerald-700",
    nextAction: "Mark Collected",
    nextStatus: "collected" as OrderStatus,
  },
  collected: {
    label: "Collected",
    color: "bg-indigo-100 text-indigo-700",
    nextAction: null,
    nextStatus: null,
  },
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const config = statusConfig[order.status];

  const handleStatusChange = () => {
    if (!config.nextStatus) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.98,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(cardRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "back.out(1.7)",
          });
        },
      });
    }

    onStatusChange(order.id, config.nextStatus);
  };

  const timeSinceOrder = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - order.orderTime.getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-lg sm:text-xl font-bold text-slate-800">
            {order.tokenNumber}
          </span>
          <span className="ml-2 text-xs text-slate-500">{timeSinceOrder()}</span>
        </div>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Items */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1.5">
          {order.items.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-md"
            >
              {item.quantity}× {item.name}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="font-semibold text-slate-800">₹{order.totalAmount}</span>
        
        {config.nextAction && (
          <button
            onClick={handleStatusChange}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            {config.nextAction}
          </button>
        )}
      </div>
    </div>
  );
}

interface LiveOrdersProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export default function LiveOrders({ orders, onStatusChange }: LiveOrdersProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOrders = orders.filter((o) => o.status !== "collected");
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.4 }
      );
    }
  }, []);

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Live Orders</h2>
          <p className="text-sm text-slate-500">{activeOrders.length} active orders</p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
            {pendingCount} pending
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
            {preparingCount} preparing
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
            {readyCount} ready
          </span>
        </div>
      </div>

      {activeOrders.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-slate-500">No active orders</p>
          <p className="text-sm text-slate-400 mt-1">New orders will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
