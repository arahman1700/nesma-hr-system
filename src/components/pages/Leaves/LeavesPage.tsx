import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palmtree,
  Calendar,
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
  AlertCircle,
  MoreVertical,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sun,
  Umbrella,
  Heart,
  Baby,
  GraduationCap,
  Plane,
  X,
  User,
  Building2,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card, StatCard } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge, StatusBadge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Tabs, TabPanel } from "../../common/Tabs";
import { Avatar } from "../../common/Avatar";
import { Modal } from "../../common/Modal";
import { InteractiveStatCard, DetailModal, DataTable, SummaryStats } from "../../common/InteractiveCard";
import { ChartWrapper, EnhancedDonutChart, EnhancedBarChart, EnhancedAreaChart, ProgressRing } from "../../common/AdvancedCharts";
import {
  DataExportModal,
  createExportData,
} from "../../common/DataExportModal";
import {
  FilterBar,
  ActiveFilter,
  FilterConfig,
  FilterValue,
} from "../../common/FilterBar";
import { leaves, leaveBalances, employees, departments } from "../../../data";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
import { format, differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, startOfWeek, endOfWeek } from "date-fns";

type LeaveType =
  | "Annual"
  | "Sick"
  | "Emergency"
  | "Maternity"
  | "Paternity"
  | "Study"
  | "Unpaid"
  | "Hajj";
type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

const leaveTypeColors: Record<LeaveType, string> = {
  Annual: "#10B981",
  Sick: "#EF4444",
  Emergency: "#F59E0B",
  Maternity: "#EC4899",
  Paternity: "#8B5CF6",
  Study: "#3B82F6",
  Unpaid: "#6B7280",
  Hajj: "#14B8A6",
};

const leaveTypeIcons: Record<LeaveType, React.ReactNode> = {
  Annual: <Sun className="w-4 h-4" />,
  Sick: <Heart className="w-4 h-4" />,
  Emergency: <AlertCircle className="w-4 h-4" />,
  Maternity: <Baby className="w-4 h-4" />,
  Paternity: <Baby className="w-4 h-4" />,
  Study: <GraduationCap className="w-4 h-4" />,
  Unpaid: <Umbrella className="w-4 h-4" />,
  Hajj: <Plane className="w-4 h-4" />,
};

const statusConfig: Record<
  LeaveStatus,
  { color: string; bgColor: string; icon: React.ReactNode }
> = {
  Pending: {
    color: "text-warning-600",
    bgColor: "bg-warning-50",
    icon: <Clock className="w-4 h-4" />,
  },
  Approved: {
    color: "text-success-600",
    bgColor: "bg-success-50",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  Rejected: {
    color: "text-error-600",
    bgColor: "bg-error-50",
    icon: <XCircle className="w-4 h-4" />,
  },
  Cancelled: {
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: <XCircle className="w-4 h-4" />,
  },
};

export const LeavesPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<(typeof leaves)[0] | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ReturnType<typeof createExportData> | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCalendarLeave, setSelectedCalendarLeave] = useState<(typeof leaves)[0] | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = leaves.filter((l) => l.status === "Pending").length;
    const approved = leaves.filter((l) => l.status === "Approved").length;
    const rejected = leaves.filter((l) => l.status === "Rejected").length;
    const totalDays = leaves
      .filter((l) => l.status === "Approved")
      .reduce((acc, l) => acc + l.days, 0);
    const onLeaveNow = leaves.filter((l) => {
      const today = new Date();
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      return l.status === "Approved" && today >= start && today <= end;
    }).length;
    return { pending, approved, rejected, totalDays, onLeaveNow };
  }, []);

  // Sparkline data for pending requests
  const pendingSparkline = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - i));
      return leaves.filter((l) => {
        const requestDate = new Date(l.startDate);
        return l.status === "Pending" && requestDate.toDateString() === day.toDateString();
      }).length + Math.floor(Math.random() * 3);
    });
  }, []);

  // Filter leaves
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchesSearch = leave.employeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || leave.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || leave.status === selectedStatus;
      const employee = employees.find((e) => e.id === leave.employeeId);
      const matchesDepartment =
        selectedDepartment === "all" ||
        employee?.department === selectedDepartment;
      return matchesSearch && matchesType && matchesStatus && matchesDepartment;
    });
  }, [searchQuery, selectedType, selectedStatus, selectedDepartment]);

  // Chart data - Leave type distribution
  const leaveTypeData = Object.keys(leaveTypeColors)
    .map((type) => ({
      name: type,
      value: leaves.filter((l) => l.type === type && l.status === "Approved").length,
      color: leaveTypeColors[type as LeaveType],
    }))
    .filter((d) => d.value > 0);

  // Monthly leave trend for area chart
  const monthlyTrendData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (5 - i));
      const monthStr = format(month, "yyyy-MM");
      const monthLeaves = leaves.filter(
        (l) => l.startDate.startsWith(monthStr)
      );
      return {
        name: format(month, "MMM"),
        approved: monthLeaves.filter((l) => l.status === "Approved").length,
        pending: monthLeaves.filter((l) => l.status === "Pending").length,
        rejected: monthLeaves.filter((l) => l.status === "Rejected").length,
      };
    });
  }, []);

  // Monthly leave bar chart data
  const monthlyBarData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    const monthStr = format(month, "yyyy-MM");
    const monthLeaves = leaves.filter(
      (l) => l.startDate.startsWith(monthStr) && l.status === "Approved",
    );
    return {
      name: format(month, "MMM"),
      requests: monthLeaves.length,
      days: monthLeaves.reduce((acc, l) => acc + l.days, 0),
    };
  });

  // Calendar data
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const getLeavesForDate = (date: Date) => {
    return leaves.filter((leave) => {
      if (leave.status !== "Approved") return false;
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return isWithinInterval(date, { start, end });
    });
  };

  const tabs = [
    {
      id: "requests",
      label: "Leave Requests",
      icon: <FileText className="w-4 h-4" />,
      badge: stats.pending,
    },
    {
      id: "balances",
      label: "Leave Balances",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "calendar",
      label: "Leave Calendar",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  const leaveColumns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (leave: (typeof leaves)[0]) => {
        const employee = employees.find((e) => e.id === leave.employeeId);
        return (
          <div className="flex items-center gap-3">
            <Avatar name={leave.employeeName} size="sm" />
            <div>
              <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>{leave.employeeName}</p>
              <p className={cn("text-xs", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>{employee?.department}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (leave: (typeof leaves)[0]) => (
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${leaveTypeColors[leave.type as LeaveType]}20` }}
          >
            <span style={{ color: leaveTypeColors[leave.type as LeaveType] }}>
              {leaveTypeIcons[leave.type as LeaveType]}
            </span>
          </div>
          <Badge
            style={{
              backgroundColor: `${leaveTypeColors[leave.type as LeaveType]}20`,
              color: leaveTypeColors[leave.type as LeaveType],
            }}
          >
            {leave.type}
          </Badge>
        </div>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (leave: (typeof leaves)[0]) => (
        <div>
          <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
            {format(new Date(leave.startDate), "MMM d")} -{" "}
            {format(new Date(leave.endDate), "MMM d")}
          </p>
          <p className={cn("text-xs", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>{leave.days} days</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (leave: (typeof leaves)[0]) => {
        const config = statusConfig[leave.status as LeaveStatus];
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full",
              config.bgColor,
            )}
          >
            <span className={config.color}>{config.icon}</span>
            <span className={cn("text-sm font-medium", config.color)}>
              {leave.status}
            </span>
          </motion.div>
        );
      },
    },
    {
      key: "reason",
      label: "Reason",
      render: (leave: (typeof leaves)[0]) => (
        <p
          className={cn("text-sm truncate max-w-[200px]", isDark || isGlass ? "text-gray-300" : "text-gray-600")}
          title={leave.reason}
        >
          {leave.reason}
        </p>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (leave: (typeof leaves)[0]) => (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedLeave(leave);
              setShowDetailModal(true);
            }}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isDark || isGlass ? "hover:bg-white/10" : "hover:bg-gray-100"
            )}
            title="View Details"
          >
            <Eye className={cn("w-4 h-4", isDark || isGlass ? "text-gray-400" : "text-gray-500")} />
          </motion.button>
          {leave.status === "Pending" && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 hover:bg-success-50 rounded-lg transition-colors"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4 text-success" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 hover:bg-error-50 rounded-lg transition-colors"
                title="Reject"
              >
                <XCircle className="w-4 h-4 text-error" />
              </motion.button>
            </>
          )}
        </div>
      ),
    },
  ];

  const balanceColumns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (balance: (typeof leaveBalances)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar name={balance.employeeName} size="sm" />
          <div>
            <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>{balance.employeeName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "annual",
      label: "Annual Leave",
      render: (balance: (typeof leaveBalances)[0]) => {
        const percentage = (balance.annual.remaining / balance.annual.total) * 100;
        return (
          <div className="flex items-center gap-2">
            <div className={cn("flex-1 rounded-full h-2 max-w-[100px]", isDark || isGlass ? "bg-gray-700" : "bg-gray-100")}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8 }}
                className="bg-success rounded-full h-2"
              />
            </div>
            <span className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>
              {balance.annual.remaining}/{balance.annual.total}
            </span>
          </div>
        );
      },
    },
    {
      key: "sick",
      label: "Sick Leave",
      render: (balance: (typeof leaveBalances)[0]) => {
        const percentage = (balance.sick.remaining / balance.sick.total) * 100;
        return (
          <div className="flex items-center gap-2">
            <div className={cn("flex-1 rounded-full h-2 max-w-[100px]", isDark || isGlass ? "bg-gray-700" : "bg-gray-100")}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-error rounded-full h-2"
              />
            </div>
            <span className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>
              {balance.sick.remaining}/{balance.sick.total}
            </span>
          </div>
        );
      },
    },
    {
      key: "emergency",
      label: "Emergency",
      render: (balance: (typeof leaveBalances)[0]) => {
        const percentage = (balance.emergency.remaining / balance.emergency.total) * 100;
        return (
          <div className="flex items-center gap-2">
            <div className={cn("flex-1 rounded-full h-2 max-w-[100px]", isDark || isGlass ? "bg-gray-700" : "bg-gray-100")}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-warning rounded-full h-2"
              />
            </div>
            <span className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>
              {balance.emergency.remaining}/{balance.emergency.total}
            </span>
          </div>
        );
      },
    },
    {
      key: "unpaid",
      label: "Unpaid",
      render: (balance: (typeof leaveBalances)[0]) => (
        <span className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>
          {balance.unpaid.used} days used
        </span>
      ),
    },
  ];

  // Filter configuration
  const filterConfigs: FilterConfig[] = [
    {
      id: "type",
      label: "Leave Type",
      type: "select",
      placeholder: "All Types",
      options: Object.keys(leaveTypeColors).map((type) => ({
        value: type,
        label: type,
        count: leaves.filter((l) => l.type === type).length,
      })),
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      placeholder: "All Statuses",
      options: [
        { value: "Pending", label: "Pending", count: stats.pending },
        { value: "Approved", label: "Approved", count: stats.approved },
        { value: "Rejected", label: "Rejected", count: stats.rejected },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
    {
      id: "department",
      label: "Department",
      type: "select",
      placeholder: "All Departments",
      options: departments.map((d) => ({
        value: d.name,
        label: d.name,
      })),
    },
  ];

  const handleFilterChange = useCallback(
    (filterId: string, value: FilterValue) => {
      if (value === null) {
        setActiveFilters((prev) => prev.filter((f) => f.filterId !== filterId));
        if (filterId === "type") setSelectedType("all");
        if (filterId === "status") setSelectedStatus("all");
        if (filterId === "department") setSelectedDepartment("all");
      } else {
        const config = filterConfigs.find((c) => c.id === filterId);
        const displayValue = typeof value === "string" ? value : "";
        const option = config?.options?.find((o) => o.value === displayValue);

        if (filterId === "type") setSelectedType(displayValue);
        if (filterId === "status") setSelectedStatus(displayValue);
        if (filterId === "department") setSelectedDepartment(displayValue);

        setActiveFilters((prev) => {
          const existing = prev.find((f) => f.filterId === filterId);
          if (existing) {
            return prev.map((f) =>
              f.filterId === filterId
                ? {
                    ...f,
                    value,
                    label: option?.label || config?.label || filterId,
                  }
                : f,
            );
          }
          return [
            ...prev,
            {
              filterId,
              value,
              label: option?.label || config?.label || filterId,
            },
          ];
        });
      }
    },
    [filterConfigs, stats],
  );

  const handleClearFilter = useCallback((filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.filterId !== filterId));
    if (filterId === "type") setSelectedType("all");
    if (filterId === "status") setSelectedStatus("all");
    if (filterId === "department") setSelectedDepartment("all");
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveFilters([]);
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedDepartment("all");
    setSearchQuery("");
  }, []);

  // Handle export
  const handleExport = useCallback(() => {
    const summaryItems = [
      { label: "Pending Requests", value: stats.pending },
      { label: "Approved", value: stats.approved },
      { label: "Rejected", value: stats.rejected },
      { label: "Total Days", value: stats.totalDays },
    ];

    const details = filteredLeaves.map((leave) => {
      const employee = employees.find((e) => e.id === leave.employeeId);
      return {
        Employee: leave.employeeName,
        Department: employee?.department || "-",
        Type: leave.type,
        "Start Date": format(new Date(leave.startDate), "MMM d, yyyy"),
        "End Date": format(new Date(leave.endDate), "MMM d, yyyy"),
        Days: leave.days,
        Status: leave.status,
        Reason: leave.reason,
      };
    });

    setExportData(
      createExportData("Leave Requests Report", summaryItems, details),
    );
    setShowExportModal(true);
  }, [filteredLeaves, stats]);

  // Pending detail content
  const pendingDetailContent = (
    <div className="space-y-4">
      <SummaryStats
        stats={[
          { label: "Pending", value: stats.pending, color: "text-amber-500" },
          { label: "Today", value: 3, color: "text-blue-500" },
          { label: "This Week", value: 8, color: "text-purple-500" },
          { label: "Urgent", value: 2, color: "text-rose-500" },
        ]}
      />
      <div className="space-y-3">
        {leaves.filter((l) => l.status === "Pending").slice(0, 5).map((leave, index) => (
          <motion.div
            key={leave.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-4 rounded-xl flex items-center justify-between",
              isGlass ? "bg-white/5" : isDark ? "bg-gray-800" : "bg-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar name={leave.employeeName} size="sm" />
              <div>
                <p className={cn("font-medium", isGlass || isDark ? "text-white" : "text-gray-800")}>
                  {leave.employeeName}
                </p>
                <p className={cn("text-xs", isGlass || isDark ? "text-gray-400" : "text-gray-500")}>
                  {leave.type} - {leave.days} days
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-success border-success">
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-error border-error">
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              isGlass || isDark ? "text-white" : "text-gray-900",
            )}
          >
            Leaves
          </h1>
          <p
            className={cn(
              "mt-1",
              isGlass
                ? "text-white/60"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-500",
            )}
          >
            Manage employee leave requests and balances
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowRequestModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </motion.div>

      {/* Interactive Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <InteractiveStatCard
          title="Pending Requests"
          value={stats.pending}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
          sparkline={pendingSparkline}
          trend={{ value: 12, isPositive: false, label: "vs last week" }}
          subtitle="Awaiting review"
          detailTitle="Pending Leave Requests"
          detailContent={pendingDetailContent}
          actions={[
            { label: "View All", onClick: () => setActiveTab("requests"), variant: "primary" },
            { label: "Export", onClick: handleExport, variant: "secondary" },
          ]}
        />
        <InteractiveStatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
          trend={{ value: 8, isPositive: true, label: "this month" }}
          subtitle="This month"
        />
        <InteractiveStatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
          subtitle="This month"
        />
        <InteractiveStatCard
          title="On Leave Now"
          value={stats.onLeaveNow}
          icon={<Users className="w-5 h-5" />}
          color="purple"
          subtitle="Currently away"
        />
        <InteractiveStatCard
          title="Total Leave Days"
          value={stats.totalDays}
          icon={<CalendarDays className="w-5 h-5" />}
          color="cyan"
          subtitle="Approved days"
        />
      </motion.div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
        onClearAll={handleClearAllFilters}
        onSearch={setSearchQuery}
        searchPlaceholder="Search employees..."
        showSearch={true}
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="modern"
      />

      {/* Leave Requests Tab */}
      <TabPanel id="requests" activeTab={activeTab}>
        <Card className="p-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", isDark || isGlass ? "text-gray-500" : "text-gray-400")} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  isDark || isGlass
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-200 text-gray-800"
                )}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "Annual", label: "Annual" },
                  { value: "Sick", label: "Sick" },
                  { value: "Emergency", label: "Emergency" },
                  { value: "Maternity", label: "Maternity" },
                  { value: "Paternity", label: "Paternity" },
                  { value: "Study", label: "Study" },
                  { value: "Unpaid", label: "Unpaid" },
                  { value: "Hajj", label: "Hajj" },
                ]}
                className="w-36"
              />
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" },
                  { value: "Cancelled", label: "Cancelled" },
                ]}
                className="w-36"
              />
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                options={[
                  { value: "all", label: "All Departments" },
                  ...departments.map((d) => ({ value: d.name, label: d.name })),
                ]}
                className="w-44"
              />
            </div>
          </div>

          {/* Table */}
          <Table
            data={filteredLeaves}
            columns={leaveColumns}
            searchable={false}
          />
        </Card>
      </TabPanel>

      {/* Leave Balances Tab */}
      <TabPanel id="balances" activeTab={activeTab}>
        <Card className="p-6">
          <Table
            data={leaveBalances}
            columns={balanceColumns}
            searchable={true}
            searchPlaceholder="Search employees..."
          />
        </Card>
      </TabPanel>

      {/* Leave Calendar Tab - Enhanced */}
      <TabPanel id="calendar" activeTab={activeTab}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDark || isGlass ? "hover:bg-white/10" : "hover:bg-gray-100"
                )}
              >
                <ChevronLeft className={cn("w-5 h-5", isDark || isGlass ? "text-white" : "text-gray-600")} />
              </motion.button>
              <h3 className={cn("text-xl font-semibold", isDark || isGlass ? "text-white" : "text-gray-800")}>
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDark || isGlass ? "hover:bg-white/10" : "hover:bg-gray-100"
                )}
              >
                <ChevronRight className={cn("w-5 h-5", isDark || isGlass ? "text-white" : "text-gray-600")} />
              </motion.button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className={cn(
                  "text-center py-2 text-sm font-medium",
                  isDark || isGlass ? "text-gray-400" : "text-gray-500"
                )}
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day, index) => {
              const dayLeaves = getLeavesForDate(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "min-h-[100px] p-2 rounded-lg border transition-all cursor-pointer",
                    !isCurrentMonth && "opacity-40",
                    isToday && "ring-2 ring-primary",
                    isDark || isGlass
                      ? "border-gray-700 hover:bg-white/5"
                      : "border-gray-100 hover:bg-gray-50",
                    dayLeaves.length > 0 && (isDark || isGlass ? "bg-white/5" : "bg-blue-50/50")
                  )}
                  onClick={() => {
                    if (dayLeaves.length > 0) {
                      setSelectedCalendarLeave(dayLeaves[0]);
                    }
                  }}
                >
                  <p className={cn(
                    "text-sm font-medium mb-1",
                    isToday ? "text-primary" : isDark || isGlass ? "text-white" : "text-gray-800"
                  )}>
                    {format(day, "d")}
                  </p>
                  <div className="space-y-1">
                    {dayLeaves.slice(0, 2).map((leave, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs truncate"
                        style={{ backgroundColor: `${leaveTypeColors[leave.type as LeaveType]}20` }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: leaveTypeColors[leave.type as LeaveType] }}
                        />
                        <span className={cn("truncate", isDark || isGlass ? "text-gray-300" : "text-gray-700")}>
                          {leave.employeeName.split(" ")[0]}
                        </span>
                      </motion.div>
                    ))}
                    {dayLeaves.length > 2 && (
                      <p className={cn("text-xs", isDark || isGlass ? "text-gray-500" : "text-gray-400")}>
                        +{dayLeaves.length - 2} more
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {Object.entries(leaveTypeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>
                  {type}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </TabPanel>

      {/* Reports Tab - Enhanced with ChartWrapper */}
      <TabPanel id="reports" activeTab={activeTab}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWrapper
            title="Leave Request Trends"
            subtitle="Monthly overview of leave requests"
            trend={{ value: 12, isPositive: true }}
            onExport={handleExport}
          >
            <EnhancedAreaChart
              data={monthlyTrendData}
              dataKeys={[
                { key: "approved", color: "#10B981", name: "Approved" },
                { key: "pending", color: "#F59E0B", name: "Pending" },
                { key: "rejected", color: "#EF4444", name: "Rejected" },
              ]}
              height={280}
            />
          </ChartWrapper>

          <ChartWrapper
            title="Leave Type Distribution"
            subtitle="Breakdown by leave category"
          >
            <EnhancedDonutChart
              data={leaveTypeData}
              height={280}
              innerRadius={50}
              outerRadius={90}
              centerContent={
                <div className="text-center">
                  <p className={cn("text-2xl font-bold", isDark || isGlass ? "text-white" : "text-gray-800")}>
                    {leaveTypeData.reduce((sum, d) => sum + d.value, 0)}
                  </p>
                  <p className={cn("text-xs", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                    Total
                  </p>
                </div>
              }
            />
          </ChartWrapper>

          <ChartWrapper
            title="Monthly Leave Summary"
            subtitle="Requests and days taken"
          >
            <EnhancedBarChart
              data={monthlyBarData}
              dataKeys={[
                { key: "requests", color: "#5B4CCC", name: "Requests" },
                { key: "days", color: "#10B981", name: "Days" },
              ]}
              height={280}
            />
          </ChartWrapper>

          <Card className="p-6">
            <h3 className={cn("font-semibold mb-4", isDark || isGlass ? "text-white" : "text-gray-800")}>
              Department Leave Usage
            </h3>
            <div className="space-y-4">
              {departments.slice(0, 5).map((dept, index) => {
                const deptLeaves = leaves.filter((l) => {
                  const emp = employees.find((e) => e.id === l.employeeId);
                  return emp?.department === dept.name && l.status === "Approved";
                });
                const deptDays = deptLeaves.reduce((acc, l) => acc + l.days, 0);
                const maxDays = 100;
                const percentage = (deptDays / maxDays) * 100;

                return (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className={cn("text-sm font-medium", isDark || isGlass ? "text-white" : "text-gray-700")}>
                        {dept.name}
                      </span>
                      <span className={cn("text-sm", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                        {deptDays} days
                      </span>
                    </div>
                    <div className={cn("h-2 rounded-full overflow-hidden", isDark || isGlass ? "bg-gray-700" : "bg-gray-100")}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>
      </TabPanel>

      {/* New Leave Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="New Leave Request"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Employee"
            options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
          />
          <Select
            label="Leave Type"
            options={[
              { value: "Annual", label: "Annual Leave" },
              { value: "Sick", label: "Sick Leave" },
              { value: "Emergency", label: "Emergency Leave" },
              { value: "Maternity", label: "Maternity Leave" },
              { value: "Paternity", label: "Paternity Leave" },
              { value: "Study", label: "Study Leave" },
              { value: "Unpaid", label: "Unpaid Leave" },
              { value: "Hajj", label: "Hajj Leave" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="End Date" type="date" />
          </div>
          <Input label="Reason" placeholder="Enter reason for leave..." />
          <Input label="Attachment" type="file" />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowRequestModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowRequestModal(false)}>
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* Leave Detail Modal - Enhanced */}
      <AnimatePresence>
        {showDetailModal && selectedLeave && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg",
                "max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl",
                isGlass
                  ? "bg-white/10 backdrop-blur-2xl border border-white/20"
                  : isDark
                    ? "bg-gray-900 border border-gray-700"
                    : "bg-white border border-gray-200"
              )}
            >
              {/* Header */}
              <div
                className="relative p-6 pb-4"
                style={{
                  background: `linear-gradient(135deg, ${leaveTypeColors[selectedLeave.type as LeaveType]}, ${leaveTypeColors[selectedLeave.type as LeaveType]}80)`,
                }}
              >
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white">
                    {leaveTypeIcons[selectedLeave.type as LeaveType]}
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{selectedLeave.type} Leave</h2>
                    <p className="text-white/80">{selectedLeave.days} days</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Employee Info */}
                <div className="flex items-center gap-4">
                  <Avatar name={selectedLeave.employeeName} size="lg" />
                  <div>
                    <h3 className={cn("font-semibold", isDark || isGlass ? "text-white" : "text-gray-800")}>
                      {selectedLeave.employeeName}
                    </h3>
                    <p className={cn("text-sm", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                      {employees.find((e) => e.id === selectedLeave.employeeId)?.position}
                    </p>
                  </div>
                  <div className="ml-auto">
                    {(() => {
                      const config = statusConfig[selectedLeave.status as LeaveStatus];
                      return (
                        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full", config.bgColor)}>
                          <span className={config.color}>{config.icon}</span>
                          <span className={cn("text-sm font-medium", config.color)}>
                            {selectedLeave.status}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn("p-4 rounded-xl", isDark || isGlass ? "bg-white/5" : "bg-gray-50")}>
                    <p className={cn("text-xs mb-1", isDark || isGlass ? "text-gray-500" : "text-gray-400")}>
                      Start Date
                    </p>
                    <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                      {format(new Date(selectedLeave.startDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className={cn("p-4 rounded-xl", isDark || isGlass ? "bg-white/5" : "bg-gray-50")}>
                    <p className={cn("text-xs mb-1", isDark || isGlass ? "text-gray-500" : "text-gray-400")}>
                      End Date
                    </p>
                    <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                      {format(new Date(selectedLeave.endDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className={cn("p-4 rounded-xl col-span-2", isDark || isGlass ? "bg-white/5" : "bg-gray-50")}>
                    <p className={cn("text-xs mb-1", isDark || isGlass ? "text-gray-500" : "text-gray-400")}>
                      Reason
                    </p>
                    <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                      {selectedLeave.reason}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {selectedLeave.status === "Pending" && (
                  <div className={cn("flex justify-end gap-3 pt-4 border-t", isDark || isGlass ? "border-gray-700" : "border-gray-100")}>
                    <Button
                      variant="outline"
                      className="text-error border-error hover:bg-error-50"
                      onClick={() => setShowDetailModal(false)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button onClick={() => setShowDetailModal(false)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}

                {selectedLeave.status !== "Pending" && (
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Calendar Leave Detail Modal */}
      <AnimatePresence>
        {selectedCalendarLeave && (
          <DetailModal
            isOpen={!!selectedCalendarLeave}
            onClose={() => setSelectedCalendarLeave(null)}
            title={`${selectedCalendarLeave.type} Leave`}
            subtitle={`${selectedCalendarLeave.employeeName}`}
            icon={leaveTypeIcons[selectedCalendarLeave.type as LeaveType]}
            color={
              selectedCalendarLeave.type === "Annual" ? "green" :
              selectedCalendarLeave.type === "Sick" ? "red" :
              selectedCalendarLeave.type === "Emergency" ? "amber" :
              "blue"
            }
            actions={[
              { label: "View Full Details", onClick: () => {
                setSelectedLeave(selectedCalendarLeave);
                setSelectedCalendarLeave(null);
                setShowDetailModal(true);
              }, variant: "primary" },
              { label: "Close", onClick: () => setSelectedCalendarLeave(null), variant: "secondary" },
            ]}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name={selectedCalendarLeave.employeeName} size="lg" />
                <div>
                  <h3 className={cn("font-semibold", isDark || isGlass ? "text-white" : "text-gray-800")}>
                    {selectedCalendarLeave.employeeName}
                  </h3>
                  <p className={cn("text-sm", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                    {employees.find((e) => e.id === selectedCalendarLeave.employeeId)?.department}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={cn("p-4 rounded-xl", isDark || isGlass ? "bg-white/5" : "bg-gray-50")}>
                  <p className={cn("text-xs mb-1", isDark || isGlass ? "text-gray-500" : "text-gray-400")}>Duration</p>
                  <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                    {selectedCalendarLeave.days} days
                  </p>
                </div>
                <div className={cn("p-4 rounded-xl", isDark || isGlass ? "bg-white/5" : "bg-gray-50")}>
                  <p className={cn("text-xs mb-1", isDark || isGlass ? "text-gray-500" : "text-gray-400")}>Period</p>
                  <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                    {format(new Date(selectedCalendarLeave.startDate), "MMM d")} - {format(new Date(selectedCalendarLeave.endDate), "MMM d")}
                  </p>
                </div>
              </div>
            </div>
          </DetailModal>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      {exportData && (
        <DataExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={exportData}
        />
      )}
    </div>
  );
};

export default LeavesPage;
