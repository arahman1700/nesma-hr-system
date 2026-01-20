import React, { useState, useEffect, createContext, useContext } from "react";
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Calendar,
  ChevronRight,
  Settings,
  Trash2,
  MailOpen,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

// Types
export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationCategory =
  | "system"
  | "request"
  | "leave"
  | "attendance"
  | "reminder";

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// Context
const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};

// Provider
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Sample notifications
    {
      id: "1",
      type: "info",
      category: "request",
      title: "New Leave Request",
      message: "Ahmed Al-Rashid submitted a leave request for review",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionUrl: "/requests",
      actionLabel: "View Request",
    },
    {
      id: "2",
      type: "success",
      category: "leave",
      title: "Leave Approved",
      message: "Your annual leave request has been approved",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: "3",
      type: "warning",
      category: "reminder",
      title: "Document Expiring",
      message: "3 employees have Iqama expiring within 30 days",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      actionUrl: "/employees",
      actionLabel: "View Details",
    },
    {
      id: "4",
      type: "info",
      category: "attendance",
      title: "Attendance Report",
      message: "Daily attendance report is ready for review",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell Component
interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className,
}) => {
  const { theme } = useTheme();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";
  // Check if we're in the header (transparent background needed)
  const isInHeader = className?.includes("header") || true; // Default to header style

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "request":
        return <FileText className="w-4 h-4" />;
      case "leave":
        return <Calendar className="w-4 h-4" />;
      case "attendance":
        return <Clock className="w-4 h-4" />;
      case "reminder":
        return <Bell className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={cn("relative", className)}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-lg transition-all duration-200",
          "hover:bg-white/10 text-white/80 hover:text-white",
        )}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Bell
          className={cn(
            "w-5 h-5 transition-transform",
            unreadCount > 0 && "animate-[ring_1s_ease-in-out]",
          )}
        />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -top-1 -right-1 w-5 h-5 rounded-full",
              "flex items-center justify-center text-xs font-bold text-white",
              "bg-red-500 animate-pulse",
            )}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className={cn(
              "absolute right-0 top-full mt-2 w-96 z-50",
              "rounded-2xl shadow-2xl overflow-hidden",
              "transform transition-all duration-200",
              "animate-in fade-in slide-in-from-top-2",
              isGlass
                ? "bg-white/95 backdrop-blur-xl border border-[#2E3192]/20"
                : isDark
                  ? "bg-gray-900 border border-gray-700"
                  : "bg-white border border-gray-200",
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between px-4 py-3 border-b",
                isGlass
                  ? "border-[#2E3192]/10"
                  : isDark
                    ? "border-gray-700"
                    : "border-gray-200",
              )}
            >
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-semibold",
                    isGlass
                      ? "text-[#2E3192]"
                      : isDark
                        ? "text-white"
                        : "text-gray-800",
                  )}
                >
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      isGlass
                        ? "bg-[#2E3192]/10 text-[#2E3192]"
                        : "bg-red-100 text-red-600",
                    )}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isGlass
                        ? "text-[#2E3192] hover:text-[#2E3192]/80"
                        : isDark
                          ? "text-cyan-400 hover:text-cyan-300"
                          : "text-[#2E3192] hover:text-[#2E3192]/80",
                    )}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "p-1 rounded-lg transition-colors",
                    isGlass
                      ? "hover:bg-[#2E3192]/10 text-[#2E3192]"
                      : isDark
                        ? "hover:bg-gray-800 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500",
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div
                  className={cn(
                    "text-center py-12",
                    isGlass
                      ? "text-[#2E3192]/50"
                      : isDark
                        ? "text-gray-500"
                        : "text-gray-400",
                  )}
                >
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "px-4 py-3 border-b transition-colors cursor-pointer",
                      "hover:bg-gray-50 dark:hover:bg-gray-800",
                      !notification.read &&
                        (isGlass
                          ? "bg-[#2E3192]/5"
                          : isDark
                            ? "bg-gray-800/50"
                            : "bg-blue-50/50"),
                      isGlass
                        ? "border-[#2E3192]/5"
                        : isDark
                          ? "border-gray-800"
                          : "border-gray-100",
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          notification.type === "success" &&
                            "bg-emerald-100 text-emerald-600",
                          notification.type === "warning" &&
                            "bg-amber-100 text-amber-600",
                          notification.type === "error" &&
                            "bg-red-100 text-red-600",
                          notification.type === "info" &&
                            "bg-blue-100 text-blue-600",
                        )}
                      >
                        {getCategoryIcon(notification.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "font-medium text-sm",
                              isGlass
                                ? "text-[#2E3192]"
                                : isDark
                                  ? "text-white"
                                  : "text-gray-800",
                            )}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-xs mt-0.5 line-clamp-2",
                            isGlass
                              ? "text-[#2E3192]/60"
                              : isDark
                                ? "text-gray-400"
                                : "text-gray-500",
                          )}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={cn(
                              "text-xs",
                              isGlass
                                ? "text-[#2E3192]/40"
                                : isDark
                                  ? "text-gray-500"
                                  : "text-gray-400",
                            )}
                          >
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className={cn(
                                "text-xs font-medium flex items-center gap-1",
                                isGlass
                                  ? "text-[#2E3192] hover:text-[#2E3192]/80"
                                  : isDark
                                    ? "text-cyan-400 hover:text-cyan-300"
                                    : "text-[#2E3192] hover:text-[#2E3192]/80",
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {notification.actionLabel || "View"}
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className={cn(
                          "p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all",
                          isGlass
                            ? "hover:bg-[#2E3192]/10 text-[#2E3192]/50"
                            : isDark
                              ? "hover:bg-gray-700 text-gray-500"
                              : "hover:bg-gray-100 text-gray-400",
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div
                className={cn(
                  "px-4 py-3 border-t",
                  isGlass
                    ? "border-[#2E3192]/10"
                    : isDark
                      ? "border-gray-700"
                      : "border-gray-200",
                )}
              >
                <button
                  className={cn(
                    "w-full text-center text-sm font-medium py-2 rounded-xl transition-colors",
                    isGlass
                      ? "bg-[#2E3192]/10 text-[#2E3192] hover:bg-[#2E3192]/20"
                      : isDark
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// CSS Animation for bell ring
const styles = `
@keyframes ring {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
  20%, 40%, 60%, 80% { transform: rotate(10deg); }
}
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default NotificationBell;
