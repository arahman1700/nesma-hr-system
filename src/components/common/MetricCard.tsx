import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { AnimatedCounter } from "./AnimatedCounter";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "cyan";
  variant?: "default" | "glass" | "gradient" | "outlined";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  subtitle?: string;
  badge?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  animate?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "primary",
  variant = "default",
  size = "md",
  onClick,
  subtitle,
  badge,
  prefix = "",
  suffix = "",
  className,
  animate = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    primary: {
      border: "border-l-[#2E3192]",
      icon: "bg-[#2E3192]/10 text-[#2E3192]",
      value: "text-[#2E3192]",
      gradient: "from-[#2E3192]/5 to-transparent",
      badge: "bg-[#2E3192]/10 text-[#2E3192]",
    },
    secondary: {
      border: "border-l-[#80D1E9]",
      icon: "bg-[#80D1E9]/20 text-[#0E2841]",
      value: "text-[#0E2841]",
      gradient: "from-[#80D1E9]/10 to-transparent",
      badge: "bg-[#80D1E9]/20 text-[#0E2841]",
    },
    cyan: {
      border: "border-l-[#80D1E9]",
      icon: "bg-[#80D1E9]/20 text-[#80D1E9]",
      value: "text-[#80D1E9]",
      gradient: "from-[#80D1E9]/10 to-transparent",
      badge: "bg-[#80D1E9]/20 text-[#80D1E9]",
    },
    success: {
      border: "border-l-emerald-500",
      icon: "bg-emerald-100 text-emerald-600",
      value: "text-emerald-600",
      gradient: "from-emerald-50 to-transparent",
      badge: "bg-emerald-100 text-emerald-600",
    },
    warning: {
      border: "border-l-amber-500",
      icon: "bg-amber-100 text-amber-600",
      value: "text-amber-600",
      gradient: "from-amber-50 to-transparent",
      badge: "bg-amber-100 text-amber-600",
    },
    danger: {
      border: "border-l-red-500",
      icon: "bg-red-100 text-red-600",
      value: "text-red-600",
      gradient: "from-red-50 to-transparent",
      badge: "bg-red-100 text-red-600",
    },
    info: {
      border: "border-l-blue-500",
      icon: "bg-blue-100 text-blue-600",
      value: "text-blue-600",
      gradient: "from-blue-50 to-transparent",
      badge: "bg-blue-100 text-blue-600",
    },
  };

  const sizes = {
    sm: {
      padding: "p-4",
      iconSize: "p-2",
      iconInner: "w-4 h-4",
      title: "text-xs",
      value: "text-xl",
      subtitle: "text-[10px]",
    },
    md: {
      padding: "p-5",
      iconSize: "p-3",
      iconInner: "w-5 h-5",
      title: "text-sm",
      value: "text-3xl",
      subtitle: "text-xs",
    },
    lg: {
      padding: "p-6",
      iconSize: "p-4",
      iconInner: "w-6 h-6",
      title: "text-base",
      value: "text-4xl",
      subtitle: "text-sm",
    },
  };

  const variants = {
    default: `
      bg-[var(--theme-card)]
      border border-[var(--theme-card-border)]
      shadow-[var(--theme-shadow)]
      hover:shadow-[var(--theme-shadow-hover)]
    `,
    glass: `
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      hover:bg-white/10
      hover:border-[#80D1E9]/30
    `,
    gradient: `
      bg-gradient-to-br from-[var(--theme-card)] to-transparent
      border border-[var(--theme-card-border)]
    `,
    outlined: `
      bg-transparent
      border-2 border-[var(--theme-border)]
      hover:border-[#2E3192]/30
    `,
  };

  const colors = colorClasses[color];
  const sizeConfig = sizes[size];

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-300",
        "border-l-4",
        colors.border,
        variants[variant],
        sizeConfig.padding,
        onClick && "cursor-pointer",
        isHovered && "hover:-translate-y-1 hover:scale-[1.02]",
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
          colors.gradient,
          isHovered && "opacity-100",
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div
              className={cn(
                "rounded-xl transition-transform duration-300",
                sizeConfig.iconSize,
                colors.icon,
                isHovered && "scale-110",
              )}
            >
              {icon}
            </div>
          )}
          {badge && (
            <span
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-full",
                colors.badge,
              )}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p
            className={cn(
              "font-medium text-[var(--theme-text-muted)]",
              sizeConfig.title,
            )}
          >
            {title}
          </p>
          <p className={cn("font-bold", colors.value, sizeConfig.value)}>
            {prefix}
            {animate && typeof value === "number" ? (
              <AnimatedCounter value={value} />
            ) : (
              value
            )}
            {suffix}
          </p>
          {subtitle && (
            <p
              className={cn(
                "text-[var(--theme-text-muted)]",
                sizeConfig.subtitle,
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {trend && (
          <div className="flex items-center gap-1 mt-3">
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : trend.value === 0 ? (
              <Minus className="w-4 h-4 text-gray-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                trend.isPositive
                  ? "text-emerald-500"
                  : trend.value === 0
                    ? "text-gray-400"
                    : "text-red-500",
              )}
            >
              {trend.value > 0 && "+"}
              {trend.value}%
            </span>
            <span className="text-xs text-[var(--theme-text-muted)] ml-1">
              {trend.label || "vs last month"}
            </span>
          </div>
        )}

        {/* Hover indicator */}
        {onClick && (
          <div
            className={cn(
              "absolute bottom-4 right-4 transition-all duration-300",
              "opacity-0 translate-x-2",
              isHovered && "opacity-100 translate-x-0",
            )}
          >
            <ChevronRight className="w-5 h-5 text-[var(--theme-text-muted)]" />
          </div>
        )}
      </div>
    </div>
  );
};

// Glass Metric Card (for dark/company themes)
export const GlassMetricCard: React.FC<MetricCardProps> = (props) => {
  return <MetricCard {...props} variant="glass" />;
};

export default MetricCard;
