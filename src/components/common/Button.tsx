import React from "react";
import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { ICON_CHILD_SIZES, ICON_ONLY_SIZES, GRADIENTS, SHADOWS } from "../../utils/designTokens";

// ============================================
// BUTTON COMPONENT
// ============================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "glass"
    | "neon"
    | "gradient";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  icon,
  fullWidth = false,
  rounded = false,
  glow = false,
  className,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const effectiveLeftIcon = leftIcon || icon;

  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98]
    relative overflow-hidden
  `;

  const variants: Record<string, string> = {
    primary: `
      bg-gradient-to-r from-[#2E3192] to-[#0E2841]
      text-white
      hover:shadow-[0_8px_30px_rgba(46,49,146,0.35)]
      hover:-translate-y-0.5
      focus:ring-[#2E3192]
      active:shadow-[0_2px_10px_rgba(46,49,146,0.2)]
    `,
    secondary: `
      bg-gradient-to-r from-[#80D1E9] to-[#5BC0DE]
      text-[#0E2841]
      hover:shadow-[0_8px_30px_rgba(128,209,233,0.35)]
      hover:-translate-y-0.5
      focus:ring-[#80D1E9]
    `,
    outline: isGlass
      ? `
        bg-transparent
        border-2 border-white/30
        text-white
        hover:bg-white/10
        hover:border-white/50
        focus:ring-white/30
      `
      : isDark
        ? `
          bg-transparent
          border-2 border-[#80D1E9]/50
          text-[#80D1E9]
          hover:bg-[#80D1E9]/10
          hover:border-[#80D1E9]
          focus:ring-[#80D1E9]
        `
        : `
          bg-transparent
          border-2 border-[#2E3192]
          text-[#2E3192]
          hover:bg-[#2E3192]
          hover:text-white
          hover:shadow-[0_4px_20px_rgba(46,49,146,0.25)]
          focus:ring-[#2E3192]
        `,
    ghost: isGlass
      ? `
        bg-transparent
        text-white/80
        hover:bg-white/10
        hover:text-white
        focus:ring-white/20
      `
      : isDark
        ? `
          bg-transparent
          text-gray-300
          hover:bg-white/10
          hover:text-white
          focus:ring-white/20
        `
        : `
          bg-transparent
          text-gray-600
          hover:bg-[#2E3192]/10
          hover:text-[#2E3192]
          focus:ring-[#2E3192]/30
        `,
    danger: `
      bg-gradient-to-r from-rose-500 to-rose-600
      text-white
      hover:shadow-[0_8px_30px_rgba(239,68,68,0.35)]
      hover:-translate-y-0.5
      focus:ring-rose-500
    `,
    success: `
      bg-gradient-to-r from-emerald-500 to-emerald-600
      text-white
      hover:shadow-[0_8px_30px_rgba(16,185,129,0.35)]
      hover:-translate-y-0.5
      focus:ring-emerald-500
    `,
    glass: `
      bg-white/10
      backdrop-blur-md
      border border-white/20
      text-white
      hover:bg-white/20
      hover:border-white/30
      hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)]
      focus:ring-white/30
    `,
    neon: `
      bg-transparent
      border-2 border-[#80D1E9]
      text-[#80D1E9]
      hover:bg-[#80D1E9]/10
      hover:shadow-[0_0_30px_rgba(128,209,233,0.5)]
      focus:ring-[#80D1E9]/50
    `,
    gradient: `
      bg-gradient-to-r from-[#2E3192] via-[#80D1E9] to-[#2E3192]
      bg-[length:200%_100%]
      text-white
      hover:bg-right
      hover:shadow-[0_8px_30px_rgba(128,209,233,0.35)]
      hover:-translate-y-0.5
      focus:ring-[#80D1E9]
      transition-all duration-500
    `,
  };

  const sizes: Record<string, string> = {
    xs: "px-2.5 py-1.5 text-xs rounded-lg",
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-5 py-3 text-base rounded-xl",
    xl: "px-6 py-3.5 text-lg rounded-2xl",
  };

  const glowStyles: Record<string, string> = {
    primary: "shadow-[0_0_20px_rgba(46,49,146,0.4)]",
    secondary: "shadow-[0_0_20px_rgba(128,209,233,0.4)]",
    danger: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    success: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    neon: "shadow-[0_0_20px_rgba(128,209,233,0.4)]",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        rounded && "rounded-full",
        glow && glowStyles[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine effect overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
        <span
          className={cn(
            "absolute inset-0 -translate-x-full",
            "bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "group-hover:translate-x-full transition-transform duration-700",
          )}
        />
      </span>

      {/* Content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {effectiveLeftIcon && (
              <span className={cn("flex-shrink-0", ICON_CHILD_SIZES.sm)}>
                {effectiveLeftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className={cn("flex-shrink-0", ICON_CHILD_SIZES.sm)}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </span>
    </button>
  );
};

// ============================================
// ICON BUTTON
// ============================================
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "glass"
    | "neon";
  size?: "xs" | "sm" | "md" | "lg";
  icon: React.ReactNode;
  tooltip?: string;
  rounded?: boolean;
  glow?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = "ghost",
  size = "md",
  icon,
  tooltip,
  rounded = false,
  glow = false,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-[#2E3192] to-[#0E2841] text-white hover:shadow-lg hover:scale-110",
    secondary: "bg-[#80D1E9] text-[#0E2841] hover:bg-[#6bc4de] hover:scale-110",
    outline:
      isDark || isGlass
        ? "border-2 border-[#80D1E9]/50 text-[#80D1E9] hover:bg-[#80D1E9]/10 hover:border-[#80D1E9]"
        : "border-2 border-[#2E3192] text-[#2E3192] hover:bg-[#2E3192] hover:text-white",
    ghost:
      isDark || isGlass
        ? "text-gray-400 hover:bg-white/10 hover:text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-[#2E3192]",
    danger: "text-rose-500 hover:bg-rose-50 hover:scale-110",
    glass:
      "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
    neon: "border-2 border-[#80D1E9] text-[#80D1E9] hover:bg-[#80D1E9]/10 hover:shadow-[0_0_20px_rgba(128,209,233,0.5)]",
  };

  const sizes: Record<string, string> = {
    xs: `p-1 [&>*>svg]:w-3.5 [&>*>svg]:h-3.5`,
    sm: `p-1.5 [&>*>svg]:w-4 [&>*>svg]:h-4`,
    md: `p-2 [&>*>svg]:w-5 [&>*>svg]:h-5`,
    lg: `p-3 [&>*>svg]:w-6 [&>*>svg]:h-6`,
  };

  const glowStyles: Record<string, string> = {
    primary: "shadow-[0_0_15px_rgba(46,49,146,0.4)]",
    neon: "shadow-[0_0_15px_rgba(128,209,233,0.4)]",
  };

  return (
    <button
      className={cn(
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[#2E3192]/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-95",
        rounded ? "rounded-full" : "rounded-xl",
        variants[variant],
        sizes[size],
        glow && glowStyles[variant],
        className,
      )}
      title={tooltip}
      {...props}
    >
      <span className="flex items-center justify-center">{icon}</span>
    </button>
  );
};

// ============================================
// BUTTON GROUP
// ============================================
export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  attached?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  attached = true,
}) => {
  return (
    <div
      className={cn(
        "inline-flex",
        attached
          ? [
              "rounded-xl overflow-hidden",
              "[&>button]:rounded-none",
              "[&>button:first-child]:rounded-l-xl",
              "[&>button:last-child]:rounded-r-xl",
              "[&>button:not(:last-child)]:border-r",
              "[&>button:not(:last-child)]:border-r-white/20",
            ]
          : "gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
};

// ============================================
// FLOATING ACTION BUTTON
// ============================================
export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  fixed?: boolean;
  pulse?: boolean;
}

export const FAB: React.FC<FABProps> = ({
  icon,
  variant = "primary",
  size = "md",
  position = "bottom-right",
  fixed = true,
  pulse = false,
  className,
  ...props
}) => {
  const gradients: Record<string, string> = {
    primary: "from-[#2E3192] to-[#0E2841]",
    secondary: "from-[#80D1E9] to-[#2E3192]",
    danger: "from-rose-500 to-rose-600",
    success: "from-emerald-500 to-emerald-600",
  };

  const glows: Record<string, string> = {
    primary: "shadow-[0_8px_30px_rgba(46,49,146,0.4)]",
    secondary: "shadow-[0_8px_30px_rgba(128,209,233,0.4)]",
    danger: "shadow-[0_8px_30px_rgba(239,68,68,0.4)]",
    success: "shadow-[0_8px_30px_rgba(16,185,129,0.4)]",
  };

  const sizes: Record<string, string> = {
    sm: "w-12 h-12 [&>*>svg]:w-5 [&>*>svg]:h-5",
    md: "w-14 h-14 [&>*>svg]:w-6 [&>*>svg]:h-6",
    lg: "w-16 h-16 [&>*>svg]:w-7 [&>*>svg]:h-7",
  };

  const positions: Record<string, string> = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  return (
    <button
      className={cn(
        "rounded-full text-white",
        "bg-gradient-to-br",
        gradients[variant],
        glows[variant],
        sizes[size],
        fixed && "fixed z-50",
        fixed && positions[position],
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl",
        "active:scale-95",
        "focus:outline-none focus:ring-4 focus:ring-white/20",
        pulse && "animate-pulse",
        className,
      )}
      {...props}
    >
      <span className="flex items-center justify-center">{icon}</span>
    </button>
  );
};

export default Button;
