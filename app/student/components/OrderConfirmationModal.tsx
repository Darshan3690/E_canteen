"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenNumber: string;
  estimatedTime: number;
  totalAmount: number;
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  tokenNumber,
  estimatedTime,
  totalAmount,
}: OrderConfirmationModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (overlayRef.current) overlayRef.current.style.opacity = "1";
      if (modalRef.current) {
        modalRef.current.style.opacity = "1";
        modalRef.current.style.transform = "scale(1)";
      }
      return;
    }

    const tl = gsap.timeline();

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    )
      .fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.1"
      )
      .fromTo(
        contentRef.current?.querySelectorAll(".animate-in") || [],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.3, ease: "power2.out" },
        "-=0.2"
      );

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        style={{ opacity: 0 }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
        style={{ opacity: 0, transform: "scale(0.9)" }}
      >
        <div ref={contentRef} className="p-6 sm:p-8 text-center">
          {/* Success Icon */}
          <div className="animate-in w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="animate-in text-xl sm:text-2xl font-bold text-slate-800 mb-2">
            Order Placed!
          </h3>
          <p className="animate-in text-slate-500 text-sm mb-6">
            Your order has been successfully placed
          </p>

          {/* Token Number */}
          <div className="animate-in bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
              Token Number
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-emerald-600">
              {tokenNumber}
            </p>
          </div>

          {/* Details */}
          <div className="animate-in grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-0.5">Est. Time</p>
              <p className="font-semibold text-slate-800">
                {estimatedTime} min
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-0.5">Total</p>
              <p className="font-semibold text-slate-800">₹{totalAmount}</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="animate-in w-full py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 active:scale-[0.98] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
