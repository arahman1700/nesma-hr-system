import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // alias for leftIcon
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      icon,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const isDark = theme === "dark" || theme === "company";

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const effectiveLeftIcon = leftIcon || icon;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium mb-1.5",
              isDark ? "text-gray-300" : "text-gray-700"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {effectiveLeftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2",
              isDark ? "text-gray-500" : "text-gray-400"
            )}>
              {effectiveLeftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-4 py-2.5 border rounded-lg transition-all duration-200",
              isDark
                ? "bg-[var(--theme-bg)] border-[var(--theme-border)] text-white placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
              isDark
                ? "focus:outline-none focus:ring-2 focus:ring-[#80D1E9]/20 focus:border-[#80D1E9]"
                : "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              error && (isDark
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-error focus:border-error focus:ring-error/20"),
              !error && (isDark ? "border-[var(--theme-border)]" : "border-gray-300"),
              effectiveLeftIcon && "pl-10",
              rightIcon && "pr-10",
              props.disabled && (isDark
                ? "bg-white/5 cursor-not-allowed opacity-60"
                : "bg-gray-100 cursor-not-allowed"),
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              isDark ? "text-gray-500" : "text-gray-400"
            )}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
        {helperText && !error && (
          <p className={cn(
            "mt-1 text-sm",
            isDark ? "text-gray-400" : "text-gray-500"
          )}>{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
