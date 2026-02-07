"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MenuItem } from "./MenuManagement";

interface InventoryProps {
  items: MenuItem[];
  onToggleAvailability: (id: string) => void;
}

export default function Inventory({ items, onToggleAvailability }: InventoryProps) {
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

  const handleToggle = (id: string, ref: HTMLDivElement | null) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const item = items.find((i) => i.id === id);

    if (!prefersReducedMotion && ref) {
      gsap.to(ref, {
        backgroundColor: item?.available ? "#fef2f2" : "#f0fdf4",
        duration: 0.2,
        onComplete: () => {
          gsap.to(ref, {
            backgroundColor: "#ffffff",
            duration: 0.4,
          });
        },
      });
    }

    onToggleAvailability(id);
  };

  const outOfStockItems = items.filter((i) => !i.available);
  const availableItems = items.filter((i) => i.available);

  return (
    <div ref={containerRef}>
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Inventory Status</h2>
        <p className="text-sm text-slate-500">
          Quick availability management
        </p>
      </div>

      {/* Out of Stock Section */}
      {outOfStockItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-rose-600 mb-3 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Out of Stock ({outOfStockItems.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {outOfStockItems.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Items */}
      <div>
        <h3 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Available Items ({availableItems.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface InventoryCardProps {
  item: MenuItem;
  onToggle: (id: string, ref: HTMLDivElement | null) => void;
}

function InventoryCard({ item, onToggle }: InventoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={`flex items-center justify-between p-4 bg-white rounded-lg border ${
        item.available ? "border-slate-100" : "border-rose-200 bg-rose-50"
      }`}
    >
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-slate-800 truncate">{item.name}</h4>
        <p className="text-xs text-slate-500">{item.category} · ₹{item.price}</p>
      </div>
      <button
        onClick={() => onToggle(item.id, cardRef.current)}
        className={`ml-3 relative w-12 h-7 rounded-full transition-colors ${
          item.available ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            item.available ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
