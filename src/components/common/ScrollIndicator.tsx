import React, { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

interface ScrollIndicatorProps {
  className?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  className,
  color,
  height = 3,
  showPercentage = false,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 z-[100] transition-all duration-100",
          className,
        )}
        style={{
          width: `${scrollProgress}%`,
          height: `${height}px`,
          background:
            color ||
            "linear-gradient(90deg, #80D1E9 0%, #2E3192 50%, #10B981 100%)",
        }}
      />
      {showPercentage && scrollProgress > 0 && (
        <div
          className="fixed top-4 right-4 z-[100] px-3 py-1 rounded-full text-xs font-semibold
                     bg-[var(--theme-surface)] text-[var(--theme-text)]
                     shadow-lg border border-[var(--theme-border)]
                     transition-opacity duration-300"
          style={{ opacity: scrollProgress > 5 ? 1 : 0 }}
        >
          {Math.round(scrollProgress)}%
        </div>
      )}
    </>
  );
};

export default ScrollIndicator;
