"use client";

import { useState, useCallback, useEffect } from "react";
import ManagerHeader from "./components/ManagerHeader";
import { StatsOverview } from "./components/StatsOverview";
import LiveOrders, { Order, OrderStatus } from "./components/LiveOrders";
import MenuManagement, { MenuItem } from "./components/MenuManagement";
import Inventory from "./components/Inventory";
import OrderHistory from "./components/OrderHistory";
import FeedbackSection from "./components/FeedbackSection";

// Sample data for menu items (in production, fetch from API)
const initialMenuItems: MenuItem[] = [
  { id: "1", name: "Veg Sandwich", description: "Fresh vegetables with cheese and mint chutney", price: 40, category: "Snacks", available: true },
  { id: "2", name: "Cold Coffee", description: "Chilled coffee with ice cream", price: 30, category: "Beverages", available: true },
  { id: "3", name: "Masala Dosa", description: "Crispy dosa with potato filling", price: 50, category: "South Indian", available: true },
  { id: "4", name: "Paneer Roll", description: "Spicy paneer wrapped in soft roti", price: 60, category: "Snacks", available: true },
  { id: "5", name: "Samosa", description: "Crispy pastry with spiced potato", price: 15, category: "Snacks", available: true },
  { id: "6", name: "Masala Chai", description: "Traditional Indian tea with spices", price: 15, category: "Beverages", available: true },
  { id: "7", name: "Veg Biryani", description: "Aromatic rice with mixed vegetables", price: 80, category: "Main Course", available: false },
  { id: "8", name: "Pav Bhaji", description: "Spiced vegetable curry with buttered pav", price: 55, category: "Main Course", available: false },
  { id: "9", name: "Fresh Lime Soda", description: "Refreshing lime drink with soda", price: 25, category: "Beverages", available: true },
];

const initialOrders: Order[] = []; // Loaded from API on mount

const completedOrders: {
  id: string;
  tokenNumber: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  completedAt: Date;
  status: OrderStatus;
}[] = []; // Loaded from API

const sampleFeedback = [
  {
    id: "fb-1",
    studentName: "Rahul Sharma",
    message: "Great food and quick service! The samosas were fresh and crispy.",
    rating: 5,
    createdAt: new Date(2026, 0, 31),
  },
  {
    id: "fb-2",
    studentName: "Priya Patel",
    message: "Coffee could be better, but overall good experience.",
    rating: 3,
    createdAt: new Date(2026, 0, 30),
  },
  {
    id: "fb-3",
    studentName: "Amit Kumar",
    message: "Love the new online ordering system. No more long queues!",
    rating: 5,
    createdAt: new Date(2026, 0, 29),
  },
];

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [orderHistoryData, setOrderHistoryData] = useState(completedOrders);

  // Helper: convert API order to component Order shape
  const toComponentOrder = (o: any): Order => ({
    id: o.id,
    tokenNumber: o.orderNumber ?? o.id.slice(0, 8),
    items: (o.items ?? []).map((item: any) => ({
      name: item.menuItem?.name ?? "Item",
      quantity: item.quantity,
    })),
    totalAmount: o.totalAmount,
    status: (o.status as string).toLowerCase() as OrderStatus,
    orderTime: new Date(),
    studentName: o.student?.name,
  });

  // Fetch real orders from API
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) return;
      const data: any[] = await res.json();
      const active = data
        .filter((o) => !["COLLECTED", "CANCELLED"].includes(o.status))
        .map(toComponentOrder);
      const completed = data
        .filter((o) => o.status === "COLLECTED")
        .map((o) => ({
          id: o.id,
          tokenNumber: o.orderNumber ?? o.id.slice(0, 8),
          items: (o.items ?? []).map((item: any) => ({
            name: item.menuItem?.name ?? "Item",
            quantity: item.quantity,
          })),
          totalAmount: o.totalAmount,
          completedAt: o.completedAt ? new Date(o.completedAt) : new Date(),
          status: "collected" as OrderStatus,
        }));
      setOrders(active);
      setOrderHistoryData(completed);
    } catch {
      // silent – keep existing state
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30_000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Calculate stats
  const stats = {
    todayOrders: orders.length + orderHistoryData.length,
    pendingOrders: orders.filter((o) => o.status === "pending" || o.status === "preparing").length,
    totalRevenue: orderHistoryData.reduce((sum, o) => sum + o.totalAmount, 0) + 
                  orders.filter(o => o.status === "collected").reduce((sum, o) => sum + o.totalAmount, 0),
    outOfStock: menuItems.filter((i) => !i.available).length,
  };

  // Order handlers — also call API
  const handleOrderStatusChange = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );

    // Call API
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });
    } catch {
      // Revert on error
      fetchOrders();
      return;
    }

    // If collected, move to history
    if (newStatus === "collected") {
      setTimeout(() => {
        setOrders((current) => {
          const order = current.find((o) => o.id === orderId);
          if (order) {
            setOrderHistoryData((history) => [
              {
                id: orderId,
                tokenNumber: order.tokenNumber,
                items: order.items,
                totalAmount: order.totalAmount,
                completedAt: new Date(),
                status: "collected" as OrderStatus,
              },
              ...history,
            ]);
          }
          return current.filter((o) => o.id !== orderId);
        });
      }, 500);
    }
  }, [fetchOrders]);

  // Fetch real menu items from API
  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch("/api/manager/menu");
      if (!res.ok) return;
      const data: any[] = await res.json();
      setMenuItems(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? "",
          price: item.price,
          category: "Menu",
          available: item.isAvailable,
        }))
      );
    } catch {
      // keep existing state
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Menu handlers — call API + update UI
  const handleToggleAvailability = useCallback(async (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
    const item = menuItems.find((m) => m.id === id);
    if (!item) return;
    try {
      await fetch(`/api/manager/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !item.available }),
      });
    } catch { fetchMenu(); }
  }, [menuItems, fetchMenu]);

  const handleAddItem = useCallback(async (item: Omit<MenuItem, "id">) => {
    try {
      const res = await fetch("/api/manager/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          price: item.price,
        }),
      });
      if (!res.ok) return;
      const created = await res.json();
      setMenuItems((prev) => [
        ...prev,
        { id: created.id, name: created.name, description: created.description ?? "", price: created.price, category: "Menu", available: created.isAvailable },
      ]);
    } catch { fetchMenu(); }
  }, [fetchMenu]);

  const handleEditItem = useCallback(async (updatedItem: MenuItem) => {
    setMenuItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    try {
      await fetch(`/api/manager/menu/${updatedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedItem.name, description: updatedItem.description, price: updatedItem.price }),
      });
    } catch { fetchMenu(); }
  }, [fetchMenu]);

  const handleDeleteItem = useCallback(async (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/manager/menu/${id}`, { method: "DELETE" });
    } catch { fetchMenu(); }
  }, [fetchMenu]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6 sm:space-y-8">
            <StatsOverview stats={stats} />
            <LiveOrders orders={orders} onStatusChange={handleOrderStatusChange} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OrderHistory orders={orderHistoryData.slice(0, 5)} />
              <FeedbackSection feedbacks={sampleFeedback} />
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-6">
            <LiveOrders orders={orders} onStatusChange={handleOrderStatusChange} />
            <OrderHistory orders={orderHistoryData} />
          </div>
        );
      case "menu":
        return (
          <MenuManagement
            items={menuItems}
            onToggleAvailability={handleToggleAvailability}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      case "inventory":
        return (
          <Inventory
            items={menuItems}
            onToggleAvailability={handleToggleAvailability}
          />
        );
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "orders":
        return "Order Management";
      case "menu":
        return "Menu Management";
      case "inventory":
        return "Inventory Status";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ManagerHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}
