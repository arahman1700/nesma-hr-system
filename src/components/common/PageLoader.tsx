import React from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
  fullScreen = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen ? "min-h-screen" : "min-h-[400px]",
        isGlass
          ? "bg-transparent"
          : isDark
            ? "bg-[var(--theme-bg)]"
            : "bg-gray-50"
      )}
      role="status"
      aria-live="polite"
    >
      {/* NESMA Branded Loader */}
      <div className="relative">
        {/* Outer Ring */}
        <div
          className={cn(
            "w-16 h-16 rounded-full border-4 border-t-transparent animate-spin",
            isDark || isGlass ? "border-[#80D1E9]" : "border-[#2E3192]"
          )}
        />
        {/* Inner Pulse */}
        <div
          className={cn(
            "absolute inset-0 m-auto w-8 h-8 rounded-full animate-pulse",
            isDark || isGlass
              ? "bg-[#80D1E9]/20"
              : "bg-[#2E3192]/20"
          )}
        />
      </div>

      {/* Loading Text */}
      <p
        className={cn(
          "mt-4 text-sm font-medium",
          isDark || isGlass ? "text-gray-400" : "text-gray-600"
        )}
      >
        {message}
      </p>

      {/* Loading Bar */}
      <div
        className={cn(
          "mt-3 w-32 h-1 rounded-full overflow-hidden",
          isDark || isGlass ? "bg-white/10" : "bg-gray-200"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full animate-loading-bar",
            "bg-gradient-to-r from-[#2E3192] via-[#80D1E9] to-[#2E3192]"
          )}
          style={{
            animation: "loading-bar 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 60%; }
          100% { transform: translateX(400%); width: 30%; }
        }
      `}</style>
    </div>
  );
};

// Skeleton loader for page content
export const PageSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const skeletonClass = cn(
    "rounded-xl animate-pulse",
    isGlass
      ? "bg-white/[0.05]"
      : isDark
        ? "bg-white/5"
        : "bg-gray-200"
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className={cn(skeletonClass, "h-8 w-48")} />
        <div className="flex gap-3">
          <div className={cn(skeletonClass, "h-10 w-24")} />
          <div className={cn(skeletonClass, "h-10 w-24")} />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              skeletonClass,
              "h-32 p-4",
              isGlass
                ? "bg-white/[0.03]"
                : isDark
                  ? "bg-[var(--theme-card)]"
                  : "bg-white"
            )}
          >
            <div className="space-y-3">
              <div className={cn(skeletonClass, "h-4 w-20")} />
              <div className={cn(skeletonClass, "h-8 w-16")} />
              <div className={cn(skeletonClass, "h-3 w-24")} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div
        className={cn(
          "rounded-2xl overflow-hidden",
          isGlass
            ? "bg-white/[0.03] border border-white/[0.08]"
            : isDark
              ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
              : "bg-white border border-gray-100"
        )}
      >
        {/* Table Header */}
        <div className="bg-gradient-to-r from-[#2E3192] to-[#0E2841] p-4">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={cn("h-4 bg-white/20 rounded", i === 1 ? "w-32" : "w-24")} />
            ))}
          </div>
        </div>
        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className={cn(
              "p-4 border-b",
              isDark || isGlass ? "border-white/[0.05]" : "border-gray-100"
            )}
          >
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((col) => (
                <div key={col} className={cn(skeletonClass, "h-4", col === 1 ? "w-32" : "w-24")} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageLoader;
