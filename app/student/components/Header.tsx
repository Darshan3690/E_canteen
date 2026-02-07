"use client";

import { useEffect, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import gsap from "gsap";
import Link from "next/link";

// Removed invalid import; landing page is routed at '/'

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemCount, onCartClick }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">E</span>
            </div>
            <span className="font-semibold text-slate-800 text-base sm:text-lg">
              E-Canteen
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/student"
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/student#orders"
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              My Orders
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="View cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Nav */}
            <div className="flex sm:hidden items-center gap-2">
              <Link
                href="/student#orders"
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Orders"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </Link>
            </div>

            {/* User Button */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 sm:w-9 sm:h-9",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
