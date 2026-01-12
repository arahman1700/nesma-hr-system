import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

// ============================================
// UNIFIED DESIGN SYSTEM TOKENS
// ============================================
export const DESIGN_TOKENS = {
  borderRadius: {
    none: "rounded-none",
    sm: "rounded-lg", // 8px
    md: "rounded-xl", // 12px
    lg: "rounded-2xl", // 16px - DEFAULT for cards
    xl: "rounded-3xl", // 24px
    full: "rounded-full",
  },
  spacing: {
    xs: "p-3",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
    xl: "p-8",
  },
  shadow: {
    none: "",
    sm: "shadow-[0_2px_8px_rgba(14,40,65,0.06)]",
    md: "shadow-[0_4px_16px_rgba(14,40,65,0.08)]",
    lg: "shadow-[0_8px_32px_rgba(14,40,65,0.12)]",
    xl: "shadow-[0_16px_48px_rgba(14,40,65,0.16)]",
    glow: "shadow-[0_0_40px_rgba(128,209,233,0.2)]",
    glowStrong: "shadow-[0_0_60px_rgba(128,209,233,0.3)]",
  },
  transition: {
    fast: "transition-all duration-150 ease-out",
    normal: "transition-all duration-300 ease-out",
    slow: "transition-all duration-500 ease-out",
    bounce:
      "transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
  },
};

// ============================================
// BASE CARD COMPONENT
// ============================================
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  hover?: boolean;
  variant?:
    | "default"
    | "glass"
    | "glass-heavy"
    | "gradient"
    | "bordered"
    | "elevated"
    | "neon";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "glow";
  hoverEffect?: "none" | "lift" | "scale" | "glow" | "border";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
  hover,
  variant = "default",
  padding = "md",
  radius = "lg",
  shadow = "sm",
  hoverEffect = "lift",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";
  const isHoverable = hoverable || hover;

  const getVariantClasses = () => {
    // Glass theme overrides
    if (isGlass) {
      return `
        bg-white/[0.03]
        backdrop-blur-xl
        border border-white/[0.08]
        hover:bg-white/[0.06]
        hover:border-white/[0.15]
        hover:shadow-[0_16px_48px_rgba(128,209,233,0.1)]
      `;
    }

    if (isDark) {
      switch (variant) {
        case "glass":
        case "glass-heavy":
          return `
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            hover:bg-white/10
            hover:border-[#80D1E9]/30
            hover:shadow-[0_0_40px_rgba(128,209,233,0.15)]
          `;
        case "gradient":
          return `
            bg-gradient-to-br from-white/10 to-white/5
            border border-white/10
            hover:border-[#80D1E9]/30
          `;
        case "bordered":
          return `
            bg-[var(--theme-card)]
            border-2 border-white/20
            hover:border-[#80D1E9]/50
          `;
        case "elevated":
          return `
            bg-[var(--theme-card)]
            border border-[var(--theme-border)]
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
          `;
        case "neon":
          return `
            bg-white/5
            border border-[#80D1E9]/30
            shadow-[0_0_20px_rgba(128,209,233,0.15)]
            hover:border-[#80D1E9]/60
            hover:shadow-[0_0_40px_rgba(128,209,233,0.25)]
          `;
        default:
          return `
            bg-[var(--theme-card)]
            border border-[var(--theme-border)]
            shadow-[0_2px_8px_rgba(0,0,0,0.3)]
            hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            hover:border-[#80D1E9]/30
          `;
      }
    }

    // Light mode variants
    switch (variant) {
      case "glass":
        return `
          bg-white/95
          backdrop-blur-xl
          border border-white/20
          shadow-[0_8px_32px_rgba(0,0,0,0.08)]
          hover:shadow-[0_12px_40px_rgba(46,49,146,0.12)]
        `;
      case "glass-heavy":
        return `
          bg-white/80
          backdrop-blur-2xl
          border border-gray-100
          shadow-[0_8px_32px_rgba(0,0,0,0.1)]
          hover:shadow-[0_16px_48px_rgba(46,49,146,0.15)]
        `;
      case "gradient":
        return `
          bg-gradient-to-br from-white to-gray-50
          border border-gray-100
          shadow-[0_2px_8px_rgba(14,40,65,0.06)]
          hover:shadow-[0_8px_32px_rgba(46,49,146,0.1)]
        `;
      case "bordered":
        return `
          bg-white
          border-2 border-gray-200
          hover:border-[#2E3192]/30
          shadow-none
          hover:shadow-[0_4px_20px_rgba(46,49,146,0.08)]
        `;
      case "elevated":
        return `
          bg-white
          border border-gray-100
          shadow-[0_8px_32px_rgba(14,40,65,0.1)]
          hover:shadow-[0_16px_48px_rgba(14,40,65,0.15)]
        `;
      case "neon":
        return `
          bg-white
          border border-[#80D1E9]/30
          shadow-[0_0_20px_rgba(128,209,233,0.1)]
          hover:border-[#80D1E9]/60
          hover:shadow-[0_0_40px_rgba(128,209,233,0.2)]
        `;
      default:
        return `
          bg-white
          border border-gray-100
          shadow-[0_2px_8px_rgba(14,40,65,0.06)]
          hover:shadow-[0_8px_24px_rgba(14,40,65,0.1)]
          hover:border-gray-200
        `;
    }
  };

  const getHoverEffectClasses = () => {
    if (!isHoverable) return "";
    switch (hoverEffect) {
      case "lift":
        return "hover:-translate-y-1";
      case "scale":
        return "hover:scale-[1.02]";
      case "glow":
        return "hover:shadow-[0_0_40px_rgba(128,209,233,0.25)]";
      case "border":
        return "hover:border-[#80D1E9]/50";
      default:
        return "";
    }
  };

  const paddings: Record<string, string> = {
    none: "",
    xs: "p-3",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
    xl: "p-8",
  };

  const radiuses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
  };

  return (
    <div
      className={cn(
        radiuses[radius],
        DESIGN_TOKENS.transition.normal,
        "overflow-hidden relative",
        getVariantClasses(),
        paddings[padding],
        isHoverable && "cursor-pointer",
        getHoverEffectClasses(),
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Subtle noise texture for premium feel */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none noise-overlay" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ============================================
// KPI CARD - Premium Statistics Card
// ============================================
export interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "cyan";
  onClick?: () => void;
  subtitle?: string;
  badge?: string;
  className?: string;
  variant?: "default" | "gradient" | "glass" | "neon";
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "primary",
  onClick,
  subtitle,
  badge,
  className,
  variant = "default",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses: Record<
    string,
    {
      border: string;
      icon: string;
      iconDark: string;
      value: string;
      gradient: { from: string; to: string };
      glow: string;
    }
  > = {
    primary: {
      border: isDark ? "border-l-[#80D1E9]" : "border-l-[#2E3192]",
      icon: "bg-[#2E3192]/10 text-[#2E3192]",
      iconDark: "bg-[#2E3192]/30 text-[#80D1E9]",
      value: isDark ? "text-[#80D1E9]" : "text-[#2E3192]",
      gradient: { from: "#2E3192", to: "#0E2841" },
      glow: "rgba(46, 49, 146, 0.4)",
    },
    secondary: {
      border: "border-l-[#80D1E9]",
      icon: "bg-[#80D1E9]/20 text-[#0E2841]",
      iconDark: "bg-[#80D1E9]/20 text-[#80D1E9]",
      value: isDark ? "text-[#80D1E9]" : "text-[#0E2841]",
      gradient: { from: "#80D1E9", to: "#2E3192" },
      glow: "rgba(128, 209, 233, 0.4)",
    },
    success: {
      border: "border-l-emerald-500",
      icon: "bg-emerald-50 text-emerald-600",
      iconDark: "bg-emerald-500/20 text-emerald-400",
      value: isDark ? "text-emerald-400" : "text-emerald-600",
      gradient: { from: "#10B981", to: "#059669" },
      glow: "rgba(16, 185, 129, 0.4)",
    },
    warning: {
      border: "border-l-amber-500",
      icon: "bg-amber-50 text-amber-600",
      iconDark: "bg-amber-500/20 text-amber-400",
      value: isDark ? "text-amber-400" : "text-amber-600",
      gradient: { from: "#F59E0B", to: "#D97706" },
      glow: "rgba(245, 158, 11, 0.4)",
    },
    danger: {
      border: "border-l-rose-500",
      icon: "bg-rose-50 text-rose-600",
      iconDark: "bg-rose-500/20 text-rose-400",
      value: isDark ? "text-rose-400" : "text-rose-600",
      gradient: { from: "#EF4444", to: "#DC2626" },
      glow: "rgba(239, 68, 68, 0.4)",
    },
    info: {
      border: "border-l-sky-500",
      icon: "bg-sky-50 text-sky-600",
      iconDark: "bg-sky-500/20 text-sky-400",
      value: isDark ? "text-sky-400" : "text-sky-600",
      gradient: { from: "#3B82F6", to: "#2563EB" },
      glow: "rgba(59, 130, 246, 0.4)",
    },
    purple: {
      border: "border-l-purple-500",
      icon: "bg-purple-50 text-purple-600",
      iconDark: "bg-purple-500/20 text-purple-400",
      value: isDark ? "text-purple-400" : "text-purple-600",
      gradient: { from: "#A855F7", to: "#7C3AED" },
      glow: "rgba(168, 85, 247, 0.4)",
    },
    cyan: {
      border: "border-l-cyan-500",
      icon: "bg-cyan-50 text-cyan-600",
      iconDark: "bg-cyan-500/20 text-cyan-400",
      value: isDark ? "text-cyan-400" : "text-cyan-600",
      gradient: { from: "#06B6D4", to: "#0891B2" },
      glow: "rgba(6, 182, 212, 0.4)",
    },
  };

  const colors = colorClasses[color];

  const getCardVariantStyles = () => {
    if (isGlass) {
      return `
        bg-white/[0.03]
        backdrop-blur-xl
        border border-white/[0.08]
        border-l-4 ${colors.border}
      `;
    }

    switch (variant) {
      case "gradient":
        return cn(
          "bg-gradient-to-br text-white border-0",
          isDark ? "from-white/10 to-white/5" : "",
        );
      case "glass":
        return cn(
          "backdrop-blur-xl border-l-4",
          colors.border,
          isDark
            ? "bg-white/5 border border-white/10"
            : "bg-white/90 border border-gray-100",
        );
      case "neon":
        return cn(
          "border-l-4 border border-current/20",
          colors.border,
          isDark ? "bg-white/5" : "bg-white",
        );
      default:
        return cn(
          "border-l-4",
          colors.border,
          isDark
            ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
            : "bg-white border border-gray-100",
        );
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        DESIGN_TOKENS.borderRadius.lg,
        "p-5 transition-all duration-300",
        getCardVariantStyles(),
        DESIGN_TOKENS.shadow.sm,
        "hover:shadow-lg hover:-translate-y-1",
        isDark && "hover:border-[#80D1E9]/30",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        isHovered && variant === "neon"
          ? { boxShadow: `0 0 30px ${colors.glow}` }
          : undefined
      }
    >
      {/* Background gradient on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
          isHovered && "opacity-100",
        )}
        style={{
          background: isDark
            ? `radial-gradient(circle at top right, ${colors.glow.replace("0.4", "0.1")} 0%, transparent 60%)`
            : `radial-gradient(circle at top right, ${colors.glow.replace("0.4", "0.05")} 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div
              className={cn(
                "p-3 rounded-xl transition-all duration-300 overflow-hidden",
                "[&>svg]:w-5 [&>svg]:h-5",
                isDark ? colors.iconDark : colors.icon,
                isHovered && "scale-110 rotate-3",
              )}
              style={
                variant === "gradient"
                  ? {
                      background: `linear-gradient(135deg, ${colors.gradient.from} 0%, ${colors.gradient.to} 100%)`,
                      color: "white",
                    }
                  : undefined
              }
            >
              {icon}
            </div>
          )}
          {badge && (
            <span
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-full",
                isDark
                  ? "bg-[#80D1E9]/20 text-[#80D1E9]"
                  : "bg-[#2E3192]/10 text-[#2E3192]",
              )}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p
            className={cn(
              "text-sm font-medium",
              isDark || isGlass ? "text-gray-400" : "text-gray-500",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-3xl font-bold tracking-tight",
              variant === "gradient" ? "text-white" : colors.value,
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className={cn(
                "text-xs",
                isDark || isGlass ? "text-gray-500" : "text-gray-400",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                trend.isPositive
                  ? isDark
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                  : trend.value === 0
                    ? isDark
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                    : isDark
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-rose-50 text-rose-600",
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend.value === 0 ? (
                <Minus className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {trend.value > 0 && "+"}
                {trend.value}%
              </span>
            </div>
            <span
              className={cn(
                "text-xs",
                isDark || isGlass ? "text-gray-500" : "text-gray-400",
              )}
            >
              vs last month
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
            <ChevronRight
              className={cn(
                "w-5 h-5",
                isDark || isGlass ? "text-gray-500" : "text-gray-400",
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// STAT CARD - Simpler Statistics Card
// ============================================
export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "error";
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = "primary",
  trend,
  onClick,
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const colorMap: Record<string, string> = {
    primary: isDark
      ? "text-[#80D1E9] bg-[#2E3192]/20"
      : "text-[#2E3192] bg-[#2E3192]/10",
    secondary: isDark
      ? "text-[#80D1E9] bg-[#80D1E9]/20"
      : "text-[#0E2841] bg-[#80D1E9]/20",
    success: isDark
      ? "text-emerald-400 bg-emerald-500/20"
      : "text-emerald-600 bg-emerald-50",
    warning: isDark
      ? "text-amber-400 bg-amber-500/20"
      : "text-amber-600 bg-amber-50",
    danger: isDark
      ? "text-rose-400 bg-rose-500/20"
      : "text-rose-600 bg-rose-50",
    info: isDark ? "text-sky-400 bg-sky-500/20" : "text-sky-600 bg-sky-50",
    error: isDark ? "text-rose-400 bg-rose-500/20" : "text-rose-600 bg-rose-50",
  };

  return (
    <div
      className={cn(
        DESIGN_TOKENS.borderRadius.lg,
        "p-5 transition-all duration-300 overflow-hidden relative",
        isGlass
          ? "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]"
          : isDark
            ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
            : "bg-white border border-gray-100",
        DESIGN_TOKENS.shadow.sm,
        "hover:shadow-lg hover:-translate-y-1",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium mb-1",
              isDark || isGlass ? "text-gray-400" : "text-gray-500",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-2xl font-bold",
              isDark || isGlass ? "text-white" : "text-gray-800",
            )}
          >
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "p-3 rounded-xl overflow-hidden [&>svg]:w-5 [&>svg]:h-5",
              colorMap[color],
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// GLASS CARD - For Dark/Premium Backgrounds
// ============================================
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  intensity?: "light" | "medium" | "heavy";
  glowColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  onClick,
  hoverable = true,
  intensity = "medium",
  glowColor = "rgba(128,209,233,0.2)",
}) => {
  const intensityStyles = {
    light: "bg-white/[0.02] backdrop-blur-md border-white/[0.05]",
    medium: "bg-white/[0.05] backdrop-blur-xl border-white/[0.1]",
    heavy: "bg-white/[0.08] backdrop-blur-2xl border-white/[0.15]",
  };

  return (
    <div
      className={cn(
        "relative p-6",
        DESIGN_TOKENS.borderRadius.xl,
        "border overflow-hidden",
        intensityStyles[intensity],
        DESIGN_TOKENS.transition.normal,
        hoverable && [
          "hover:bg-white/[0.1]",
          "hover:border-[#80D1E9]/30",
          "hover:-translate-y-2",
        ],
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      style={{
        boxShadow: hoverable ? undefined : `0 0 40px ${glowColor}`,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = `0 0 40px ${glowColor}`;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = "";
        }
      }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            padding: "1px",
            background:
              "linear-gradient(135deg, transparent 0%, rgba(128,209,233,0.4) 50%, transparent 100%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ============================================
// DEPARTMENT CARD - For Portal Navigation
// ============================================
export interface DepartmentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "active" | "coming-soon";
  tags?: string[];
  onClick?: () => void;
  className?: string;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  title,
  description,
  icon,
  status,
  tags = [],
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative bg-white/[0.03] backdrop-blur-xl p-8 text-center",
        DESIGN_TOKENS.borderRadius.xl,
        "border border-white/[0.08] overflow-hidden min-h-[320px]",
        DESIGN_TOKENS.transition.normal,
        "cursor-pointer",
        "hover:bg-white/[0.08] hover:border-[#80D1E9]/30",
        "hover:shadow-[0_40px_80px_rgba(128,209,233,0.15)]",
        "hover:-translate-y-3 hover:scale-[1.02]",
        className,
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2E3192] to-[#0E2841] flex items-center justify-center text-white shadow-lg [&>svg]:w-9 [&>svg]:h-9">
          {icon}
        </div>
      </div>

      {/* Status badge */}
      <div className="mb-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
            status === "active"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-400",
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              status === "active" ? "bg-emerald-400" : "bg-amber-400",
            )}
          />
          {status === "active" ? "Active" : "Coming Soon"}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm mb-6">{description}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Enter button */}
      <div className="flex items-center justify-center text-[#80D1E9] text-sm font-semibold transition-all group-hover:gap-2">
        <span>Enter</span>
        <ChevronRight className="w-5 h-5 ml-1" />
      </div>
    </div>
  );
};

// ============================================
// CHART CARD - For Data Visualizations
// ============================================
export interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  actions,
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className={cn(
              "text-lg font-semibold",
              isDark || isGlass ? "text-white" : "text-gray-800",
            )}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className={cn(
                "text-sm mt-0.5",
                isDark || isGlass ? "text-gray-400" : "text-gray-500",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </Card>
  );
};

export default Card;
