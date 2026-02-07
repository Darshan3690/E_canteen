"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function WelcomeSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && containerRef.current) {
      const elements = containerRef.current.querySelectorAll(".animate-item");

      gsap.fromTo(
        elements,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="py-6 sm:py-8 lg:py-10">
      <h1 className="animate-item text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
        Welcome back 👋
      </h1>
      <p className="animate-item mt-2 text-slate-500 text-sm sm:text-base lg:text-lg">
        Order food without waiting in queues
      </p>
    </div>
  );
}
