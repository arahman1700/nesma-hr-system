import React from "react";
import {
  UserPlus,
  FileText,
  Calendar,
  Clock,
  DollarSign,
  Mail,
  Settings,
  BarChart3,
  Users,
  Briefcase,
  Award,
  Building2,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  onClick?: () => void;
}

const defaultActions: QuickAction[] = [
  {
    id: "add-employee",
    label: "Add Employee",
    description: "Register new team member",
    icon: <UserPlus className="w-6 h-6" />,
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    id: "request-leave",
    label: "Request Leave",
    description: "Submit leave application",
    icon: <Calendar className="w-6 h-6" />,
    gradient: "from-emerald-500 via-emerald-600 to-teal-700",
    glowColor: "rgba(16, 185, 129, 0.5)",
  },
  {
    id: "clock-in",
    label: "Clock In/Out",
    description: "Mark attendance",
    icon: <Clock className="w-6 h-6" />,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    glowColor: "rgba(245, 158, 11, 0.5)",
  },
  {
    id: "payroll",
    label: "Run Payroll",
    description: "Process salaries",
    icon: <DollarSign className="w-6 h-6" />,
    gradient: "from-purple-500 via-purple-600 to-indigo-700",
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
  {
    id: "generate-letter",
    label: "Generate Letter",
    description: "Create HR documents",
    icon: <FileText className="w-6 h-6" />,
    gradient: "from-cyan-500 via-cyan-600 to-blue-700",
    glowColor: "rgba(6, 182, 212, 0.5)",
  },
  {
    id: "send-announcement",
    label: "Announcement",
    description: "Broadcast to team",
    icon: <Mail className="w-6 h-6" />,
    gradient: "from-rose-500 via-pink-500 to-fuchsia-600",
    glowColor: "rgba(244, 63, 94, 0.5)",
  },
  {
    id: "reports",
    label: "Generate Report",
    description: "Analytics & insights",
    icon: <BarChart3 className="w-6 h-6" />,
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    glowColor: "rgba(99, 102, 241, 0.5)",
  },
  {
    id: "settings",
    label: "HR Settings",
    description: "Configure system",
    icon: <Settings className="w-6 h-6" />,
    gradient: "from-slate-500 via-slate-600 to-gray-700",
    glowColor: "rgba(100, 116, 139, 0.5)",
  },
];

interface QuickActionsSectionProps {
  actions?: QuickAction[];
  title?: string;
  columns?: 2 | 3 | 4 | 6 | 8;
  onActionClick?: (actionId: string) => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  actions = defaultActions,
  title = "Quick Actions",
  columns = 4,
  onActionClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    8: "grid-cols-2 md:grid-cols-4 lg:grid-cols-8",
  };

  return (
    <div className="space-y-4">
      {title && (
        <h2
          className={cn(
            "text-lg font-semibold",
            isGlass
              ? "text-[#2E3192]"
              : isDark
                ? "text-white"
                : "text-gray-800",
          )}
        >
          {title}
        </h2>
      )}

      <div className={cn("grid gap-4", gridCols[columns])}>
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={() => {
              action.onClick?.();
              onActionClick?.(action.id);
            }}
            className={cn(
              "group relative overflow-hidden rounded-2xl p-5",
              "transition-all duration-500 ease-out",
              "hover:scale-[1.02] hover:-translate-y-1",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              isGlass
                ? "bg-white/10 backdrop-blur-xl border border-white/20 focus:ring-[#2E3192]/50"
                : isDark
                  ? "bg-gray-800/50 border border-gray-700 focus:ring-cyan-500/50"
                  : "bg-white border border-gray-100 shadow-sm focus:ring-[#2E3192]/50",
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* Gradient Background on Hover */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100",
                "transition-opacity duration-500",
                `bg-gradient-to-br ${action.gradient}`,
              )}
            />

            {/* Glow Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
              style={{ background: action.glowColor }}
            />

            {/* Shine Effect */}
            <div
              className={cn(
                "absolute inset-0 -translate-x-full group-hover:translate-x-full",
                "transition-transform duration-1000 ease-out",
                "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                "skew-x-12",
              )}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon Container */}
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-3",
                  "transition-all duration-500",
                  "group-hover:scale-110 group-hover:rotate-3",
                  `bg-gradient-to-br ${action.gradient}`,
                  "shadow-lg",
                )}
                style={{
                  boxShadow: `0 8px 24px ${action.glowColor}`,
                }}
              >
                <span className="text-white">{action.icon}</span>
              </div>

              {/* Text */}
              <h3
                className={cn(
                  "font-semibold text-sm transition-colors duration-300",
                  "group-hover:text-white",
                  isGlass
                    ? "text-[#2E3192]"
                    : isDark
                      ? "text-white"
                      : "text-gray-800",
                )}
              >
                {action.label}
              </h3>
              <p
                className={cn(
                  "text-xs mt-1 transition-colors duration-300",
                  "group-hover:text-white/80",
                  isGlass
                    ? "text-[#2E3192]/70"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-500",
                )}
              >
                {action.description}
              </p>
            </div>

            {/* Floating Particles on Hover */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="absolute w-1 h-1 bg-white/50 rounded-full animate-ping"
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "1.5s",
                  }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Mini version for smaller spaces
export const MiniQuickActions: React.FC<{
  actions?: QuickAction[];
  onActionClick?: (actionId: string) => void;
}> = ({ actions = defaultActions.slice(0, 4), onActionClick }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";

  return (
    <div className="flex gap-2 flex-wrap">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick?.(action.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl",
            "transition-all duration-300",
            "hover:scale-105",
            isGlass
              ? "bg-white/10 backdrop-blur text-[#2E3192] hover:bg-white/20"
              : isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          <span
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              `bg-gradient-to-br ${action.gradient}`,
              "text-white text-sm",
            )}
          >
            {action.icon}
          </span>
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsSection;
