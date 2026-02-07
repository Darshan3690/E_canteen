"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type OrderStatus = "preparing" | "ready" | "collected";

interface ActiveOrder {
  tokenNumber: string;
  status: OrderStatus;
  items: string[];
  totalAmount: number;
  placedAt: Date;
}

interface OrderStatusSectionProps {
  activeOrder: ActiveOrder | null;
}

const statusConfig = {
  preparing: {
    label: "Preparing",
    color: "bg-amber-100 text-amber-700",
    dotColor: "bg-amber-500",
    step: 1,
  },
  ready: {
    label: "Ready for Pickup",
    color: "bg-emerald-100 text-emerald-700",
    dotColor: "bg-emerald-500",
    step: 2,
  },
  collected: {
    label: "Collected",
    color: "bg-slate-100 text-slate-600",
    dotColor: "bg-slate-500",
    step: 3,
  },
};

export default function OrderStatusSection({
  activeOrder,
}: OrderStatusSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.6 }
      );
    }
  }, []);

  useEffect(() => {
    if (!activeOrder) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [activeOrder?.status]);

  if (!activeOrder) return null;

  const config = statusConfig[activeOrder.status];

  return (
    <div ref={sectionRef} className="mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4">
        Active Order
      </h2>

      <div className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
              Token
            </p>
            <p className="text-2xl font-bold text-slate-800">
              {activeOrder.tokenNumber}
            </p>
          </div>
          <span
            ref={badgeRef}
            className={`px-3 py-1.5 text-sm font-medium rounded-full ${config.color}`}
          >
            {config.label}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex items-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  step <= config.step ? config.dotColor : "bg-slate-200"
                }`}
              />
              {step < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-1 ${
                    step < config.step ? config.dotColor : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Order Items */}
        <div className="flex flex-wrap gap-2 mb-3">
          {activeOrder.items.map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Placed at{" "}
            {activeOrder.placedAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="font-medium text-slate-800">
            ₹{activeOrder.totalAmount}
          </span>
        </div>
      </div>
    </div>
  );
}
