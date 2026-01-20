import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { TrendingUp, TrendingDown, ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { BORDER_RADIUS, ICON_SIZES } from "../../utils/designTokens";

// ============================================
// COLOR PRESETS - Beautiful Gradients
// ============================================
export const cardColors = {
  // Primary colors
  blue: {
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
    bg: "bg-gradient-to-br",
    glow: "rgba(59, 130, 246, 0.4)",
    icon: "bg-white/20",
    light: "from-blue-50 to-indigo-50",
  },
  purple: {
    gradient: "from-purple-500 via-purple-600 to-indigo-700",
    bg: "bg-gradient-to-br",
    glow: "rgba(168, 85, 247, 0.4)",
    icon: "bg-white/20",
    light: "from-purple-50 to-indigo-50",
  },
  emerald: {
    gradient: "from-emerald-500 via-emerald-600 to-teal-700",
    bg: "bg-gradient-to-br",
    glow: "rgba(16, 185, 129, 0.4)",
    icon: "bg-white/20",
    light: "from-emerald-50 to-teal-50",
  },
  amber: {
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bg: "bg-gradient-to-br",
    glow: "rgba(245, 158, 11, 0.4)",
    icon: "bg-white/20",
    light: "from-amber-50 to-orange-50",
  },
  rose: {
    gradient: "from-rose-500 via-pink-500 to-fuchsia-600",
    bg: "bg-gradient-to-br",
    glow: "rgba(244, 63, 94, 0.4)",
    icon: "bg-white/20",
    light: "from-rose-50 to-pink-50",
  },
  cyan: {
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    bg: "bg-gradient-to-br",
    glow: "rgba(6, 182, 212, 0.4)",
    icon: "bg-white/20",
    light: "from-cyan-50 to-sky-50",
  },
  // NESMA Brand colors
  primary: {
    gradient: "from-[#2E3192] via-[#3d42b0] to-[#0E2841]",
    bg: "bg-gradient-to-br",
    glow: "rgba(46, 49, 146, 0.4)",
    icon: "bg-white/20",
    light: "from-indigo-50 to-blue-50",
  },
  secondary: {
    gradient: "from-[#80D1E9] via-[#5cc4e0] to-[#2E3192]",
    bg: "bg-gradient-to-br",
    glow: "rgba(128, 209, 233, 0.4)",
    icon: "bg-white/20",
    light: "from-cyan-50 to-blue-50",
  },
  // Status colors
  success: {
    gradient: "from-green-500 via-emerald-500 to-teal-600",
    bg: "bg-gradient-to-br",
    glow: "rgba(34, 197, 94, 0.4)",
    icon: "bg-white/20",
    light: "from-green-50 to-emerald-50",
  },
  warning: {
    gradient: "from-yellow-500 via-amber-500 to-orange-600",
    bg: "bg-gradient-to-br",
    glow: "rgba(234, 179, 8, 0.4)",
    icon: "bg-white/20",
    light: "from-yellow-50 to-amber-50",
  },
  danger: {
    gradient: "from-red-500 via-rose-500 to-pink-600",
    bg: "bg-gradient-to-br",
    glow: "rgba(239, 68, 68, 0.4)",
    icon: "bg-white/20",
    light: "from-red-50 to-rose-50",
  },
  info: {
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    bg: "bg-gradient-to-br",
    glow: "rgba(14, 165, 233, 0.4)",
    icon: "bg-white/20",
    light: "from-sky-50 to-blue-50",
  },
};

export type CardColor = keyof typeof cardColors;

// ============================================
// COLORED STATS CARD
// ============================================
export interface ColoredStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: CardColor;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  subtitle?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "gradient" | "glass" | "outline";
  animated?: boolean;
  sparkle?: boolean;
}

export const ColoredStatsCard: React.FC<ColoredStatsCardProps> = ({
  title,
  value,
  icon,
  color = "primary",
  trend,
  subtitle,
  onClick,
  className,
  size = "md",
  variant = "gradient",
  animated = true,
  sparkle = false,
}) => {
  const { theme } = useTheme();
  const isGlass = theme === "glass";
  const isDark = theme === "dark" || theme === "company";
  const [isHovered, setIsHovered] = useState(false);

  const colors = cardColors[color];

  const sizeStyles = {
    sm: "p-4 min-h-[120px]",
    md: "p-5 min-h-[160px]",
    lg: "p-6 min-h-[200px]",
  };

  const iconSizes = {
    sm: `${ICON_SIZES.md.container} [&>svg]:${ICON_SIZES.md.icon}`,
    md: `${ICON_SIZES.lg.container} [&>svg]:${ICON_SIZES.lg.icon}`,
    lg: `${ICON_SIZES.xl.container} [&>svg]:${ICON_SIZES.xl.icon}`,
  };

  const valueSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  const getVariantStyles = () => {
    if (isGlass) {
      return cn(
        "bg-gradient-to-br backdrop-blur-xl",
        colors.gradient,
        "bg-opacity-80",
      );
    }

    switch (variant) {
      case "gradient":
        return cn(colors.bg, colors.gradient);
      case "filled":
        return cn(colors.bg, colors.gradient, "saturate-150");
      case "glass":
        return cn("bg-white/10 backdrop-blur-xl", "border border-white/20");
      case "outline":
        return cn(
          "bg-transparent",
          "border-2",
          isDark ? "border-white/20" : "border-gray-200",
        );
      default:
        return cn(colors.bg, colors.gradient);
    }
  };

  return (
    <div
      className={cn(
        // Base
        "relative overflow-hidden",
        BORDER_RADIUS.lg,
        "transition-all duration-500 ease-out",
        "cursor-pointer group",
        // Size
        sizeStyles[size],
        // Variant
        getVariantStyles(),
        // Text color
        variant === "outline"
          ? isDark
            ? "text-white"
            : "text-gray-800"
          : "text-white",
        // Hover effects
        animated && ["hover:-translate-y-2", "hover:shadow-2xl"],
        className,
      )}
      style={{
        boxShadow: isHovered
          ? `0 20px 40px ${colors.glow}, 0 0 60px ${colors.glow}`
          : `0 10px 30px ${colors.glow.replace("0.4", "0.2")}`,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient overlay */}
        <div
          className={cn(
            "absolute inset-0 opacity-30",
            "bg-gradient-to-tr from-white/20 via-transparent to-transparent",
          )}
        />

        {/* Animated circles */}
        <div
          className={cn(
            "absolute -top-12 -right-12 w-40 h-40 rounded-full",
            "bg-white/10 blur-2xl",
            "transition-transform duration-700",
            isHovered && "scale-150",
          )}
        />
        <div
          className={cn(
            "absolute -bottom-8 -left-8 w-32 h-32 rounded-full",
            "bg-white/10 blur-xl",
            "transition-transform duration-700 delay-100",
            isHovered && "scale-150",
          )}
        />

        {/* Sparkle effect */}
        {sparkle && (
          <Sparkles
            className={cn(
              "absolute top-3 right-3 w-5 h-5",
              "text-white/40 animate-pulse",
            )}
          />
        )}

        {/* Shine effect on hover */}
        <div
          className={cn(
            "absolute inset-0 -translate-x-full",
            "bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "transition-transform duration-1000 ease-out",
            isHovered && "translate-x-full",
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div
            className={cn(
              "flex items-center justify-center rounded-xl",
              colors.icon,
              iconSizes[size],
              "transition-all duration-300",
              "backdrop-blur-sm",
              "border border-white/20",
              animated && "group-hover:scale-110 group-hover:rotate-6",
            )}
          >
            {icon}
          </div>

          {/* Trend */}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full",
                "text-xs font-bold",
                "backdrop-blur-sm",
                trend.isPositive
                  ? "bg-green-500/30 text-green-100"
                  : "bg-red-500/30 text-red-100",
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
            </div>
          )}
        </div>

        {/* Value & Title */}
        <div className="mt-4">
          <p className="text-white/70 text-sm font-medium mb-1">{title}</p>
          <p
            className={cn(
              "font-bold tracking-tight",
              valueSizes[size],
              "drop-shadow-lg",
              animated && "transition-transform duration-300",
              isHovered && "scale-105",
            )}
          >
            {value}
          </p>
          {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
          {trend?.label && (
            <p className="text-white/50 text-xs mt-1">{trend.label}</p>
          )}
        </div>

        {/* Footer - Click indicator */}
        {onClick && (
          <div
            className={cn(
              "absolute bottom-4 right-4",
              "flex items-center gap-1 text-white/50 text-xs",
              "transition-all duration-300",
              "opacity-0 translate-x-2",
              isHovered && "opacity-100 translate-x-0",
            )}
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MINI COLORED CARD - For compact displays
// ============================================
export interface MiniColoredCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: CardColor;
  className?: string;
}

export const MiniColoredCard: React.FC<MiniColoredCardProps> = ({
  title,
  value,
  icon,
  color = "primary",
  className,
}) => {
  const colors = cardColors[color];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4",
        "bg-gradient-to-br",
        colors.gradient,
        "text-white",
        "transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        className,
      )}
      style={{
        boxShadow: `0 4px 15px ${colors.glow.replace("0.4", "0.2")}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center",
            "w-10 h-10 rounded-lg",
            colors.icon,
            "[&>svg]:w-5 [&>svg]:h-5",
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-white/70 text-xs font-medium">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STATS GRID - Layout helper
// ============================================
export interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  children,
  columns = 4,
  className,
}) => {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  };

  return (
    <div className={cn("grid gap-5", gridCols[columns], className)}>
      {children}
    </div>
  );
};

export default ColoredStatsCard;
