"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, items, onCheckout }: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (drawerRef.current && overlayRef.current) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        gsap.to(overlayRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
        gsap.to(drawerRef.current, { x: "0%", y: "0%", duration: 0.4, ease: "power3.out" });
      } else {
        document.body.style.overflow = "";
        gsap.to(overlayRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
        // Slide right on desktop, slide down on mobile
        const isMobile = window.innerWidth < 768;
        gsap.to(drawerRef.current, { 
          x: isMobile ? "0%" : "100%", 
          y: isMobile ? "100%" : "0%", 
          duration: 0.3, 
          ease: "power3.in" 
        });
      }
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef} 
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 opacity-0 pointer-events-none"
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={cn(
          "fixed z-50 bg-card border-none md:border-l border-border shadow-2xl flex flex-col",
          "bottom-0 left-0 right-0 h-[85vh] rounded-t-[2rem] translate-y-full md:translate-y-0", // Mobile: Bottom sheet
          "md:top-0 md:right-0 md:bottom-0 md:left-auto md:w-[400px] md:h-full md:rounded-none md:translate-x-full" // Desktop: Sidebar
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-card rounded-t-[2rem] md:rounded-none">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ShoppingBag className="w-5 h-5" />
             </div>
             <h2 className="text-xl font-bold text-foreground">Your Order</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-50">
              <ShoppingBag className="w-16 h-16 mb-4 stroke-1" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm text-secondary-foreground">
                    {item.quantity}x
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">₹{item.price * item.quantity}</p>
                  </div>
                </div>
                {/* Could add +/- controls here too, but keep it simple for checkout review */}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-muted/20">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground font-medium">Total</span>
              <span className="text-2xl font-bold text-primary">₹{total}</span>
            </div>
            
            <button 
              onClick={onCheckout}
              className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
