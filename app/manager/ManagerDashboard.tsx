"use client";

import { useState, useCallback } from "react";
import ManagerHeader from "./components/ManagerHeader";
import { StatsOverview } from "./components/StatsOverview";
import LiveOrders, { Order, OrderStatus } from "./components/LiveOrders";
import MenuManagement, { MenuItem } from "./components/MenuManagement";
import Inventory from "./components/Inventory";
import OrderHistory from "./components/OrderHistory";
import FeedbackSection from "./components/FeedbackSection";

// Sample data - in production, this would come from your API/database
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

const initialOrders: Order[] = [
  {
    id: "ord-1",
    tokenNumber: "A101",
    items: [{ name: "Veg Sandwich", quantity: 2 }, { name: "Cold Coffee", quantity: 1 }],
    totalAmount: 110,
    status: "pending",
    orderTime: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "ord-2",
    tokenNumber: "A102",
    items: [{ name: "Masala Dosa", quantity: 1 }, { name: "Masala Chai", quantity: 2 }],
    totalAmount: 80,
    status: "preparing",
    orderTime: new Date(Date.now() - 12 * 60000),
  },
  {
    id: "ord-3",
    tokenNumber: "A103",
    items: [{ name: "Samosa", quantity: 4 }],
    totalAmount: 60,
    status: "ready",
    orderTime: new Date(Date.now() - 20 * 60000),
  },
  {
    id: "ord-4",
    tokenNumber: "A104",
    items: [{ name: "Paneer Roll", quantity: 1 }, { name: "Fresh Lime Soda", quantity: 1 }],
    totalAmount: 85,
    status: "pending",
    orderTime: new Date(Date.now() - 2 * 60000),
  },
];

const completedOrders = [
  {
    id: "comp-1",
    tokenNumber: "A098",
    items: [{ name: "Masala Dosa", quantity: 1 }, { name: "Cold Coffee", quantity: 2 }],
    totalAmount: 110,
    completedAt: new Date(Date.now() - 45 * 60000),
    status: "collected" as OrderStatus,
  },
  {
    id: "comp-2",
    tokenNumber: "A097",
    items: [{ name: "Veg Biryani", quantity: 2 }],
    totalAmount: 160,
    completedAt: new Date(Date.now() - 60 * 60000),
    status: "collected" as OrderStatus,
  },
  {
    id: "comp-3",
    tokenNumber: "A096",
    items: [{ name: "Samosa", quantity: 6 }, { name: "Masala Chai", quantity: 3 }],
    totalAmount: 135,
    completedAt: new Date(Date.now() - 90 * 60000),
    status: "collected" as OrderStatus,
  },
];

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
  const [orders, setOrders] = useState(initialOrders);
  const [orderHistoryData, setOrderHistoryData] = useState(completedOrders);

  // Calculate stats
  const stats = {
    todayOrders: orders.length + orderHistoryData.length,
    pendingOrders: orders.filter((o) => o.status === "pending" || o.status === "preparing").length,
    totalRevenue: orderHistoryData.reduce((sum, o) => sum + o.totalAmount, 0) + 
                  orders.filter(o => o.status === "collected").reduce((sum, o) => sum + o.totalAmount, 0),
    outOfStock: menuItems.filter((i) => !i.available).length,
  };

  // Order handlers
  const handleOrderStatusChange = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus };
          
          // If collected, move to history
          if (newStatus === "collected") {
            setTimeout(() => {
              setOrders((current) => current.filter((o) => o.id !== orderId));
              setOrderHistoryData((history) => [
                {
                  id: orderId,
                  tokenNumber: order.tokenNumber,
                  items: order.items,
                  totalAmount: order.totalAmount,
                  completedAt: new Date(),
                  status: "collected",
                },
                ...history,
              ]);
            }, 500);
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  }, []);

  // Menu handlers
  const handleToggleAvailability = useCallback((id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  }, []);

  const handleAddItem = useCallback((item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenuItems((prev) => [...prev, newItem]);
  }, []);

  const handleEditItem = useCallback((updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

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
