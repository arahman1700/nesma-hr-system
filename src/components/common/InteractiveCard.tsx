import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Maximize2,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

// Detail Modal Component
interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: "blue" | "green" | "amber" | "red" | "purple" | "pink" | "cyan";
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
    icon?: React.ReactNode;
  }>;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const colorMap = {
  blue: {
    bg: "from-blue-500 to-blue-600",
    light: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
  },
  green: {
    bg: "from-emerald-500 to-emerald-600",
    light: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
  },
  amber: {
    bg: "from-amber-500 to-amber-600",
    light: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
  },
  red: {
    bg: "from-rose-500 to-rose-600",
    light: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/20",
  },
  purple: {
    bg: "from-purple-500 to-purple-600",
    light: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/20",
  },
  pink: {
    bg: "from-pink-500 to-pink-600",
    light: "bg-pink-500/10",
    text: "text-pink-500",
    border: "border-pink-500/20",
  },
  cyan: {
    bg: "from-cyan-500 to-cyan-600",
    light: "bg-cyan-500/10",
    text: "text-cyan-500",
    border: "border-cyan-500/20",
  },
};

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-6xl",
};

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  icon,
  color = "blue",
  actions,
  size = "lg",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";
  const colors = colorMap[color];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full",
              sizeMap[size],
              "max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl",
              isGlass
                ? "bg-white/10 backdrop-blur-2xl border border-white/20"
                : isDark
                  ? "bg-gray-900 border border-gray-700"
                  : "bg-white border border-gray-200"
            )}
          >
            {/* Header with gradient */}
            <div
              className={cn(
                "relative p-6 pb-4 bg-gradient-to-r",
                colors.bg,
                "text-white"
              )}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                {icon && (
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    {icon}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{title}</h2>
                  {subtitle && (
                    <p className="text-white/80 mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">{children}</div>

            {/* Actions */}
            {actions && actions.length > 0 && (
              <div
                className={cn(
                  "px-6 py-4 border-t flex justify-end gap-3",
                  isGlass
                    ? "border-white/10"
                    : isDark
                      ? "border-gray-700"
                      : "border-gray-200"
                )}
              >
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all",
                      action.variant === "primary" &&
                        `bg-gradient-to-r ${colors.bg} text-white hover:shadow-lg`,
                      action.variant === "secondary" &&
                        (isGlass
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : isDark
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"),
                      action.variant === "danger" &&
                        "bg-rose-500 text-white hover:bg-rose-600"
                    )}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Interactive Stat Card
interface InteractiveStatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "amber" | "red" | "purple" | "pink" | "cyan";
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  sparkline?: number[];
  onClick?: () => void;
  detailContent?: React.ReactNode;
  detailTitle?: string;
  subtitle?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
    icon?: React.ReactNode;
  }>;
}

export const InteractiveStatCard: React.FC<InteractiveStatCardProps> = ({
  title,
  value,
  icon,
  color = "blue",
  trend,
  sparkline,
  onClick,
  detailContent,
  detailTitle,
  subtitle,
  actions,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";
  const colors = colorMap[color];
  const [showDetail, setShowDetail] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    if (detailContent) {
      setShowDetail(true);
    } else if (onClick) {
      onClick();
    }
  };

  // Generate sparkline path
  const getSparklinePath = () => {
    if (!sparkline || sparkline.length < 2) return "";
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min || 1;
    const width = 80;
    const height = 30;
    const points = sparkline.map((val, i) => {
      const x = (i / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });
    return `M${points.join(" L")}`;
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={cn(
          "relative p-5 rounded-2xl cursor-pointer overflow-hidden group transition-all duration-300",
          isGlass
            ? "bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] hover:border-white/[0.2]"
            : isDark
              ? "bg-gray-800/80 border border-gray-700 hover:border-gray-600"
              : "bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg"
        )}
      >
        {/* Background gradient effect */}
        <div
          className={cn(
            "absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20",
            `bg-gradient-to-br ${colors.bg}`
          )}
        />

        {/* Menu button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className={cn(
            "absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
            isGlass
              ? "hover:bg-white/10"
              : isDark
                ? "hover:bg-gray-700"
                : "hover:bg-gray-100"
          )}
        >
          <MoreHorizontal
            className={cn(
              "w-4 h-4",
              isGlass || isDark ? "text-white/60" : "text-gray-400"
            )}
          />
        </button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "absolute top-10 right-3 z-10 min-w-[140px] py-1 rounded-lg shadow-lg",
                isGlass
                  ? "bg-gray-900/90 backdrop-blur-xl border border-white/10"
                  : isDark
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={cn(
                  "w-full px-3 py-2 text-left text-sm flex items-center gap-2",
                  isGlass
                    ? "text-white/80 hover:bg-white/10"
                    : isDark
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => {
                  setShowDetail(true);
                  setShowMenu(false);
                }}
              >
                <Maximize2 className="w-4 h-4" />
                View Details
              </button>
              <button
                className={cn(
                  "w-full px-3 py-2 text-left text-sm flex items-center gap-2",
                  isGlass
                    ? "text-white/80 hover:bg-white/10"
                    : isDark
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                className={cn(
                  "w-full px-3 py-2 text-left text-sm flex items-center gap-2",
                  isGlass
                    ? "text-white/80 hover:bg-white/10"
                    : isDark
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <div
              className={cn(
                "inline-flex p-2.5 rounded-xl mb-3",
                colors.light,
                colors.text
              )}
            >
              {icon}
            </div>

            <p
              className={cn(
                "text-sm font-medium mb-1",
                isGlass
                  ? "text-white/60"
                  : isDark
                    ? "text-gray-400"
                    : "text-gray-500"
              )}
            >
              {title}
            </p>

            <div className="flex items-end gap-3">
              <p
                className={cn(
                  "text-3xl font-bold",
                  isGlass || isDark ? "text-white" : "text-gray-900"
                )}
              >
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>

              {trend && (
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-1",
                    trend.isPositive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {trend.value}%
                  {trend.label && (
                    <span className="opacity-70 ml-0.5">{trend.label}</span>
                  )}
                </div>
              )}
            </div>

            {subtitle && (
              <p
                className={cn(
                  "text-xs mt-2",
                  isGlass
                    ? "text-white/40"
                    : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          {sparkline && sparkline.length > 0 && (
            <svg
              viewBox="0 0 80 30"
              className={cn("w-20 h-8 mt-6", colors.text)}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`sparkline-${color}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={getSparklinePath()}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`${getSparklinePath()} L80,30 L0,30 Z`}
                fill={`url(#sparkline-${color})`}
              />
            </svg>
          )}
        </div>

        {/* Click indicator */}
        <div
          className={cn(
            "absolute bottom-3 right-3 flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity",
            colors.text
          )}
        >
          <span>View details</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </motion.div>

      {/* Detail Modal */}
      {detailContent && (
        <DetailModal
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          title={detailTitle || title}
          subtitle={subtitle}
          icon={icon}
          color={color}
          actions={actions}
        >
          {detailContent}
        </DetailModal>
      )}
    </>
  );
};

// Data Table for Modal Content
interface DataTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  onRowClick?: (index: number) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  headers,
  rows,
  onRowClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr
            className={cn(
              "border-b",
              isGlass
                ? "border-white/10"
                : isDark
                  ? "border-gray-700"
                  : "border-gray-200"
            )}
          >
            {headers.map((header, index) => (
              <th
                key={index}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider",
                  isGlass
                    ? "text-white/60"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              onClick={() => onRowClick?.(rowIndex)}
              className={cn(
                "border-b transition-colors",
                onRowClick && "cursor-pointer",
                isGlass
                  ? "border-white/5 hover:bg-white/5"
                  : isDark
                    ? "border-gray-800 hover:bg-gray-800/50"
                    : "border-gray-100 hover:bg-gray-50"
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-4 py-3 text-sm",
                    isGlass || isDark ? "text-white/80" : "text-gray-700"
                  )}
                >
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Summary Stats Row
interface SummaryStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "p-4 rounded-xl text-center",
            isGlass
              ? "bg-white/5"
              : isDark
                ? "bg-gray-800/50"
                : "bg-gray-50"
          )}
        >
          <p
            className={cn(
              "text-2xl font-bold",
              stat.color || (isGlass || isDark ? "text-white" : "text-gray-900")
            )}
          >
            {stat.value}
          </p>
          <p
            className={cn(
              "text-xs mt-1",
              isGlass ? "text-white/50" : isDark ? "text-gray-500" : "text-gray-400"
            )}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

// Chart placeholder for modal content
interface MiniChartProps {
  type: "bar" | "line" | "pie";
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  type,
  data,
  labels,
  color = "#2E3192",
  height = 120,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const max = Math.max(...data);

  if (type === "bar") {
    return (
      <div className="flex items-end justify-around" style={{ height }}>
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(value / max) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="w-8 rounded-t-lg"
              style={{ backgroundColor: color }}
            />
            {labels && (
              <span
                className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}
              >
                {labels[index]}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default InteractiveStatCard;
