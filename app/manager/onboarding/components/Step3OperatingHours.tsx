"use client";

import { useState } from "react";
import { OperatingHoursData, OnboardingErrors } from "@/lib/onboarding-validation";
import { validateOperatingHoursAction } from "../actions";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

interface Step3Props {
  data: OperatingHoursData;
  errors: OnboardingErrors;
  onDataChange: (data: OperatingHoursData) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function Step3OperatingHours({
  data,
  errors,
  onDataChange,
  onNext,
  onPrev,
  isLoading,
}: Step3Props) {
  const [validating, setValidating] = useState(false);
  const [stepErrors, setStepErrors] = useState<OnboardingErrors>({});

  const handleTimeChange = (field: "openingTime" | "closingTime", value: string) => {
    onDataChange({ ...data, [field]: value });
    // Clear error for this field
    if (stepErrors[field]) {
      const newErrors = { ...stepErrors };
      delete newErrors[field];
      setStepErrors(newErrors);
    }
  };

  const handleDayToggle = (day: string) => {
    let newDays = [...data.workingDays];
    if (newDays.includes(day)) {
      newDays = newDays.filter((d) => d !== day);
    } else {
      newDays.push(day);
    }
    onDataChange({ ...data, workingDays: newDays });
    // Clear error
    if (stepErrors.workingDays) {
      const newErrors = { ...stepErrors };
      delete newErrors.workingDays;
      setStepErrors(newErrors);
    }
  };

  const handleNext = async () => {
    setValidating(true);
    const result = await validateOperatingHoursAction(data);
    setValidating(false);

    if (result.success) {
      onNext();
    } else {
      setStepErrors(result.errors || {});
    }
  };

  if (validating || isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="opening" className="block text-sm font-medium text-slate-700 mb-1.5">
            Opening Time <span className="text-red-500">*</span>
          </label>
          <input
            id="opening"
            type="time"
            value={data.openingTime}
            onChange={(e) => handleTimeChange("openingTime", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 text-slate-900 ${
              stepErrors.openingTime
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {stepErrors.openingTime && <ErrorMessage message={stepErrors.openingTime} />}
        </div>

        <div>
          <label htmlFor="closing" className="block text-sm font-medium text-slate-700 mb-1.5">
            Closing Time <span className="text-red-500">*</span>
          </label>
          <input
            id="closing"
            type="time"
            value={data.closingTime}
            onChange={(e) => handleTimeChange("closingTime", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 text-slate-900 ${
              stepErrors.closingTime
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {stepErrors.closingTime && <ErrorMessage message={stepErrors.closingTime} />}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Working Days <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => handleDayToggle(day)}
              className={`py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                data.workingDays.includes(day)
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
        {stepErrors.workingDays && <ErrorMessage message={stepErrors.workingDays} />}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Operating Hours Preview:</strong> {data.workingDays.length > 0 ? data.workingDays.join(", ") : "No days selected"} from{" "}
          {data.openingTime || "--"} to {data.closingTime || "--"}
        </p>
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
          {validating ? "Validating..." : "Next: Token Setup"}
        </button>
      </div>
    </div>
  );
}
