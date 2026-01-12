import React from "react";
import { Sun, Moon, Building2, Sparkles } from "lucide-react";
import { useTheme, ThemeMode, themeConfig } from "../../contexts/ThemeContext";
import { cn } from "../../utils/cn";

interface ThemeToggleProps {
  variant?: "icon" | "button" | "dropdown";
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "icon",
  size = "md",
  className,
  showLabel = false,
}) => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const getIcon = (mode: ThemeMode) => {
    const iconClass = iconSizes[size];
    switch (mode) {
      case "light":
        return <Sun className={iconClass} />;
      case "dark":
        return <Moon className={iconClass} />;
      case "company":
        return <Building2 className={iconClass} />;
      case "glass":
        return <Sparkles className={iconClass} />;
    }
  };

  const themes: {
    mode: ThemeMode;
    label: string;
    icon: React.ReactNode;
    description?: string;
  }[] = [
    {
      mode: "light",
      label: "Light Mode",
      icon: <Sun className={iconSizes[size]} />,
      description: "Clean and bright",
    },
    {
      mode: "dark",
      label: "Dark Mode",
      icon: <Moon className={iconSizes[size]} />,
      description: "Easy on the eyes",
    },
    {
      mode: "company",
      label: "NESMA Brand",
      icon: <Building2 className={iconSizes[size]} />,
      description: "Official branding",
    },
    {
      mode: "glass",
      label: "Glass Mode",
      icon: <Sparkles className={iconSizes[size]} />,
      description: "Premium glassmorphism",
    },
  ];

  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "rounded-xl flex items-center justify-center transition-all duration-300",
          "bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)]",
          "border border-[var(--theme-border)]",
          "text-[var(--theme-text)]",
          "hover:scale-105 active:scale-95",
          sizes[size],
          className,
        )}
        title={`Current: ${themeConfig[theme].name}. Click to switch.`}
      >
        {getIcon(theme)}
      </button>
    );
  }

  if (variant === "button") {
    return (
      <div
        className={cn(
          "flex items-center gap-1 p-1 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)]",
          className,
        )}
      >
        {themes.map(({ mode, label, icon }) => (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
              "text-sm font-medium",
              theme === mode
                ? "bg-[var(--theme-primary)] text-white"
                : "text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)]",
            )}
            title={label}
          >
            {icon}
            {showLabel && <span>{label}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-xl flex items-center gap-2 px-3 py-2 transition-all duration-300",
          "bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)]",
          "border border-[var(--theme-border)]",
          "text-[var(--theme-text)]",
          "hover:scale-105 active:scale-95",
        )}
      >
        {getIcon(theme)}
        {showLabel && (
          <span className="text-sm font-medium">{themeConfig[theme].name}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "absolute top-full right-0 mt-2 z-50",
              "min-w-[180px] rounded-xl overflow-hidden",
              "bg-[var(--theme-surface)] border border-[var(--theme-border)]",
              "shadow-lg",
              "animate-in fade-in slide-in-from-top-2 duration-200",
            )}
          >
            {themes.map(({ mode, label, icon, description }) => (
              <button
                key={mode}
                onClick={() => {
                  setTheme(mode);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 transition-all duration-200",
                  "text-sm font-medium text-left",
                  theme === mode
                    ? "bg-[var(--theme-primary-light)] text-[var(--theme-primary)]"
                    : "text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)]",
                  mode === "glass" &&
                    theme !== mode &&
                    "hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-cyan-500/10",
                )}
              >
                <span
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    theme === mode
                      ? "bg-[var(--theme-primary)] text-white"
                      : "bg-[var(--theme-surface)]",
                    mode === "glass" &&
                      theme === mode &&
                      "bg-gradient-to-br from-purple-500 to-cyan-500",
                  )}
                >
                  {icon}
                </span>
                <div className="flex-1">
                  <span className="block">{label}</span>
                  {description && (
                    <span
                      className={cn(
                        "text-xs block mt-0.5",
                        theme === mode
                          ? "text-[var(--theme-primary)]/70"
                          : "text-[var(--theme-text-muted)]",
                      )}
                    >
                      {description}
                    </span>
                  )}
                </div>
                {theme === mode && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      mode === "glass"
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                        : "bg-[var(--theme-primary)] text-white",
                    )}
                  >
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
