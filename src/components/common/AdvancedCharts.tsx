import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Maximize2,
  Download,
  Filter,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

// Chart wrapper with header and controls
interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onExpand?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  filters?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  subtitle,
  children,
  onExpand,
  onExport,
  onRefresh,
  filters,
  trend,
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  return (
    <div
      className={cn(
        "p-6 rounded-2xl transition-all duration-300",
        isGlass
          ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
          : isDark
            ? "bg-gray-800/80 border border-gray-700"
            : "bg-white border border-gray-100 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3
              className={cn(
                "text-lg font-semibold",
                isGlass || isDark ? "text-white" : "text-gray-800"
              )}
            >
              {title}
            </h3>
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
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
              </div>
            )}
          </div>
          {subtitle && (
            <p
              className={cn(
                "text-sm mt-1",
                isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {filters}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isGlass
                  ? "hover:bg-white/10 text-white/60"
                  : isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
              )}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isGlass
                  ? "hover:bg-white/10 text-white/60"
                  : isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
              )}
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          {onExpand && (
            <button
              onClick={onExpand}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isGlass
                  ? "hover:bg-white/10 text-white/60"
                  : isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
              )}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chart content */}
      {children}
    </div>
  );
};

// Enhanced Area Chart
interface AreaChartData {
  name: string;
  [key: string]: string | number;
}

interface EnhancedAreaChartProps {
  data: AreaChartData[];
  dataKeys: Array<{
    key: string;
    color: string;
    name?: string;
  }>;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animated?: boolean;
}

export const EnhancedAreaChart: React.FC<EnhancedAreaChartProps> = ({
  data,
  dataKeys,
  height = 300,
  showGrid = true,
  showLegend = true,
  animated = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          {dataKeys.map((dk) => (
            <linearGradient
              key={dk.key}
              id={`gradient-${dk.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={dk.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={dk.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#374151" : "#E5E7EB"}
            vertical={false}
          />
        )}
        <XAxis
          dataKey="name"
          tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
          axisLine={{ stroke: isDark ? "#374151" : "#E5E7EB" }}
        />
        <YAxis
          tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
          axisLine={{ stroke: isDark ? "#374151" : "#E5E7EB" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1F2937" : "#fff",
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            color: isDark ? "#F3F4F6" : "#1F2937",
          }}
        />
        {showLegend && <Legend />}
        {dataKeys.map((dk) => (
          <Area
            key={dk.key}
            type="monotone"
            dataKey={dk.key}
            name={dk.name || dk.key}
            stroke={dk.color}
            strokeWidth={2}
            fill={`url(#gradient-${dk.key})`}
            isAnimationActive={animated}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Enhanced Donut/Pie Chart
interface DonutChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for recharts compatibility
}

interface EnhancedDonutChartProps {
  data: DonutChartData[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLabel?: boolean;
  showLegend?: boolean;
  centerContent?: React.ReactNode;
}

export const EnhancedDonutChart: React.FC<EnhancedDonutChartProps> = ({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  showLabel = false,
  showLegend = true,
  centerContent,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                style={{
                  transform:
                    activeIndex === index ? "scale(1.05)" : "scale(1)",
                  transformOrigin: "center",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const numValue = typeof value === 'number' ? value : 0;
              return [`${numValue} (${((numValue / total) * 100).toFixed(1)}%)`, ""];
            }}
            contentStyle={{
              backgroundColor: isDark ? "#1F2937" : "#fff",
              border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
              borderRadius: "8px",
              color: isDark ? "#F3F4F6" : "#1F2937",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      {centerContent && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {centerContent}
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 cursor-pointer transition-opacity",
                activeIndex !== null && activeIndex !== index && "opacity-50"
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span
                className={cn(
                  "text-sm",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}
              >
                {item.name}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Bar Chart
interface BarChartData {
  name: string;
  [key: string]: string | number;
}

interface EnhancedBarChartProps {
  data: BarChartData[];
  dataKeys: Array<{
    key: string;
    color: string;
    name?: string;
  }>;
  height?: number;
  layout?: "horizontal" | "vertical";
  stacked?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const EnhancedBarChart: React.FC<EnhancedBarChartProps> = ({
  data,
  dataKeys,
  height = 300,
  layout = "horizontal",
  stacked = false,
  showGrid = true,
  showLegend = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={layout === "vertical" ? "vertical" : "horizontal"}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#374151" : "#E5E7EB"}
            vertical={layout !== "vertical"}
            horizontal={layout === "vertical"}
          />
        )}
        {layout === "vertical" ? (
          <>
            <XAxis type="number" tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }} width={80} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }} />
            <YAxis tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }} />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1F2937" : "#fff",
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            color: isDark ? "#F3F4F6" : "#1F2937",
          }}
        />
        {showLegend && <Legend />}
        {dataKeys.map((dk) => (
          <Bar
            key={dk.key}
            dataKey={dk.key}
            name={dk.name || dk.key}
            fill={dk.color}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// Progress Ring Chart
interface ProgressRingProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 10,
  color = "#2E3192",
  backgroundColor,
  label,
  showPercentage = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / maxValue) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={
            backgroundColor ||
            (isGlass ? "rgba(255,255,255,0.1)" : isDark ? "#374151" : "#E5E7EB")
          }
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span
            className={cn(
              "text-2xl font-bold",
              isGlass || isDark ? "text-white" : "text-gray-900"
            )}
          >
            {Math.round(percentage)}%
          </span>
        )}
        {label && (
          <span
            className={cn(
              "text-xs mt-1",
              isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
            )}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

// Multiple Progress Rings
interface MultiProgressRingProps {
  data: Array<{
    value: number;
    maxValue?: number;
    color: string;
    label: string;
  }>;
  size?: number;
}

export const MultiProgressRing: React.FC<MultiProgressRingProps> = ({
  data,
  size = 150,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const strokeWidth = 12;
  const gap = 5;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} className="-rotate-90">
        {data.map((item, index) => {
          const radius = (size - strokeWidth) / 2 - (strokeWidth + gap) * index;
          const circumference = radius * 2 * Math.PI;
          const percentage = (item.value / (item.maxValue || 100)) * 100;
          const offset = circumference - (percentage / 100) * circumference;

          return (
            <g key={index}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={
                  isGlass
                    ? "rgba(255,255,255,0.1)"
                    : isDark
                      ? "#374151"
                      : "#E5E7EB"
                }
                strokeWidth={strokeWidth}
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                style={{
                  strokeDasharray: circumference,
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span
              className={cn(
                "text-sm",
                isGlass ? "text-white/80" : isDark ? "text-gray-300" : "text-gray-600"
              )}
            >
              {item.label}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stat Comparison Card
interface StatComparisonProps {
  current: {
    label: string;
    value: number;
  };
  previous: {
    label: string;
    value: number;
  };
  format?: (value: number) => string;
  color?: string;
}

export const StatComparison: React.FC<StatComparisonProps> = ({
  current,
  previous,
  format = (v) => v.toLocaleString(),
  color = "#2E3192",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const change = current.value - previous.value;
  const changePercent =
    previous.value !== 0
      ? ((change / previous.value) * 100).toFixed(1)
      : "N/A";
  const isPositive = change >= 0;

  return (
    <div
      className={cn(
        "p-4 rounded-xl",
        isGlass
          ? "bg-white/5"
          : isDark
            ? "bg-gray-800/50"
            : "bg-gray-50"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p
            className={cn(
              "text-sm",
              isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
            )}
          >
            {current.label}
          </p>
          <p
            className={cn(
              "text-3xl font-bold",
              isGlass || isDark ? "text-white" : "text-gray-900"
            )}
          >
            {format(current.value)}
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
            isPositive
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-rose-500/10 text-rose-500"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {changePercent}%
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-2 pt-3 border-t",
          isGlass
            ? "border-white/10"
            : isDark
              ? "border-gray-700"
              : "border-gray-200"
        )}
      >
        <span
          className={cn(
            "text-sm",
            isGlass ? "text-white/50" : isDark ? "text-gray-500" : "text-gray-400"
          )}
        >
          {previous.label}:
        </span>
        <span
          className={cn(
            "text-sm font-medium",
            isGlass ? "text-white/80" : isDark ? "text-gray-300" : "text-gray-600"
          )}
        >
          {format(previous.value)}
        </span>
        <span
          className={cn(
            "text-sm",
            isPositive ? "text-emerald-500" : "text-rose-500"
          )}
        >
          ({isPositive ? "+" : ""}
          {format(change)})
        </span>
      </div>
    </div>
  );
};

// Timeline/Activity Chart
interface TimelineData {
  time: string;
  event: string;
  value?: number;
  type?: "success" | "warning" | "error" | "info";
}

interface TimelineChartProps {
  data: TimelineData[];
  maxItems?: number;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  maxItems = 5,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const typeColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
    info: "bg-blue-500",
  };

  return (
    <div className="space-y-4">
      {data.slice(0, maxItems).map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                typeColors[item.type || "info"]
              )}
            />
            {index < data.slice(0, maxItems).length - 1 && (
              <div
                className={cn(
                  "w-0.5 h-full mt-1",
                  isGlass
                    ? "bg-white/20"
                    : isDark
                      ? "bg-gray-700"
                      : "bg-gray-200"
                )}
              />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p
              className={cn(
                "text-sm font-medium",
                isGlass || isDark ? "text-white" : "text-gray-800"
              )}
            >
              {item.event}
            </p>
            <p
              className={cn(
                "text-xs mt-1",
                isGlass ? "text-white/50" : isDark ? "text-gray-500" : "text-gray-400"
              )}
            >
              {item.time}
            </p>
          </div>
          {item.value !== undefined && (
            <span
              className={cn(
                "text-sm font-medium",
                isGlass || isDark ? "text-white/80" : "text-gray-700"
              )}
            >
              {item.value}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// All components are exported at their declarations above
