"use client";

import { useState } from "react";
import { BasicInfoData, OnboardingErrors } from "@/lib/onboarding-validation";
import { validateBasicInfoAction } from "../actions";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

interface Step1Props {
  data: BasicInfoData;
  errors: OnboardingErrors;
  onDataChange: (data: BasicInfoData) => void;
  onNext: () => void;
  isLoading: boolean;
}

export default function Step1BasicInfo({
  data,
  errors,
  onDataChange,
  onNext,
  isLoading,
}: Step1Props) {
  const [validating, setValidating] = useState(false);
  const [stepErrors, setStepErrors] = useState<OnboardingErrors>({});

  const handleNext = async () => {
    setValidating(true);
    const result = await validateBasicInfoAction(data);
    setValidating(false);

    if (result.success) {
      onNext();
    } else {
      setStepErrors(result.errors || {});
    }
  };

  const handleChange = (field: keyof BasicInfoData, value: string) => {
    onDataChange({ ...data, [field]: value });
    // Clear error for this field as user starts typing
    if (stepErrors[field]) {
      const newErrors = { ...stepErrors };
      delete newErrors[field];
      setStepErrors(newErrors);
    }
  };

  if (validating || isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Canteen Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g., South Campus Food Court"
          className={`w-full px-4 py-2.5 rounded-lg border transition-colors text-slate-900 ${
            stepErrors.name
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          } focus:outline-none focus:ring-2`}
        />
        {stepErrors.name && <ErrorMessage message={stepErrors.name} />}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
          Short Description
        </label>
        <textarea
          id="description"
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief description of your canteen (optional)"
          rows={3}
          className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 text-slate-900 ${
            stepErrors.description
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        {stepErrors.description && <ErrorMessage message={stepErrors.description} />}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          id="location"
          type="text"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="e.g., Block A, Building 2, Near Library"
          className={`w-full px-4 py-2.5 rounded-lg border transition-colors text-slate-900 ${
            stepErrors.location
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        {stepErrors.location && <ErrorMessage message={stepErrors.location} />}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
          Contact Number <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={data.contactNumber}
          onChange={(e) => handleChange("contactNumber", e.target.value)}
          placeholder="e.g., +91-9876543210 or 9876543210"
          className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 text-slate-900 ${
            stepErrors.contactNumber
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        {stepErrors.contactNumber && <ErrorMessage message={stepErrors.contactNumber} />}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
          Email (Optional)
        </label>
        <input
          id="email"
          type="email"
          value={data.contactEmail || ""}
          onChange={(e) => handleChange("contactEmail", e.target.value)}
          placeholder="e.g., contact@canteen.com"
          className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 text-slate-900 ${
            stepErrors.contactEmail
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        {stepErrors.contactEmail && <ErrorMessage message={stepErrors.contactEmail} />}
      </div>

      <button
        onClick={handleNext}
        disabled={validating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {validating ? "Validating..." : "Next: Branding"}
      </button>
    </div>
  );
}
