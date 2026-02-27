"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  ArrowUpRight, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  MoreHorizontal,
  Clock,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ManagerDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dashboard-card", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });
      
      gsap.from(".stat-value", {
        innerText: 0,
        duration: 1.5,
        snap: { innerText: 1 },
        stagger: 0.2,
        ease: "power1.out",
        onUpdate: function() {
          // This is a simple counter animation, handling strings might need more care
          // but for now let's just fade in the number
        } 
      });
      
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 dashboard-card">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, get an overview of your canteen today.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium shadow-sm hover:bg-secondary transition-colors">
              Export Report
           </button>
           <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg hover:bg-primary/90 transition-all">
              Add New Item
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="₹12,450" 
          change="+12.5%" 
          icon={DollarSign} 
          trend="up"
          delay={0}
        />
        <StatCard 
          title="Total Orders" 
          value="156" 
          change="+8.2%" 
          icon={ShoppingBag} 
          trend="up"
          delay={0.1}
        />
        <StatCard 
          title="Avg. Wait Time" 
          value="12m" 
          change="-2.1%" 
          icon={Clock} 
          trend="down" // Good for wait time
          delay={0.2} 
        />
         <StatCard 
          title="Active Customers" 
          value="89" 
          change="+4.3%" 
          icon={Users} 
          trend="up"
          delay={0.3}
        />
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart (Mock UI) */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-soft dashboard-card">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Revenue Analytics</h3>
              <select className="bg-secondary text-sm rounded-lg px-3 py-1 border-none outline-none">
                 <option>This Week</option>
                 <option>This Month</option>
              </select>
           </div>
           
           <div className="h-64 flex items-end justify-between gap-2 px-2">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                 <div key={i} className="flex-1 group relative">
                    <div 
                        className="bg-primary/20 w-full rounded-t-lg transition-all duration-500 hover:bg-primary relative overflow-hidden" 
                        style={{ height: `${h}%` }}
                    >
                        <div className="absolute bottom-0 left-0 w-full bg-primary/30 h-0 transition-all duration-1000" style={{ height: '0%' }} />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                       ₹{h * 150}
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 block text-center">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                 </div>
              ))}
           </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-soft dashboard-card">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Recent Orders</h3>
              <button className="text-primary text-sm font-medium hover:underline">View All</button>
           </div>
           
           <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                          T-{100 + i}
                       </div>
                       <div>
                          <p className="font-medium text-sm text-foreground">Butter Chicken...</p>
                          <p className="text-xs text-muted-foreground">2 mins ago</p>
                       </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                       PREPARING
                    </span>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, trend, delay }: any) {
  const isUp = trend === "up";
  const isGood = (title === "Avg. Wait Time" && !isUp) || (title !== "Avg. Wait Time" && isUp);
  
  return (
    <div 
        className="bg-card p-6 rounded-2xl border border-border shadow-soft hover:shadow-lg transition-all hover:-translate-y-1 dashboard-card group"
        style={{ transitionDelay: `${delay}s` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <h3 className="text-3xl font-bold text-foreground mb-1 stat-value">{value}</h3>
      <p className="text-sm text-muted-foreground mb-4">{title}</p>
      
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className={cn(
            "flex items-center px-1.5 py-0.5 rounded",
            isGood ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {isGood ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1 rotate-180" />}
          {change}
        </span>
        <span className="text-muted-foreground">vs last week</span>
      </div>
    </div>
  );
}
