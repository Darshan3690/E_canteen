"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Power, EyeOff, MoreVertical } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import MenuModal from "../components/MenuModal";

// Mock Data
const MOCK_MENU = [
  { id: 1, name: "Butter Chicken", price: 180, category: "Main Course", image: "/foods/food_1.png", available: true, description: "Classic creamy chicken curry" },
  { id: 2, name: "Paneer Tikka", price: 150, category: "Starters", image: "/foods/food_2.png", available: true, description: "Grilled marinated cottage cheese" },
  { id: 3, name: "Veg. Biryani", price: 120, category: "Rice", image: "/foods/food_3.png", available: false, description: "Aromatic rice with vegetables" },
  { id: 4, name: "Cold Coffee", price: 60, category: "Beverages", image: "/foods/food_4.png", available: true, description: "Chilled coffee with ice cream" },
  { id: 5, name: "Masala Dosa", price: 80, category: "South Indian", image: "/foods/food_5.png", available: true, description: "Crispy crepe with potato filling" },
  { id: 6, name: "Chicken 65", price: 160, category: "Starters", image: "/foods/food_1.png", available: true, description: "Spicy deep-fried chicken" },
];

export default function MenuManagement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [menuItems, setMenuItems] = useState(MOCK_MENU);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".menu-item-card", {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.7)"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  const handleAddItem = (data: any) => {
    const newItem = {
      id: menuItems.length + 1,
      ...data,
      available: true, // Default
      image: data.image || "/foods/food_1.png" // Fallback mock image
    };
    setMenuItems([newItem, ...menuItems]);
    setIsModalOpen(false);
  };

  const handleUpdateItem = (data: any) => {
    if (!editingItem) return;
    setMenuItems(prev => prev.map(item => 
      item.id === editingItem.id ? { ...item, ...data } : item
    ));
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const toggleAvailability = (id: number) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };
    
  const filteredItems = menuItems.filter(item => 
    (activeTab === "All" || item.category === activeTab) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="pb-20">
      <MenuModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingItem ? handleUpdateItem : handleAddItem}
        initialData={editingItem}
      />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground mt-1">Manage your food items, prices and availability.</p>
        </div>
        <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          Add New Item
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-border/40">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search food items..." 
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 rounded-xl focus:bg-background border border-transparent focus:border-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
           {["All", "Starters", "Main Course", "Beverages", "Rice", "South Indian", "Breads", "Desserts"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  activeTab === tab 
                    ? "bg-foreground text-background shadow-md" 
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {tab}
              </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <MenuCard 
            key={item.id} 
            item={item} 
            onEdit={() => openEditModal(item)}
            onToggle={() => toggleAvailability(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MenuCard({ item, onEdit, onToggle }: { item: any, onEdit: () => void, onToggle: () => void }) {
  const isAvailable = item.available;

  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 menu-item-card flex flex-col h-full">
      
      {/* Image Area */}
      <div className="relative h-48 w-full overflow-hidden bg-secondary/30">
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-110",
            !isAvailable && "grayscale opacity-60"
          )}
        />
        
        {/* Availability Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border border-white/10 flex items-center gap-1.5",
            isAvailable 
              ? "bg-green-500/90 text-white" 
              : "bg-red-500/90 text-white"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full bg-white animate-pulse")} />
            {isAvailable ? "Available" : "Sold Out"}
          </span>
        </div>

        {/* Action Menu (Appear on Hover) */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
            <button 
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-foreground hover:text-primary transition-colors"
                title="Edit Item"
            >
                <Edit2 size={14} />
            </button>
             <button 
                className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-foreground hover:text-red-500 transition-colors"
                title="Delete Item"
            >
                <Trash2 size={14} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
           <div>
             <h3 className="font-bold text-lg text-foreground line-clamp-1">{item.name}</h3>
             <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{item.category}</p>
           </div>
           <span className="font-bold text-primary">₹{item.price}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {item.description || "No description available."}
        </p>

        {/* Actions Row */}
        <div className="pt-4 border-t border-border mt-auto">
            <button 
                onClick={onToggle}
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border",
                    isAvailable 
                        ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100" 
                        : "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                )}
            >
                <Power size={14} />
                {isAvailable ? "Mark as Sold Out" : "Mark as Available"}
            </button>
        </div>
      </div>
    </div>
  );
}
