"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import MenuCard, { MenuItem } from "./MenuCard";

interface MenuSectionProps {
  items: MenuItem[];
  quantities: Record<string, number>;
  onQuantityChange: (id: string, quantity: number) => void;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuSection({
  items,
  quantities,
  onQuantityChange,
  onAddToCart,
}: MenuSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll(".menu-card");

      gsap.fromTo(
        cards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.4,
        }
      );
    }
  }, []);

  return (
    <div ref={sectionRef}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
          Today&apos;s Menu
        </h2>
        <span className="text-sm text-slate-500">{items.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item) => (
          <div key={item.id} className="menu-card">
            <MenuCard
              item={item}
              quantity={quantities[item.id] || 0}
              onQuantityChange={onQuantityChange}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
