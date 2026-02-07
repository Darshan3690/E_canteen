"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MenuItem } from "./MenuCard";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onPlaceOrder: () => void;
}

export default function CartPanel({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onPlaceOrder,
}: CartPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );

  // Check for desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Handle animations
  useEffect(() => {
    // On desktop, cart is always visible
    if (isDesktop) {
      if (panelRef.current) {
        panelRef.current.style.transform = "translateY(0)";
      }
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (panelRef.current) {
        panelRef.current.style.transform = isOpen
          ? "translateY(0)"
          : "translateY(100%)";
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = isOpen ? "1" : "0";
        overlayRef.current.style.pointerEvents = isOpen ? "auto" : "none";
      }
      return;
    }

    if (isOpen) {
      // Open animation
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(panelRef.current, {
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      // Close animation
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(panelRef.current, {
        y: "100%",
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isOpen, isDesktop]);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="lg:hidden fixed inset-0 bg-black/40 z-40"
        style={{ opacity: 0, pointerEvents: isOpen ? "auto" : "none" }}
      />

      {/* Cart Panel - Mobile: Bottom drawer, Desktop: Side panel */}
      <div
        ref={panelRef}
        className="fixed lg:relative bottom-0 lg:bottom-auto lg:top-0 right-0 left-0 lg:left-auto z-50 lg:z-auto w-full lg:w-full max-h-[85vh] lg:max-h-[calc(100vh-6rem)] bg-white rounded-t-2xl lg:rounded-xl border border-slate-100 shadow-xl lg:shadow-md flex flex-col"
        style={{ transform: isDesktop ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Your Cart</h3>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">Your cart is empty</p>
              <p className="text-slate-400 text-xs mt-1">
                Add items from the menu
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-slate-500 text-xs">
                      ₹{item.price} × {quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, Math.max(0, quantity - 1))
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
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

                    <span className="w-6 text-center text-sm font-medium text-slate-800">
                      {quantity}
                    </span>

                    <button
                      onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
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

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-1 p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600">Total</span>
              <span className="text-xl font-bold text-slate-800">
                ₹{totalAmount}
              </span>
            </div>
            <button
              onClick={onPlaceOrder}
              className="w-full py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 active:scale-[0.98] transition-all"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </>
  );
}
