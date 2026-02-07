"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: "indigo" | "emerald" | "amber" | "rose";
}

const colorClasses = {
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    icon: "bg-indigo-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: "bg-emerald-100",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: "bg-amber-100",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    icon: "bg-rose-100",
  },
};

export default function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${trend.isPositive ? "text-emerald-500" : "text-rose-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={trend.isPositive ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"}
                />
              </svg>
              <span className={`text-xs font-medium ${trend.isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                {trend.value}% vs yesterday
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].icon}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClasses[color].text}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface StatsOverviewProps {
  stats: {
    todayOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    outOfStock: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".stat-card");
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 0.2 }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="stat-card">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          color="indigo"
          trend={{ value: 12, isPositive: true }}
        />
      </div>
      <div className="stat-card">
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          color="amber"
        />
      </div>
      <div className="stat-card">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          color="emerald"
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      <div className="stat-card">
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          color="rose"
        />
      </div>
    </div>
  );
}
