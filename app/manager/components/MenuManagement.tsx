"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface MenuItemRowProps {
  item: MenuItem;
  onToggleAvailability: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export function MenuItemRow({ item, onToggleAvailability, onEdit, onDelete }: MenuItemRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && rowRef.current) {
      gsap.to(rowRef.current, {
        backgroundColor: item.available ? "#fef2f2" : "#f0fdf4",
        duration: 0.3,
        onComplete: () => {
          gsap.to(rowRef.current, {
            backgroundColor: "#ffffff",
            duration: 0.5,
          });
        },
      });
    }

    onToggleAvailability(item.id);
  };

  return (
    <div
      ref={rowRef}
      className={`flex items-center justify-between p-4 bg-white rounded-lg border border-slate-100 ${
        !item.available ? "opacity-60" : ""
      }`}
    >
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-slate-800 truncate">{item.name}</h3>
          <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
            {item.category}
          </span>
        </div>
        <p className="text-sm text-slate-500 truncate">{item.description}</p>
        <p className="text-sm font-semibold text-slate-800 mt-1">₹{item.price}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Availability Toggle */}
        <button
          onClick={handleToggle}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            item.available ? "bg-emerald-500" : "bg-slate-300"
          }`}
          aria-label={item.available ? "Disable item" : "Enable item"}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              item.available ? "left-6" : "left-1"
            }`}
          />
        </button>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          aria-label="Edit item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          aria-label="Delete item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, "id"> | MenuItem) => void;
  editItem?: MenuItem | null;
}

export function MenuItemModal({ isOpen, onClose, onSave, editItem }: MenuItemModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Snacks",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description,
        price: editItem.price.toString(),
        category: editItem.category,
      });
    } else {
      setFormData({ name: "", description: "", price: "", category: "Snacks" });
    }
  }, [editItem, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      ...(editItem && { id: editItem.id }),
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      category: formData.category,
      available: editItem?.available ?? true,
    };
    onSave(itemData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-xl shadow-xl"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {editItem ? "Edit Menu Item" : "Add Menu Item"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Veg Sandwich"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Brief description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="40"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Main Course">Main Course</option>
                  <option value="South Indian">South Indian</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface MenuManagementProps {
  items: MenuItem[];
  onToggleAvailability: (id: string) => void;
  onAddItem: (item: Omit<MenuItem, "id">) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
}

export default function MenuManagement({
  items,
  onToggleAvailability,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: MenuManagementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (item: Omit<MenuItem, "id"> | MenuItem) => {
    if ("id" in item) {
      onEditItem(item);
    } else {
      onAddItem(item);
    }
    setEditingItem(null);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableCount = items.filter((i) => i.available).length;

  return (
    <div ref={containerRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Menu Management</h2>
          <p className="text-sm text-slate-500">
            {items.length} items · {availableCount} available
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:flex-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            + Add Item
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredItems.map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            onToggleAvailability={onToggleAvailability}
            onEdit={handleEdit}
            onDelete={onDeleteItem}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
          <p className="text-slate-500">No items found</p>
        </div>
      )}

      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editItem={editingItem}
      />
    </div>
  );
}
