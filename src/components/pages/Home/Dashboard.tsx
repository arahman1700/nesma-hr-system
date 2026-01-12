import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Briefcase,
  Building2,
  MapPin,
  AlertTriangle,
  Eye,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  Bell,
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
  EnhancedAvatar,
} from "../../common/EnhancedUI";
import {
  InteractiveStatCard,
  DetailModal,
  DataTable,
  SummaryStats,
} from "../../common/InteractiveCard";
import {
  ChartWrapper,
  EnhancedAreaChart,
  EnhancedDonutChart,
  EnhancedBarChart,
  ProgressRing,
  MultiProgressRing,
  StatComparison,
  TimelineChart,
} from "../../common/AdvancedCharts";
import { EmployeeDetailModal } from "../../common/EmployeeDetailModal";
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
import { format, addDays, isBefore, differenceInDays } from "date-fns";
import { Employee } from "../../../types";
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
  Legend,
  LineChart,
  Line,
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Filter states
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("week");

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

  // Map locations with coordinates
  const mapLocations = NESMA_LOCATIONS;

  // Enhanced attendance trend data
  const attendanceTrendData = [
    { name: "Mon", present: 92, late: 5, absent: 3, target: 95 },
    { name: "Tue", present: 88, late: 8, absent: 4, target: 95 },
    { name: "Wed", present: 95, late: 3, absent: 2, target: 95 },
    { name: "Thu", present: 90, late: 6, absent: 4, target: 95 },
    { name: "Fri", present: 93, late: 4, absent: 3, target: 95 },
    { name: "Sat", present: 91, late: 5, absent: 4, target: 95 },
    { name: "Sun", present: 94, late: 3, absent: 3, target: 95 },
  ];

  // Department distribution
  const departmentData = [
    { name: "Logistics", value: 15, color: "#2E3192" },
    { name: "Finance", value: 8, color: "#80D1E9" },
    { name: "Operations", value: 12, color: "#10B981" },
    { name: "HR", value: 5, color: "#F59E0B" },
    { name: "IT", value: 6, color: "#EF4444" },
    { name: "Marketing", value: 4, color: "#8B5CF6" },
  ];

  // Monthly payroll data
  const payrollData = [
    { name: "Jan", amount: 450000, employees: 72 },
    { name: "Feb", amount: 455000, employees: 73 },
    { name: "Mar", amount: 460000, employees: 75 },
    { name: "Apr", amount: 458000, employees: 74 },
    { name: "May", amount: 465000, employees: 78 },
    { name: "Jun", amount: 470000, employees: 80 },
  ];

  // Leave types distribution
  const leaveTypesData = [
    { name: "Annual", value: 45, color: "#2E3192" },
    { name: "Sick", value: 15, color: "#EF4444" },
    { name: "Emergency", value: 8, color: "#F59E0B" },
    { name: "Maternity", value: 3, color: "#EC4899" },
    { name: "Other", value: 9, color: "#6B7280" },
  ];

  // Recent activities
  const recentActivities = [
    { time: "10 min ago", event: "Ahmed Al-Rashid checked in", type: "success" as const },
    { time: "25 min ago", event: "Leave request approved for Sara M.", type: "info" as const },
    { time: "1 hour ago", event: "New employee onboarded: Khalid F.", type: "success" as const },
    { time: "2 hours ago", event: "Payroll processed for June", type: "info" as const },
    { time: "3 hours ago", event: "Document expiry alert: 3 iqamas", type: "warning" as const },
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

  // Handle employee click
  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  // Employee detail content for interactive card
  const getEmployeeDetailContent = () => (
    <div className="space-y-4">
      <SummaryStats
        stats={[
          { label: "Total", value: stats.totalEmployees },
          { label: "Active", value: stats.activeEmployees, color: "text-emerald-500" },
          { label: "On Leave", value: stats.onLeave, color: "text-amber-500" },
          { label: "New This Month", value: 5, color: "text-blue-500" },
        ]}
      />
      <DataTable
        headers={["Employee", "Department", "Position", "Status"]}
        rows={allEmployees.slice(0, 10).map((emp) => [
          <div className="flex items-center gap-3" key={emp.id}>
            <EnhancedAvatar src={emp.photo} name={emp.fullName} size="sm" />
            <div>
              <p className={cn("font-medium", isDark ? "text-white" : "text-gray-800")}>
                {emp.fullName}
              </p>
              <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                {emp.employeeId}
              </p>
            </div>
          </div>,
          emp.department,
          emp.position,
          <StatusBadge status={emp.status} size="sm" key={`status-${emp.id}`} />,
        ])}
        onRowClick={(index) => handleEmployeeClick(allEmployees[index])}
      />
    </div>
  );

  // Attendance detail content
  const getAttendanceDetailContent = () => (
    <div className="space-y-6">
      <SummaryStats
        stats={[
          { label: "Present", value: stats.presentToday, color: "text-emerald-500" },
          { label: "Late", value: attendanceStats.late, color: "text-amber-500" },
          { label: "Absent", value: attendanceStats.absent, color: "text-rose-500" },
          { label: "Rate", value: `${stats.attendanceRate}%` },
        ]}
      />
      <EnhancedAreaChart
        data={attendanceTrendData}
        dataKeys={[
          { key: "present", color: "#10B981", name: "Present %" },
          { key: "late", color: "#F59E0B", name: "Late %" },
        ]}
        height={250}
      />
    </div>
  );

  // Leaves detail content
  const getLeavesDetailContent = () => (
    <div className="space-y-6">
      <SummaryStats
        stats={[
          { label: "On Leave", value: stats.onLeave },
          { label: "Pending", value: pendingLeaves.length, color: "text-amber-500" },
          { label: "Approved", value: 12, color: "text-emerald-500" },
          { label: "Rejected", value: 2, color: "text-rose-500" },
        ]}
      />
      <div className="flex gap-6">
        <div className="flex-1">
          <EnhancedDonutChart
            data={leaveTypesData}
            height={200}
            innerRadius={40}
            outerRadius={70}
          />
        </div>
        <div className="flex-1">
          <DataTable
            headers={["Employee", "Type", "Duration", "Status"]}
            rows={pendingLeaves.map((leave) => [
              leave.employeeName,
              leave.type,
              `${leave.days} days`,
              <StatusBadge status={leave.status} size="sm" key={leave.id} />,
            ])}
          />
        </div>
      </div>
    </div>
  );

  // Requests detail content
  const getRequestsDetailContent = () => (
    <div className="space-y-4">
      <SummaryStats
        stats={[
          { label: "Pending", value: stats.pendingRequests, color: "text-amber-500" },
          { label: "Approved Today", value: 8, color: "text-emerald-500" },
          { label: "Rejected", value: 2, color: "text-rose-500" },
          { label: "Total This Week", value: 25 },
        ]}
      />
      <DataTable
        headers={["ID", "Employee", "Type", "Title", "Date", "Status"]}
        rows={pendingRequests.map((req) => [
          req.id,
          req.employeeName,
          <Badge variant="default" size="sm" key={`type-${req.id}`}>
            {req.type}
          </Badge>,
          req.title,
          format(new Date(req.createdAt), "MMM dd"),
          <StatusBadge status={req.status} size="sm" key={`status-${req.id}`} />,
        ])}
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#80D1E9] text-sm font-medium"
            >
              Good Morning,
            </motion.p>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold mt-1"
            >
              Abdulrahman Hussein
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/70 mt-2 max-w-lg text-sm md:text-base"
            >
              You have{" "}
              <span className="text-[#80D1E9] font-semibold">
                {stats.pendingApprovals} pending approvals
              </span>{" "}
              and{" "}
              <span className="text-[#80D1E9] font-semibold">
                {pendingRequests.length} new requests
              </span>{" "}
              today
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mt-6"
            >
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
            </motion.div>
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

            {/* Quick alerts */}
            <div className="mt-4 flex gap-2 justify-end">
              {expiringDocuments.length > 0 && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  {expiringDocuments.length} expiring docs
                </div>
              )}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                <Bell className="w-3 h-3" />
                {stats.pendingRequests} pending
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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

      {/* Stats Grid - Interactive Cards */}
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
            <InteractiveStatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={<Users className="w-5 h-5" />}
              color="blue"
              trend={{ value: 5, isPositive: true, label: "vs last month" }}
              sparkline={[45, 52, 48, 61, 58, 63, 69, 72, 78, 80]}
              subtitle="Click for detailed breakdown"
              detailTitle="Employee Overview"
              detailContent={getEmployeeDetailContent()}
              actions={[
                {
                  label: "Export",
                  onClick: () => {},
                  variant: "secondary",
                  icon: <Download className="w-4 h-4" />,
                },
                {
                  label: "View All",
                  onClick: () => {},
                  variant: "primary",
                  icon: <ArrowRight className="w-4 h-4" />,
                },
              ]}
            />
            <InteractiveStatCard
              title="Present Today"
              value={stats.presentToday}
              icon={<Clock className="w-5 h-5" />}
              color="green"
              trend={{
                value: stats.attendanceRate,
                isPositive: stats.attendanceRate > 90,
                label: "rate",
              }}
              sparkline={[88, 92, 85, 90, 94, 91, 93, 89, 92, 94]}
              subtitle="Real-time attendance tracking"
              detailTitle="Attendance Details"
              detailContent={getAttendanceDetailContent()}
            />
            <InteractiveStatCard
              title="On Leave"
              value={stats.onLeave}
              icon={<Palmtree className="w-5 h-5" />}
              color="amber"
              sparkline={[3, 5, 4, 6, 4, 5, 3, 4, 5, 4]}
              subtitle={`${pendingLeaves.length} pending requests`}
              detailTitle="Leave Management"
              detailContent={getLeavesDetailContent()}
            />
            <InteractiveStatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={<FileText className="w-5 h-5" />}
              color="purple"
              trend={{ value: 8, isPositive: false, label: "new today" }}
              sparkline={[12, 8, 15, 10, 7, 11, 9, 13, 8, 10]}
              subtitle="Requires your attention"
              detailTitle="Request Queue"
              detailContent={getRequestsDetailContent()}
            />
          </>
        )}
      </div>

      {/* Second Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-5 rounded-2xl",
            isGlass
              ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
              : isDark
                ? "bg-gray-800/80 border border-gray-700"
                : "bg-white border border-gray-100 shadow-sm"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              Attendance Rate
            </span>
            <Activity className={cn("w-4 h-4", isDark ? "text-emerald-400" : "text-emerald-500")} />
          </div>
          <ProgressRing
            value={stats.attendanceRate}
            size={80}
            strokeWidth={8}
            color="#10B981"
            label="Today"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-5 rounded-2xl",
            isGlass
              ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
              : isDark
                ? "bg-gray-800/80 border border-gray-700"
                : "bg-white border border-gray-100 shadow-sm"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              Task Completion
            </span>
            <Target className={cn("w-4 h-4", isDark ? "text-blue-400" : "text-blue-500")} />
          </div>
          <ProgressRing
            value={78}
            size={80}
            strokeWidth={8}
            color="#2E3192"
            label="This Week"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "p-5 rounded-2xl",
            isGlass
              ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
              : isDark
                ? "bg-gray-800/80 border border-gray-700"
                : "bg-white border border-gray-100 shadow-sm"
          )}
        >
          <StatComparison
            current={{ label: "This Month", value: 470000 }}
            previous={{ label: "Last Month", value: 458000 }}
            format={(v) => `${(v / 1000).toFixed(0)}K SAR`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "p-5 rounded-2xl",
            isGlass
              ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
              : isDark
                ? "bg-gray-800/80 border border-gray-700"
                : "bg-white border border-gray-100 shadow-sm"
          )}
        >
          <StatComparison
            current={{ label: "Active Employees", value: stats.activeEmployees }}
            previous={{ label: "Last Month", value: stats.activeEmployees - 5 }}
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Trend Chart */}
          <ChartWrapper
            title="Attendance Trend"
            subtitle="Weekly attendance statistics"
            trend={{ value: 3.2, isPositive: true }}
            onExport={() => console.log("Export")}
            filters={
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={cn(
                  "text-sm border px-3 py-2 rounded-lg focus:outline-none",
                  isGlass
                    ? "bg-white/5 border-white/15 text-white"
                    : isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-700"
                )}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            }
          >
            <EnhancedAreaChart
              data={attendanceTrendData}
              dataKeys={[
                { key: "present", color: "#10B981", name: "Present %" },
                { key: "target", color: "#2E3192", name: "Target %" },
              ]}
              height={300}
            />
          </ChartWrapper>

          {/* Pending Approvals */}
          <div
            className={cn(
              "p-6 rounded-2xl",
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-gray-800/80 border border-gray-700"
                  : "bg-white border border-gray-100 shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className={cn(
                    "text-lg font-semibold",
                    isGlass || isDark ? "text-white" : "text-gray-800"
                  )}
                >
                  Pending Approvals
                </h2>
                <p
                  className={cn(
                    "text-sm",
                    isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
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
                    : "text-[#2E3192] hover:underline"
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
                      isGlass || isDark ? "bg-emerald-500/20" : "bg-green-100"
                    )}
                  >
                    <CheckCircle
                      className={cn(
                        "w-8 h-8",
                        isGlass || isDark ? "text-emerald-400" : "text-green-500"
                      )}
                    />
                  </div>
                  <p className={isGlass || isDark ? "text-white/60" : "text-gray-500"}>
                    No pending approvals
                  </p>
                </div>
              ) : (
                pendingRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl cursor-pointer",
                      "transition-all duration-300 hover:-translate-y-0.5",
                      isGlass
                        ? "bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06]"
                        : isDark
                          ? "bg-gray-700/50 border border-gray-600 hover:bg-gray-700"
                          : "bg-gray-50 border border-gray-100 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <EnhancedAvatar
                        name={request.employeeName}
                        size="md"
                        status="online"
                      />
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            isGlass || isDark ? "text-white" : "text-gray-800"
                          )}
                        >
                          {request.employeeName}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
                          )}
                        >
                          {request.title}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-0.5",
                            isDark ? "text-gray-500" : "text-gray-400"
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
                            "p-2 rounded-lg transition-colors",
                            isDark
                              ? "text-emerald-400 hover:bg-emerald-500/20"
                              : "text-green-600 hover:bg-green-50"
                          )}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isDark
                              ? "text-rose-400 hover:bg-rose-500/20"
                              : "text-red-600 hover:bg-red-50"
                          )}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Interactive Map */}
          <div
            className={cn(
              "p-6 rounded-2xl",
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-gray-800/80 border border-gray-700"
                  : "bg-white border border-gray-100 shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className={cn(
                    "text-lg font-semibold",
                    isGlass || isDark ? "text-white" : "text-gray-800"
                  )}
                >
                  Employee Locations
                </h2>
                <p
                  className={cn(
                    "text-sm",
                    isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  Distribution across {mapLocations.length} locations
                </p>
              </div>
              <Link
                to="/locations"
                className={cn(
                  "text-sm font-medium flex items-center gap-1",
                  isDark ? "text-[#80D1E9]" : "text-[#2E3192]"
                )}
              >
                Manage <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <InteractiveMap locations={mapLocations} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Department Distribution */}
          <ChartWrapper
            title="Department Distribution"
            subtitle="Employee distribution by department"
            onExport={() => console.log("Export")}
          >
            <EnhancedDonutChart
              data={departmentData}
              height={280}
              innerRadius={50}
              outerRadius={90}
              centerContent={
                <div className="text-center">
                  <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {stats.totalEmployees}
                  </p>
                  <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                    Total
                  </p>
                </div>
              }
            />
          </ChartWrapper>

          {/* Recent Activity */}
          <div
            className={cn(
              "p-6 rounded-2xl",
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-gray-800/80 border border-gray-700"
                  : "bg-white border border-gray-100 shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  isGlass || isDark ? "text-white" : "text-gray-800"
                )}
              >
                Recent Activity
              </h2>
              <button
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isGlass
                    ? "hover:bg-white/10"
                    : isDark
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                )}
              >
                <RefreshCw className={cn("w-4 h-4", isDark ? "text-gray-400" : "text-gray-500")} />
              </button>
            </div>
            <TimelineChart data={recentActivities} maxItems={5} />
          </div>

          {/* Upcoming Birthdays */}
          <div
            className={cn(
              "p-6 rounded-2xl",
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-gray-800/80 border border-gray-700"
                  : "bg-white border border-gray-100 shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  isGlass || isDark ? "text-white" : "text-gray-800"
                )}
              >
                Upcoming Birthdays
              </h2>
              <div
                className={cn(
                  "p-2 rounded-lg",
                  isDark ? "bg-pink-500/20" : "bg-pink-100"
                )}
              >
                <Cake className={cn("w-5 h-5", isDark ? "text-pink-400" : "text-pink-500")} />
              </div>
            </div>
            {upcomingBirthdays.length === 0 ? (
              <p
                className={cn(
                  "text-center py-4",
                  isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
                )}
              >
                No upcoming birthdays
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingBirthdays.map((birthday, index) => (
                  <motion.div
                    key={birthday.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl",
                      isDark ? "bg-pink-500/10 border border-pink-500/20" : "bg-pink-50"
                    )}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-400 to-pink-600">
                      <Cake className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          isGlass || isDark ? "text-white" : "text-gray-800"
                        )}
                      >
                        {birthday.title.replace(" Birthday", "")}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
                        )}
                      >
                        {format(new Date(birthday.startDate), "MMM dd")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring Documents */}
          <div
            className={cn(
              "p-6 rounded-2xl",
              isGlass
                ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
                : isDark
                  ? "bg-gray-800/80 border border-gray-700"
                  : "bg-white border border-gray-100 shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  isGlass || isDark ? "text-white" : "text-gray-800"
                )}
              >
                Expiring Documents
              </h2>
              <Badge
                variant="warning"
                size="sm"
                className={isDark ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : ""}
              >
                {expiringDocuments.length} alerts
              </Badge>
            </div>
            {expiringDocuments.length === 0 ? (
              <p
                className={cn(
                  "text-center py-4",
                  isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
                )}
              >
                No expiring documents
              </p>
            ) : (
              <div className="space-y-3">
                {expiringDocuments.map((emp, index) => {
                  const daysUntilExpiry = emp.iqamaExpiry
                    ? differenceInDays(new Date(emp.iqamaExpiry), today)
                    : 999;
                  return (
                    <motion.div
                      key={emp.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleEmployeeClick(emp)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02]",
                        daysUntilExpiry < 30
                          ? "bg-rose-500/10 border border-rose-500/20"
                          : "bg-amber-500/10 border border-amber-500/20"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 flex items-center justify-center rounded-lg",
                          daysUntilExpiry < 30
                            ? "bg-gradient-to-br from-rose-400 to-rose-600"
                            : "bg-gradient-to-br from-amber-400 to-amber-600"
                        )}
                      >
                        <FileWarning className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "font-medium truncate",
                            isGlass || isDark ? "text-white" : "text-gray-800"
                          )}
                        >
                          {emp.fullName}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            daysUntilExpiry < 30 ? "text-rose-400" : "text-amber-400"
                          )}
                        >
                          Expires in {daysUntilExpiry} days
                        </p>
                      </div>
                      <ChevronRight className={cn("w-4 h-4", isDark ? "text-gray-600" : "text-gray-300")} />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payroll Trend */}
          <ChartWrapper
            title="Payroll Trend"
            subtitle="Monthly payroll overview"
          >
            <EnhancedBarChart
              data={payrollData}
              dataKeys={[{ key: "amount", color: "#2E3192", name: "Amount (SAR)" }]}
              height={180}
              showLegend={false}
            />
            <div
              className={cn(
                "mt-4 pt-4 border-t flex items-center justify-between",
                isDark ? "border-gray-700" : "border-gray-100"
              )}
            >
              <span
                className={cn(
                  "text-sm",
                  isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
                )}
              >
                This Month
              </span>
              <span
                className={cn(
                  "text-lg font-bold",
                  isDark ? "text-[#80D1E9]" : "text-[#2E3192]"
                )}
              >
                470,000 SAR
              </span>
            </div>
          </ChartWrapper>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        className={cn(
          "p-6 rounded-2xl",
          isGlass
            ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
            : isDark
              ? "bg-gray-800/80 border border-gray-700"
              : "bg-white border border-gray-100 shadow-sm"
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

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          isOpen={showEmployeeModal}
          onClose={() => {
            setShowEmployeeModal(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onEdit={(emp) => console.log("Edit employee:", emp)}
        />
      )}

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
