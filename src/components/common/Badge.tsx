import React from "react";
import { cn } from "../../utils/cn";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Info,
  Minus,
  Circle,
  Zap,
  Shield,
  Star,
  Flame,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

// ============================================
// BASE BADGE COMPONENT
// ============================================
export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "gray"
    | "outline"
    | "default"
    | "error"
    | "purple"
    | "cyan"
    | "gradient";
  size?: "xs" | "sm" | "md" | "lg";
  rounded?: boolean;
  dot?: boolean;
  dotPulse?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "sm",
  rounded = true,
  dot = false,
  dotPulse = false,
  icon,
  className,
  style,
  glow = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const variants: Record<string, string> = {
    primary:
      isDark || isGlass
        ? "bg-[#2E3192]/20 text-[#80D1E9] border-[#2E3192]/30"
        : "bg-[#2E3192]/10 text-[#2E3192] border-[#2E3192]/20",
    secondary:
      isDark || isGlass
        ? "bg-[#80D1E9]/15 text-[#80D1E9] border-[#80D1E9]/25"
        : "bg-[#80D1E9]/15 text-[#0E2841] border-[#80D1E9]/30",
    success:
      isDark || isGlass
        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
        : "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning:
      isDark || isGlass
        ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
        : "bg-amber-50 text-amber-700 border-amber-200",
    danger:
      isDark || isGlass
        ? "bg-rose-500/15 text-rose-400 border-rose-500/25"
        : "bg-rose-50 text-rose-700 border-rose-200",
    info:
      isDark || isGlass
        ? "bg-blue-500/15 text-blue-400 border-blue-500/25"
        : "bg-blue-50 text-blue-700 border-blue-200",
    gray:
      isDark || isGlass
        ? "bg-white/10 text-gray-300 border-white/15"
        : "bg-gray-100 text-gray-600 border-gray-200",
    outline:
      isDark || isGlass
        ? "bg-transparent border-2 border-white/30 text-white"
        : "bg-transparent border-2 border-current",
    default:
      isDark || isGlass
        ? "bg-white/10 text-gray-300 border-white/15"
        : "bg-gray-100 text-gray-600 border-gray-200",
    error:
      isDark || isGlass
        ? "bg-rose-500/15 text-rose-400 border-rose-500/25"
        : "bg-rose-50 text-rose-700 border-rose-200",
    purple:
      isDark || isGlass
        ? "bg-purple-500/15 text-purple-400 border-purple-500/25"
        : "bg-purple-50 text-purple-700 border-purple-200",
    cyan:
      isDark || isGlass
        ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/25"
        : "bg-cyan-50 text-cyan-700 border-cyan-200",
    gradient:
      "bg-gradient-to-r from-[#2E3192] to-[#0E2841] text-white border-0",
  };

  const sizes: Record<string, string> = {
    xs: "px-1.5 py-0.5 text-[10px] gap-1",
    sm: "px-2.5 py-0.5 text-xs gap-1.5",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const dotColors: Record<string, string> = {
    primary: isDark || isGlass ? "bg-[#80D1E9]" : "bg-[#2E3192]",
    secondary: "bg-[#80D1E9]",
    success: isDark || isGlass ? "bg-emerald-400" : "bg-emerald-500",
    warning: isDark || isGlass ? "bg-amber-400" : "bg-amber-500",
    danger: isDark || isGlass ? "bg-rose-400" : "bg-rose-500",
    info: isDark || isGlass ? "bg-blue-400" : "bg-blue-500",
    gray: "bg-gray-400",
    outline: "bg-current",
    default: "bg-gray-400",
    error: isDark || isGlass ? "bg-rose-400" : "bg-rose-500",
    purple: isDark || isGlass ? "bg-purple-400" : "bg-purple-500",
    cyan: isDark || isGlass ? "bg-cyan-400" : "bg-cyan-500",
    gradient: "bg-white",
  };

  const glowColors: Record<string, string> = {
    primary: "shadow-[0_0_12px_rgba(46,49,146,0.4)]",
    secondary: "shadow-[0_0_12px_rgba(128,209,233,0.4)]",
    success: "shadow-[0_0_12px_rgba(16,185,129,0.4)]",
    warning: "shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    danger: "shadow-[0_0_12px_rgba(239,68,68,0.4)]",
    info: "shadow-[0_0_12px_rgba(59,130,246,0.4)]",
    purple: "shadow-[0_0_12px_rgba(168,85,247,0.4)]",
    cyan: "shadow-[0_0_12px_rgba(6,182,212,0.4)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold border transition-all duration-200",
        variants[variant],
        sizes[size],
        rounded ? "rounded-full" : "rounded-lg",
        glow && glowColors[variant],
        className,
      )}
      style={style}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            dotColors[variant],
            dotPulse && "animate-pulse",
          )}
        />
      )}
      {icon && (
        <span className="flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};

// ============================================
// STATUS BADGE - Predefined Status Styles
// ============================================
export interface StatusBadgeProps {
  status:
    | "active"
    | "inactive"
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "cancelled"
    | "draft"
    | "in_progress"
    | "on_hold"
    | "expired"
    | "paid"
    | "unpaid"
    | "new"
    | "processing"
    | "shipped"
    | "delivered"
    | string;
  size?: "xs" | "sm" | "md";
  showIcon?: boolean;
  className?: string;
  animated?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
  showIcon = true,
  className,
  animated = true,
}) => {
  const statusConfig: Record<
    string,
    {
      variant: BadgeProps["variant"];
      label: string;
      icon: React.ReactNode;
    }
  > = {
    active: {
      variant: "success",
      label: "Active",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    inactive: {
      variant: "gray",
      label: "Inactive",
      icon: <Minus className="w-3.5 h-3.5" />,
    },
    pending: {
      variant: "warning",
      label: "Pending",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    approved: {
      variant: "success",
      label: "Approved",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    rejected: {
      variant: "danger",
      label: "Rejected",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    completed: {
      variant: "success",
      label: "Completed",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    cancelled: {
      variant: "gray",
      label: "Cancelled",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    draft: {
      variant: "gray",
      label: "Draft",
      icon: <Circle className="w-3.5 h-3.5" />,
    },
    in_progress: {
      variant: "info",
      label: "In Progress",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    on_hold: {
      variant: "warning",
      label: "On Hold",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    expired: {
      variant: "danger",
      label: "Expired",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    paid: {
      variant: "success",
      label: "Paid",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    unpaid: {
      variant: "danger",
      label: "Unpaid",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    new: {
      variant: "info",
      label: "New",
      icon: <Star className="w-3.5 h-3.5" />,
    },
    processing: {
      variant: "info",
      label: "Processing",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    shipped: {
      variant: "secondary",
      label: "Shipped",
      icon: <Shield className="w-3.5 h-3.5" />,
    },
    delivered: {
      variant: "success",
      label: "Delivered",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  };

  const normalizedStatus = status.toLowerCase().replace(/[\s-]/g, "_");
  const config = statusConfig[normalizedStatus] || {
    variant: "gray" as const,
    label: status,
    icon: <Circle className="w-3.5 h-3.5" />,
  };

  return (
    <Badge
      variant={config.variant}
      size={size}
      icon={showIcon ? config.icon : undefined}
      className={cn(
        animated && "hover:scale-105 transition-transform",
        className,
      )}
    >
      {config.label}
    </Badge>
  );
};

// ============================================
// PRIORITY BADGE
// ============================================
export interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "urgent" | "critical";
  size?: "xs" | "sm" | "md";
  className?: string;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = "sm",
  className,
  showIcon = true,
}) => {
  const priorityConfig: Record<
    string,
    { variant: BadgeProps["variant"]; label: string; icon: React.ReactNode }
  > = {
    low: {
      variant: "gray",
      label: "Low",
      icon: <Minus className="w-3.5 h-3.5" />,
    },
    medium: {
      variant: "info",
      label: "Medium",
      icon: <Circle className="w-3.5 h-3.5" />,
    },
    high: {
      variant: "warning",
      label: "High",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    urgent: {
      variant: "danger",
      label: "Urgent",
      icon: <Flame className="w-3.5 h-3.5" />,
    },
    critical: {
      variant: "danger",
      label: "Critical",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <Badge
      variant={config.variant}
      size={size}
      icon={showIcon ? config.icon : undefined}
      className={cn("hover:scale-105 transition-transform", className)}
    >
      {config.label}
    </Badge>
  );
};

// ============================================
// COUNT BADGE
// ============================================
export interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "xs" | "sm" | "md";
  className?: string;
  pulse?: boolean;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  variant = "danger",
  size = "sm",
  className,
  pulse = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";

  const displayCount = count > max ? `${max}+` : count;

  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-[#2E3192] to-[#0E2841] text-white",
    secondary: "bg-gradient-to-r from-[#80D1E9] to-[#2E3192] text-white",
    danger: "bg-gradient-to-r from-rose-500 to-rose-600 text-white",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
  };

  const sizes: Record<string, string> = {
    xs: "min-w-4 h-4 text-[10px] px-1",
    sm: "min-w-5 h-5 text-xs px-1.5",
    md: "min-w-6 h-6 text-sm px-2",
  };

  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold",
        "shadow-lg transition-transform hover:scale-110",
        variants[variant],
        sizes[size],
        pulse && "animate-pulse",
        className,
      )}
    >
      {displayCount}
    </span>
  );
};

// ============================================
// TAG BADGE
// ============================================
export interface TagBadgeProps {
  tag: string;
  color?: string;
  onRemove?: () => void;
  size?: "sm" | "md";
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  color,
  onRemove,
  size = "sm",
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";

  const sizes: Record<string, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all",
        isDark
          ? "bg-white/10 text-white border border-white/10 hover:bg-white/15"
          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200",
        sizes[size],
        className,
      )}
      style={
        color
          ? {
              backgroundColor: `${color}15`,
              color,
              borderColor: `${color}30`,
            }
          : undefined
      }
    >
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "ml-0.5 hover:bg-black/10 rounded p-0.5 transition-colors",
            "hover:scale-110",
          )}
        >
          <XCircle className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};

// ============================================
// FEATURE BADGE - For New/Beta Features
// ============================================
export interface FeatureBadgeProps {
  children: React.ReactNode;
  variant?: "new" | "updated" | "beta" | "coming" | "hot" | "pro";
  className?: string;
  animated?: boolean;
}

export const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  children,
  variant = "new",
  className,
  animated = true,
}) => {
  const variants: Record<string, string> = {
    new: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    updated: "bg-gradient-to-r from-[#80D1E9] to-[#2E3192] text-white",
    beta: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    coming: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
    hot: "bg-gradient-to-r from-rose-500 to-orange-500 text-white",
    pro: "bg-gradient-to-r from-[#2E3192] to-[#0E2841] text-white",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full",
        "shadow-lg",
        variants[variant],
        animated && "animate-pulse",
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
