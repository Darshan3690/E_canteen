"use client";

import { useState } from "react";
import { MenuItemData, OnboardingErrors } from "@/lib/onboarding-validation";
import { validateMenuItem } from "@/lib/onboarding-validation";
import ErrorMessage from "./ErrorMessage";

interface Step5Props {
  data: MenuItemData | null;
  onDataChange: (data: MenuItemData | null) => void;
  onNext: (includeMenuItem: boolean) => void;
  onPrev: () => void;
  isLoading: boolean;
}

export default function Step5MenuItem({
  data,
  onDataChange,
  onNext,
  onPrev,
  isLoading,
}: Step5Props) {
  const [includeMenuItem, setIncludeMenuItem] = useState(!!data?.name);
  const [localData, setLocalData] = useState<MenuItemData>(
    data || {
      name: "",
      price: 0,
      description: "",
      prepTime: 15,
    }
  );
  const [stepErrors, setStepErrors] = useState<OnboardingErrors>({});

  const handleChange = (field: keyof MenuItemData, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    // Clear error
    if (stepErrors[field]) {
      const newErrors = { ...stepErrors };
      delete newErrors[field];
      setStepErrors(newErrors);
    }
  };

  const handleNext = () => {
    if (includeMenuItem) {
      // Validate menu item
      const errors = validateMenuItem(localData);
      if (Object.keys(errors).length > 0) {
        setStepErrors(errors);
        return;
      }
      onDataChange(localData);
      onNext(true);
    } else {
      onDataChange(null);
      onNext(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeMenuItem}
            onChange={(e) => {
              setIncludeMenuItem(e.target.checked);
              setStepErrors({});
            }}
            className="w-5 h-5 rounded border-slate-300"
          />
          <span className="text-sm font-medium text-slate-700">
            Add your first menu item now (you can add more later)
          </span>
        </label>
      </div>

      {includeMenuItem && (
        <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-slate-700 mb-1.5">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              id="itemName"
              type="text"
              value={localData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Paneer Fried Rice"
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                stepErrors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {stepErrors.name && <ErrorMessage message={stepErrors.name} />}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="itemPrice" className="block text-sm font-medium text-slate-700 mb-1.5">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                id="itemPrice"
                type="number"
                value={localData.price}
                onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                placeholder="e.g., 180"
                min="0"
                step="0.01"
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                  stepErrors.price
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {stepErrors.price && <ErrorMessage message={stepErrors.price} />}
            </div>

            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-slate-700 mb-1.5">
                Prep Time (minutes)
              </label>
              <input
                id="prepTime"
                type="number"
                value={localData.prepTime || ""}
                onChange={(e) => handleChange("prepTime", e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 15"
                min="1"
                max="120"
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                  stepErrors.prepTime
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {stepErrors.prepTime && <ErrorMessage message={stepErrors.prepTime} />}
            </div>
          </div>

          <div>
            <label htmlFor="itemDesc" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="itemDesc"
              value={localData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of the item (optional)"
              rows={2}
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                stepErrors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {stepErrors.description && <ErrorMessage message={stepErrors.description} />}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {isLoading ? "Creating Canteen..." : "Review & Complete"}
        </button>
      </div>
    </div>
  );
}
