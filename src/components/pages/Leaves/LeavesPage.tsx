import React, { useState, useMemo, useCallback } from "react";
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
import { ColoredStatsCard, StatsGrid } from "../../common/ColoredStatsCard";
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
import { format, differenceInDays } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
  const [selectedLeave, setSelectedLeave] = useState<(typeof leaves)[0] | null>(
    null,
  );
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ReturnType<
    typeof createExportData
  > | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = leaves.filter((l) => l.status === "Pending").length;
    const approved = leaves.filter((l) => l.status === "Approved").length;
    const rejected = leaves.filter((l) => l.status === "Rejected").length;
    const totalDays = leaves
      .filter((l) => l.status === "Approved")
      .reduce((acc, l) => acc + l.days, 0);
    return { pending, approved, rejected, totalDays };
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
      value: leaves.filter((l) => l.type === type && l.status === "Approved")
        .length,
      color: leaveTypeColors[type as LeaveType],
    }))
    .filter((d) => d.value > 0);

  // Monthly leave trend
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    const monthStr = format(month, "yyyy-MM");
    const monthLeaves = leaves.filter(
      (l) => l.startDate.startsWith(monthStr) && l.status === "Approved",
    );
    return {
      month: format(month, "MMM"),
      leaves: monthLeaves.length,
      days: monthLeaves.reduce((acc, l) => acc + l.days, 0),
    };
  });

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
              <p className="font-medium text-gray-800">{leave.employeeName}</p>
              <p className="text-xs text-gray-500">{employee?.department}</p>
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
        <Badge
          style={{
            backgroundColor: `${leaveTypeColors[leave.type as LeaveType]}20`,
            color: leaveTypeColors[leave.type as LeaveType],
          }}
        >
          {leave.type}
        </Badge>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (leave: (typeof leaves)[0]) => (
        <div>
          <p className="font-medium text-gray-800">
            {format(new Date(leave.startDate), "MMM d")} -{" "}
            {format(new Date(leave.endDate), "MMM d")}
          </p>
          <p className="text-xs text-gray-500">{leave.days} days</p>
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
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full",
              config.bgColor,
            )}
          >
            <span className={config.color}>{config.icon}</span>
            <span className={cn("text-sm font-medium", config.color)}>
              {leave.status}
            </span>
          </div>
        );
      },
    },
    {
      key: "reason",
      label: "Reason",
      render: (leave: (typeof leaves)[0]) => (
        <p
          className="text-sm text-gray-600 truncate max-w-[200px]"
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
          <button
            onClick={() => {
              setSelectedLeave(leave);
              setShowDetailModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          {leave.status === "Pending" && (
            <>
              <button
                className="p-1.5 hover:bg-success-50 rounded-lg transition-colors"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4 text-success" />
              </button>
              <button
                className="p-1.5 hover:bg-error-50 rounded-lg transition-colors"
                title="Reject"
              >
                <XCircle className="w-4 h-4 text-error" />
              </button>
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
            <p className="font-medium text-gray-800">{balance.employeeName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "annual",
      label: "Annual Leave",
      render: (balance: (typeof leaveBalances)[0]) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[100px]">
            <div
              className="bg-success rounded-full h-2"
              style={{
                width: `${(balance.annual.remaining / balance.annual.total) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {balance.annual.remaining}/{balance.annual.total}
          </span>
        </div>
      ),
    },
    {
      key: "sick",
      label: "Sick Leave",
      render: (balance: (typeof leaveBalances)[0]) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[100px]">
            <div
              className="bg-error rounded-full h-2"
              style={{
                width: `${(balance.sick.remaining / balance.sick.total) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {balance.sick.remaining}/{balance.sick.total}
          </span>
        </div>
      ),
    },
    {
      key: "emergency",
      label: "Emergency",
      render: (balance: (typeof leaveBalances)[0]) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[100px]">
            <div
              className="bg-warning rounded-full h-2"
              style={{
                width: `${(balance.emergency.remaining / balance.emergency.total) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {balance.emergency.remaining}/{balance.emergency.total}
          </span>
        </div>
      ),
    },
    {
      key: "unpaid",
      label: "Unpaid",
      render: (balance: (typeof leaveBalances)[0]) => (
        <span className="text-sm text-gray-600">
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
      </div>

      {/* Stats Cards with ColoredStatsCard */}
      <StatsGrid columns={4}>
        <ColoredStatsCard
          title="Pending Requests"
          value={stats.pending}
          icon={<Clock className="w-6 h-6" />}
          color="amber"
          subtitle="Awaiting review"
          sparkle={stats.pending > 0}
        />
        <ColoredStatsCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="w-6 h-6" />}
          color="emerald"
          subtitle="This month"
        />
        <ColoredStatsCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="w-6 h-6" />}
          color="danger"
          subtitle="This month"
        />
        <ColoredStatsCard
          title="Total Leave Days"
          value={stats.totalDays}
          icon={<CalendarDays className="w-6 h-6" />}
          color="purple"
          subtitle="Approved days"
        />
      </StatsGrid>

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
        variant="separated"
      />

      {/* Leave Requests Tab */}
      <TabPanel id="requests" activeTab={activeTab}>
        <Card className="p-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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

      {/* Leave Calendar Tab */}
      <TabPanel id="calendar" activeTab={activeTab}>
        <Card className="p-6">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Leave Calendar
            </h3>
            <p className="text-gray-500">
              Visual calendar showing all approved leaves
            </p>
          </div>
        </Card>
      </TabPanel>

      {/* Reports Tab */}
      <TabPanel id="reports" activeTab={activeTab}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Monthly Leave Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="leaves"
                    name="Requests"
                    fill="#5B4CCC"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="days"
                    name="Days"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Leave Type Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent !== undefined
                        ? `${name} ${(percent * 100).toFixed(0)}%`
                        : name
                    }
                    labelLine={false}
                  >
                    {leaveTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {leaveTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
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

      {/* Leave Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Leave Request Details"
        size="md"
      >
        {selectedLeave && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedLeave.employeeName} size="lg" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedLeave.employeeName}
                </h3>
                <p className="text-sm text-gray-500">
                  {
                    employees.find((e) => e.id === selectedLeave.employeeId)
                      ?.position
                  }
                </p>
              </div>
              <div className="ml-auto">
                {(() => {
                  const config =
                    statusConfig[selectedLeave.status as LeaveStatus];
                  return (
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full",
                        config.bgColor,
                      )}
                    >
                      <span className={config.color}>{config.icon}</span>
                      <span className={cn("text-sm font-medium", config.color)}>
                        {selectedLeave.status}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Leave Type</p>
                <Badge
                  className="mt-1"
                  style={{
                    backgroundColor: `${leaveTypeColors[selectedLeave.type as LeaveType]}20`,
                    color: leaveTypeColors[selectedLeave.type as LeaveType],
                  }}
                >
                  {selectedLeave.type}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-800">
                  {selectedLeave.days} days
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(selectedLeave.startDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(selectedLeave.endDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                <p className="text-sm text-gray-500">Reason</p>
                <p className="font-medium text-gray-800">
                  {selectedLeave.reason}
                </p>
              </div>
            </div>

            {selectedLeave.status === "Pending" && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

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
