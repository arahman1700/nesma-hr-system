import React, { useState, useEffect, useMemo } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Users,
  UserCheck,
  Briefcase,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  Building2,
  Award,
  Cake,
  GraduationCap,
  Heart,
  Star,
  Activity,
  Target,
  Zap,
  Globe,
  Shield,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
export interface HRStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  newHires: number; // last 30 days

  // Employee Types
  fullTime: number;
  partTime: number;
  contractors: number;
  interns: number;

  // Demographics
  averageAge: number;
  maleCount: number;
  femaleCount: number;

  // Tenure
  averageTenure: number; // in years
  under1Year: number;
  oneToThreeYears: number;
  threeToFiveYears: number;
  overFiveYears: number;

  // Departments
  departmentCounts: { name: string; count: number; color: string }[];

  // Locations
  locationCounts: { name: string; count: number; isHQ?: boolean }[];

  // Performance
  topPerformers: number;
  needsImprovement: number;

  // Attendance
  presentToday: number;
  absentToday: number;
  lateToday: number;
  attendanceRate: number;
}

// ============================================
// ANIMATED NUMBER COMPONENT
// ============================================
interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1500,
  delay = 0,
  suffix = "",
  prefix = "",
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = Date.now() + delay;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = easeOutQuart * end;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, delay]);

  return (
    <span>
      {prefix}
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue)}
      {suffix}
    </span>
  );
};

// ============================================
// HR STAT CARD - Base Component
// ============================================
interface HRStatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean; label?: string };
  onClick?: () => void;
  delay?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export const HRStatCard: React.FC<HRStatCardProps> = ({
  title,
  value,
  icon,
  gradient,
  glowColor,
  subtitle,
  trend,
  onClick,
  delay = 0,
  suffix = "",
  prefix = "",
  decimals = 0,
  size = "md",
  children,
}) => {
  const { theme } = useTheme();
  const isGlass = theme === "glass";
  const isDark = theme === "dark" || theme === "company";
  const [isHovered, setIsHovered] = useState(false);

  const sizeStyles = {
    sm: "p-3",
    md: "p-4",
    lg: "p-5",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const valueSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer",
        "transition-all duration-500 ease-out",
        "group",
        sizeStyles[size],
      )}
      style={{
        background: `linear-gradient(135deg, ${gradient})`,
        boxShadow: isHovered
          ? `0 15px 40px ${glowColor}, 0 0 60px ${glowColor}`
          : `0 8px 25px ${glowColor}`,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
        <div
          className={cn(
            "absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl",
            "transition-transform duration-700",
            isHovered && "scale-150",
          )}
        />
        <div
          className={cn(
            "absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-xl",
            "transition-transform duration-700 delay-100",
            isHovered && "scale-150",
          )}
        />
        {/* Shine effect */}
        <div
          className={cn(
            "absolute inset-0 -translate-x-full",
            "bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "transition-transform duration-1000 ease-out",
            isHovered && "translate-x-full",
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          {/* Icon */}
          <div
            className={cn(
              "flex items-center justify-center rounded-xl",
              "bg-white/20 backdrop-blur-sm border border-white/20",
              iconSizes[size],
              "transition-all duration-300",
              "group-hover:scale-110 group-hover:rotate-6",
            )}
          >
            {icon}
          </div>

          {/* Trend Badge */}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full",
                "text-xs font-bold backdrop-blur-sm",
                trend.isPositive
                  ? "bg-emerald-500/30 text-emerald-100"
                  : "bg-red-500/30 text-red-100",
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className={cn("font-bold text-white", valueSizes[size])}>
          <AnimatedNumber
            value={value}
            delay={delay}
            suffix={suffix}
            prefix={prefix}
            decimals={decimals}
          />
        </div>

        {/* Title & Subtitle */}
        <p className="text-white/80 text-sm font-medium mt-1">{title}</p>
        {subtitle && <p className="text-white/60 text-xs mt-0.5">{subtitle}</p>}
        {trend?.label && (
          <p className="text-white/50 text-xs mt-1">{trend.label}</p>
        )}

        {/* Custom children */}
        {children}
      </div>
    </div>
  );
};

// ============================================
// EMPLOYEE TYPE CARD - Shows distribution
// ============================================
interface EmployeeTypeCardProps {
  fullTime: number;
  partTime: number;
  contractors: number;
  interns: number;
  delay?: number;
}

export const EmployeeTypeCard: React.FC<EmployeeTypeCardProps> = ({
  fullTime,
  partTime,
  contractors,
  interns,
  delay = 0,
}) => {
  const { theme } = useTheme();
  const isGlass = theme === "glass";
  const isDark = theme === "dark" || theme === "company";
  const [isHovered, setIsHovered] = useState(false);

  const total = fullTime + partTime + contractors + interns;
  const types = [
    {
      label: "Full-time",
      value: fullTime,
      color: "#3B82F6",
      percent: (fullTime / total) * 100,
    },
    {
      label: "Part-time",
      value: partTime,
      color: "#10B981",
      percent: (partTime / total) * 100,
    },
    {
      label: "Contractors",
      value: contractors,
      color: "#F59E0B",
      percent: (contractors / total) * 100,
    },
    {
      label: "Interns",
      value: interns,
      color: "#8B5CF6",
      percent: (interns / total) * 100,
    },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        "transition-all duration-500 ease-out",
        "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
      )}
      style={{
        boxShadow: isHovered
          ? "0 15px 40px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.3)"
          : "0 8px 25px rgba(139, 92, 246, 0.3)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">Employment Types</p>
            <p className="text-white/60 text-xs">Distribution breakdown</p>
          </div>
        </div>

        {/* Progress bars */}
        <div className="space-y-3">
          {types.map((type, i) => (
            <div key={type.label}>
              <div className="flex items-center justify-between text-xs text-white/80 mb-1">
                <span>{type.label}</span>
                <span className="font-semibold">
                  <AnimatedNumber value={type.value} delay={delay + i * 100} />
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${type.percent}%`,
                    backgroundColor: type.color,
                    transitionDelay: `${delay + i * 100}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DEMOGRAPHICS CARD - Age & Gender
// ============================================
interface DemographicsCardProps {
  averageAge: number;
  maleCount: number;
  femaleCount: number;
  delay?: number;
}

export const DemographicsCard: React.FC<DemographicsCardProps> = ({
  averageAge,
  maleCount,
  femaleCount,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const total = maleCount + femaleCount;
  const malePercent = (maleCount / total) * 100;
  const femalePercent = (femaleCount / total) * 100;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        "transition-all duration-500 ease-out",
        "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600",
      )}
      style={{
        boxShadow: isHovered
          ? "0 15px 40px rgba(6, 182, 212, 0.4), 0 0 60px rgba(6, 182, 212, 0.3)"
          : "0 8px 25px rgba(6, 182, 212, 0.3)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">Demographics</p>
            <p className="text-white/60 text-xs">Age & Gender stats</p>
          </div>
        </div>

        {/* Average Age */}
        <div className="flex items-center justify-between mb-4 p-3 bg-white/10 rounded-xl">
          <div className="flex items-center gap-2">
            <Cake className="w-4 h-4 text-white/70" />
            <span className="text-white/80 text-sm">Average Age</span>
          </div>
          <span className="text-white font-bold text-lg">
            <AnimatedNumber
              value={averageAge}
              delay={delay}
              decimals={1}
              suffix=" yrs"
            />
          </span>
        </div>

        {/* Gender Distribution */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex-1 h-3 bg-blue-400 rounded-l-full"
            style={{ width: `${malePercent}%` }}
          />
          <div
            className="flex-1 h-3 bg-pink-400 rounded-r-full"
            style={{ width: `${femalePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/80">
          <span>
            Male: <AnimatedNumber value={maleCount} delay={delay + 200} /> (
            {malePercent.toFixed(0)}%)
          </span>
          <span>
            Female: <AnimatedNumber value={femaleCount} delay={delay + 300} /> (
            {femalePercent.toFixed(0)}%)
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TENURE CARD - Employee Tenure Distribution
// ============================================
interface TenureCardProps {
  averageTenure: number;
  under1Year: number;
  oneToThreeYears: number;
  threeToFiveYears: number;
  overFiveYears: number;
  delay?: number;
}

export const TenureCard: React.FC<TenureCardProps> = ({
  averageTenure,
  under1Year,
  oneToThreeYears,
  threeToFiveYears,
  overFiveYears,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const total = under1Year + oneToThreeYears + threeToFiveYears + overFiveYears;

  const segments = [
    { label: "<1 yr", value: under1Year, color: "#EF4444" },
    { label: "1-3 yrs", value: oneToThreeYears, color: "#F59E0B" },
    { label: "3-5 yrs", value: threeToFiveYears, color: "#10B981" },
    { label: "5+ yrs", value: overFiveYears, color: "#3B82F6" },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        "transition-all duration-500 ease-out",
        "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600",
      )}
      style={{
        boxShadow: isHovered
          ? "0 15px 40px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.3)"
          : "0 8px 25px rgba(16, 185, 129, 0.3)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">Employee Tenure</p>
            <p className="text-white/60 text-xs">
              Avg:{" "}
              <AnimatedNumber
                value={averageTenure}
                delay={delay}
                decimals={1}
                suffix=" years"
              />
            </p>
          </div>
        </div>

        {/* Horizontal bar chart */}
        <div className="flex h-4 rounded-full overflow-hidden mb-3">
          {segments.map((seg, i) => (
            <div
              key={seg.label}
              className="transition-all duration-1000"
              style={{
                width: `${(seg.value / total) * 100}%`,
                backgroundColor: seg.color,
                transitionDelay: `${delay + i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {segments.map((seg, i) => (
            <div
              key={seg.label}
              className="flex items-center gap-2 text-xs text-white/80"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span>
                {seg.label}:{" "}
                <AnimatedNumber value={seg.value} delay={delay + i * 100} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// ATTENDANCE RATE CARD - Circular Progress
// ============================================
interface AttendanceRateCardProps {
  rate: number;
  present: number;
  absent: number;
  late: number;
  delay?: number;
}

export const AttendanceRateCard: React.FC<AttendanceRateCardProps> = ({
  rate,
  present,
  absent,
  late,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animatedRate, setAnimatedRate] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedRate(rate);
    }, delay);
    return () => clearTimeout(timer);
  }, [rate, delay]);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (animatedRate / 100) * circumference;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        "transition-all duration-500 ease-out",
        "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
      )}
      style={{
        boxShadow: isHovered
          ? "0 15px 40px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.3)"
          : "0 8px 25px rgba(245, 158, 11, 0.3)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold mb-1">Attendance Rate</p>
            <p className="text-white/60 text-xs">Today's overview</p>
          </div>

          {/* Circular Progress */}
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                <AnimatedNumber value={rate} delay={delay} suffix="%" />
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <p className="text-white font-bold">
              <AnimatedNumber value={present} delay={delay + 100} />
            </p>
            <p className="text-white/60 text-xs">Present</p>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <p className="text-white font-bold">
              <AnimatedNumber value={absent} delay={delay + 200} />
            </p>
            <p className="text-white/60 text-xs">Absent</p>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <p className="text-white font-bold">
              <AnimatedNumber value={late} delay={delay + 300} />
            </p>
            <p className="text-white/60 text-xs">Late</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// HR DASHBOARD GRID - Full Layout Component
// ============================================
interface HRDashboardGridProps {
  stats: HRStats;
  onCardClick?: (cardType: string) => void;
  className?: string;
}

export const HRDashboardGrid: React.FC<HRDashboardGridProps> = ({
  stats,
  onCardClick,
  className,
}) => {
  return (
    <div className={cn("space-y-5", className)}>
      {/* Row 1: Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HRStatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users className="w-5 h-5 text-white" />}
          gradient="#3B82F6, #1D4ED8"
          glowColor="rgba(59, 130, 246, 0.3)"
          trend={{ value: 5, isPositive: true, label: "vs last month" }}
          onClick={() => onCardClick?.("employees")}
          delay={0}
        />
        <HRStatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={<UserCheck className="w-5 h-5 text-white" />}
          gradient="#10B981, #059669"
          glowColor="rgba(16, 185, 129, 0.3)"
          subtitle={`${Math.round((stats.activeEmployees / stats.totalEmployees) * 100)}% of total`}
          onClick={() => onCardClick?.("active")}
          delay={100}
        />
        <HRStatCard
          title="New Hires"
          value={stats.newHires}
          icon={<Star className="w-5 h-5 text-white" />}
          gradient="#8B5CF6, #6D28D9"
          glowColor="rgba(139, 92, 246, 0.3)"
          subtitle="Last 30 days"
          onClick={() => onCardClick?.("newHires")}
          delay={200}
        />
        <HRStatCard
          title="On Leave"
          value={stats.onLeave}
          icon={<Calendar className="w-5 h-5 text-white" />}
          gradient="#F59E0B, #D97706"
          glowColor="rgba(245, 158, 11, 0.3)"
          subtitle="Currently away"
          onClick={() => onCardClick?.("onLeave")}
          delay={300}
        />
      </div>

      {/* Row 2: Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EmployeeTypeCard
          fullTime={stats.fullTime}
          partTime={stats.partTime}
          contractors={stats.contractors}
          interns={stats.interns}
          delay={400}
        />
        <DemographicsCard
          averageAge={stats.averageAge}
          maleCount={stats.maleCount}
          femaleCount={stats.femaleCount}
          delay={500}
        />
        <TenureCard
          averageTenure={stats.averageTenure}
          under1Year={stats.under1Year}
          oneToThreeYears={stats.oneToThreeYears}
          threeToFiveYears={stats.threeToFiveYears}
          overFiveYears={stats.overFiveYears}
          delay={600}
        />
        <AttendanceRateCard
          rate={stats.attendanceRate}
          present={stats.presentToday}
          absent={stats.absentToday}
          late={stats.lateToday}
          delay={700}
        />
      </div>
    </div>
  );
};

export default HRDashboardGrid;
