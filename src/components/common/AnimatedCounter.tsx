import React, { useEffect, useState, useRef } from "react";
import { cn } from "../../utils/cn";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  formatValue?: (value: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  formatValue,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateValue();
          }
        });
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, value]);

  const animateValue = () => {
    const start = 0;
    const end = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const formattedValue = formatValue
    ? formatValue(displayValue)
    : displayValue.toFixed(decimals);

  return (
    <span ref={elementRef} className={cn("tabular-nums", className)}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

// Specialized counter for currency
export const CurrencyCounter: React.FC<{
  value: number;
  currency?: string;
  className?: string;
}> = ({ value, currency = "SAR", className }) => {
  return (
    <AnimatedCounter
      value={value}
      className={className}
      formatValue={(val) =>
        new Intl.NumberFormat("en-SA", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(val)
      }
    />
  );
};

// Specialized counter for percentages
export const PercentageCounter: React.FC<{
  value: number;
  decimals?: number;
  className?: string;
}> = ({ value, decimals = 1, className }) => {
  return (
    <AnimatedCounter
      value={value}
      suffix="%"
      decimals={decimals}
      className={className}
    />
  );
};

// Specialized counter for compact numbers (1K, 1M, etc.)
export const CompactCounter: React.FC<{
  value: number;
  className?: string;
}> = ({ value, className }) => {
  return (
    <AnimatedCounter
      value={value}
      className={className}
      formatValue={(val) => {
        if (val >= 1000000) {
          return (val / 1000000).toFixed(1) + "M";
        }
        if (val >= 1000) {
          return (val / 1000).toFixed(1) + "K";
        }
        return val.toFixed(0);
      }}
    />
  );
};

export default AnimatedCounter;
