"use client";

import { useState, useCallback } from "react";
import Header from "./components/Header";
import WelcomeSection from "./components/WelcomeSection";
import MenuSection from "./components/MenuSection";
import CartPanel, { CartItem } from "./components/CartPanel";
import OrderConfirmationModal from "./components/OrderConfirmationModal";
import OrderStatusSection, {
  OrderStatus,
} from "./components/OrderStatusSection";
import OrderHistory from "./components/OrderHistory";
import { MenuItem } from "./components/MenuCard";

// Sample menu data - in production, this would come from your API/database
const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Veg Sandwich",
    description: "Fresh vegetables with cheese and mint chutney",
    price: 40,
    available: true,
    category: "Snacks",
  },
  {
    id: "2",
    name: "Cold Coffee",
    description: "Chilled coffee with ice cream and chocolate",
    price: 30,
    available: true,
    category: "Beverages",
  },
  {
    id: "3",
    name: "Masala Dosa",
    description: "Crispy dosa with potato filling and sambar",
    price: 50,
    available: true,
    category: "South Indian",
  },
  {
    id: "4",
    name: "Paneer Roll",
    description: "Spicy paneer wrapped in soft roti",
    price: 60,
    available: true,
    category: "Snacks",
  },
  {
    id: "5",
    name: "Samosa",
    description: "Crispy pastry with spiced potato filling",
    price: 15,
    available: true,
    category: "Snacks",
  },
  {
    id: "6",
    name: "Masala Chai",
    description: "Traditional Indian tea with spices",
    price: 15,
    available: true,
    category: "Beverages",
  },
  {
    id: "7",
    name: "Veg Biryani",
    description: "Aromatic rice with mixed vegetables and raita",
    price: 80,
    available: true,
    category: "Main Course",
  },
  {
    id: "8",
    name: "Pav Bhaji",
    description: "Spiced vegetable curry with buttered pav",
    price: 55,
    available: false,
    category: "Main Course",
  },
  {
    id: "9",
    name: "Fresh Lime Soda",
    description: "Refreshing lime drink with soda",
    price: 25,
    available: true,
    category: "Beverages",
  },
];

// Sample order history
const sampleOrderHistory = [
  {
    id: "order-1",
    tokenNumber: "A098",
    status: "collected" as OrderStatus,
    totalAmount: 120,
    items: ["Masala Dosa", "Cold Coffee", "Samosa"],
    date: new Date(2026, 0, 31),
  },
  {
    id: "order-2",
    tokenNumber: "A095",
    status: "collected" as OrderStatus,
    totalAmount: 80,
    items: ["Veg Biryani"],
    date: new Date(2026, 0, 30),
  },
  {
    id: "order-3",
    tokenNumber: "A089",
    status: "collected" as OrderStatus,
    totalAmount: 55,
    items: ["Veg Sandwich", "Masala Chai"],
    date: new Date(2026, 0, 28),
  },
];

// Generate random token
function generateToken(): string {
  const letters = "ABCD";
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(Math.random() * 900) + 100;
  return `${letter}${number}`;
}

export default function StudentDashboard() {
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Order state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<{
    tokenNumber: string;
    totalAmount: number;
    estimatedTime: number;
  } | null>(null);

  // Active order state (simulated)
  const [activeOrder, setActiveOrder] = useState<{
    tokenNumber: string;
    status: OrderStatus;
    items: string[];
    totalAmount: number;
    placedAt: Date;
  } | null>(null);

  // Order history
  const [orderHistory, setOrderHistory] = useState(sampleOrderHistory);

  // Handlers
  const handleQuantityChange = useCallback((id: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  }, []);

  const handleAddToCart = useCallback((item: MenuItem) => {
    const quantity = quantities[item.id] || 0;
    if (quantity === 0) return;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { item, quantity }];
    });

    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    setIsCartOpen(true);
  }, [quantities]);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== id));
  }, []);

  const handleUpdateCartQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((ci) => (ci.item.id === id ? { ...ci, quantity } : ci))
    );
  }, [handleRemoveItem]);

  const handlePlaceOrder = useCallback(() => {
    const totalAmount = cartItems.reduce(
      (sum, { item, quantity }) => sum + item.price * quantity,
      0
    );
    const tokenNumber = generateToken();
    const estimatedTime = Math.floor(Math.random() * 10) + 10; // 10-20 mins

    setCurrentOrder({ tokenNumber, totalAmount, estimatedTime });
    setShowConfirmation(true);
    setIsCartOpen(false);

    // Set as active order
    setActiveOrder({
      tokenNumber,
      status: "preparing",
      items: cartItems.map((ci) => ci.item.name),
      totalAmount,
      placedAt: new Date(),
    });

    // Clear cart
    setCartItems([]);

    // Simulate status changes (for demo)
    setTimeout(() => {
      setActiveOrder((prev) =>
        prev ? { ...prev, status: "ready" } : null
      );
    }, 8000);

    setTimeout(() => {
      setActiveOrder((prev) => {
        if (prev) {
          // Move to history
          setOrderHistory((history) => [
            {
              id: `order-${Date.now()}`,
              tokenNumber: prev.tokenNumber,
              status: "collected",
              totalAmount: prev.totalAmount,
              items: prev.items,
              date: new Date(),
            },
            ...history,
          ]);
        }
        return null;
      });
    }, 15000);
  }, [cartItems]);

  const cartItemCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:gap-8">
          {/* Main Content */}
          <main className="flex-1 pb-32 lg:pb-8">
            <WelcomeSection />
            <OrderStatusSection activeOrder={activeOrder} />
            <MenuSection
              items={menuItems}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />
            <OrderHistory orders={orderHistory} />
          </main>

          {/* Desktop Cart - Always visible on desktop */}
          <aside className="hidden lg:block lg:w-80 xl:w-96 lg:py-6">
            <div className="sticky top-20">
              <CartPanel
                isOpen={true}
                onClose={() => {}}
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateCartQuantity}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Cart Panel */}
      <div className="lg:hidden">
        <CartPanel
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateCartQuantity}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        tokenNumber={currentOrder?.tokenNumber || ""}
        estimatedTime={currentOrder?.estimatedTime || 0}
        totalAmount={currentOrder?.totalAmount || 0}
      />
    </div>
  );
}
