"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderSuccessModalProps {
  tokenNumber: string;
  totalAmount: number;
  estimatedTime: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderSuccessModal({ 
  tokenNumber, 
  totalAmount, 
  estimatedTime, 
  isOpen, 
  onClose 
}: OrderSuccessModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Entrance animation
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
      gsap.fromTo(modalRef.current, 
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );

      // Token counter animation (mock count up effect)
      if (tokenRef.current) {
        // Just a simple pop in effect for the token
         gsap.fromTo(tokenRef.current, 
            { scale: 0, rotation: -10 }, 
            { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)", delay: 0.2 }
         );
      }
    } else {
      // Exit animation
       gsap.to(overlayRef.current, { opacity: 0, pointerEvents: "none", duration: 0.2 });
       gsap.to(modalRef.current, { scale: 0.8, opacity: 0, y: 20, duration: 0.2 });
    }
  }, [isOpen, tokenNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        ref={overlayRef} 
        className="absolute inset-0 bg-background/80 backdrop-blur-md opacity-0 pointer-events-none"
      />

      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl p-8 flex flex-col items-center text-center overflow-hidden"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-in zoom-in duration-500">
           <CheckCircle className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h2>
        <p className="text-muted-foreground mb-8 text-lg">Your meal is being prepared.</p>

        <div className="bg-secondary/50 rounded-2xl p-6 w-full mb-8 border border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">PICKUP TOKEN</p>
          <div className="text-5xl font-mono font-bold text-primary tracking-tighter" ref={tokenRef}>
            {tokenNumber}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm font-medium text-foreground">
             <Clock className="w-4 h-4 text-primary" />
             <span>Estimated pickup: {estimatedTime} mins</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
            <Link href="/student/orders">
                <button className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all">
                    View Order Details
                </button>
            </Link>
            <button 
                onClick={onClose}
                className="w-full h-12 bg-transparent text-muted-foreground font-medium hover:text-foreground transition-colors"
            >
                Order more items
            </button>
        </div>
      </div>
    </div>
  );
}
