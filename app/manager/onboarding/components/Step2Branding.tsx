"use client";

import { useState } from "react";
import { BrandingData, OnboardingErrors } from "@/lib/onboarding-validation";
import { validateBrandingAction } from "../actions";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

interface Step2Props {
  data: BrandingData;
  errors: OnboardingErrors;
  onDataChange: (data: BrandingData) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export default function Step2Branding({
  data,
  errors,
  onDataChange,
  onNext,
  onPrev,
  isLoading,
}: Step2Props) {
  const [validating, setValidating] = useState(false);
  const [stepErrors, setStepErrors] = useState<OnboardingErrors>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(data.logoUrl || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(data.coverImageUrl || null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [skipBranding, setSkipBranding] = useState<boolean>(!!data.skipBranding);

  const uploadImage = async (file: File, folder: "logos" | "covers") => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);

    const res = await fetch("/api/manager/upload", {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error;
      } catch {
        errorMessage = `Server error: ${res.status} ${res.statusText}`;
      }
      throw new Error(errorMessage || "Failed to upload image");
    }

    const json = (await res.json()) as { success?: boolean; url?: string; error?: string };


    return json.url;
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previousPreview = logoPreview;
      const previousUrl = data.logoUrl;

      // Validate file type
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        setStepErrors({ ...stepErrors, logoUrl: "Only PNG and JPG files are allowed" });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setStepErrors({ ...stepErrors, logoUrl: "File size must be less than 5MB" });
        return;
      }

      // Show an immediate local preview while uploading
      const localPreviewUrl = URL.createObjectURL(file);
      setLogoPreview(localPreviewUrl);

      setUploadingLogo(true);
      uploadImage(file, "logos")
        .then((url) => {
          onDataChange({ ...data, logoUrl: url });
          setLogoPreview(url);
          // Clear error
          const newErrors = { ...stepErrors };
          delete newErrors.logoUrl;
          setStepErrors(newErrors);
        })
        .catch((err) => {
          onDataChange({ ...data, logoUrl: previousUrl });
          setLogoPreview(previousPreview || null);
          setStepErrors({ ...stepErrors, logoUrl: err instanceof Error ? err.message : "Failed to upload logo" });
        })
        .finally(() => {
          setUploadingLogo(false);
          URL.revokeObjectURL(localPreviewUrl);
        });
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previousPreview = coverPreview;
      const previousUrl = data.coverImageUrl;

      // Validate file type
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        setStepErrors({ ...stepErrors, coverImageUrl: "Only PNG and JPG files are allowed" });
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setStepErrors({ ...stepErrors, coverImageUrl: "File size must be less than 10MB" });
        return;
      }

      const localPreviewUrl = URL.createObjectURL(file);
      setCoverPreview(localPreviewUrl);

      setUploadingCover(true);
      uploadImage(file, "covers")
        .then((url) => {
          onDataChange({ ...data, coverImageUrl: url });
          setCoverPreview(url);
          // Clear error
          const newErrors = { ...stepErrors };
          delete newErrors.coverImageUrl;
          setStepErrors(newErrors);
        })
        .catch((err) => {
          onDataChange({ ...data, coverImageUrl: previousUrl });
          setCoverPreview(previousPreview || null);
          setStepErrors({ ...stepErrors, coverImageUrl: err instanceof Error ? err.message : "Failed to upload cover" });
        })
        .finally(() => {
          setUploadingCover(false);
          URL.revokeObjectURL(localPreviewUrl);
        });
    }
  };

  const handleNext = async () => {
    // If user chose to skip branding, just persist the flag and move on
    if (skipBranding) {
      onDataChange({ ...data, skipBranding: true });
      onNext();
      return;
    }

    setValidating(true);
    const result = await validateBrandingAction({ ...data, skipBranding: false });
    setValidating(false);

    if (result.success) {
      onNext();
    } else {
      setStepErrors(result.errors || {});
    }
  };

  if (validating || isLoading || uploadingLogo || uploadingCover) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-800">Branding</p>
          <p className="text-xs text-slate-500">You can upload a logo and cover now or skip and add them later from the manager dashboard.</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={skipBranding}
            onChange={(e) => {
              const value = e.target.checked;
              setSkipBranding(value);
              // Persist the flag in shared onboarding state
              onDataChange({ ...data, skipBranding: value });
              // Clear any logo-related validation errors when skipping
              if (value) {
                const newErrors = { ...stepErrors };
                delete newErrors.logoUrl;
                delete newErrors.coverImageUrl;
                setStepErrors(newErrors);
              }
            }}
          />
          <span>Skip branding for now</span>
        </label>
      </div>
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-slate-700 mb-3">
          Canteen Logo {!skipBranding && <span className="text-red-500">*</span>}
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
          <input
            id="logo"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleLogoChange}
            className="hidden"
          />
          {logoPreview ? (
            <label htmlFor="logo" className="cursor-pointer block">
              <img src={logoPreview} alt="Logo preview" className="h-32 w-32 object-cover mx-auto rounded mb-3" />
              <p className="text-sm text-slate-600">Click to change logo</p>
            </label>
          ) : (
            <label htmlFor="logo" className="cursor-pointer block">
              <svg
                className="mx-auto h-12 w-12 text-slate-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium text-slate-700">Upload your canteen logo</p>
              <p className="text-xs text-slate-500 mt-1">PNG or JPG, max 5MB</p>
            </label>
          )}
        </div>
        {!skipBranding && stepErrors.logoUrl && <ErrorMessage message={stepErrors.logoUrl} />}
      </div>

      <div>
        <label htmlFor="cover" className="block text-sm font-medium text-slate-700 mb-3">
          Cover Image (Optional)
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
          <input
            id="cover"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleCoverChange}
            className="hidden"
          />
          {coverPreview ? (
            <label htmlFor="cover" className="cursor-pointer block">
              <img src={coverPreview} alt="Cover preview" className="h-40 w-full object-cover rounded mb-3" />
              <p className="text-sm text-slate-600">Click to change cover image</p>
            </label>
          ) : (
            <label htmlFor="cover" className="cursor-pointer block">
              <svg
                className="mx-auto h-12 w-12 text-slate-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium text-slate-700">Upload a cover image</p>
              <p className="text-xs text-slate-500 mt-1">PNG or JPG, max 10MB (optional)</p>
            </label>
          )}
        </div>
        {stepErrors.coverImageUrl && <ErrorMessage message={stepErrors.coverImageUrl} />}
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
          disabled={validating || uploadingLogo || uploadingCover}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {validating ? "Validating..." : "Next: Operating Hours"}
        </button>
      </div>
    </div>
  );
}
