"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Clock, MapPin, ShoppingBag } from "lucide-react";
import MenuItemCard from "@/app/components/student/MenuItemCard";
import CartDrawer from "@/app/components/student/CartDrawer";
import OrderSuccessModal from "@/app/components/student/OrderSuccessModal";
import UserProfileBar from "@/app/components/UserProfileBar";
import { cn } from "@/lib/utils";

/* ---------- Types ---------- */
interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  prepTime: number | null;
  isAvailable: boolean;
}

interface Canteen {
  id: string;
  name: string;
  description: string | null;
  location: string;
  openingTime: string;
  closingTime: string;
  isOpenNow: boolean;
  logoUrl: string | null;
  tokenPrefix: string;
  menuItems: MenuItem[];
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface ConfirmedOrder {
  tokenNumber: string;
  totalAmount: number;
  estimatedTime: number;
  status: string;
}

export default function CanteenMenuClient({ canteen }: { canteen: Canteen }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Animation Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance Animation
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      
      gsap.from(".menu-item-gsap", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.3
      });
    });
    return () => ctx.revert();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.menuItem.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.menuItem.id !== itemId);
    });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canteenId: canteen.id,
          items: cart.map((c) => ({ menuItemId: c.menuItem.id, quantity: c.quantity })),
        }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Order failed");
        setLoading(false);
        return;
      }
      
      const order = await res.json();
      
      // Calculate estimated time
      const estTime = cart.length > 0
        ? Math.max(...cart.map((c) => c.menuItem.prepTime ?? 5)) + Math.min(totalItems * 2, 10)
        : 15;

      setConfirmedOrder({
        tokenNumber: order.tokenNumber || "T-" + Math.floor(Math.random() * 1000), 
        totalAmount: totalPrice,
        estimatedTime: estTime,
        status: "PENDING"
      });
      
      setCart([]);
      setCartOpen(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 relative overflow-x-hidden">
      {/* Subtle background for Hero */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />

      {/* Header */}
      <header ref={headerRef} className="pt-8 px-6 pb-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
            <Link href="/canteens" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-foreground transition-all shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-medium hidden sm:inline group-hover:translate-x-1 transition-transform">Back</span>
            </Link>
            <div className="flex items-center gap-4">
               {/* Cart Button Mobile */}
               <button 
                onClick={() => setCartOpen(true)}
                className="relative md:hidden w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
               >
                 <ShoppingBag className="w-5 h-5" />
                 {totalItems > 0 && (
                   <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary">
                     {totalItems}
                   </span>
                 )}
               </button>
               <UserProfileBar variant="light" />
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
           <div>
              <div className="flex items-center gap-4 mb-3">
                 <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-none">{canteen.name}</h1>
                 <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm",
                    canteen.isOpenNow ? "bg-green-100/50 text-green-700 border-green-200" : "bg-red-100/50 text-red-700 border-red-200"
                 )}>
                    <span className={cn("w-2 h-2 rounded-full", canteen.isOpenNow ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                    {canteen.isOpenNow ? "OPEN" : "CLOSED"}
                 </span>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">{canteen.description || "Fresh & delicious food served daily on campus."}</p>
              
              <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-foreground/70 font-medium">
                 <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{canteen.openingTime} - {canteen.closingTime}</span>
                 </div>
                 <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{canteen.location}</span>
                 </div>
              </div>
           </div>
        </div>
      </header>

      {/* Menu Grid */}
      <main className="max-w-7xl mx-auto px-6">
         <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">Menu</h2>
         </div>

         <div ref={menuRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {canteen.menuItems.map((item) => (
              <div key={item.id} className="menu-item-gsap h-full">
                  <div className="h-full">
                    <MenuItemCard
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        imageUrl={item.image}
                        prepTime={item.prepTime}
                        isAvailable={item.isAvailable}
                        quantityInCart={cart.find((c) => c.menuItem.id === item.id)?.quantity || 0}
                        onAdd={() => addToCart(item)}
                        onRemove={() => removeFromCart(item.id)}
                    />
                  </div>
              </div>
            ))}
         </div>
         
         {canteen.menuItems.length === 0 && (
             <div className="text-center py-20 text-muted-foreground">
                 <p className="text-xl">No menu items available right now.</p>
             </div>
         )}
      </main>

      {/* Floating Cart Button (Desktop & Mobile) when items > 0 */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-30 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <button 
            onClick={() => setCartOpen(true)}
            className="group flex items-center gap-4 bg-foreground text-background pl-6 pr-2 py-2 rounded-full shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            <div className="flex flex-col items-start mr-2">
               <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Total</span>
               <span className="text-lg font-bold leading-none">₹{totalPrice}</span>
            </div>
            
            <div className="bg-background text-foreground rounded-full w-12 h-12 flex items-center justify-center relative group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
               <ShoppingBag className="w-5 h-5" />
               <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-background group-hover:border-primary-foreground transition-colors">
                 {totalItems}
               </span>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        items={cart.map(c => ({ 
            id: c.menuItem.id, 
            name: c.menuItem.name, 
            price: c.menuItem.price, 
            quantity: c.quantity 
        }))}
        onCheckout={placeOrder}
      />

      {/* Success Modal */}
      {confirmedOrder && (
          <OrderSuccessModal 
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            tokenNumber={confirmedOrder.tokenNumber}
            totalAmount={confirmedOrder.totalAmount}
            estimatedTime={confirmedOrder.estimatedTime}
          />
      )}
    </div>
  );
}
