import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "../../utils/cn";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "../../contexts/ThemeContext";
import { ScrollIndicator } from "../common/ScrollIndicator";
import { AIAssistant } from "../common/AIAssistant";
import { KeyboardShortcuts } from "../common/KeyboardShortcuts";
import { NotificationProvider } from "../common/NotificationSystem";

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();

  const isDark = theme === "dark" || theme === "company";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <NotificationProvider>
      <div
        className={cn(
          "min-h-screen transition-colors duration-300",
          isDark ? "bg-[var(--theme-bg)]" : "bg-[#f8fafc]",
        )}
      >
        {/* Scroll Progress Indicator */}
        <ScrollIndicator />

        {/* Keyboard Shortcuts (Ctrl+K) */}
        <KeyboardShortcuts />

        {/* Header */}
        <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <main
          className={cn(
            "pt-16 min-h-screen transition-all duration-300 ease-in-out relative z-10",
            isSidebarOpen ? "ml-64" : "ml-0",
          )}
        >
          <div
            className={cn(
              "p-4 md:p-6 max-w-[1920px] mx-auto",
              isDark ? "text-[var(--theme-text)]" : "text-gray-900",
            )}
          >
            <Outlet />
          </div>
        </main>

        {/* AI Assistant - Abbas */}
        <AIAssistant />
      </div>
    </NotificationProvider>
  );
};

export default MainLayout;
