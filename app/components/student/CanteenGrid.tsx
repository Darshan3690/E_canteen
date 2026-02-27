"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import CanteenCard from "./CanteenCard";

interface Canteen {
  id: string;
  name: string;
  description: string | null;
  location: string; // Changed from null to string directly as per schema usage
  coverImageUrl: string | null;
  isOpenNow: boolean;
}

export default function CanteenGrid({ canteens }: { canteens: any[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { 
          y: 30, 
          opacity: 0,
          scale: 0.95 
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.5, 
          stagger: 0.1, 
          ease: "power2.out",
          delay: 0.1
        }
      );
    }
  }, []);

  if (canteens.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-up">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
          🏪
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No canteens found</h3>
        <p className="text-muted-foreground">Check back later for new spots!</p>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {canteens.map((canteen) => (
        <CanteenCard 
          key={canteen.id} 
          canteen={{
            id: canteen.id,
            name: canteen.name,
            description: canteen.description,
            location: canteen.location,
            imageUrl: canteen.coverImageUrl,
            isOpen: canteen.isOpenNow, // Calculated on server or helper
            rating: 4.5 // Mock rating
          }} 
        />
      ))}
    </div>
  );
}
