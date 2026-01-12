import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Clock,
  Palmtree,
  FileText,
  Calendar,
  ArrowRight,
  CheckCircle,
  XCircle,
  UserPlus,
  Cake,
  Award,
  FileWarning,
  ChevronRight,
  DollarSign,
  Download,
} from "lucide-react";
import { Card, ChartCard } from "../../common/Card";
import { Badge, StatusBadge } from "../../common/Badge";
import { Avatar } from "../../common/Avatar";
import { Button } from "../../common/Button";
import { Modal } from "../../common/Modal";
import { StatsCard, DESIGN_TOKENS } from "../../common/StatsCard";
import { ColoredStatsCard, StatsGrid } from "../../common/ColoredStatsCard";
import { FilterBar, ActiveFilter, FilterConfig } from "../../common/FilterBar";
import { ExportButton } from "../../common/ExportButton";
import { QuickActionsSection } from "../../common/QuickActionsSection";
import {
  DataExportModal,
  createExportData,
  ExportData,
} from "../../common/DataExportModal";
import {
  InteractiveMap,
  MapLocation,
  NESMA_LOCATIONS,
} from "../../common/InteractiveMap";
import {
  EnhancedStat,
  SkeletonCard,
  SkeletonTable,
  Tooltip as EnhancedTooltip,
} from "../../common/EnhancedUI";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  getDashboardStats,
  employees as allEmployees,
  getPendingRequests,
  getPendingLeaves,
  getUpcomingLeaves,
  calendarEvents,
  getAttendanceStats,
} from "../../../data";
import { format, addDays, isBefore } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const stats = getDashboardStats();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const attendanceStats = getAttendanceStats(todayStr);
  const pendingRequests = getPendingRequests().slice(0, 5);
  const pendingLeaves = getPendingLeaves().slice(0, 5);
  const upcomingLeaves = getUpcomingLeaves(30);

  // Loading state for skeleton display
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Modal states
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);

  // Filter states
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter configuration
  const filterConfigs: FilterConfig[] = [
    {
      id: "department",
      label: "Department",
      type: "select",
      placeholder: "All Departments",
      options: [
        { value: "logistics", label: "Logistics", count: 15 },
        { value: "finance", label: "Finance", count: 8 },
        { value: "operations", label: "Operations", count: 12 },
        { value: "hr", label: "HR", count: 5 },
        { value: "it", label: "IT", count: 6 },
      ],
    },
    {
      id: "location",
      label: "Location",
      type: "select",
      placeholder: "All Locations",
      options: [
        { value: "riyadh", label: "Riyadh HQ", count: 30 },
        { value: "neom", label: "NEOM Site", count: 20 },
        { value: "redsea", label: "Red Sea", count: 15 },
        { value: "jeddah", label: "Jeddah", count: 10 },
        { value: "dammam", label: "Dammam", count: 5 },
      ],
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      placeholder: "All Statuses",
      options: [
        { value: "active", label: "Active", count: 72 },
        { value: "on-leave", label: "On Leave", count: 5 },
        { value: "inactive", label: "Inactive", count: 3 },
      ],
    },
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    if (value === null) {
      setActiveFilters((prev) => prev.filter((f) => f.filterId !== filterId));
    } else {
      const config = filterConfigs.find((c) => c.id === filterId);
      const option = config?.options?.find((o) => o.value === value);
      setActiveFilters((prev) => {
        const existing = prev.find((f) => f.filterId === filterId);
        if (existing) {
          return prev.map((f) =>
            f.filterId === filterId
              ? { ...f, value, label: option?.label || filterId }
              : f,
          );
        }
        return [...prev, { filterId, value, label: option?.label || filterId }];
      });
    }
  };

  const handleClearFilter = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.filterId !== filterId));
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  // Map locations with coordinates (using NESMA_LOCATIONS from InteractiveMap)
  const mapLocations = NESMA_LOCATIONS;

  // Sample attendance trend data
  const attendanceTrendData = [
    { week: "Week 1", present: 92, late: 5, absent: 3 },
    { week: "Week 2", present: 88, late: 8, absent: 4 },
    { week: "Week 3", present: 95, late: 3, absent: 2 },
    { week: "Week 4", present: 90, late: 6, absent: 4 },
    { week: "Week 5", present: 93, late: 4, absent: 3 },
    { week: "Week 6", present: 91, late: 5, absent: 4 },
  ];

  // Department distribution
  const departmentData = [
    { name: "Logistics", value: 15, color: "#2E3192" },
    { name: "Finance", value: 8, color: "#80D1E9" },
    { name: "Operations", value: 12, color: "#10B981" },
    { name: "HR", value: 5, color: "#F59E0B" },
    { name: "IT", value: 6, color: "#EF4444" },
    { name: "Other", value: 9, color: "#6B7280" },
  ];

  // Monthly payroll data
  const payrollData = [
    { month: "Jan", amount: 450000 },
    { month: "Feb", amount: 455000 },
    { month: "Mar", amount: 460000 },
    { month: "Apr", amount: 458000 },
    { month: "May", amount: 465000 },
    { month: "Jun", amount: 470000 },
  ];

  // Expiring documents
  const expiringDocuments = allEmployees
    .filter(
      (emp) =>
        emp.iqamaExpiry &&
        isBefore(new Date(emp.iqamaExpiry), addDays(today, 90)),
    )
    .slice(0, 5);

  // Upcoming birthdays
  const upcomingBirthdays = calendarEvents
    .filter((evt) => evt.type === "Birthday")
    .slice(0, 3);

  // Prepare detail data for stats cards
  const employeeDetailData = {
    headers: ["ID", "Name", "Department", "Position", "Status"],
    rows: allEmployees
      .slice(0, 20)
      .map((emp) => [
        emp.employeeId,
        emp.fullName,
        emp.department,
        emp.position,
        emp.status,
      ]),
  };

  const attendanceDetailData = {
    headers: ["Employee", "Check In", "Check Out", "Status", "Hours"],
    rows: allEmployees
      .slice(0, 15)
      .map((emp, idx) => [
        emp.fullName,
        "08:00 AM",
        idx % 3 === 0 ? "---" : "05:00 PM",
        idx % 5 === 0 ? "Late" : idx % 3 === 0 ? "Present" : "Present",
        idx % 3 === 0 ? "---" : "9h",
      ]),
  };

  const leavesDetailData = {
    headers: ["Employee", "Type", "From", "To", "Days", "Status"],
    rows: pendingLeaves.map((leave) => [
      leave.employeeName,
      leave.type,
      format(new Date(leave.startDate), "MMM dd"),
      format(new Date(leave.endDate), "MMM dd"),
      leave.days,
      leave.status,
    ]),
  };

  const requestsDetailData = {
    headers: ["ID", "Employee", "Type", "Title", "Date", "Status"],
    rows: pendingRequests.map((req) => [
      req.id,
      req.employeeName,
      req.type,
      req.title,
      format(new Date(req.createdAt), "MMM dd"),
      req.status,
    ]),
  };

  // Handle card click to show export modal
  const handleCardClick = (cardType: string) => {
    let data: ExportData;

    switch (cardType) {
      case "employees":
        data = {
          title: "Employee Report",
          columns: [
            { key: "id", label: "Employee ID" },
            { key: "name", label: "Full Name" },
            { key: "department", label: "Department" },
            { key: "position", label: "Position" },
            { key: "status", label: "Status" },
          ],
          data: allEmployees.slice(0, 20).map((emp) => ({
            id: emp.employeeId,
            name: emp.fullName,
            department: emp.department,
            position: emp.position,
            status: emp.status,
          })),
          summary: [
            { label: "Total", value: stats.totalEmployees },
            { label: "Active", value: stats.activeEmployees },
            { label: "New This Month", value: 5 },
            { label: "Departments", value: 6 },
          ],
        };
        break;
      case "attendance":
        data = {
          title: "Attendance Report",
          columns: [
            { key: "name", label: "Employee" },
            { key: "checkIn", label: "Check In" },
            { key: "checkOut", label: "Check Out" },
            { key: "status", label: "Status" },
            { key: "hours", label: "Hours" },
          ],
          data: allEmployees.slice(0, 15).map((emp, idx) => ({
            name: emp.fullName,
            checkIn: "08:00 AM",
            checkOut: idx % 3 === 0 ? "---" : "05:00 PM",
            status: idx % 5 === 0 ? "Late" : "Present",
            hours: idx % 3 === 0 ? "---" : "9h",
          })),
          summary: [
            { label: "Present", value: stats.presentToday },
            { label: "Late", value: attendanceStats.late },
            { label: "Absent", value: attendanceStats.absent },
            { label: "Rate", value: `${stats.attendanceRate}%` },
          ],
        };
        break;
      case "leaves":
        data = {
          title: "Leave Report",
          columns: [
            { key: "employee", label: "Employee" },
            { key: "type", label: "Type" },
            { key: "from", label: "From" },
            { key: "to", label: "To" },
            { key: "days", label: "Days" },
            { key: "status", label: "Status" },
          ],
          data: pendingLeaves.map((leave) => ({
            employee: leave.employeeName,
            type: leave.type,
            from: format(new Date(leave.startDate), "MMM dd"),
            to: format(new Date(leave.endDate), "MMM dd"),
            days: leave.days,
            status: leave.status,
          })),
          summary: [
            { label: "On Leave", value: stats.onLeave },
            { label: "Pending", value: pendingLeaves.length },
            { label: "Approved", value: 12 },
            { label: "Total Days", value: 45 },
          ],
        };
        break;
      case "requests":
        data = {
          title: "Requests Report",
          columns: [
            { key: "id", label: "ID" },
            { key: "employee", label: "Employee" },
            { key: "type", label: "Type" },
            { key: "title", label: "Title" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
          ],
          data: pendingRequests.map((req) => ({
            id: req.id,
            employee: req.employeeName,
            type: req.type,
            title: req.title,
            date: format(new Date(req.createdAt), "MMM dd"),
            status: req.status,
          })),
          summary: [
            { label: "Pending", value: stats.pendingRequests },
            { label: "Approved", value: 8 },
            { label: "Rejected", value: 2 },
            { label: "Total", value: pendingRequests.length + 10 },
          ],
        };
        break;
      default:
        return;
    }

    setExportData(data);
    setShowExportModal(true);
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Welcome Banner */}
      <div
        className={cn(
          "relative overflow-hidden p-6 md:p-8 text-white",
          DESIGN_TOKENS.borderRadius.lg,
          "bg-gradient-to-r from-[#2E3192] via-[#203366] to-[#0E2841]",
          isGlass &&
            "backdrop-blur-xl bg-gradient-to-r from-[#2E3192]/90 via-[#203366]/90 to-[#0E2841]/90",
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#80D1E9] rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#80D1E9] rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[#80D1E9] text-sm font-medium">Good Morning,</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Abdulrahman Hussein
            </h1>
            <p className="text-white/70 mt-2 max-w-lg text-sm md:text-base">
              You have{" "}
              <span className="text-[#80D1E9] font-semibold">
                {stats.pendingApprovals} pending approvals
              </span>{" "}
              and{" "}
              <span className="text-[#80D1E9] font-semibold">
                {pendingRequests.length} new requests
              </span>{" "}
              today
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/requests">
                <Button
                  variant="secondary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View Requests
                </Button>
              </Link>
              <Link to="/attendance">
                <Button variant="glass" size="md">
                  Check Attendance
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block text-right">
            <p className="text-white/60 text-sm">{format(today, "EEEE")}</p>
            <p className="text-xl md:text-2xl font-bold text-[#80D1E9]">
              {format(today, "dd MMMM yyyy")}
            </p>
            <div className="mt-4 flex items-center gap-2 justify-end">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/70">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
        onClearAll={handleClearAllFilters}
        onSearch={setSearchQuery}
        searchPlaceholder="Search employees, requests..."
        showSearch={true}
        showFilterCount={true}
      />

      {/* Stats Grid - Using Enhanced Stats with sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <EnhancedStat
              label="Total Employees"
              value={stats.totalEmployees}
              icon={<Users className="w-5 h-5" />}
              color="blue"
              trend={{ value: 5, isPositive: true, label: "vs last month" }}
              sparkline={[45, 52, 48, 61, 58, 63, 69, 72, 78, 80]}
              onClick={() => handleCardClick("employees")}
            />
            <EnhancedStat
              label="Present Today"
              value={stats.presentToday}
              icon={<Clock className="w-5 h-5" />}
              color="green"
              trend={{
                value: stats.attendanceRate,
                isPositive: stats.attendanceRate > 90,
                label: "rate",
              }}
              sparkline={[88, 92, 85, 90, 94, 91, 93, 89, 92, 94]}
              onClick={() => handleCardClick("attendance")}
            />
            <EnhancedStat
              label="On Leave"
              value={stats.onLeave}
              icon={<Palmtree className="w-5 h-5" />}
              color="amber"
              sparkline={[3, 5, 4, 6, 4, 5, 3, 4, 5, 4]}
              onClick={() => handleCardClick("leaves")}
            />
            <EnhancedStat
              label="Pending Requests"
              value={stats.pendingRequests}
              icon={<FileText className="w-5 h-5" />}
              color="purple"
              trend={{ value: 8, isPositive: false, label: "new" }}
              sparkline={[12, 8, 15, 10, 7, 11, 9, 13, 8, 10]}
              onClick={() => handleCardClick("requests")}
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Trend Chart */}
          <div
            className={cn(
              "p-6",
              DESIGN_TOKENS.borderRadius.lg,
              DESIGN_TOKENS.shadow.sm,
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
                  : "bg-white border border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className={cn(
                    "text-lg font-semibold",
                    isGlass || isGlass || isDark
                      ? "text-white"
                      : "text-gray-800",
                  )}
                >
                  Attendance Trend
                </h3>
                <p
                  className={cn(
                    "text-sm mt-0.5",
                    isGlass
                      ? "text-white/60"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-500",
                  )}
                >
                  Weekly attendance statistics
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className={cn(
                    "text-sm border px-3 py-2 focus:outline-none focus:ring-2",
                    DESIGN_TOKENS.borderRadius.md,
                    isGlass
                      ? "bg-white/5 border-white/15 text-white focus:ring-[#80D1E9]/20"
                      : isDark
                        ? "bg-[var(--theme-bg)] border-[var(--theme-border)] text-gray-300 focus:ring-[#80D1E9]/20"
                        : "border-gray-200 text-gray-700 focus:ring-[#2E3192]/20 focus:border-[#2E3192]",
                  )}
                >
                  <option>Last 6 Weeks</option>
                  <option>Last 3 Months</option>
                  <option>Last 6 Months</option>
                </select>
                <ExportButton
                  variant="icon"
                  data={{
                    headers: ["Week", "Present %", "Late %", "Absent %"],
                    rows: attendanceTrendData.map((d) => [
                      d.week,
                      d.present,
                      d.late,
                      d.absent,
                    ]),
                    title: "Attendance Trend Report",
                    filename: "attendance_trend",
                  }}
                />
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData}>
                  <defs>
                    <linearGradient
                      id="presentGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="lateGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{
                      fill: isDark ? "#9CA3AF" : "#6B7280",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: isDark ? "#9CA3AF" : "#6B7280",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1F2937" : "#fff",
                      border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      color: isDark ? "#F3F4F6" : "#1F2937",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#presentGradient)"
                    name="Present %"
                  />
                  <Area
                    type="monotone"
                    dataKey="late"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#lateGradient)"
                    name="Late %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Approvals */}
          <div
            className={cn(
              "p-6",
              DESIGN_TOKENS.borderRadius.lg,
              DESIGN_TOKENS.shadow.sm,
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
                  : "bg-white border border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className={cn(
                    "text-lg font-semibold",
                    isGlass || isGlass || isDark
                      ? "text-white"
                      : "text-gray-800",
                  )}
                >
                  Pending Approvals
                </h2>
                <p
                  className={cn(
                    "text-sm",
                    isGlass
                      ? "text-white/60"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-500",
                  )}
                >
                  {pendingRequests.length} requests waiting for your action
                </p>
              </div>
              <Link
                to="/requests"
                className={cn(
                  "text-sm font-medium flex items-center gap-1 transition-colors",
                  isGlass || isDark
                    ? "text-[#80D1E9] hover:text-[#80D1E9]/80"
                    : "text-[#2E3192] hover:underline",
                )}
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                      isGlass || isDark ? "bg-emerald-500/20" : "bg-green-100",
                    )}
                  >
                    <CheckCircle
                      className={cn(
                        "w-8 h-8",
                        isGlass || isDark
                          ? "text-emerald-400"
                          : "text-green-500",
                      )}
                    />
                  </div>
                  <p
                    className={
                      isGlass || isDark ? "text-white/60" : "text-gray-500"
                    }
                  >
                    No pending approvals
                  </p>
                </div>
              ) : (
                pendingRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className={cn(
                      "flex items-center justify-between p-4",
                      DESIGN_TOKENS.borderRadius.md,
                      "transition-all duration-300 hover:-translate-y-0.5",
                      isGlass
                        ? "bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-[#80D1E9]/30"
                        : isDark
                          ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#80D1E9]/30"
                          : "bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-[#80D1E9]/30 hover:shadow-md",
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar name={request.employeeName} size="md" />
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            isGlass || isGlass || isDark
                              ? "text-white"
                              : "text-gray-800",
                          )}
                        >
                          {request.employeeName}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isGlass
                              ? "text-white/60"
                              : isDark
                                ? "text-gray-400"
                                : "text-gray-500",
                          )}
                        >
                          {request.title}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-0.5",
                            isDark ? "text-gray-500" : "text-gray-400",
                          )}
                        >
                          {format(new Date(request.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={request.status} size="sm" />
                      <div className="flex gap-1">
                        <button
                          className={cn(
                            "p-2 transition-colors",
                            DESIGN_TOKENS.borderRadius.md,
                            isDark
                              ? "text-emerald-400 hover:bg-emerald-500/20"
                              : "text-green-600 hover:bg-green-50",
                          )}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          className={cn(
                            "p-2 transition-colors",
                            DESIGN_TOKENS.borderRadius.md,
                            isDark
                              ? "text-rose-400 hover:bg-rose-500/20"
                              : "text-red-600 hover:bg-red-50",
                          )}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interactive Map */}
          <div
            className={cn(
              "p-6",
              DESIGN_TOKENS.borderRadius.lg,
              DESIGN_TOKENS.shadow.sm,
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
                  : "bg-white border border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className={cn(
                    "text-lg font-semibold",
                    isGlass || isDark ? "text-white" : "text-gray-800",
                  )}
                >
                  Employee Locations
                </h2>
                <p
                  className={cn(
                    "text-sm",
                    isGlass
                      ? "text-white/60"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-500",
                  )}
                >
                  Distribution across {mapLocations.length} locations
                </p>
              </div>
              <Link
                to="/locations"
                className={cn(
                  "text-sm font-medium flex items-center gap-1 transition-colors",
                  isDark
                    ? "text-[#80D1E9] hover:text-[#80D1E9]/80"
                    : "text-[#2E3192] hover:underline",
                )}
              >
                Manage Locations <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <InteractiveMap locations={mapLocations} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Department Distribution */}
          <div
            className={cn(
              "p-6",
              DESIGN_TOKENS.borderRadius.lg,
              DESIGN_TOKENS.shadow.sm,
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
                  : "bg-white border border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  isGlass || isDark ? "text-white" : "text-gray-800",
                )}
              >
                Department Distribution
              </h2>
              <ExportButton
                variant="icon"
                size="sm"
                data={{
                  headers: ["Department", "Employees", "Percentage"],
                  rows: departmentData.map((d) => [
                    d.name,
                    d.value,
                    `${Math.round((d.value / 55) * 100)}%`,
                  ]),
                  title: "Department Distribution",
                  filename: "department_distribution",
                }}
              />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1F2937" : "#fff",
                      border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "8px",
                      color: isDark ? "#F3F4F6" : "#1F2937",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {departmentData.slice(0, 4).map((dept) => (
                <div key={dept.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span
                    className={cn(
                      "text-sm truncate",
                      isGlass
                        ? "text-white/80"
                        : isDark
                          ? "text-gray-300"
                          : "text-gray-600",
                    )}
                  >
                    {dept.name} ({dept.value})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Birthdays */}
          <div
            className={cn(
              "p-6",
              DESIGN_TOKENS.borderRadius.lg,
              DESIGN_TOKENS.shadow.sm,
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
                  : "bg-white border border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  isGlass || isDark ? "text-white" : "text-gray-800",
                )}
              >
                Upcoming Birthdays
              </h2>
              <div
                className={cn(
                  "p-2",
                  DESIGN_TOKENS.borderRadius.md,
                  isDark ? "bg-pink-500/20" : "bg-pink-100",
                )}
              >
                <Cake
                  className={cn(
                    "w-5 h-5",
                    isDark ? "text-pink-400" : "text-pink-500",
                  )}
                />
              </div>
            </div>
            {upcomingBirthdays.length === 0 ? (
              <p
                className={cn(
                  "text-center py-4",
                  isGlass
                    ? "text-white/60"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-500",
                )}
              >
                No upcoming birthdays
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingBirthdays.map((birthday) => (
                  <div
                    key={birthday.id}
                    className={cn(
                      "flex items-center gap-3 p-3",
                      DESIGN_TOKENS.borderRadius.md,
                      isDark
                        ? "bg-pink-500/10 border border-pink-500/20"
                        : "bg-gradient-to-r from-pink-50 to-white",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 flex items-center justify-center",
                        DESIGN_TOKENS.borderRadius.md,
                        "bg-gradient-to-br from-pink-400 to-pink-600",
                      )}
                    >
                      <Cake className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          isGlass || isDark ? "text-white" : "text-gray-800",
                        )}
                      >
                        {birthday.title.replace(" Birthday", "")}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isGlass
                            ? "text-white/60"
                            : isDark
                              ? "text-gray-400"
                              : "text-gray-500",
                        )}
                      >
                        {format(new Date(birthday.startDate), "MMM dd")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring Documents */}
          <div
            className={cn(
              "p-6",
              DESIGN_TOKENS.borderRadius.lg,
              DESIGN_TOKENS.shadow.sm,
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
                  : "bg-white border border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  isGlass || isDark ? "text-white" : "text-gray-800",
                )}
              >
                Expiring Documents
              </h2>
              <Badge
                variant="warning"
                size="sm"
                className={
                  isDark
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : ""
                }
              >
                {expiringDocuments.length} alerts
              </Badge>
            </div>
            {expiringDocuments.length === 0 ? (
              <p
                className={cn(
                  "text-center py-4",
                  isGlass
                    ? "text-white/60"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-500",
                )}
              >
                No expiring documents
              </p>
            ) : (
              <div className="space-y-3">
                {expiringDocuments.map((emp) => (
                  <div
                    key={emp.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border",
                      DESIGN_TOKENS.borderRadius.md,
                      isDark
                        ? "bg-amber-500/10 border-amber-500/20"
                        : "bg-gradient-to-r from-amber-50 to-white border-amber-100",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 flex items-center justify-center flex-shrink-0",
                        DESIGN_TOKENS.borderRadius.md,
                        "bg-gradient-to-br from-amber-400 to-amber-600",
                      )}
                    >
                      <FileWarning className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-medium truncate",
                          isGlass || isDark ? "text-white" : "text-gray-800",
                        )}
                      >
                        {emp.fullName}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isGlass
                            ? "text-white/60"
                            : isDark
                              ? "text-gray-400"
                              : "text-gray-500",
                        )}
                      >
                        Iqama expires:{" "}
                        {emp.iqamaExpiry
                          ? format(new Date(emp.iqamaExpiry), "dd MMM yyyy")
                          : "N/A"}
                      </p>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 flex-shrink-0",
                        isDark ? "text-gray-600" : "text-gray-300",
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly Payroll */}
          <div
            className={cn(
              "p-6",
              DESIGN_TOKENS.borderRadius.lg,
              DESIGN_TOKENS.shadow.sm,
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
                  : "bg-white border border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  isGlass || isDark ? "text-white" : "text-gray-800",
                )}
              >
                Payroll Trend
              </h2>
              <div
                className={cn(
                  "p-2",
                  DESIGN_TOKENS.borderRadius.md,
                  isDark ? "bg-emerald-500/20" : "bg-green-100",
                )}
              >
                <DollarSign
                  className={cn(
                    "w-5 h-5",
                    isDark ? "text-emerald-400" : "text-green-600",
                  )}
                />
              </div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData}>
                  <Bar
                    dataKey="amount"
                    fill={isDark ? "#80D1E9" : "#2E3192"}
                    radius={[4, 4, 0, 0]}
                  />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("en-SA", {
                        style: "currency",
                        currency: "SAR",
                        minimumFractionDigits: 0,
                      }).format(value as number)
                    }
                    contentStyle={{
                      backgroundColor: isDark ? "#1F2937" : "#fff",
                      border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "8px",
                      color: isDark ? "#F3F4F6" : "#1F2937",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div
              className={cn(
                "mt-4 pt-4 border-t",
                isDark ? "border-[var(--theme-border)]" : "border-gray-100",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm",
                    isGlass
                      ? "text-white/60"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-500",
                  )}
                >
                  This Month
                </span>
                <span
                  className={cn(
                    "text-lg font-bold",
                    isDark ? "text-[#80D1E9]" : "text-[#2E3192]",
                  )}
                >
                  470,000 SAR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Using new QuickActionsSection */}
      <div
        className={cn(
          "p-6",
          DESIGN_TOKENS.borderRadius.lg,
          DESIGN_TOKENS.shadow.sm,
          isGlass
            ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
            : isDark
              ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
              : "bg-white border border-gray-100",
        )}
      >
        <QuickActionsSection
          title="Quick Actions"
          columns={4}
          onActionClick={(actionId) => {
            console.log("Action clicked:", actionId);
          }}
        />
      </div>

      {/* Data Export Modal */}
      {exportData && (
        <DataExportModal
          isOpen={showExportModal}
          onClose={() => {
            setShowExportModal(false);
            setExportData(null);
          }}
          data={exportData}
          onExport={(format, data) => {
            console.log("Exporting:", format, data);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
