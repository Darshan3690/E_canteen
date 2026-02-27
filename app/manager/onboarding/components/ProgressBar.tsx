interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, label: "Basic Info", icon: "📋" },
    { number: 2, label: "Branding", icon: "🎨" },
    { number: 3, label: "Hours", icon: "⏰" },
    { number: 4, label: "Tokens", icon: "🔑" },
    { number: 5, label: "Menu", icon: "🍽️" },
  ];

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Step Indicators */}
      <div className="hidden sm:flex justify-between mb-10">
        {steps.slice(0, totalSteps).map((step) => (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors mb-2 ${
                step.number <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {step.number}
            </div>
            <p className={`text-xs font-medium text-center ${
              step.number <= currentStep ? "text-slate-900" : "text-slate-600"
            }`}>
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
