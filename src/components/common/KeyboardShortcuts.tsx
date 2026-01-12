import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Command,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  X,
  Home,
  Users,
  Clock,
  Palmtree,
  FileText,
  Calendar,
  Settings,
  HelpCircle,
  Mail,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

interface ShortcutAction {
  id: string;
  label: string;
  description: string;
  shortcut: string[];
  icon: React.ReactNode;
  action: () => void;
  category: "navigation" | "action" | "help";
}

interface KeyboardShortcutsProps {
  className?: string;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  className,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";

  // Define shortcuts
  const shortcuts: ShortcutAction[] = [
    {
      id: "home",
      label: "Go to Dashboard",
      description: "Navigate to main dashboard",
      shortcut: ["G", "D"],
      icon: <Home className="w-4 h-4" />,
      action: () => navigate("/"),
      category: "navigation",
    },
    {
      id: "employees",
      label: "Go to Employees",
      description: "View employee directory",
      shortcut: ["G", "E"],
      icon: <Users className="w-4 h-4" />,
      action: () => navigate("/employees"),
      category: "navigation",
    },
    {
      id: "attendance",
      label: "Go to Attendance",
      description: "Check attendance records",
      shortcut: ["G", "A"],
      icon: <Clock className="w-4 h-4" />,
      action: () => navigate("/attendance"),
      category: "navigation",
    },
    {
      id: "leaves",
      label: "Go to Leaves",
      description: "Manage leave requests",
      shortcut: ["G", "L"],
      icon: <Palmtree className="w-4 h-4" />,
      action: () => navigate("/leaves"),
      category: "navigation",
    },
    {
      id: "requests",
      label: "Go to Requests",
      description: "View all requests",
      shortcut: ["G", "R"],
      icon: <FileText className="w-4 h-4" />,
      action: () => navigate("/requests"),
      category: "navigation",
    },
    {
      id: "calendar",
      label: "Go to Calendar",
      description: "Open calendar view",
      shortcut: ["G", "C"],
      icon: <Calendar className="w-4 h-4" />,
      action: () => navigate("/calendar"),
      category: "navigation",
    },
    {
      id: "settings",
      label: "Go to Settings",
      description: "System settings",
      shortcut: ["G", "S"],
      icon: <Settings className="w-4 h-4" />,
      action: () => navigate("/settings"),
      category: "navigation",
    },
    {
      id: "letters",
      label: "Go to Letters",
      description: "Generate letters",
      shortcut: ["G", "T"],
      icon: <Mail className="w-4 h-4" />,
      action: () => navigate("/letters"),
      category: "navigation",
    },
    {
      id: "help",
      label: "Show Shortcuts",
      description: "Display this help menu",
      shortcut: ["?"],
      icon: <HelpCircle className="w-4 h-4" />,
      action: () => setIsOpen(true),
      category: "help",
    },
  ];

  // Filter shortcuts based on search
  const filteredShortcuts = shortcuts.filter(
    (s) =>
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Open command palette with Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchQuery("");
        setSelectedIndex(0);
        return;
      }

      // Show help with ?
      if (e.key === "?" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      // Navigation when palette is open
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredShortcuts.length - 1 ? prev + 1 : 0,
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredShortcuts.length - 1,
          );
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filteredShortcuts[selectedIndex]) {
            filteredShortcuts[selectedIndex].action();
            setIsOpen(false);
            setSearchQuery("");
            setSelectedIndex(0);
          }
        }
      }
    },
    [isOpen, filteredShortcuts, selectedIndex],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]",
        "bg-black/50 backdrop-blur-sm",
        className,
      )}
      onClick={() => {
        setIsOpen(false);
        setSearchQuery("");
      }}
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl",
          "transform transition-all duration-200",
          isGlass
            ? "bg-white/95 backdrop-blur-xl border border-[#2E3192]/20"
            : isDark
              ? "bg-gray-900 border border-gray-700"
              : "bg-white border border-gray-200",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 border-b",
            isGlass
              ? "border-[#2E3192]/10"
              : isDark
                ? "border-gray-700"
                : "border-gray-200",
          )}
        >
          <Search
            className={cn(
              "w-5 h-5",
              isGlass
                ? "text-[#2E3192]"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-400",
            )}
          />
          <input
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className={cn(
              "flex-1 bg-transparent outline-none text-sm",
              isGlass
                ? "text-[#2E3192] placeholder-[#2E3192]/50"
                : isDark
                  ? "text-white placeholder-gray-500"
                  : "text-gray-800 placeholder-gray-400",
            )}
          />
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs",
              isGlass
                ? "bg-[#2E3192]/10 text-[#2E3192]"
                : isDark
                  ? "bg-gray-800 text-gray-400"
                  : "bg-gray-100 text-gray-500",
            )}
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {filteredShortcuts.length === 0 ? (
            <div
              className={cn(
                "text-center py-8",
                isGlass
                  ? "text-[#2E3192]/50"
                  : isDark
                    ? "text-gray-500"
                    : "text-gray-400",
              )}
            >
              No commands found
            </div>
          ) : (
            <>
              {/* Group by category */}
              {["navigation", "action", "help"].map((category) => {
                const categoryShortcuts = filteredShortcuts.filter(
                  (s) => s.category === category,
                );
                if (categoryShortcuts.length === 0) return null;

                return (
                  <div key={category}>
                    <div
                      className={cn(
                        "px-4 py-1 text-xs font-medium uppercase tracking-wider",
                        isGlass
                          ? "text-[#2E3192]/50"
                          : isDark
                            ? "text-gray-500"
                            : "text-gray-400",
                      )}
                    >
                      {category}
                    </div>
                    {categoryShortcuts.map((shortcut) => {
                      const globalIndex = filteredShortcuts.indexOf(shortcut);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={shortcut.id}
                          onClick={() => {
                            shortcut.action();
                            setIsOpen(false);
                            setSearchQuery("");
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3",
                            "transition-colors",
                            isSelected
                              ? isGlass
                                ? "bg-[#2E3192]/10"
                                : isDark
                                  ? "bg-gray-800"
                                  : "bg-gray-100"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800",
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              isGlass
                                ? "bg-[#2E3192]/10 text-[#2E3192]"
                                : isDark
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-100 text-gray-600",
                            )}
                          >
                            {shortcut.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                isGlass
                                  ? "text-[#2E3192]"
                                  : isDark
                                    ? "text-white"
                                    : "text-gray-800",
                              )}
                            >
                              {shortcut.label}
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isGlass
                                  ? "text-[#2E3192]/60"
                                  : isDark
                                    ? "text-gray-400"
                                    : "text-gray-500",
                              )}
                            >
                              {shortcut.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {shortcut.shortcut.map((key, i) => (
                              <React.Fragment key={i}>
                                <kbd
                                  className={cn(
                                    "px-2 py-1 rounded text-xs font-mono",
                                    isGlass
                                      ? "bg-[#2E3192]/10 text-[#2E3192]"
                                      : isDark
                                        ? "bg-gray-700 text-gray-300"
                                        : "bg-gray-100 text-gray-600",
                                  )}
                                >
                                  {key}
                                </kbd>
                                {i < shortcut.shortcut.length - 1 && (
                                  <span
                                    className={cn(
                                      "text-xs",
                                      isDark
                                        ? "text-gray-500"
                                        : "text-gray-400",
                                    )}
                                  >
                                    +
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className={cn(
            "flex items-center justify-between px-4 py-2 border-t text-xs",
            isGlass
              ? "border-[#2E3192]/10 text-[#2E3192]/60"
              : isDark
                ? "border-gray-700 text-gray-500"
                : "border-gray-200 text-gray-400",
          )}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              <ArrowDown className="w-3 h-3" />
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" />
              Select
            </span>
            <span className="flex items-center gap-1">
              <X className="w-3 h-3" />
              ESC to close
            </span>
          </div>
          <span>NESMA HR System</span>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
