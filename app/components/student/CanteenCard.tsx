"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CanteenProps {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  imageUrl: string | null;
  isOpen: boolean;
  rating?: number; // Mock rating if not in DB
}

export default function CanteenCard({ canteen }: { canteen: CanteenProps }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.02,
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <Link href={`/canteen/${canteen.id}`}>
      <div 
        ref={cardRef}
        className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm transition-all duration-300 h-full flex flex-col"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {canteen.imageUrl ? (
            <img 
              src={canteen.imageUrl} 
              alt={canteen.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-orange-300">
               <span className="text-4xl">🍽️</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className={cn(
            "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm",
            canteen.isOpen 
              ? "bg-green-500/90 text-white" 
              : "bg-red-500/90 text-white"
          )}>
            {canteen.isOpen ? "OPEN" : "CLOSED"}
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm text-foreground">
            <Star className="w-3 h-3 text-orange-400 fill-orange-400" /> 
            {canteen.rating || "4.5"}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-auto">
            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {canteen.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {canteen.description || "Fresh food served daily on campus."}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{canteen.location || "Campus Center"}</span>
            </div>
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Menu <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
