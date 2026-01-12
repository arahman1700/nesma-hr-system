import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Theme types - Added Glass Mode
export type ThemeMode = "light" | "dark" | "company" | "glass";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isCompany: boolean;
  isGlass: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme configurations with Glass Mode
export const themeConfig = {
  light: {
    name: "Light Mode",
    icon: "Sun",
    background: "#F9FAFB",
    backgroundGradient: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
    surface: "#FFFFFF",
    surfaceHover: "#F3F4F6",
    border: "#E5E7EB",
    text: "#1F2937",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    primary: "#2E3192",
    primaryLight: "rgba(46, 49, 146, 0.1)",
    secondary: "#80D1E9",
    secondaryLight: "rgba(128, 209, 233, 0.2)",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    sidebar: "#FFFFFF",
    sidebarText: "#374151",
    sidebarHover: "#F3F4F6",
    header: "linear-gradient(135deg, #2E3192 0%, #203366 50%, #0E2841 100%)",
    headerText: "#FFFFFF",
    card: "#FFFFFF",
    cardBorder: "#E5E7EB",
    shadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    shadowHover: "0 10px 25px rgba(0, 0, 0, 0.1)",
    blur: "0px",
  },
  dark: {
    name: "Dark Mode",
    icon: "Moon",
    background: "#0F172A",
    backgroundGradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    surface: "#1E293B",
    surfaceHover: "#334155",
    border: "#334155",
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    primary: "#80D1E9",
    primaryLight: "rgba(128, 209, 233, 0.15)",
    secondary: "#2E3192",
    secondaryLight: "rgba(46, 49, 146, 0.2)",
    success: "#34D399",
    warning: "#FBBF24",
    danger: "#F87171",
    info: "#60A5FA",
    sidebar: "#1E293B",
    sidebarText: "#E2E8F0",
    sidebarHover: "#334155",
    header: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    headerText: "#FFFFFF",
    card: "#1E293B",
    cardBorder: "#334155",
    shadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
    shadowHover: "0 10px 25px rgba(0, 0, 0, 0.4)",
    blur: "0px",
  },
  company: {
    name: "NESMA Brand",
    icon: "Building2",
    background: "#0E2841",
    backgroundGradient:
      "linear-gradient(135deg, #0E2841 0%, #203366 50%, #0E2841 100%)",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceHover: "rgba(255, 255, 255, 0.1)",
    border: "rgba(128, 209, 233, 0.2)",
    text: "#FFFFFF",
    textSecondary: "#80D1E9",
    textMuted: "rgba(255, 255, 255, 0.6)",
    primary: "#2E3192",
    primaryLight: "rgba(46, 49, 146, 0.3)",
    secondary: "#80D1E9",
    secondaryLight: "rgba(128, 209, 233, 0.2)",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    sidebar: "rgba(14, 40, 65, 0.95)",
    sidebarText: "#FFFFFF",
    sidebarHover: "rgba(128, 209, 233, 0.15)",
    header: "linear-gradient(135deg, #2E3192 0%, #203366 50%, #0E2841 100%)",
    headerText: "#FFFFFF",
    card: "rgba(255, 255, 255, 0.05)",
    cardBorder: "rgba(128, 209, 233, 0.2)",
    shadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    shadowHover: "0 10px 40px rgba(128, 209, 233, 0.2)",
    blur: "0px",
  },
  glass: {
    name: "Glass Mode",
    icon: "Sparkles",
    background: "#0a0a1a",
    backgroundGradient:
      "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%)",
    surface: "rgba(255, 255, 255, 0.03)",
    surfaceHover: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.08)",
    text: "#FFFFFF",
    textSecondary: "rgba(255, 255, 255, 0.8)",
    textMuted: "rgba(255, 255, 255, 0.5)",
    primary: "#80D1E9",
    primaryLight: "rgba(128, 209, 233, 0.15)",
    secondary: "#a855f7",
    secondaryLight: "rgba(168, 85, 247, 0.2)",
    success: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
    info: "#3b82f6",
    sidebar: "rgba(255, 255, 255, 0.02)",
    sidebarText: "#FFFFFF",
    sidebarHover: "rgba(128, 209, 233, 0.1)",
    header:
      "linear-gradient(135deg, rgba(46, 49, 146, 0.8) 0%, rgba(32, 51, 102, 0.8) 50%, rgba(14, 40, 65, 0.8) 100%)",
    headerText: "#FFFFFF",
    card: "rgba(255, 255, 255, 0.03)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    shadowHover: "0 16px 48px rgba(128, 209, 233, 0.15)",
    blur: "20px",
  },
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nesma-hr-theme") as ThemeMode;
      if (saved && ["light", "dark", "company", "glass"].includes(saved)) {
        return saved;
      }
    }
    return "light";
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("nesma-hr-theme", newTheme);
  };

  const toggleTheme = () => {
    const themes: ThemeMode[] = ["light", "dark", "company", "glass"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const config = themeConfig[theme];

    // Set CSS variables
    root.style.setProperty("--theme-background", config.background);
    root.style.setProperty(
      "--theme-background-gradient",
      config.backgroundGradient,
    );
    root.style.setProperty("--theme-surface", config.surface);
    root.style.setProperty("--theme-surface-hover", config.surfaceHover);
    root.style.setProperty("--theme-border", config.border);
    root.style.setProperty("--theme-text", config.text);
    root.style.setProperty("--theme-text-secondary", config.textSecondary);
    root.style.setProperty("--theme-text-muted", config.textMuted);
    root.style.setProperty("--theme-primary", config.primary);
    root.style.setProperty("--theme-primary-light", config.primaryLight);
    root.style.setProperty("--theme-secondary", config.secondary);
    root.style.setProperty("--theme-secondary-light", config.secondaryLight);
    root.style.setProperty("--theme-success", config.success);
    root.style.setProperty("--theme-warning", config.warning);
    root.style.setProperty("--theme-danger", config.danger);
    root.style.setProperty("--theme-info", config.info);
    root.style.setProperty("--theme-sidebar", config.sidebar);
    root.style.setProperty("--theme-sidebar-text", config.sidebarText);
    root.style.setProperty("--theme-sidebar-hover", config.sidebarHover);
    root.style.setProperty("--theme-header", config.header);
    root.style.setProperty("--theme-header-text", config.headerText);
    root.style.setProperty("--theme-card", config.card);
    root.style.setProperty("--theme-card-border", config.cardBorder);
    root.style.setProperty("--theme-shadow", config.shadow);
    root.style.setProperty("--theme-shadow-hover", config.shadowHover);
    root.style.setProperty("--theme-blur", config.blur);

    // Add theme class to body
    document.body.classList.remove(
      "theme-light",
      "theme-dark",
      "theme-company",
      "theme-glass",
    );
    document.body.classList.add(`theme-${theme}`);

    // Set color-scheme for native elements
    root.style.colorScheme = theme === "light" ? "light" : "dark";
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
    isCompany: theme === "company",
    isGlass: theme === "glass",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
