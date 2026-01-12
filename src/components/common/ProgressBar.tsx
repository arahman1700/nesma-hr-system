import React, { useEffect, useState, useRef } from "react";
import { cn } from "../../utils/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  animated?: boolean;
  striped?: boolean;
  className?: string;
  labelClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  showPercentage = false,
  size = "md",
  color = "primary",
  animated = true,
  striped = false,
  className,
  labelClassName,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (!animated) {
      setDisplayValue(percentage);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateProgress();
          }
        });
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, percentage, animated]);

  const animateProgress = () => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = percentage * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const sizes = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  const colors = {
    primary: "bg-[#2E3192]",
    secondary: "bg-[#80D1E9]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
  };

  const bgColors = {
    primary: "bg-[#2E3192]/20",
    secondary: "bg-[#80D1E9]/20",
    success: "bg-emerald-500/20",
    warning: "bg-amber-500/20",
    danger: "bg-red-500/20",
    info: "bg-blue-500/20",
  };

  return (
    <div ref={elementRef} className={cn("w-full", className)}>
      {(label || showValue || showPercentage) && (
        <div
          className={cn(
            "flex justify-between items-center mb-2",
            labelClassName,
          )}
        >
          {label && (
            <span className="text-sm font-medium text-[var(--theme-text)]">
              {label}
            </span>
          )}
          <span className="text-sm font-semibold text-[var(--theme-text-secondary)]">
            {showValue && `${value}/${max}`}
            {showPercentage && `${Math.round(percentage)}%`}
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full overflow-hidden transition-all duration-300",
          sizes[size],
          bgColors[color],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden",
            colors[color],
            striped && "progress-striped",
            animated && striped && "progress-striped-animated",
          )}
          style={{ width: `${displayValue}%` }}
        >
          {size === "lg" && (
            <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-bold text-white">
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Progress Row component (like MITC dashboard)
interface ProgressRowProps {
  label: string;
  value: number;
  max?: number;
  status?: string;
  statusColor?: "success" | "warning" | "danger" | "info";
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
}

export const ProgressRow: React.FC<ProgressRowProps> = ({
  label,
  value,
  max = 100,
  status,
  statusColor = "success",
  color = "primary",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  // Auto-determine color based on percentage if not specified
  const autoColor =
    percentage >= 80 ? "success" : percentage >= 50 ? "warning" : "danger";

  const finalColor = color || autoColor;

  const statusColors = {
    success: "text-emerald-500",
    warning: "text-amber-500",
    danger: "text-red-500",
    info: "text-blue-500",
  };

  return (
    <div className="flex items-center gap-4 mb-3">
      <span className="w-48 text-sm font-medium text-[var(--theme-text)] flex-shrink-0">
        {label}
      </span>
      <div className="flex-1">
        <ProgressBar value={value} max={max} color={finalColor} size="md" />
      </div>
      {status && (
        <span
          className={cn(
            "w-24 text-xs font-semibold text-right flex-shrink-0",
            statusColors[statusColor],
          )}
        >
          {status}
        </span>
      )}
    </div>
  );
};

// Circular Progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  showValue?: boolean;
  label?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = "primary",
  showValue = true,
  label,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<SVGSVGElement>(null);

  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateProgress();
          }
        });
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, percentage]);

  const animateProgress = () => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = percentage * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const colors = {
    primary: "#2E3192",
    secondary: "#80D1E9",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        ref={elementRef}
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{ width: size, height: size }}
        >
          <span className="text-2xl font-bold text-[var(--theme-text)]">
            {Math.round(displayValue)}%
          </span>
          {label && (
            <span className="text-xs text-[var(--theme-text-muted)]">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
