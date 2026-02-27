"use client";

import { useState } from "react";
import { TokenConfigData, OnboardingErrors } from "@/lib/onboarding-validation";
import { validateTokenConfigAction } from "../actions";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

interface Step4Props {
  data: TokenConfigData;
  errors: OnboardingErrors;
  onDataChange: (data: TokenConfigData) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export default function Step4TokenConfig({
  data,
  errors,
  onDataChange,
  onNext,
  onPrev,
  isLoading,
}: Step4Props) {
  const [validating, setValidating] = useState(false);
  const [stepErrors, setStepErrors] = useState<OnboardingErrors>({});

  const handlePrefixChange = (value: string) => {
    // Convert to uppercase automatically
    const upperValue = value.toUpperCase();
    onDataChange({ ...data, tokenPrefix: upperValue });
    // Clear error
    if (stepErrors.tokenPrefix) {
      const newErrors = { ...stepErrors };
      delete newErrors.tokenPrefix;
      setStepErrors(newErrors);
    }
  };

  const handleNumberChange = (value: string) => {
    const num = parseInt(value) || 0;
    onDataChange({ ...data, startingTokenNumber: num });
    // Clear error
    if (stepErrors.startingTokenNumber) {
      const newErrors = { ...stepErrors };
      delete newErrors.startingTokenNumber;
      setStepErrors(newErrors);
    }
  };

  const handleNext = async () => {
    setValidating(true);
    const result = await validateTokenConfigAction(data);
    setValidating(false);

    if (result.success) {
      onNext();
    } else {
      setStepErrors(result.errors || {});
    }
  };

  // Generate sample token numbers
  const sampleTokens = [
    `${data.tokenPrefix || "---"}-${data.startingTokenNumber}`,
    `${data.tokenPrefix || "---"}-${data.startingTokenNumber + 1}`,
    `${data.tokenPrefix || "---"}-${data.startingTokenNumber + 2}`,
  ];

  if (validating || isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="prefix" className="block text-sm font-medium text-slate-700 mb-1.5">
          Token Prefix <span className="text-red-500">*</span>
        </label>
        <input
          id="prefix"
          type="text"
          value={data.tokenPrefix}
          onChange={(e) => handlePrefixChange(e.target.value)}
          placeholder="e.g., CAN, CTN (max 3 letters)"
          maxLength={3}
          className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 uppercase text-slate-900 ${
            stepErrors.tokenPrefix
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        <p className="text-xs text-slate-500 mt-1">Used to identify tokens from your canteen</p>
        {stepErrors.tokenPrefix && <ErrorMessage message={stepErrors.tokenPrefix} />}
      </div>

      <div>
        <label htmlFor="startNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
          Starting Token Number <span className="text-red-500">*</span>
        </label>
        <input
          id="startNumber"
          type="number"
          value={data.startingTokenNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder="e.g., 100"
          min="1"
          max="9999"
          className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 text-slate-900 ${
            stepErrors.startingTokenNumber
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        <p className="text-xs text-slate-500 mt-1">First order will be token #{data.startingTokenNumber}</p>
        {stepErrors.startingTokenNumber && <ErrorMessage message={stepErrors.startingTokenNumber} />}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Sample Token Numbers:</p>
        <div className="space-y-2">
          {sampleTokens.map((token, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-300 rounded px-4 py-2.5 text-center font-mono text-lg font-semibold text-slate-800"
            >
              {token}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={validating}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {validating ? "Validating..." : "Next: Menu Item (Optional)"}
        </button>
      </div>
    </div>
  );
}
