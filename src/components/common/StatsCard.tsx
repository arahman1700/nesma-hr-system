import React, { useState } from "react";
import { cn } from "../../utils/cn";
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  FileText,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BORDER_RADIUS,
  SPACING,
  SHADOWS,
  ICON_ONLY_SIZES,
} from "../../utils/designTokens";

// ============================================
// UNIFIED DESIGN SYSTEM TOKENS (Re-exported for backward compatibility)
// ============================================
export const DESIGN_TOKENS = {
  borderRadius: BORDER_RADIUS,
  spacing: {
    card: SPACING.card.lg,
    cardLg: "p-7",
    icon: SPACING.padding.sm,
    iconSm: "p-2.5",
    iconLg: SPACING.padding.md,
    gap: SPACING.gap.lg,
    gapLg: SPACING.gap.xl,
  },
  shadow: {
    sm: SHADOWS.sm,
    md: SHADOWS.md,
    lg: SHADOWS.lg,
    glow: SHADOWS.glow,
  },
  iconSize: {
    sm: ICON_ONLY_SIZES.sm,
    md: ICON_ONLY_SIZES.md,
    lg: ICON_ONLY_SIZES.lg,
    xl: "w-8 h-8",
  },
};

// Color palette with gradients
const colorPalette = {
  primary: {
    bg: "bg-[#2E3192]/10",
    bgDark: "bg-[#2E3192]/20",
    text: "text-[#2E3192]",
    textDark: "text-[#80D1E9]",
    border: "border-[#2E3192]",
    gradient: { from: "#2E3192", to: "#0E2841" },
    glow: "rgba(46, 49, 146, 0.4)",
  },
  success: {
    bg: "bg-emerald-50",
    bgDark: "bg-emerald-500/20",
    text: "text-emerald-600",
    textDark: "text-emerald-400",
    border: "border-emerald-500",
    gradient: { from: "#10B981", to: "#059669" },
    glow: "rgba(16, 185, 129, 0.4)",
  },
  warning: {
    bg: "bg-amber-50",
    bgDark: "bg-amber-500/20",
    text: "text-amber-600",
    textDark: "text-amber-400",
    border: "border-amber-500",
    gradient: { from: "#F59E0B", to: "#D97706" },
    glow: "rgba(245, 158, 11, 0.4)",
  },
  danger: {
    bg: "bg-rose-50",
    bgDark: "bg-rose-500/20",
    text: "text-rose-600",
    textDark: "text-rose-400",
    border: "border-rose-500",
    gradient: { from: "#EF4444", to: "#DC2626" },
    glow: "rgba(239, 68, 68, 0.4)",
  },
  info: {
    bg: "bg-sky-50",
    bgDark: "bg-sky-500/20",
    text: "text-sky-600",
    textDark: "text-sky-400",
    border: "border-sky-500",
    gradient: { from: "#3B82F6", to: "#2563EB" },
    glow: "rgba(59, 130, 246, 0.4)",
  },
  purple: {
    bg: "bg-purple-50",
    bgDark: "bg-purple-500/20",
    text: "text-purple-600",
    textDark: "text-purple-400",
    border: "border-purple-500",
    gradient: { from: "#A855F7", to: "#7C3AED" },
    glow: "rgba(168, 85, 247, 0.4)",
  },
  cyan: {
    bg: "bg-cyan-50",
    bgDark: "bg-cyan-500/20",
    text: "text-cyan-600",
    textDark: "text-cyan-400",
    border: "border-cyan-500",
    gradient: { from: "#06B6D4", to: "#0891B2" },
    glow: "rgba(6, 182, 212, 0.4)",
  },
};

export interface DetailData {
  headers: string[];
  rows: (string | number)[][];
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: keyof typeof colorPalette;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
  detailData?: DetailData;
  className?: string;
  variant?: "default" | "gradient" | "glass" | "neon";
  animated?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = "primary",
  trend,
  subtitle,
  badge,
  onClick,
  detailData,
  className,
  variant = "default",
  animated = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const colors = colorPalette[color];

  const exportToExcel = async () => {
    if (!detailData) return;
    setIsExporting(true);
    try {
      const ws = XLSX.utils.aoa_to_sheet([
        detailData.headers,
        ...detailData.rows,
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, title);
      XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, "_")}.xlsx`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!detailData) return;
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.setTextColor(46, 49, 146);
      doc.text(title, 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Total: ${value}`, 14, 28);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 34);

      autoTable(doc, {
        head: [detailData.headers],
        body: detailData.rows.map((row) => row.map((cell) => String(cell))),
        startY: 42,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [46, 49, 146], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  // Get variant styles
  const getVariantStyles = () => {
    if (isGlass) {
      return cn(
        "bg-white/[0.04] backdrop-blur-2xl",
        "border border-white/[0.1]",
        "border-l-4",
        colors.border,
        "hover:bg-white/[0.08]",
        "hover:border-white/[0.18]",
      );
    }

    switch (variant) {
      case "gradient":
        return cn("text-white border-0", "bg-gradient-to-br");
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
          "border-l-4 border",
          colors.border,
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-100",
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
    <>
      <div
        className={cn(
          // Base styles
          "relative overflow-hidden transition-all duration-300",
          DESIGN_TOKENS.borderRadius.lg,
          DESIGN_TOKENS.spacing.card,
          DESIGN_TOKENS.shadow.sm,
          // Variant styles
          getVariantStyles(),
          // Hover effects
          "hover:shadow-lg hover:-translate-y-1",
          isDark && "hover:border-[#80D1E9]/30",
          // Clickable
          (onClick || detailData) && "cursor-pointer",
          className,
        )}
        onClick={detailData ? () => setShowDetail(true) : onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={
          isHovered && variant === "neon"
            ? { boxShadow: `0 0 30px ${colors.glow}` }
            : variant === "gradient"
              ? {
                  background: `linear-gradient(135deg, ${colors.gradient.from} 0%, ${colors.gradient.to} 100%)`,
                }
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
            background:
              isDark || isGlass
                ? `radial-gradient(circle at top right, ${colors.glow.replace("0.4", "0.1")} 0%, transparent 60%)`
                : `radial-gradient(circle at top right, ${colors.glow.replace("0.4", "0.05")} 0%, transparent 60%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header row - Icon and Badge */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                "flex items-center justify-center transition-all duration-300 overflow-hidden",
                "w-12 h-12",
                DESIGN_TOKENS.borderRadius.md,
                variant === "gradient"
                  ? "bg-white/20 text-white"
                  : isDark || isGlass
                    ? colors.bgDark
                    : colors.bg,
                variant !== "gradient" &&
                  (isDark || isGlass ? colors.textDark : colors.text),
                "[&>svg]:w-5 [&>svg]:h-5",
                // Animation on hover
                animated && isHovered && "scale-110 rotate-3",
                animated && "icon-animate-pulse",
              )}
              style={
                variant === "gradient"
                  ? undefined
                  : isHovered
                    ? { boxShadow: `0 0 20px ${colors.glow}` }
                    : undefined
              }
            >
              {icon}
            </div>

            <div className="flex items-center gap-2">
              {badge && (
                <span
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-full transition-all",
                    variant === "gradient"
                      ? "bg-white/20 text-white"
                      : isDark || isGlass
                        ? "bg-[#80D1E9]/20 text-[#80D1E9]"
                        : "bg-[#2E3192]/10 text-[#2E3192]",
                    isHovered && "scale-105",
                  )}
                >
                  {badge}
                </span>
              )}
              {detailData && (
                <button
                  className={cn(
                    "p-1.5 rounded-xl transition-all",
                    variant === "gradient"
                      ? "hover:bg-white/20 text-white/70 hover:text-white"
                      : isDark || isGlass
                        ? "hover:bg-white/10 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-400 hover:text-gray-600",
                    isHovered && "scale-110",
                  )}
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Title and Value */}
          <div className="space-y-2">
            <p
              className={cn(
                "text-sm font-medium",
                variant === "gradient"
                  ? "text-white/80"
                  : isGlass
                    ? "text-white/70"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-500",
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                "text-3xl font-bold tracking-tight transition-all",
                variant === "gradient"
                  ? "text-white"
                  : isGlass
                    ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    : isDark
                      ? "text-white"
                      : colors.text,
                isHovered && "scale-[1.02]",
              )}
            >
              {value}
            </p>
            {subtitle && (
              <p
                className={cn(
                  "text-xs",
                  variant === "gradient"
                    ? "text-white/60"
                    : isGlass
                      ? "text-white/60"
                      : isDark
                        ? "text-gray-500"
                        : "text-gray-400",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Trend indicator */}
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all",
                  trend.isPositive
                    ? variant === "gradient"
                      ? "bg-white/20 text-white"
                      : isDark || isGlass
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-50 text-emerald-600"
                    : trend.value === 0
                      ? variant === "gradient"
                        ? "bg-white/10 text-white/70"
                        : isDark || isGlass
                          ? "bg-gray-500/20 text-gray-400"
                          : "bg-gray-100 text-gray-500"
                      : variant === "gradient"
                        ? "bg-white/20 text-white"
                        : isDark || isGlass
                          ? "bg-rose-500/20 text-rose-400"
                          : "bg-rose-50 text-rose-600",
                  isHovered && "scale-105",
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : trend.value !== 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : null}
                <span>
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
              </div>
              <span
                className={cn(
                  "text-xs",
                  variant === "gradient"
                    ? "text-white/50"
                    : isDark || isGlass
                      ? "text-gray-500"
                      : "text-gray-400",
                )}
              >
                {trend.label || "vs last month"}
              </span>
            </div>
          )}

          {/* Click indicator */}
          {(onClick || detailData) && (
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
                  variant === "gradient"
                    ? "text-white/50"
                    : isDark || isGlass
                      ? "text-gray-500"
                      : "text-gray-400",
                )}
              />
            </div>
          )}
        </div>

        {/* Sparkle effect for neon variant */}
        {variant === "neon" && isHovered && (
          <Sparkles
            className={cn(
              "absolute top-3 right-3 w-4 h-4 opacity-60 animate-pulse",
              isDark ? colors.textDark : colors.text,
            )}
          />
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && detailData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowDetail(false)}
        >
          <div
            className={cn(
              "w-full max-w-4xl max-h-[80vh] overflow-hidden",
              DESIGN_TOKENS.borderRadius.xl,
              isGlass
                ? "bg-white/[0.05] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
                  : "bg-white",
              DESIGN_TOKENS.shadow.lg,
              "animate-scaleIn",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={cn(
                "flex items-center justify-between px-6 py-4 border-b",
                isDark || isGlass ? "border-white/10" : "border-gray-100",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-xl [&>svg]:w-5 [&>svg]:h-5",
                    isDark || isGlass ? colors.bgDark : colors.bg,
                    isDark || isGlass ? colors.textDark : colors.text,
                  )}
                >
                  {icon}
                </div>
                <div>
                  <h3
                    className={cn(
                      "text-lg font-semibold",
                      isDark || isGlass ? "text-white" : "text-gray-800",
                    )}
                  >
                    {title}
                  </h3>
                  <p
                    className={cn(
                      "text-sm",
                      isDark || isGlass ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    Total: {value}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Export buttons */}
                <button
                  onClick={exportToExcel}
                  disabled={isExporting}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                    isDark || isGlass
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:scale-105"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105",
                  )}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4" />
                  )}
                  Excel
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                    isDark || isGlass
                      ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:scale-105"
                      : "bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-105",
                  )}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  PDF
                </button>
                <button
                  onClick={() => setShowDetail(false)}
                  className={cn(
                    "p-2 rounded-xl transition-all hover:scale-110",
                    isDark || isGlass
                      ? "hover:bg-white/10 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500",
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Table */}
            <div className="overflow-auto max-h-[60vh] p-4">
              <div
                className={cn(
                  "rounded-2xl overflow-hidden border",
                  isDark || isGlass ? "border-white/10" : "border-gray-100",
                )}
              >
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#2E3192] to-[#0E2841]">
                      {detailData.headers.map((header, idx) => (
                        <th
                          key={idx}
                          className={cn(
                            "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white",
                            idx === 0 && "rounded-tl-xl",
                            idx === detailData.headers.length - 1 &&
                              "rounded-tr-xl",
                          )}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody
                    className={cn(
                      "divide-y",
                      isDark || isGlass ? "divide-white/5" : "divide-gray-100",
                    )}
                  >
                    {detailData.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className={cn(
                          "transition-colors",
                          isDark || isGlass
                            ? "hover:bg-white/5"
                            : "hover:bg-gray-50",
                          rowIdx === detailData.rows.length - 1 &&
                            "rounded-b-xl",
                        )}
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={cn(
                              "px-4 py-3 text-sm",
                              isDark || isGlass
                                ? "text-gray-300"
                                : "text-gray-700",
                              rowIdx === detailData.rows.length - 1 &&
                                cellIdx === 0 &&
                                "rounded-bl-xl",
                              rowIdx === detailData.rows.length - 1 &&
                                cellIdx === row.length - 1 &&
                                "rounded-br-xl",
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================
// MINI STAT - Compact Stats for Sidebars
// ============================================
export interface MiniStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: keyof typeof colorPalette;
  trend?: "up" | "down" | "neutral";
}

export const MiniStat: React.FC<MiniStatProps> = ({
  label,
  value,
  icon,
  color = "primary",
  trend,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";
  const colors = colorPalette[color];

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 transition-all",
        DESIGN_TOKENS.borderRadius.md,
        isGlass
          ? "bg-white/[0.03] border border-white/[0.08]"
          : isDark
            ? "bg-white/5 border border-white/10"
            : "bg-gray-50 border border-gray-100",
        "hover:scale-[1.02]",
      )}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div
            className={cn(
              "p-1.5 rounded-lg [&>svg]:w-4 [&>svg]:h-4",
              isDark || isGlass ? colors.bgDark : colors.bg,
              isDark || isGlass ? colors.textDark : colors.text,
            )}
          >
            {icon}
          </div>
        )}
        <span
          className={cn(
            "text-sm",
            isDark || isGlass ? "text-gray-400" : "text-gray-600",
          )}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "text-lg font-bold",
            isDark || isGlass ? "text-white" : colors.text,
          )}
        >
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs",
              trend === "up" && "text-emerald-500",
              trend === "down" && "text-rose-500",
              trend === "neutral" && "text-gray-400",
            )}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "→"}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================
// STAT GRID - Grid Layout for Multiple Stats
// ============================================
interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const StatGrid: React.FC<StatGridProps> = ({
  children,
  columns = 4,
  className,
}) => {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
};

export default StatsCard;
