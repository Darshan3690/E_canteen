"use client";

import Image from "next/image";
import { Plus, Minus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  prepTime: number | null;
  isAvailable: boolean;
  quantityInCart: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function MenuItemCard({
  name,
  description,
  price,
  imageUrl,
  prepTime,
  isAvailable,
  quantityInCart,
  onAdd,
  onRemove,
}: MenuItemProps) {
  return (
    <div className={cn(
      "group relative flex flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md bg-card",
      isAvailable ? "border-border hover:border-primary/50" : "opacity-60 grayscale border-border pointer-events-none"
    )}>
      {/* Image */}
      <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden shrink-0 bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-2xl bg-orange-50 text-orange-200">
            🥗
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-sm">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-lg text-foreground line-clamp-1">{name}</h4>
            <span className="font-bold text-primary">₹{price}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{description || "Delicious meal prepared fresh."}</p>
          
          {prepTime && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-accent/30 w-fit px-2 py-1 rounded-md">
              <Clock className="w-3 h-3" />
              <span>{prepTime} min</span>
            </div>
          )}
        </div>

        {/* Add Button */}
        <div className="mt-4 flex justify-end">
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-3 bg-primary text-primary-foreground px-1 py-1 rounded-lg shadow-md animate-in fade-in zoom-in duration-200">
              <button 
                onClick={(e) => { e.preventDefault(); onRemove(); }}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm min-w-[20px] text-center">{quantityInCart}</span>
              <button 
                onClick={(e) => { e.preventDefault(); onAdd(); }}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); onAdd(); }}
              disabled={!isAvailable}
              className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground text-sm font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
