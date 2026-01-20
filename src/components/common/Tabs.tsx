import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";
import { ICON_CHILD_SIZES } from "../../utils/designTokens";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "underline" | "separated" | "glass";
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
  sm: ICON_CHILD_SIZES.sm,
  md: ICON_CHILD_SIZES.md,
  lg: ICON_CHILD_SIZES.lg,
};

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

  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id,
  );
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  // نمط "separated" الجديد - أيقونات منفصلة وجميلة
  if (variant === "separated" || variant === "glass") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 p-1.5 rounded-2xl",
          isDark
            ? "bg-white/5 backdrop-blur-xl border border-white/10"
            : "bg-gray-100/80 backdrop-blur-xl border border-gray-200/50",
          fullWidth && "w-full",
          className,
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "relative flex items-center gap-2.5 font-medium transition-all duration-300 rounded-xl",
                sizeStyles[size],
                iconSizeStyles[size],
                fullWidth && "flex-1 justify-center",
                tab.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? cn(
                      "shadow-lg",
                      isDark
                        ? "bg-[#80D1E9] text-[#0E2841]"
                        : "bg-white text-[#2E3192] shadow-md",
                    )
                  : cn(
                      isDark
                        ? "text-gray-400 hover:text-white hover:bg-white/10"
                        : "text-gray-500 hover:text-gray-900 hover:bg-white/50",
                    ),
              )}
            >
              {tab.icon && (
                <span
                  className={cn(
                    "flex items-center justify-center transition-transform duration-300",
                    isActive && "scale-110",
                  )}
                >
                  {tab.icon}
                </span>
              )}
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "min-w-[20px] h-5 px-1.5 flex items-center justify-center",
                    "text-[10px] font-bold rounded-full",
                    isActive
                      ? isDark
                        ? "bg-[#0E2841]/20 text-[#0E2841]"
                        : "bg-[#2E3192]/20 text-[#2E3192]"
                      : isDark
                        ? "bg-white/10 text-gray-400"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
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
            isDark ? "bg-white/5" : "bg-gray-100",
          ),
          tab: "rounded-lg",
          active: cn(
            "shadow-sm",
            isDark ? "bg-[#80D1E9] text-[#0E2841]" : "bg-white text-gray-900",
          ),
          inactive: cn(
            isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-700",
          ),
        };
      case "underline":
        return {
          container: "",
          tab: "border-b-2 border-transparent -mb-px",
          active: cn(
            isDark
              ? "border-[#80D1E9] text-[#80D1E9]"
              : "border-[#2E3192] text-[#2E3192]",
          ),
          inactive: cn(
            isDark
              ? "text-gray-400 hover:text-white hover:border-gray-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300",
          ),
        };
      default:
        return {
          container: cn(
            "border-b",
            isDark ? "border-white/10" : "border-gray-200",
          ),
          tab: "border-b-2 border-transparent -mb-px",
          active: cn(
            isDark
              ? "border-[#80D1E9] text-[#80D1E9]"
              : "border-[#2E3192] text-[#2E3192]",
          ),
          inactive: cn(
            isDark
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
            <button
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
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs font-semibold rounded-full",
                    isActive
                      ? isDark
                        ? "bg-[#80D1E9]/20 text-[#80D1E9]"
                        : "bg-[#2E3192]/10 text-[#2E3192]"
                      : isDark
                        ? "bg-white/10 text-gray-400"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
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
    <div className={cn("animate-fadeIn", className)}>
      {children}
    </div>
  );
};

export default Tabs;
