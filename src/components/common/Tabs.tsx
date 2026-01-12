import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  color?: string; // Optional gradient color
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "underline" | "separated" | "glass" | "modern" | "gradient";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5",
  lg: "px-6 py-3 text-lg",
};

const iconSizeStyles = {
  sm: "[&>svg]:w-4 [&>svg]:h-4",
  md: "[&>svg]:w-5 [&>svg]:h-5",
  lg: "[&>svg]:w-6 [&>svg]:h-6",
};

// Gradient colors for tabs
const gradientColors = [
  { from: "#2E3192", to: "#5B4CCC" },    // Primary blue-purple
  { from: "#10B981", to: "#34D399" },    // Emerald
  { from: "#8B5CF6", to: "#A78BFA" },    // Violet
  { from: "#F59E0B", to: "#FBBF24" },    // Amber
  { from: "#EF4444", to: "#F87171" },    // Red
  { from: "#06B6D4", to: "#22D3EE" },    // Cyan
];

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = "default",
  size = "md",
  fullWidth = false,
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id,
  );
  const activeTab = controlledActiveTab ?? internalActiveTab;
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleTabClick = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  // Modern gradient variant with animated indicator
  if (variant === "modern" || variant === "gradient") {
    return (
      <div
        className={cn(
          "relative inline-flex items-center gap-1 p-1.5 rounded-2xl",
          isGlass
            ? "bg-white/5 backdrop-blur-2xl border border-white/10"
            : isDark
              ? "bg-gray-800/80 border border-gray-700/50"
              : "bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200/50 shadow-sm",
          fullWidth && "w-full",
          className,
        )}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;
          const colorIndex = index % gradientColors.length;
          const gradient = gradientColors[colorIndex];

          return (
            <motion.button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              disabled={tab.disabled}
              className={cn(
                "relative flex items-center gap-2.5 font-medium transition-all duration-300 rounded-xl overflow-hidden",
                sizeStyles[size],
                iconSizeStyles[size],
                fullWidth && "flex-1 justify-center",
                tab.disabled && "opacity-50 cursor-not-allowed",
                !isActive && !tab.disabled && "cursor-pointer",
              )}
              whileHover={{ scale: tab.disabled ? 1 : 1.02 }}
              whileTap={{ scale: tab.disabled ? 1 : 0.98 }}
            >
              {/* Active background with gradient */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                  }}
                  initial={false}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                />
              )}

              {/* Hover effect for inactive tabs */}
              {!isActive && isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "absolute inset-0 rounded-xl",
                    isGlass || isDark ? "bg-white/10" : "bg-gray-200/50",
                  )}
                />
              )}

              {/* Shine effect on active */}
              {isActive && (
                <div
                  className="absolute inset-0 overflow-hidden rounded-xl"
                  style={{ opacity: isHovered ? 1 : 0 }}
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
                </div>
              )}

              {/* Icon */}
              {tab.icon && (
                <span
                  className={cn(
                    "relative z-10 flex items-center justify-center transition-all duration-300",
                    isActive ? "text-white" : isGlass || isDark ? "text-white/60" : "text-gray-500",
                    isActive && "drop-shadow-sm",
                  )}
                >
                  {tab.icon}
                </span>
              )}

              {/* Label */}
              <span
                className={cn(
                  "relative z-10 whitespace-nowrap transition-colors duration-300",
                  isActive
                    ? "text-white font-semibold"
                    : isGlass || isDark
                      ? "text-white/70 hover:text-white"
                      : "text-gray-600 hover:text-gray-900",
                )}
              >
                {tab.label}
              </span>

              {/* Badge */}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "relative z-10 min-w-[20px] h-5 px-1.5 flex items-center justify-center",
                    "text-[10px] font-bold rounded-full transition-all duration-300",
                    isActive
                      ? "bg-white/25 text-white"
                      : isGlass || isDark
                        ? "bg-white/10 text-white/60"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}

        {/* Glow effect for container */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none",
            hoveredTab && "opacity-100",
          )}
          style={{
            background: hoveredTab
              ? `radial-gradient(circle at 50% 100%, ${gradientColors[tabs.findIndex(t => t.id === hoveredTab) % gradientColors.length]?.from}20, transparent 70%)`
              : "transparent",
          }}
        />
      </div>
    );
  }

  // نمط "separated" الجديد - أيقونات منفصلة وجميلة
  if (variant === "separated" || variant === "glass") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 p-1.5 rounded-2xl",
          isGlass
            ? "bg-white/5 backdrop-blur-xl border border-white/10"
            : isDark
              ? "bg-gray-800/50 border border-gray-700/50"
              : "bg-gray-100/80 backdrop-blur-xl border border-gray-200/50",
          fullWidth && "w-full",
          className,
        )}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const colorIndex = index % gradientColors.length;
          const gradient = gradientColors[colorIndex];

          return (
            <motion.button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "relative flex items-center gap-2.5 font-medium transition-all duration-300 rounded-xl overflow-hidden",
                sizeStyles[size],
                iconSizeStyles[size],
                fullWidth && "flex-1 justify-center",
                tab.disabled && "opacity-50 cursor-not-allowed",
              )}
              whileHover={{ scale: tab.disabled ? 1 : 1.02 }}
              whileTap={{ scale: tab.disabled ? 1 : 0.98 }}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={cn(
                    "absolute inset-0 rounded-xl shadow-lg",
                    isGlass
                      ? "bg-white/20 backdrop-blur-xl"
                      : isDark
                        ? "bg-[#80D1E9]"
                        : "bg-white shadow-md",
                  )}
                  initial={false}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              )}

              {/* Icon */}
              {tab.icon && (
                <span
                  className={cn(
                    "relative z-10 flex items-center justify-center transition-transform duration-300",
                    isActive && "scale-110",
                    isActive
                      ? isGlass
                        ? "text-white"
                        : isDark
                          ? "text-[#0E2841]"
                          : "text-[#2E3192]"
                      : isGlass || isDark
                        ? "text-white/60"
                        : "text-gray-500",
                  )}
                >
                  {tab.icon}
                </span>
              )}

              {/* Label */}
              <span
                className={cn(
                  "relative z-10 whitespace-nowrap",
                  isActive
                    ? isGlass
                      ? "text-white font-semibold"
                      : isDark
                        ? "text-[#0E2841] font-semibold"
                        : "text-[#2E3192] font-semibold"
                    : isGlass || isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900",
                )}
              >
                {tab.label}
              </span>

              {/* Badge */}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "relative z-10 min-w-[20px] h-5 px-1.5 flex items-center justify-center",
                    "text-[10px] font-bold rounded-full",
                    isActive
                      ? isGlass
                        ? "bg-white/20 text-white"
                        : isDark
                          ? "bg-[#0E2841]/20 text-[#0E2841]"
                          : "bg-[#2E3192]/20 text-[#2E3192]"
                      : isGlass || isDark
                        ? "bg-white/10 text-gray-400"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  // الأنماط التقليدية
  const getStyles = () => {
    switch (variant) {
      case "pills":
        return {
          container: cn(
            "p-1 rounded-xl",
            isGlass ? "bg-white/5 backdrop-blur-xl" : isDark ? "bg-gray-800/50" : "bg-gray-100",
          ),
          tab: "rounded-lg",
          active: cn(
            "shadow-sm",
            isGlass
              ? "bg-white/20 text-white"
              : isDark
                ? "bg-[#80D1E9] text-[#0E2841]"
                : "bg-white text-gray-900",
          ),
          inactive: cn(
            isGlass || isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-700",
          ),
        };
      case "underline":
        return {
          container: "",
          tab: "border-b-2 border-transparent -mb-px",
          active: cn(
            isGlass
              ? "border-white/50 text-white"
              : isDark
                ? "border-[#80D1E9] text-[#80D1E9]"
                : "border-[#2E3192] text-[#2E3192]",
          ),
          inactive: cn(
            isGlass || isDark
              ? "text-gray-400 hover:text-white hover:border-gray-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300",
          ),
        };
      default:
        return {
          container: cn(
            "border-b",
            isGlass ? "border-white/10" : isDark ? "border-gray-700" : "border-gray-200",
          ),
          tab: "border-b-2 border-transparent -mb-px",
          active: cn(
            isGlass
              ? "border-white/50 text-white"
              : isDark
                ? "border-[#80D1E9] text-[#80D1E9]"
                : "border-[#2E3192] text-[#2E3192]",
          ),
          inactive: cn(
            isGlass || isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-700",
          ),
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={cn(styles.container, fullWidth && "w-full", className)}>
      <nav className={cn("flex", fullWidth && "w-full")} aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "flex items-center gap-2 font-medium transition-all duration-200",
                sizeStyles[size],
                iconSizeStyles[size],
                styles.tab,
                isActive ? styles.active : styles.inactive,
                fullWidth && "flex-1 justify-center",
                tab.disabled && "opacity-50 cursor-not-allowed",
              )}
              whileHover={{ scale: tab.disabled ? 1 : 1.02 }}
              whileTap={{ scale: tab.disabled ? 1 : 0.98 }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs font-semibold rounded-full",
                    isActive
                      ? isGlass
                        ? "bg-white/20 text-white"
                        : isDark
                          ? "bg-[#80D1E9]/20 text-[#80D1E9]"
                          : "bg-[#2E3192]/10 text-[#2E3192]"
                      : isGlass || isDark
                        ? "bg-white/10 text-gray-400"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

interface TabPanelProps {
  children: React.ReactNode;
  id: string;
  activeTab: string;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  id,
  activeTab,
  className,
}) => {
  if (id !== activeTab) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Tabs;
