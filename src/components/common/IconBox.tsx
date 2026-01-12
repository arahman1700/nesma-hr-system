import React from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

// Gradient color presets
export const gradients = {
  primary: "from-[#2E3192] to-[#0E2841]",
  secondary: "from-[#80D1E9] to-[#2E3192]",
  success: "from-emerald-500 to-emerald-700",
  warning: "from-amber-500 to-amber-600",
  danger: "from-rose-500 to-rose-600",
  info: "from-sky-500 to-sky-600",
  purple: "from-purple-500 to-purple-700",
  pink: "from-pink-500 to-pink-600",
  indigo: "from-indigo-500 to-indigo-700",
  cyan: "from-cyan-500 to-cyan-600",
  teal: "from-teal-500 to-teal-600",
  orange: "from-orange-500 to-orange-600",
  // Light backgrounds for icons
  "primary-light": "from-[#2E3192]/10 to-[#2E3192]/5",
  "success-light": "from-emerald-50 to-emerald-100/50",
  "warning-light": "from-amber-50 to-amber-100/50",
  "danger-light": "from-rose-50 to-rose-100/50",
  "info-light": "from-sky-50 to-sky-100/50",
};

// Text colors matching gradients
export const iconColors = {
  primary: "text-white",
  secondary: "text-white",
  success: "text-white",
  warning: "text-white",
  danger: "text-white",
  info: "text-white",
  purple: "text-white",
  pink: "text-white",
  indigo: "text-white",
  cyan: "text-white",
  teal: "text-white",
  orange: "text-white",
  "primary-light": "text-[#2E3192]",
  "success-light": "text-emerald-600",
  "warning-light": "text-amber-600",
  "danger-light": "text-rose-600",
  "info-light": "text-sky-600",
};

export type IconBoxSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type IconBoxColor = keyof typeof gradients;

interface IconBoxProps {
  icon: React.ReactNode;
  color?: IconBoxColor;
  size?: IconBoxSize;
  className?: string;
  rounded?: "md" | "lg" | "xl" | "2xl" | "full";
  shadow?: boolean;
  pulse?: boolean;
}

const sizeClasses: Record<IconBoxSize, { container: string; icon: string }> = {
  xs: { container: "w-6 h-6", icon: "[&>svg]:w-3 [&>svg]:h-3" },
  sm: { container: "w-8 h-8", icon: "[&>svg]:w-4 [&>svg]:h-4" },
  md: { container: "w-10 h-10", icon: "[&>svg]:w-5 [&>svg]:h-5" },
  lg: { container: "w-12 h-12", icon: "[&>svg]:w-6 [&>svg]:h-6" },
  xl: { container: "w-14 h-14", icon: "[&>svg]:w-7 [&>svg]:h-7" },
  "2xl": { container: "w-16 h-16", icon: "[&>svg]:w-8 [&>svg]:h-8" },
};

const roundedClasses = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export const IconBox: React.FC<IconBoxProps> = ({
  icon,
  color = "primary",
  size = "md",
  className,
  rounded = "xl",
  shadow = true,
  pulse = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  // Glass mode special styling
  const glassStyle = isGlass
    ? "bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]"
    : "";

  return (
    <div
      className={cn(
        "flex items-center justify-center flex-shrink-0",
        "bg-gradient-to-br transition-all duration-300",
        "hover:scale-110 hover:rotate-3",
        sizeClasses[size].container,
        sizeClasses[size].icon,
        roundedClasses[rounded],
        isGlass ? glassStyle : gradients[color],
        iconColors[color],
        shadow && !isGlass && "shadow-lg shadow-black/10",
        pulse && "animate-pulse",
        // Icon filter for better visibility
        "[&>svg]:drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      {icon}
    </div>
  );
};

// Stat Icon - Lighter background version for stats
interface StatIconProps {
  icon: React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  size?: IconBoxSize;
  className?: string;
}

export const StatIcon: React.FC<StatIconProps> = ({
  icon,
  color = "primary",
  size = "md",
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const darkColors = {
    primary: "bg-[#2E3192]/20 text-[#80D1E9]",
    success: "bg-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/20 text-amber-400",
    danger: "bg-rose-500/20 text-rose-400",
    info: "bg-sky-500/20 text-sky-400",
  };

  const lightColors = {
    primary: "bg-[#2E3192]/10 text-[#2E3192]",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-rose-50 text-rose-600",
    info: "bg-sky-50 text-sky-600",
  };

  const glassColors = {
    primary:
      "bg-gradient-to-br from-[#2E3192]/30 to-[#80D1E9]/20 text-[#80D1E9]",
    success:
      "bg-gradient-to-br from-emerald-500/30 to-emerald-400/20 text-emerald-400",
    warning:
      "bg-gradient-to-br from-amber-500/30 to-amber-400/20 text-amber-400",
    danger: "bg-gradient-to-br from-rose-500/30 to-rose-400/20 text-rose-400",
    info: "bg-gradient-to-br from-sky-500/30 to-sky-400/20 text-sky-400",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center flex-shrink-0 rounded-xl",
        "transition-all duration-300",
        "hover:scale-110",
        sizeClasses[size].container,
        sizeClasses[size].icon,
        isGlass
          ? cn(
              glassColors[color],
              "backdrop-blur-md border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)]",
            )
          : isDark
            ? darkColors[color]
            : lightColors[color],
        "[&>svg]:drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
        className,
      )}
    >
      {icon}
    </div>
  );
};

// Service Logo Box - For GOSI, Tameeni, etc.
interface ServiceLogoProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ServiceLogo: React.FC<ServiceLogoProps> = ({
  src,
  alt,
  size = "md",
  className,
}) => {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={cn(sizes[size], "w-auto object-contain rounded-lg", className)}
    />
  );
};

export default IconBox;
