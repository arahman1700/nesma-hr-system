import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import {
  Calendar,
  Clock,
  CalendarClock,
  Palmtree,
  FileText,
  Mail,
  Users,
  CheckSquare,
  Briefcase,
  Settings,
  MapPin,
  FolderOpen,
  ChevronDown,
  DollarSign,
  LayoutDashboard,
  UserCheck,
  UserX,
  Timer,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { DESIGN_TOKENS } from "../common/StatsCard";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
  badge?: number;
  isNew?: boolean;
  fullLogo?: React.ReactNode;
}

// Unified icon size for consistency
const ICON_SIZE = "w-[18px] h-[18px]";

const sidebarItems: SidebarItem[] = [
  {
    id: "home",
    label: "Dashboard",
    icon: <LayoutDashboard className={ICON_SIZE} />,
    path: "/",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: <Calendar className={ICON_SIZE} />,
    path: "/calendar",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: <Clock className={ICON_SIZE} />,
    path: "/attendance",
  },
  {
    id: "shifts",
    label: "Shifts",
    icon: <CalendarClock className={ICON_SIZE} />,
    path: "/shifts",
  },
  {
    id: "leaves",
    label: "Leaves",
    icon: <Palmtree className={ICON_SIZE} />,
    path: "/leaves",
    badge: 3,
  },
  {
    id: "requests",
    label: "Requests",
    icon: <FileText className={ICON_SIZE} />,
    path: "/requests",
    badge: 5,
  },
  {
    id: "letters",
    label: "Letters",
    icon: <Mail className={ICON_SIZE} />,
    path: "/letters",
  },
  {
    id: "muqeem",
    label: "Muqeem",
    icon: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/muqeem-icon.svg`}
        alt="Muqeem"
        className="h-5 w-auto"
      />
    ),
    path: "/muqeem",
    fullLogo: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/muqeem.svg`}
        alt="Muqeem"
        className="h-8 w-auto"
      />
    ),
  },
  {
    id: "payroll",
    label: "Payroll",
    icon: <DollarSign className={ICON_SIZE} />,
    path: "/payroll",
  },
  {
    id: "mudad",
    label: "Mudad",
    icon: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/mudad-icon.svg`}
        alt="Mudad"
        className="h-5 w-auto"
      />
    ),
    path: "/mudad",
    fullLogo: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/mudad.svg`}
        alt="Mudad"
        className="h-8 w-auto"
      />
    ),
  },
  {
    id: "qsalary",
    label: "Qsalary",
    icon: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/qsalary-icon.svg`}
        alt="Qsalary"
        className="h-5 w-auto"
      />
    ),
    path: "/qsalary",
    isNew: true,
    fullLogo: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/qsalary.svg`}
        alt="Qsalary"
        className="h-8 w-auto"
      />
    ),
  },
  {
    id: "gosi",
    label: "GOSI",
    icon: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/gosi-icon.svg`}
        alt="GOSI"
        className="h-5 w-auto"
      />
    ),
    path: "/gosi",
    fullLogo: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/gosi.svg`}
        alt="GOSI"
        className="h-8 w-auto"
      />
    ),
  },
  {
    id: "tameeni",
    label: "Tameeni",
    icon: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/tameeni-icon.svg`}
        alt="Tameeni"
        className="h-5 w-auto"
      />
    ),
    path: "/tameeni",
    fullLogo: (
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/tameeni.svg`}
        alt="Tameeni"
        className="h-8 w-auto"
      />
    ),
  },
  {
    id: "employees",
    label: "Employees",
    icon: <Users className={ICON_SIZE} />,
    path: "/employees",
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: <CheckSquare className={ICON_SIZE} />,
    path: "/tasks",
  },
  {
    id: "position",
    label: "Positions",
    icon: <Briefcase className={ICON_SIZE} />,
    path: "/position",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className={ICON_SIZE} />,
    path: "/settings",
  },
  {
    id: "locations",
    label: "Locations",
    icon: <MapPin className={ICON_SIZE} />,
    path: "/locations",
  },
  {
    id: "files",
    label: "Files",
    icon: <FolderOpen className={ICON_SIZE} />,
    path: "/files",
  },
];

// ============================================
// ANIMATED STAT CARD FOR SIDEBAR
// ============================================
interface AnimatedStatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  trend?: { value: number; isPositive: boolean };
  isDark: boolean;
  isGlass: boolean;
  delay?: number;
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  value,
  label,
  icon,
  gradient,
  glowColor,
  trend,
  isDark,
  isGlass,
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animated counter effect
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const startTime = Date.now() + delay;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * end);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, delay]);

  return (
    <div
      className={cn(
        "relative overflow-hidden p-3 rounded-xl",
        "transition-all duration-300 cursor-pointer",
        "group",
      )}
      style={{
        background: `linear-gradient(135deg, ${gradient})`,
        boxShadow: isHovered
          ? `0 8px 25px ${glowColor}, 0 0 40px ${glowColor}`
          : `0 4px 15px ${glowColor}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -top-4 -right-4 w-16 h-16 rounded-full",
            "bg-white/10 blur-xl",
            "transition-transform duration-500",
            isHovered && "scale-150",
          )}
        />
        <div
          className={cn(
            "absolute -bottom-2 -left-2 w-12 h-12 rounded-full",
            "bg-white/10 blur-lg",
            "transition-transform duration-500 delay-100",
            isHovered && "scale-150",
          )}
        />

        {/* Shine effect */}
        <div
          className={cn(
            "absolute inset-0 -translate-x-full",
            "bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "transition-transform duration-700 ease-out",
            isHovered && "translate-x-full",
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            "bg-white/20 backdrop-blur-sm",
            "transition-all duration-300",
            isHovered && "scale-110 rotate-6",
          )}
        >
          {icon}
        </div>

        {/* Value and Label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-2xl font-bold text-white",
                "transition-transform duration-300",
                isHovered && "scale-105",
              )}
            >
              {displayValue}
            </span>
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                  trend.isPositive
                    ? "bg-emerald-400/30 text-emerald-100"
                    : "bg-red-400/30 text-red-100",
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
          <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider truncate">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MINI STAT (for collapsed sidebar)
// ============================================
interface MiniStatProps {
  value: number;
  color: string;
  isDark: boolean;
}

const MiniStat: React.FC<MiniStatProps> = ({ value, color, isDark }) => {
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center",
        "font-bold text-sm text-white",
        "transition-all duration-300 hover:scale-110",
      )}
      style={{
        background: `linear-gradient(135deg, ${color})`,
        boxShadow: `0 4px 12px ${color.split(",")[0].replace("linear-gradient(135deg, ", "")}40`,
      }}
    >
      {value}
    </div>
  );
};

// ============================================
// SIDEBAR COMPONENT
// ============================================
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isMobile,
}) => {
  const location = useLocation();
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Stats data (in real app, this would come from context/API)
  const sidebarStats = {
    employees: { value: 80, trend: { value: 5, isPositive: true } },
    present: { value: 68, trend: { value: 92, isPositive: true } },
    onLeave: { value: 7, trend: { value: 2, isPositive: false } },
    late: { value: 5, trend: { value: 3, isPositive: false } },
  };

  const renderSidebarItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.path === location.pathname;

    // Base item styles - unified across all items
    const baseItemStyles = cn(
      "group flex items-center gap-3 px-3 py-2.5 mx-2 my-0.5",
      DESIGN_TOKENS.borderRadius.md,
      "font-medium text-sm transition-all duration-200",
    );

    // Active state styles
    const activeStyles =
      isDark || isGlass
        ? "bg-[#80D1E9]/15 text-[#80D1E9]"
        : "bg-gradient-to-r from-[#2E3192]/10 to-transparent text-[#2E3192]";

    // Hover state styles
    const hoverStyles =
      isDark || isGlass
        ? "hover:bg-white/5 hover:text-[#80D1E9]"
        : "hover:bg-[#2E3192]/5 hover:text-[#2E3192]";

    // Default state styles
    const defaultStyles = isDark || isGlass ? "text-gray-400" : "text-gray-600";

    // Icon wrapper styles
    const iconWrapperStyles = cn(
      "flex items-center justify-center w-8 h-8",
      DESIGN_TOKENS.borderRadius.md,
      "transition-all duration-200",
    );

    const activeIconStyles =
      isDark || isGlass
        ? "bg-[#80D1E9]/20 text-[#80D1E9]"
        : "bg-[#2E3192]/10 text-[#2E3192]";

    const defaultIconStyles =
      isDark || isGlass
        ? "text-gray-500 group-hover:bg-white/5 group-hover:text-[#80D1E9]"
        : "text-gray-400 group-hover:bg-[#2E3192]/5 group-hover:text-[#2E3192]";

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpand(item.id)}
            className={cn(
              baseItemStyles,
              defaultStyles,
              hoverStyles,
              "w-full justify-between",
            )}
            style={{ marginLeft: `${depth * 12}px` }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(iconWrapperStyles, defaultIconStyles)}>
                {item.icon}
              </div>
              {isOpen && <span>{item.label}</span>}
            </div>
            {isOpen && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isExpanded && "rotate-180",
                )}
              />
            )}
          </button>
          {isOpen && isExpanded && (
            <div
              className={cn(
                "mt-1 ml-6 pl-3 border-l-2",
                isDark || isGlass ? "border-gray-700/50" : "border-gray-200",
              )}
            >
              {item.children?.map((child) =>
                renderSidebarItem(child, depth + 1),
              )}
            </div>
          )}
        </div>
      );
    }

    // If item has fullLogo and sidebar is open, show full logo
    if (item.fullLogo && isOpen) {
      return (
        <NavLink
          key={item.id}
          to={item.path || "#"}
          onClick={() => isMobile && onClose?.()}
          className={({ isActive: linkIsActive }) =>
            cn(
              baseItemStyles,
              linkIsActive || isActive ? activeStyles : defaultStyles,
              !linkIsActive && !isActive && hoverStyles,
              // Active indicator bar
              (linkIsActive || isActive) &&
                "relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:rounded-r-full",
              (linkIsActive || isActive) &&
                (isDark || isGlass
                  ? "before:bg-[#80D1E9]"
                  : "before:bg-[#2E3192]"),
            )
          }
          style={{ marginLeft: `${depth * 12}px` }}
        >
          <div className="flex items-center gap-2 flex-1">{item.fullLogo}</div>
          <div className="flex items-center gap-1.5">
            {item.isNew && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded",
                  isDark || isGlass
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-emerald-500 text-white",
                )}
              >
                New
              </span>
            )}
          </div>
        </NavLink>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path || "#"}
        onClick={() => isMobile && onClose?.()}
        className={({ isActive: linkIsActive }) =>
          cn(
            baseItemStyles,
            linkIsActive || isActive ? activeStyles : defaultStyles,
            !linkIsActive && !isActive && hoverStyles,
            // Active indicator bar
            (linkIsActive || isActive) &&
              "relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:rounded-r-full",
            (linkIsActive || isActive) &&
              (isDark || isGlass
                ? "before:bg-[#80D1E9]"
                : "before:bg-[#2E3192]"),
          )
        }
        style={{ marginLeft: `${depth * 12}px` }}
      >
        <div
          className={cn(
            iconWrapperStyles,
            isActive ? activeIconStyles : defaultIconStyles,
          )}
        >
          {item.icon}
        </div>
        {isOpen && (
          <>
            <span className="flex-1">{item.label}</span>
            <div className="flex items-center gap-1.5">
              {item.isNew && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded",
                    isDark || isGlass
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-500 text-white",
                  )}
                >
                  New
                </span>
              )}
              {item.badge && item.badge > 0 && (
                <span
                  className={cn(
                    "min-w-[20px] h-5 px-1.5 flex items-center justify-center",
                    "text-[10px] font-bold rounded-full",
                    isDark || isGlass
                      ? "bg-[#80D1E9] text-[#0E2841]"
                      : "bg-[#2E3192] text-white",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </>
        )}
        {!isOpen && item.badge && item.badge > 0 && (
          <span
            className={cn(
              "absolute top-1 right-1 w-2 h-2 rounded-full",
              isDark || isGlass ? "bg-[#80D1E9]" : "bg-[#2E3192]",
            )}
          />
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 lg:top-16 h-full lg:h-[calc(100vh-4rem)]",
        "border-r transition-all duration-300 ease-in-out z-50 lg:z-40",
        "flex flex-col w-72 lg:w-64",
        // الإخفاء الكامل عند الإغلاق باستخدام transform
        isOpen ? "translate-x-0" : "-translate-x-full",
        isGlass
          ? "bg-black/95 lg:bg-black/40 backdrop-blur-2xl border-white/10"
          : isDark
            ? "bg-[var(--theme-sidebar)] border-[var(--theme-border)]"
            : "bg-white border-gray-200",
        DESIGN_TOKENS.shadow.sm,
      )}
    >
      {/* Mobile Header with Close Button */}
      <div
        className={cn(
          "lg:hidden flex items-center justify-between p-4 border-b",
          isGlass
            ? "border-white/10"
            : isDark
              ? "border-[var(--theme-border)]"
              : "border-gray-100",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 flex-shrink-0",
              "bg-gradient-to-br from-[#2E3192] to-[#0E2841]",
              DESIGN_TOKENS.borderRadius.md,
              "flex items-center justify-center",
            )}
          >
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1
              className={cn(
                "font-bold",
                isGlass || isDark ? "text-white" : "text-gray-800",
              )}
            >
              NESMA HR
            </h1>
          </div>
        </div>
        <button
          onClick={onClose}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isGlass || isDark
              ? "text-white hover:bg-white/10"
              : "text-gray-600 hover:bg-gray-100",
          )}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Logo Section */}
      <div
        className={cn(
          "hidden lg:block flex-shrink-0 p-4 border-b",
          isGlass
            ? "border-white/10"
            : isDark
              ? "border-[var(--theme-border)]"
              : "border-gray-100",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 flex-shrink-0",
              "bg-gradient-to-br from-[#2E3192] to-[#0E2841]",
              DESIGN_TOKENS.borderRadius.md,
              "flex items-center justify-center",
              DESIGN_TOKENS.shadow.md,
              "relative overflow-hidden",
            )}
          >
            {/* Animated shine effect on logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shine_3s_ease-in-out_infinite]" />
            <span className="text-white font-bold text-lg relative z-10">
              N
            </span>
          </div>
          {isOpen && (
            <div className="min-w-0">
              <h1
                className={cn(
                  "font-bold text-base truncate",
                  isGlass || isDark ? "text-white" : "text-gray-800",
                )}
              >
                NESMA HR
              </h1>
              <p className="text-[11px] text-[#80D1E9] font-medium">
                Version 2.0
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats - Animated colored cards (Hidden on mobile for cleaner UI) */}
      {isOpen && (
        <div
          className={cn(
            "hidden lg:block flex-shrink-0 p-3 border-b space-y-2",
            isGlass
              ? "border-white/10"
              : isDark
                ? "border-[var(--theme-border)]"
                : "border-gray-100",
          )}
        >
          {/* Row 1: Employees & Present */}
          <div className="grid grid-cols-2 gap-2">
            <AnimatedStatCard
              value={sidebarStats.employees.value}
              label="Employees"
              icon={<Users className="w-5 h-5 text-white" />}
              gradient="#3B82F6, #1D4ED8"
              glowColor="rgba(59, 130, 246, 0.3)"
              trend={sidebarStats.employees.trend}
              isDark={isDark}
              isGlass={isGlass}
              delay={0}
            />
            <AnimatedStatCard
              value={sidebarStats.present.value}
              label="Present"
              icon={<UserCheck className="w-5 h-5 text-white" />}
              gradient="#10B981, #059669"
              glowColor="rgba(16, 185, 129, 0.3)"
              trend={sidebarStats.present.trend}
              isDark={isDark}
              isGlass={isGlass}
              delay={200}
            />
          </div>

          {/* Row 2: On Leave & Late */}
          <div className="grid grid-cols-2 gap-2">
            <AnimatedStatCard
              value={sidebarStats.onLeave.value}
              label="On Leave"
              icon={<Palmtree className="w-5 h-5 text-white" />}
              gradient="#8B5CF6, #6D28D9"
              glowColor="rgba(139, 92, 246, 0.3)"
              isDark={isDark}
              isGlass={isGlass}
              delay={400}
            />
            <AnimatedStatCard
              value={sidebarStats.late.value}
              label="Late Today"
              icon={<Timer className="w-5 h-5 text-white" />}
              gradient="#F59E0B, #D97706"
              glowColor="rgba(245, 158, 11, 0.3)"
              isDark={isDark}
              isGlass={isGlass}
              delay={600}
            />
          </div>
        </div>
      )}

      {/* Collapsed Stats */}
      {!isOpen && (
        <div
          className={cn(
            "flex-shrink-0 py-3 border-b flex flex-col items-center gap-2",
            isGlass
              ? "border-white/10"
              : isDark
                ? "border-[var(--theme-border)]"
                : "border-gray-100",
          )}
        >
          <MiniStat
            value={sidebarStats.employees.value}
            color="#3B82F6, #1D4ED8"
            isDark={isDark}
          />
          <MiniStat
            value={sidebarStats.present.value}
            color="#10B981, #059669"
            isDark={isDark}
          />
        </div>
      )}

      {/* Navigation - Scrollable area */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden py-2",
          "scrollbar-thin",
          isGlass || isDark
            ? "scrollbar-thumb-gray-700"
            : "scrollbar-thumb-gray-300",
        )}
      >
        {sidebarItems.map((item) => renderSidebarItem(item))}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "flex-shrink-0 p-3 border-t",
          isGlass
            ? "border-white/10 bg-black/20"
            : isDark
              ? "border-[var(--theme-border)] bg-black/20"
              : "border-gray-100 bg-gray-50/50",
        )}
      >
        {isOpen ? (
          <div className="text-center">
            <p
              className={cn(
                "text-[10px] font-medium",
                isGlass || isDark ? "text-gray-500" : "text-gray-400",
              )}
            >
              NESMA Infrastructure & Technology
            </p>
            <p
              className={cn(
                "text-[9px] mt-0.5",
                isGlass || isDark ? "text-gray-600" : "text-gray-300",
              )}
            >
              HR System v2.0 | Jan 2026
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center",
                DESIGN_TOKENS.borderRadius.md,
                isGlass || isDark ? "bg-white/5" : "bg-gray-100",
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-bold",
                  isGlass || isDark ? "text-gray-500" : "text-gray-400",
                )}
              >
                v2
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
