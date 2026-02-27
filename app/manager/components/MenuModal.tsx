"use client";

import { useRef, useEffect, useState } from "react";
import { X, Upload, Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import Image from "next/image";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function MenuModal({ isOpen, onClose, onSubmit, initialData }: MenuModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Main Course",
    description: "",
    image: null as string | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        category: initialData.category,
        description: initialData.description || "",
        image: initialData.image || null
      });
    } else {
        setFormData({
            name: "",
            price: "",
            category: "Main Course",
            description: "",
            image: null
        });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Entrance Animation
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: "block" });
      gsap.fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" }
      );
    } else {
      // Exit Animation handled before unmounting logic in parent if needed, 
      // but for simplicity we rely on React rendering. 
      // Ideally we'd use a transition component or delay unmount.
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.2 });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Item name is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.description) newErrors.description = "Description is required";
    // Image validation skipped for demo
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      handleClose();
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        ref={overlayRef} 
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm opacity-0 hidden"
        onClick={handleClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
            ref={modalRef}
            className="w-full max-w-lg bg-background rounded-3xl shadow-2xl border border-border p-6 md:p-8 relative overflow-hidden"
            onClick={e => e.stopPropagation()}
        >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-orange-500" />
            
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
            >
                <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="text-2xl font-bold mb-1 tracking-tight">
                {initialData ? "Edit Menu Item" : "New Menu Item"}
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">Fill in the details for your new dish.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Image Upload Area */}
                <div className="group relative w-full h-40 bg-secondary/50 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full z-10" onChange={handleImageUpload} accept="image/*" />
                    
                    {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Click to upload image</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 5MB</p>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Item Name</label>
                        <input 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className={cn(
                                "w-full bg-secondary/30 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                                errors.name && "border-red-500 focus:ring-red-500/20"
                            )}
                            placeholder="e.g. Butter Chicken"
                        />
                        {errors.name && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Price (₹)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">₹</span>
                            <input 
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                className={cn(
                                    "w-full bg-secondary/30 border border-input rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                                    errors.price && "border-red-500"
                                )}
                                placeholder="0.00"
                            />
                        </div>
                         {errors.price && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.price}</p>}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Category</label>
                    <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                         className="w-full bg-secondary/30 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                    >
                        <option>Main Course</option>
                        <option>Starters</option>
                        <option>Rice</option>
                        <option>Breads</option>
                        <option>Beverages</option>
                        <option>Desserts</option>
                    </select>
                </div>

                 <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Description</label>
                    <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className={cn(
                            "w-full bg-secondary/30 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[80px] resize-none",
                            errors.description && "border-red-500"
                        )}
                        placeholder="Describe the dish..."
                    />
                    {errors.description && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.description}</p>}
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Check className="w-5 h-5" />
                                {initialData ? "Save Changes" : "Add Item"}
                            </>
                        )}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleClose}
                        className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}
