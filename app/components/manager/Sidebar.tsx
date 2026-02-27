"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/manager/dashboard" },
  { icon: ShoppingBag, label: "Orders", href: "/manager/orders" },
  { icon: UtensilsCrossed, label: "Menu", href: "/manager/menu" },
  { icon: BarChart3, label: "Analytics", href: "/manager/analytics" },
  { icon: Settings, label: "Settings", href: "/manager/settings" },
];

export default function ManagerSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col h-full",
        collapsed ? "w-20" : "w-64"
      )}>
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            {!collapsed && <span className="text-foreground">Manager</span>}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
                
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white ml-2" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-border">
           <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
              <UserButton />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">My Account</span>
                  <span className="text-xs text-muted-foreground">Manager</span>
                </div>
              )}
           </div>
        </div>
      </aside>
    </>
  );
}
