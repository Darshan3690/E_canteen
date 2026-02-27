"use client";

import { useState } from "react";
import ManagerSidebar from "@/app/components/manager/Sidebar";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      
      {/* Mobile Header */}
      <div className="md:hidden h-16 border-b border-border bg-card flex items-center px-4 justify-between sticky top-0 z-50">
        <span className="font-bold text-lg">Manager Dashboard</span>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 -mr-2">
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex h-[calc(100vh-4rem)] md:h-screen md:overflow-hidden relative">
        {/* Sidebar */}
        <div className={cn(
            "fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:inset-auto md:h-full md:block",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
            "md:transform-none" // Reset transform on desktop
        )}>
            <ManagerSidebar />
        </div>
        
        {/* Overlay for mobile */}
        {isMobileOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-30 md:hidden glass-blur"
                onClick={() => setIsMobileOpen(false)}
            />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:overflow-y-auto bg-background transition-all">
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-5 duration-500">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
