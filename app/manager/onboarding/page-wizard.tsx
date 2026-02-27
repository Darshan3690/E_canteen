"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Step1BasicInfo from "./components/Step1BasicInfo";
import Step2Branding from "./components/Step2Branding";
import Step3OperatingHours from "./components/Step3OperatingHours";
import Step4TokenConfig from "./components/Step4TokenConfig";
import Step5MenuItem from "./components/Step5MenuItem";
import ProgressBar from "./components/ProgressBar";
import { completeOnboardingAction, getUserCanteenId } from "./actions";
import {
  BasicInfoData,
  BrandingData,
  OperatingHoursData,
  TokenConfigData,
  MenuItemData,
} from "@/lib/onboarding-validation";

const TOTAL_STEPS = 5;

export default function ManagerOnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");

  // Onboarding data state
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    name: "",
    description: "",
    location: "",
    contactNumber: "",
    contactEmail: "",
  });

  const [branding, setBranding] = useState<BrandingData>({
    logoUrl: undefined,
    coverImageUrl: undefined,
  });

  const [operatingHours, setOperatingHours] = useState<OperatingHoursData>({
    openingTime: "09:00",
    closingTime: "18:00",
    workingDays: ["MON", "TUE", "WED", "THU", "FRI"],
  });

  const [tokenConfig, setTokenConfig] = useState<TokenConfigData>({
    tokenPrefix: "",
    startingTokenNumber: 100,
  });

  const [menuItem, setMenuItem] = useState<MenuItemData | null>(null);

  // Auth check and redirect if already onboarded
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    // Check if already has canteen
    const checkExistingCanteen = async () => {
      const canteenId = await getUserCanteenId();
      if (canteenId) {
        router.push("/manager/dashboard");
      }
    };

    checkExistingCanteen();
  }, [isLoaded, isSignedIn, router]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleComplete = async (includeMenuItem: boolean) => {
    setIsSubmitting(true);
    setError("");

    try {
      const result = await completeOnboardingAction({
        basic: basicInfo,
        branding,
        hours: operatingHours,
        token: tokenConfig,
        menuItem: includeMenuItem ? menuItem || undefined : undefined,
      });

      if (!result.success) {
        setError(result.error || "Failed to complete onboarding");
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to dashboard
      router.push("/manager/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-1 bg-white rounded-full"></div>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600">{authError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            {currentStep === TOTAL_STEPS ? "Review & Complete" : "Setup Your Canteen"}
          </h1>
          <p className="text-slate-600">
            {currentStep === TOTAL_STEPS
              ? "Everything looks good! Complete your setup to start serving students."
              : "Let's get your canteen up and running in just a few steps."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && (
              <Step1BasicInfo
                data={basicInfo}
                errors={{}}
                onDataChange={setBasicInfo}
                onNext={handleNext}
                isLoading={isSubmitting}
              />
            )}

            {currentStep === 2 && (
              <Step2Branding
                data={branding}
                errors={{}}
                onDataChange={setBranding}
                onNext={handleNext}
                onPrev={handlePrev}
                isLoading={isSubmitting}
              />
            )}

            {currentStep === 3 && (
              <Step3OperatingHours
                data={operatingHours}
                errors={{}}
                onDataChange={setOperatingHours}
                onNext={handleNext}
                onPrev={handlePrev}
                isLoading={isSubmitting}
              />
            )}

            {currentStep === 4 && (
              <Step4TokenConfig
                data={tokenConfig}
                errors={{}}
                onDataChange={setTokenConfig}
                onNext={handleNext}
                onPrev={handlePrev}
                isLoading={isSubmitting}
              />
            )}

            {currentStep === 5 && (
              <Step5MenuItem
                data={menuItem}
                onDataChange={setMenuItem}
                onNext={handleComplete}
                onPrev={handlePrev}
                isLoading={isSubmitting}
              />
            )}
          </div>

          {/* Help Text */}
          <div className="border-t border-slate-200 pt-6 mt-8">
            <p className="text-xs text-slate-500 text-center">
              Your information is secure and will only be used to set up your canteen.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            🎉 Step {currentStep} of {TOTAL_STEPS}
          </p>
        </div>
      </div>
    </div>
  );
}
