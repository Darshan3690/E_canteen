"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string;
}

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({
  item,
  quantity,
  onQuantityChange,
  onAddToCart,
}: MenuCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, []);

  const handleIncrement = () => {
    onQuantityChange(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(item.id, quantity - 1);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-white rounded-xl border border-slate-100 p-4 sm:p-5 transition-colors ${
        !item.available ? "opacity-60" : ""
      }`}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
    >
      {/* Category Badge */}
      <span className="inline-block px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md mb-3">
        {item.category}
      </span>

      {/* Item Info */}
      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1">
        {item.name}
      </h3>
      <p className="text-slate-500 text-sm mb-3 line-clamp-2">
        {item.description}
      </p>

      {/* Price */}
      <p className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
        ₹{item.price}
      </p>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={!item.available || quantity === 0}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
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
                d="M20 12H4"
              />
            </svg>
          </button>

          <span className="w-8 text-center font-medium text-slate-800">
            {quantity}
          </span>

          <button
            onClick={handleIncrement}
            disabled={!item.available}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(item)}
          disabled={!item.available || quantity === 0}
          className="flex-1 sm:flex-none px-4 py-2 sm:px-5 sm:py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {item.available ? "Add" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
