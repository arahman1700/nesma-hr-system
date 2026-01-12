import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Share2,
} from "lucide-react";

// ============================================
// SKELETON LOADERS
// ============================================

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  animate = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";

  return (
    <div
      className={cn(
        "rounded-lg",
        animate && "animate-pulse",
        isDark ? "bg-white/10" : "bg-gray-200",
        className,
      )}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";

  return (
    <div
      className={cn(
        "p-5 rounded-2xl",
        isDark ? "bg-white/5" : "bg-white",
        "border",
        isDark ? "border-white/10" : "border-gray-100",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden",
        isDark ? "bg-white/5" : "bg-white",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "px-4 py-3 flex gap-4",
          isDark ? "bg-white/10" : "bg-gray-50",
        )}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            "px-4 py-4 flex gap-4 border-t",
            isDark ? "border-white/5" : "border-gray-100",
          )}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn("h-4 flex-1", colIndex === 0 && "w-1/4")}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ============================================
// ENHANCED STAT DISPLAY
// ============================================

interface EnhancedStatProps {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: "blue" | "green" | "amber" | "rose" | "purple" | "cyan";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  loading?: boolean;
  sparkline?: number[];
}

const colorVariants = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    light: "bg-blue-500/10",
    text: "text-blue-600",
    glow: "shadow-blue-500/25",
  },
  green: {
    gradient: "from-emerald-500 to-emerald-600",
    light: "bg-emerald-500/10",
    text: "text-emerald-600",
    glow: "shadow-emerald-500/25",
  },
  amber: {
    gradient: "from-amber-500 to-amber-600",
    light: "bg-amber-500/10",
    text: "text-amber-600",
    glow: "shadow-amber-500/25",
  },
  rose: {
    gradient: "from-rose-500 to-rose-600",
    light: "bg-rose-500/10",
    text: "text-rose-600",
    glow: "shadow-rose-500/25",
  },
  purple: {
    gradient: "from-purple-500 to-purple-600",
    light: "bg-purple-500/10",
    text: "text-purple-600",
    glow: "shadow-purple-500/25",
  },
  cyan: {
    gradient: "from-cyan-500 to-cyan-600",
    light: "bg-cyan-500/10",
    text: "text-cyan-600",
    glow: "shadow-cyan-500/25",
  },
};

export const EnhancedStat: React.FC<EnhancedStatProps> = ({
  value,
  label,
  icon,
  trend,
  color = "blue",
  size = "md",
  onClick,
  loading,
  sparkline,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";
  const colors = colorVariants[color];

  const [displayValue, setDisplayValue] = useState(0);
  const numericValue =
    typeof value === "number" ? value : parseFloat(value) || 0;

  // Animated counter
  useEffect(() => {
    if (loading) return;

    const duration = 1000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue, loading]);

  if (loading) {
    return <SkeletonCard />;
  }

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-5",
  };

  const valueSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "transition-all duration-300",
        onClick && "cursor-pointer hover:scale-[1.02]",
        isGlass
          ? "bg-white/5 backdrop-blur-xl border border-white/10"
          : isDark
            ? "bg-gray-800/50 border border-gray-700/50"
            : "bg-white border border-gray-100 shadow-sm hover:shadow-lg",
        sizeClasses[size],
      )}
      onClick={onClick}
    >
      {/* Background decoration */}
      <div
        className={cn(
          "absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl",
          `bg-gradient-to-br ${colors.gradient}`,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "transition-transform duration-300 group-hover:scale-110",
            `bg-gradient-to-br ${colors.gradient}`,
            `shadow-lg ${colors.glow}`,
          )}
        >
          <span className="text-white [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 text-right">
          <p
            className={cn(
              "text-xs font-medium mb-1",
              isGlass
                ? "text-[#2E3192]/70"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-500",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "font-bold tabular-nums",
              valueSizes[size],
              isGlass
                ? "text-[#2E3192]"
                : isDark
                  ? "text-white"
                  : "text-gray-900",
            )}
          >
            {typeof value === "string" ? value : displayValue.toLocaleString()}
          </p>

          {/* Trend */}
          {trend && (
            <div
              className={cn(
                "flex items-center justify-end gap-1 mt-1",
                trend.isPositive ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-xs font-medium">
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              {trend.label && (
                <span
                  className={cn(
                    "text-xs",
                    isGlass
                      ? "text-[#2E3192]/50"
                      : isDark
                        ? "text-gray-500"
                        : "text-gray-400",
                  )}
                >
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mini Sparkline */}
      {sparkline && sparkline.length > 0 && (
        <div className="mt-3 h-8 flex items-end gap-0.5">
          {sparkline.map((val, i) => {
            const max = Math.max(...sparkline);
            const height = (val / max) * 100;
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-t transition-all duration-300",
                  `bg-gradient-to-t ${colors.gradient}`,
                  "opacity-60 hover:opacity-100",
                )}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================
// ENHANCED TABLE ROW
// ============================================

interface TableAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: "default" | "danger" | "success";
}

interface EnhancedTableRowProps {
  children: React.ReactNode;
  actions?: TableAction[];
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export const EnhancedTableRow: React.FC<EnhancedTableRowProps> = ({
  children,
  actions,
  onClick,
  selected,
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const [showActions, setShowActions] = useState(false);

  return (
    <tr
      className={cn(
        "group transition-all duration-200",
        onClick && "cursor-pointer",
        selected
          ? isDark
            ? "bg-[#2E3192]/20"
            : "bg-[#2E3192]/5"
          : isDark
            ? "hover:bg-white/5"
            : "hover:bg-gray-50",
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {children}
      {actions && actions.length > 0 && (
        <td className="px-4 py-3">
          <div
            className={cn(
              "flex items-center justify-end gap-1 transition-opacity duration-200",
              showActions ? "opacity-100" : "opacity-0",
            )}
          >
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  action.color === "danger"
                    ? "hover:bg-rose-500/10 text-rose-500"
                    : action.color === "success"
                      ? "hover:bg-emerald-500/10 text-emerald-500"
                      : isDark
                        ? "hover:bg-white/10 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-700",
                )}
                title={action.label}
              >
                {action.icon}
              </button>
            ))}
          </div>
        </td>
      )}
    </tr>
  );
};

// ============================================
// CONTEXT MENU
// ============================================

interface ContextMenuItem {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: "default" | "danger";
  divider?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  trigger: React.ReactNode;
  position?: "left" | "right";
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  trigger,
  position = "right",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "absolute z-50 mt-2 min-w-[180px] py-2 rounded-xl",
              "shadow-xl border animate-in fade-in-0 zoom-in-95",
              position === "right" ? "right-0" : "left-0",
              isGlass
                ? "bg-white/10 backdrop-blur-xl border-white/20"
                : isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
            )}
          >
            {items.map((item, i) => (
              <React.Fragment key={i}>
                {item.divider && (
                  <div
                    className={cn(
                      "my-2 border-t",
                      isDark ? "border-gray-700" : "border-gray-100",
                    )}
                  />
                )}
                <button
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 flex items-center gap-3 text-sm",
                    "transition-colors",
                    item.color === "danger"
                      ? "text-rose-500 hover:bg-rose-500/10"
                      : isGlass
                        ? "text-[#2E3192] hover:bg-white/10"
                        : isDark
                          ? "text-gray-300 hover:bg-white/5 hover:text-white"
                          : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {item.icon && (
                    <span className="[&>svg]:w-4 [&>svg]:h-4">{item.icon}</span>
                  )}
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className={cn(
          "w-20 h-20 rounded-2xl flex items-center justify-center mb-6",
          isGlass ? "bg-white/10" : isDark ? "bg-gray-800" : "bg-gray-100",
        )}
      >
        <span
          className={cn(
            "[&>svg]:w-10 [&>svg]:h-10",
            isGlass
              ? "text-[#2E3192]/50"
              : isDark
                ? "text-gray-600"
                : "text-gray-400",
          )}
        >
          {icon}
        </span>
      </div>
      <h3
        className={cn(
          "text-lg font-semibold mb-2",
          isGlass ? "text-[#2E3192]" : isDark ? "text-white" : "text-gray-900",
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            "text-sm text-center max-w-sm mb-6",
            isGlass
              ? "text-[#2E3192]/70"
              : isDark
                ? "text-gray-400"
                : "text-gray-500",
          )}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "px-6 py-2.5 rounded-xl font-medium",
            "bg-gradient-to-r from-[#2E3192] to-[#0E2841]",
            "text-white shadow-lg shadow-[#2E3192]/25",
            "hover:shadow-xl hover:scale-105 transition-all duration-300",
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// ============================================
// PROGRESS INDICATOR
// ============================================

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "amber" | "rose" | "purple";
  animated?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  size = "md",
  color = "blue",
  animated = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";
  const percentage = Math.min((value / max) * 100, 100);

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const gradients = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    rose: "from-rose-500 to-rose-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span
              className={cn(
                "text-sm font-medium",
                isGlass
                  ? "text-[#2E3192]"
                  : isDark
                    ? "text-gray-300"
                    : "text-gray-700",
              )}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              className={cn(
                "text-sm font-bold",
                isGlass
                  ? "text-[#2E3192]"
                  : isDark
                    ? "text-white"
                    : "text-gray-900",
              )}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full overflow-hidden",
          heights[size],
          isGlass ? "bg-white/10" : isDark ? "bg-gray-700" : "bg-gray-200",
        )}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500",
            gradients[color],
            animated && "animate-pulse",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ============================================
// AVATAR WITH STATUS
// ============================================

interface EnhancedAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
  showName?: boolean;
  subtitle?: string;
  onClick?: () => void;
}

export const EnhancedAvatar: React.FC<EnhancedAvatarProps> = ({
  src,
  name,
  size = "md",
  status,
  showName,
  subtitle,
  onClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const statusSizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-gray-400",
    busy: "bg-rose-500",
    away: "bg-amber-500",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn("flex items-center gap-3", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <div className="relative">
        {src ? (
          <img
            src={src}
            alt={name}
            className={cn(
              "rounded-full object-cover ring-2",
              sizes[size],
              isGlass
                ? "ring-white/20"
                : isDark
                  ? "ring-gray-700"
                  : "ring-white",
            )}
          />
        ) : (
          <div
            className={cn(
              "rounded-full flex items-center justify-center font-semibold",
              "bg-gradient-to-br from-[#2E3192] to-[#0E2841] text-white",
              sizes[size],
            )}
          >
            {initials}
          </div>
        )}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full ring-2",
              statusSizes[size],
              statusColors[status],
              isGlass
                ? "ring-black/50"
                : isDark
                  ? "ring-gray-800"
                  : "ring-white",
            )}
          />
        )}
      </div>
      {showName && (
        <div>
          <p
            className={cn(
              "font-medium",
              isGlass
                ? "text-[#2E3192]"
                : isDark
                  ? "text-white"
                  : "text-gray-900",
            )}
          >
            {name}
          </p>
          {subtitle && (
            <p
              className={cn(
                "text-sm",
                isGlass
                  ? "text-[#2E3192]/70"
                  : isDark
                    ? "text-gray-400"
                    : "text-gray-500",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// TOOLTIP
// ============================================

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
}) => {
  const [show, setShow] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={cn(
            "absolute z-50 px-3 py-2 text-sm rounded-lg whitespace-nowrap",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            positions[position],
            isDark
              ? "bg-gray-800 text-white border border-gray-700"
              : "bg-gray-900 text-white",
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

// Export all common actions
export const commonTableActions = {
  view: (onClick: () => void): TableAction => ({
    icon: <Eye className="w-4 h-4" />,
    label: "View",
    onClick,
  }),
  edit: (onClick: () => void): TableAction => ({
    icon: <Edit className="w-4 h-4" />,
    label: "Edit",
    onClick,
  }),
  delete: (onClick: () => void): TableAction => ({
    icon: <Trash2 className="w-4 h-4" />,
    label: "Delete",
    onClick,
    color: "danger" as const,
  }),
  copy: (onClick: () => void): TableAction => ({
    icon: <Copy className="w-4 h-4" />,
    label: "Copy",
    onClick,
  }),
  download: (onClick: () => void): TableAction => ({
    icon: <Download className="w-4 h-4" />,
    label: "Download",
    onClick,
  }),
  share: (onClick: () => void): TableAction => ({
    icon: <Share2 className="w-4 h-4" />,
    label: "Share",
    onClick,
  }),
};

export default {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  EnhancedStat,
  EnhancedTableRow,
  ContextMenu,
  EmptyState,
  ProgressIndicator,
  EnhancedAvatar,
  Tooltip,
  commonTableActions,
};
