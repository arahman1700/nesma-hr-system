import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const { theme } = useTheme();
    const isDark = theme === "dark" || theme === "company";

    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "block text-sm font-medium mb-1.5",
              isDark ? "text-gray-300" : "text-gray-700"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full px-4 py-2.5 border rounded-lg appearance-none cursor-pointer transition-all duration-200",
              isDark
                ? "bg-[var(--theme-bg)] border-[var(--theme-border)] text-white"
                : "bg-white border-gray-300 text-gray-900",
              isDark
                ? "focus:outline-none focus:ring-2 focus:ring-[#80D1E9]/20 focus:border-[#80D1E9]"
                : "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              error && "border-error focus:border-error focus:ring-error/20",
              !error && (isDark ? "border-[var(--theme-border)]" : "border-gray-300"),
              props.disabled && (isDark
                ? "bg-white/5 cursor-not-allowed opacity-60"
                : "bg-gray-100 cursor-not-allowed"),
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className={isDark ? "bg-[#0E2841] text-white" : ""}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none",
            isDark ? "text-gray-500" : "text-gray-400"
          )} />
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
