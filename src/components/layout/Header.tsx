import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import {
  Menu,
  Bell,
  Settings,
  User,
  ChevronDown,
  LogOut,
  Globe,
  Grid,
  X,
  Users,
  Calculator,
  BarChart3,
  Search,
  Zap,
  HelpCircle,
  Moon,
  Sun,
  ExternalLink,
  LayoutGrid,
  Truck,
  FileBarChart,
  Building,
  FolderKanban,
} from "lucide-react";
import { Avatar } from "../common/Avatar";
import { CountBadge } from "../common/Badge";
import { ThemeToggle } from "../common/ThemeToggle";
import { NotificationBell } from "../common/NotificationSystem";
import { Tooltip } from "../common/EnhancedUI";
import { useTheme } from "../../contexts/ThemeContext";

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isSidebarOpen,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showModules, setShowModules] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Riyadh",
      };
      setCurrentTime(now.toLocaleTimeString("en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Leave request approved",
      message: "Your annual leave request has been approved",
      time: "5 min ago",
      type: "success",
      read: false,
    },
    {
      id: 2,
      title: "New task assigned",
      message: "Monthly report task has been assigned to you",
      time: "1 hour ago",
      type: "info",
      read: false,
    },
    {
      id: 3,
      title: "Document expiring",
      message: "Iqama for Ahmed Ali expires in 30 days",
      time: "2 hours ago",
      type: "warning",
      read: true,
    },
    {
      id: 4,
      title: "Payroll processed",
      message: "January 2026 payroll has been processed",
      time: "1 day ago",
      type: "success",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const modules = [
    {
      id: "portal",
      name: "Portal",
      icon: <LayoutGrid className="w-6 h-6" />,
      active: false,
      description: "NESMA Systems Portal",
      path: "/portal",
      isInternal: true,
    },
    {
      id: "hr",
      name: "Human Resources",
      icon: <Users className="w-6 h-6" />,
      active: true,
      description: "Employee management, attendance, payroll",
      path: "/",
      isInternal: true,
    },
    {
      id: "scm",
      name: "Supply Chain",
      icon: <Truck className="w-6 h-6" />,
      active: false,
      description: "Logistics & procurement management",
      comingSoon: true,
    },
    {
      id: "mitc",
      name: "MITC Dashboard",
      icon: <FileBarChart className="w-6 h-6" />,
      active: false,
      description: "Monthly IT Committee Reports",
      comingSoon: true,
    },
    {
      id: "accounting",
      name: "Accounting",
      icon: <Calculator className="w-6 h-6" />,
      active: false,
      description: "Finance & accounting module",
      comingSoon: true,
    },
    {
      id: "projects",
      name: "Projects",
      icon: <FolderKanban className="w-6 h-6" />,
      active: false,
      description: "Project management system",
      comingSoon: true,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 nesma-header">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2E3192] via-[#203366] to-[#0E2841]" />

      {/* Cyan accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#80D1E9] to-transparent" />

      <div className="relative h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isSidebarOpen}
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={`${import.meta.env.BASE_URL}assets/logo-white.svg`}
              alt="NESMA"
              className="h-6 sm:h-8 lg:h-10"
            />
            <div className="hidden sm:block">
              <span className="text-white/60 text-sm">|</span>
              <span className="text-white/80 text-sm ml-2 lg:ml-3">
                HR System
              </span>
            </div>
          </div>

          {/* Subscription Alert */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-sm font-medium border border-amber-500/30">
            <Zap className="w-4 h-4" />
            <span>11 Days Left</span>
            <button className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded font-semibold hover:bg-amber-600 transition-colors">
              Upgrade
            </button>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search employees, requests..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#80D1E9]/50 focus:border-[#80D1E9]/50 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Time */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-[#80D1E9] text-sm font-medium">
            {currentTime}
          </div>

          {/* Mobile Search */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={showSearch ? "Close search" : "Open search"}
            aria-expanded={showSearch}
          >
            <Search className="w-5 h-5 text-white" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle variant="icon" size="md" />

          {/* Help */}
          <Tooltip content="Help & Support" position="bottom">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden md:flex">
              <HelpCircle className="w-5 h-5 text-white/80" />
            </button>
          </Tooltip>

          {/* Settings */}
          <Tooltip content="Settings" position="bottom">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5 text-white/80" />
            </button>
          </Tooltip>

          {/* Notifications - Using new NotificationBell component */}
          <NotificationBell />

          {/* Modules Menu */}
          <div className="relative">
            <Tooltip content="NESMA Apps" position="bottom">
              <button
                onClick={() => setShowModules(!showModules)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="NESMA Applications Menu"
                aria-expanded={showModules}
                aria-haspopup="menu"
              >
                <Grid className="w-5 h-5 text-white/80" />
              </button>
            </Tooltip>

            {showModules && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowModules(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-scaleIn overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#2E3192] to-[#0E2841]">
                    <h3 className="font-semibold text-white">NESMA Apps</h3>
                  </div>
                  <div className="p-2">
                    {modules.map((module) => {
                      const handleClick = () => {
                        if (module.comingSoon) return;
                        if (module.isInternal && module.path) {
                          navigate(module.path);
                        }
                        setShowModules(false);
                      };

                      return (
                        <button
                          key={module.id}
                          onClick={handleClick}
                          disabled={module.comingSoon}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                            module.active
                              ? "bg-[#80D1E9]/10 border-l-4 border-[#2E3192]"
                              : module.comingSoon
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-50 cursor-pointer",
                          )}
                        >
                          <div
                            className={cn(
                              "p-2 rounded-xl",
                              module.active
                                ? "bg-gradient-to-br from-[#2E3192] to-[#0E2841] text-white"
                                : "bg-gray-100 text-gray-600",
                            )}
                          >
                            {module.icon}
                          </div>
                          <div className="text-left flex-1">
                            <p
                              className={cn(
                                "font-medium flex items-center gap-1",
                                module.active
                                  ? "text-[#2E3192]"
                                  : "text-gray-800",
                              )}
                            >
                              {module.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {module.description}
                            </p>
                          </div>
                          {module.active && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                          {module.comingSoon && (
                            <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                              Soon
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        navigate("/portal");
                        setShowModules(false);
                      }}
                      className="w-full py-2 text-sm font-medium text-[#2E3192] bg-[#80D1E9]/10 rounded-xl hover:bg-[#80D1E9]/20 transition-colors"
                    >
                      View All Apps
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="User profile menu"
              aria-expanded={showProfile}
              aria-haspopup="menu"
            >
              <Avatar name="Abdulrahman Hussein" size="sm" status="online" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">Abdulrahman</p>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60 hidden md:block" />
            </button>

            {showProfile && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-scaleIn overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#2E3192] to-[#0E2841]">
                    <div className="flex items-center gap-3">
                      <Avatar name="Abdulrahman Hussein" size="md" />
                      <div>
                        <p className="font-medium text-white">
                          Abdulrahman Hussein
                        </p>
                        <p className="text-sm text-[#80D1E9]">
                          Logistics Manager
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors">
                      <Settings className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">Language</span>
                      <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        EN
                      </span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors">
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="lg:hidden absolute top-full left-0 right-0 p-4 bg-[#0E2841] border-b border-white/10 animate-slideIn">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#80D1E9]/50"
              autoFocus
            />
            <button
              onClick={() => setShowSearch(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
