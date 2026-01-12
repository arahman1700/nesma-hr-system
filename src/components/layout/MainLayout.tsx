import React, { useState, useEffect } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === "dark" || theme === "company";

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Auto-open sidebar on desktop, close on mobile
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
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

        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          onClose={closeSidebar}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main
          className={cn(
            "pt-16 min-h-screen transition-all duration-300 ease-in-out relative z-10",
            // Only apply margin on desktop when sidebar is open
            !isMobile && isSidebarOpen ? "lg:ml-64" : "ml-0",
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
