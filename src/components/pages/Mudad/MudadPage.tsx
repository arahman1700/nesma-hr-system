import React, { useState } from "react";
import { Check, Clock, Calendar, Building2, AlertCircle, Save } from "lucide-react";
import { Button } from "../../common/Button";
import { Card } from "../../common/Card";
import { Select } from "../../common/Select";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";

interface Step {
  id: number;
  title: string;
  completed: boolean;
}

const MudadPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";

  const [currentStep, setCurrentStep] = useState(1);
  const [startingPeriod, setStartingPeriod] = useState("");
  const [cutoffDay, setCutoffDay] = useState("last");
  const [approvalFlow, setApprovalFlow] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const steps: Step[] = [
    { id: 1, title: "Starting Period", completed: false },
    { id: 2, title: "Approval Flow", completed: false },
    { id: 3, title: "Bank Account", completed: false },
  ];

  const months = [
    { value: "", label: "Select" },
    { value: "2026-01", label: "January 2026" },
    { value: "2026-02", label: "February 2026" },
    { value: "2026-03", label: "March 2026" },
    { value: "2026-04", label: "April 2026" },
    { value: "2026-05", label: "May 2026" },
    { value: "2026-06", label: "June 2026" },
  ];

  const cutoffOptions = [
    { value: "last", label: "Last Day" },
    { value: "25", label: "25th" },
    { value: "28", label: "28th" },
    { value: "1", label: "1st of next month" },
  ];

  const approvalOptions = [
    { value: "", label: "Select approval flow" },
    { value: "direct", label: "Direct Manager Only" },
    { value: "hr", label: "HR Approval Required" },
    { value: "multi", label: "Multi-level Approval" },
  ];

  const bankOptions = [
    { value: "", label: "Select bank account" },
    { value: "snb", label: "Saudi National Bank (SNB)" },
    { value: "rajhi", label: "Al Rajhi Bank" },
    { value: "riyadh", label: "Riyad Bank" },
    { value: "samba", label: "Samba Financial Group" },
  ];

  const handleSave = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Starting Period Section */}
            <div
              className={cn(
                "p-5 rounded-xl",
                isDark ? "bg-[var(--theme-card)]" : "bg-gray-50",
              )}
            >
              <h3
                className={cn(
                  "text-lg font-semibold mb-2",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Define your starting period
              </h3>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Select a particular month in which you want to start using the
                payroll feature
              </p>

              <div className="space-y-2">
                <label
                  className={cn(
                    "block text-sm font-medium",
                    isDark ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Starting Period <span className="text-red-500">*</span>
                </label>
                <Select
                  value={startingPeriod}
                  onChange={(e) => setStartingPeriod(e.target.value)}
                  options={months}
                  className="max-w-md"
                />
                {!startingPeriod && (
                  <p className="text-sm text-emerald-500 mt-1">
                    Please select starting period
                  </p>
                )}
              </div>
            </div>

            {/* Cutoff Day Section */}
            <div
              className={cn(
                "p-5 rounded-xl",
                isDark ? "bg-[var(--theme-card)]" : "bg-gray-50",
              )}
            >
              <h3
                className={cn(
                  "text-lg font-semibold mb-2",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Define your cutoff day
              </h3>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Select the last day of a payslip period based on which
                individual payslip periods are derived
              </p>

              <div className="space-y-2">
                <label
                  className={cn(
                    "block text-sm font-medium",
                    isDark ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  CutOff Day <span className="text-red-500">*</span>
                </label>
                <Select
                  value={cutoffDay}
                  onChange={(e) => setCutoffDay(e.target.value)}
                  options={cutoffOptions}
                  className="max-w-md"
                />
              </div>
            </div>

            {/* Warning Message */}
            <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">
                If you have set starting period and cut off day then this cannot
                be changed later, please select carefully.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div
              className={cn(
                "p-5 rounded-xl",
                isDark ? "bg-[var(--theme-card)]" : "bg-gray-50",
              )}
            >
              <h3
                className={cn(
                  "text-lg font-semibold mb-2",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Configure Approval Flow
              </h3>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Define how payroll submissions should be approved before
                processing
              </p>

              <div className="space-y-2">
                <label
                  className={cn(
                    "block text-sm font-medium",
                    isDark ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Approval Flow <span className="text-red-500">*</span>
                </label>
                <Select
                  value={approvalFlow}
                  onChange={(e) => setApprovalFlow(e.target.value)}
                  options={approvalOptions}
                  className="max-w-md"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div
              className={cn(
                "p-5 rounded-xl",
                isDark ? "bg-[var(--theme-card)]" : "bg-gray-50",
              )}
            >
              <h3
                className={cn(
                  "text-lg font-semibold mb-2",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                Bank Account Details
              </h3>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDark ? "text-gray-400" : "text-gray-600",
                )}
              >
                Select the bank account for salary disbursement
              </p>

              <div className="space-y-2">
                <label
                  className={cn(
                    "block text-sm font-medium",
                    isDark ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Bank Account <span className="text-red-500">*</span>
                </label>
                <Select
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  options={bankOptions}
                  className="max-w-md"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl",
          isDark
            ? "bg-gradient-to-r from-blue-900/50 to-indigo-900/30 border border-blue-500/20"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200",
        )}
      >
        <div className="flex items-center gap-4">
          <img
            src="/assets/logos/mudad.svg"
            alt="Mudad"
            className="h-12 w-auto"
          />
          <div>
            <h1
              className={cn(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              Payroll By Mudad
            </h1>
            <p
              className={cn(
                "mt-1",
                isDark ? "text-blue-300/70" : "text-blue-700",
              )}
            >
              Configure and manage payroll settings - إعدادات الرواتب
            </p>
          </div>
        </div>
        <Button
          className={cn(
            isDark
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-orange-500 hover:bg-orange-600 text-white",
          )}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending Overtime
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stepper */}
        <Card className="lg:col-span-1 p-4">
          <div className="space-y-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                      currentStep === step.id
                        ? "bg-emerald-500 text-white"
                        : currentStep > step.id
                          ? "bg-emerald-500 text-white"
                          : isDark
                            ? "bg-gray-700 text-gray-400"
                            : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-0.5 h-12 my-1",
                        currentStep > step.id
                          ? "bg-emerald-500"
                          : isDark
                            ? "bg-gray-700"
                            : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      "text-sm font-medium text-left transition-colors",
                      currentStep === step.id
                        ? "text-emerald-500"
                        : isDark
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    {step.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Form Content */}
        <Card className="lg:col-span-3 p-6">
          {renderStepContent()}

          {/* Save Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleSave}
              className={cn(
                isDark
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white",
              )}
            >
              <Save className="w-4 h-4 mr-2" />
              {currentStep < 3 ? "Save & Continue" : "Save"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MudadPage;
