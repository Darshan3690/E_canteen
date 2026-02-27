"use client";

import { useState, useRef, useEffect } from "react";
import { Clock, CheckCircle2, AlertCircle, ChefHat, Bell, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

// Mock Data
type OrderStatus = 'PENDING' | 'PREPARING' | 'READY';

interface Order {
  id: string;
  items: string[];
  total: number;
  time: string;
  status: OrderStatus;
  customer: string;
}

const MOCK_ORDERS: Order[] = [
  { id: "#1001", items: ["2x Butter Chicken", "2x Naan"], total: 420, time: "12:30 PM", status: "PENDING", customer: "Rahul K." },
  { id: "#1002", items: ["1x Veg Biryani", "1x Coke"], total: 180, time: "12:32 PM", status: "PENDING", customer: "Sneha M." },
  { id: "#1003", items: ["1x Masala Dosa"], total: 80, time: "12:25 PM", status: "PREPARING", customer: "Vikram S." },
  { id: "#1004", items: ["2x Coffee", "1x Sandwich"], total: 150, time: "12:20 PM", status: "READY", customer: "Priya D." },
  { id: "#1005", items: ["1x Thali"], total: 120, time: "12:35 PM", status: "PENDING", customer: "Amit B." },
];

export default function LiveOrders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".order-column", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
      });
      
      gsap.from(".order-card", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.4
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const moveOrder = (id: string, newStatus: OrderStatus) => {
    // Improve this with FLIP animation later if needed
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const getOrdersByStatus = (status: OrderStatus) => orders.filter(o => o.status === status);

  return (
    <div ref={containerRef} className="h-[calc(100vh-8rem)] flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Kitchen</h1>
          <p className="text-muted-foreground">Manage ongoing orders in real-time.</p>
        </div>
        <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Kitchen Live
            </span>
            <button className="relative p-2 rounded-full hover:bg-secondary">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pb-2">
        
        {/* Pending Column */}
        <StatusColumn 
            title="New Orders" 
            count={getOrdersByStatus('PENDING').length} 
            color="bg-blue-50 border-blue-100" 
            icon={AlertCircle}
            iconColor="text-blue-500"
        >
            {getOrdersByStatus('PENDING').map(order => (
                <OrderCard 
                    key={order.id} 
                    order={order} 
                    onAdvance={() => moveOrder(order.id, 'PREPARING')} 
                    actionLabel="Start Preparing"
                    actionColor="bg-blue-500 hover:bg-blue-600"
                />
            ))}
        </StatusColumn>

        {/* Preparing Column */}
        <StatusColumn 
            title="Preparing" 
            count={getOrdersByStatus('PREPARING').length} 
            color="bg-orange-50 border-orange-100"
            icon={ChefHat}
            iconColor="text-orange-500"
        >
            {getOrdersByStatus('PREPARING').map(order => (
                <OrderCard 
                    key={order.id} 
                    order={order} 
                    onAdvance={() => moveOrder(order.id, 'READY')} 
                    actionLabel="Mark Ready"
                    actionColor="bg-orange-500 hover:bg-orange-600"
                />
            ))}
        </StatusColumn>

        {/* Ready Column */}
        <StatusColumn 
            title="Ready for Pickup" 
            count={getOrdersByStatus('READY').length} 
            color="bg-green-50 border-green-100"
            icon={CheckCircle2}
            iconColor="text-green-500"
        >
            {getOrdersByStatus('READY').map(order => (
                <OrderCard 
                    key={order.id} 
                    order={order} 
                    onAdvance={() => {
                        // In a real app, this would archive the order
                        setOrders(prev => prev.filter(o => o.id !== order.id));
                    }} 
                    actionLabel="Complete Order"
                    actionColor="bg-green-500 hover:bg-green-600"
                />
            ))}
        </StatusColumn>

      </div>
    </div>
  );
}

function StatusColumn({ title, count, children, color, icon: Icon, iconColor }: any) {
    return (
        <div className={cn("flex flex-col h-full rounded-2xl border p-4 transition-colors order-column", color)}>
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <Icon className={cn("w-5 h-5", iconColor)} />
                    <h3 className="font-bold text-foreground">{title}</h3>
                </div>
                <span className="bg-white/50 px-2 py-0.5 rounded-md text-xs font-bold border border-black/5">
                    {count}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
                {children}
            </div>
        </div>
    );
}

function OrderCard({ order, onAdvance, actionLabel, actionColor }: any) {
    return (
        <div className="bg-white p-4 rounded-xl border border-black/5 shadow-sm hover:shadow-md transition-shadow order-card group">
            <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-lg">{order.id}</span>
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    {order.time}
                </span>
            </div>
            
            <div className="space-y-1 mb-4">
                {order.items.map((item: string, i: number) => (
                    <div key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                        {item}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/5">
                <div className="text-xs font-medium bg-secondary px-2 py-1 rounded">
                    {order.customer}
                </div>
                <button 
                    onClick={onAdvance}
                    className={cn(
                        "text-xs font-bold text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm",
                        actionColor
                    )}
                >
                    {actionLabel}
                    <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
}
