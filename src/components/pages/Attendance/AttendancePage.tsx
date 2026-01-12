import React, { useState, useMemo, useCallback } from "react";
import {
  Clock,
  Calendar,
  Users,
  TrendingUp,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Palmtree,
  Sun,
  Home,
  MoreVertical,
  Eye,
  Edit,
  FileText,
  Timer,
  UserCheck,
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
import {
  attendanceRecords,
  employees,
  departments,
  locations,
} from "../../../data";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import {
  AreaChart,
  Area,
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

type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late"
  | "On Leave"
  | "Holiday"
  | "Weekend"
  | "Remote";

const statusConfig: Record<
  AttendanceStatus,
  { color: string; bgColor: string; icon: React.ReactNode }
> = {
  Present: {
    color: "text-success-600",
    bgColor: "bg-success-50",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  Absent: {
    color: "text-error-600",
    bgColor: "bg-error-50",
    icon: <XCircle className="w-4 h-4" />,
  },
  Late: {
    color: "text-warning-600",
    bgColor: "bg-warning-50",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  "On Leave": {
    color: "text-secondary-600",
    bgColor: "bg-secondary-50",
    icon: <Palmtree className="w-4 h-4" />,
  },
  Holiday: {
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: <Sun className="w-4 h-4" />,
  },
  Weekend: {
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: <Calendar className="w-4 h-4" />,
  },
  Remote: {
    color: "text-primary",
    bgColor: "bg-primary-light",
    icon: <Home className="w-4 h-4" />,
  },
};

export const AttendancePage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<
    (typeof attendanceRecords)[0] | null
  >(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ReturnType<
    typeof createExportData
  > | null>(null);

  // Calculate statistics
  const todayRecords = attendanceRecords.filter((r) => r.date === selectedDate);
  const stats = useMemo(() => {
    const present = todayRecords.filter(
      (r) => r.status === "Present" || r.status === "Remote",
    ).length;
    const absent = todayRecords.filter((r) => r.status === "Absent").length;
    const late = todayRecords.filter((r) => r.status === "Late").length;
    const onLeave = todayRecords.filter((r) => r.status === "On Leave").length;
    const totalEmployees = employees.filter(
      (e) => e.status === "Active",
    ).length;
    const attendanceRate =
      totalEmployees > 0 ? Math.round((present / totalEmployees) * 100) : 0;

    return { present, absent, late, onLeave, totalEmployees, attendanceRate };
  }, [todayRecords]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return todayRecords.filter((record) => {
      const matchesSearch = record.employeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "all" ||
        employees.find((e) => e.id === record.employeeId)?.department ===
          selectedDepartment;
      const matchesLocation =
        selectedLocation === "all" || record.locationId === selectedLocation;
      const matchesStatus =
        selectedStatus === "all" || record.status === selectedStatus;
      return (
        matchesSearch && matchesDepartment && matchesLocation && matchesStatus
      );
    });
  }, [
    todayRecords,
    searchQuery,
    selectedDepartment,
    selectedLocation,
    selectedStatus,
  ]);

  // Chart data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayRecords = attendanceRecords.filter((r) => r.date === dateStr);
    const present = dayRecords.filter(
      (r) => r.status === "Present" || r.status === "Remote",
    ).length;
    const absent = dayRecords.filter((r) => r.status === "Absent").length;
    const late = dayRecords.filter((r) => r.status === "Late").length;
    return {
      date: format(date, "EEE"),
      present,
      absent,
      late,
      total: dayRecords.length,
    };
  });

  const statusDistribution = [
    { name: "Present", value: stats.present, color: "#10B981" },
    { name: "Absent", value: stats.absent, color: "#EF4444" },
    { name: "Late", value: stats.late, color: "#F59E0B" },
    { name: "On Leave", value: stats.onLeave, color: "#3B82F6" },
  ];

  const tabs = [
    {
      id: "daily",
      label: "Daily View",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "weekly",
      label: "Weekly Report",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "monthly",
      label: "Monthly Report",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const columns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (record: (typeof attendanceRecords)[0]) => {
        const employee = employees.find((e) => e.id === record.employeeId);
        return (
          <div className="flex items-center gap-3">
            <Avatar name={record.employeeName} size="sm" />
            <div>
              <p className="font-medium text-gray-800">{record.employeeName}</p>
              <p className="text-xs text-gray-500">{employee?.position}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (record: (typeof attendanceRecords)[0]) => {
        const config = statusConfig[record.status as AttendanceStatus];
        return (
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full",
              config.bgColor,
            )}
          >
            <span className={config.color}>{config.icon}</span>
            <span className={cn("text-sm font-medium", config.color)}>
              {record.status}
            </span>
          </div>
        );
      },
    },
    {
      key: "checkIn",
      label: "Check In",
      sortable: true,
      render: (record: (typeof attendanceRecords)[0]) => (
        <div>
          <p className="font-medium text-gray-800">{record.checkIn || "-"}</p>
          {record.lateMinutes > 0 && (
            <p className="text-xs text-warning-600">
              +{record.lateMinutes} min late
            </p>
          )}
        </div>
      ),
    },
    {
      key: "checkOut",
      label: "Check Out",
      sortable: true,
      render: (record: (typeof attendanceRecords)[0]) => (
        <div>
          <p className="font-medium text-gray-800">{record.checkOut || "-"}</p>
          {record.earlyLeaveMinutes > 0 && (
            <p className="text-xs text-warning-600">
              {record.earlyLeaveMinutes} min early
            </p>
          )}
        </div>
      ),
    },
    {
      key: "workHours",
      label: "Work Hours",
      sortable: true,
      render: (record: (typeof attendanceRecords)[0]) => (
        <div>
          <p className="font-medium text-gray-800">
            {record.workHours.toFixed(1)}h
          </p>
          {record.overtimeHours > 0 && (
            <p className="text-xs text-success-600">
              +{record.overtimeHours}h OT
            </p>
          )}
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (record: (typeof attendanceRecords)[0]) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{record.locationName}</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (record: (typeof attendanceRecords)[0]) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedRecord(record);
              setShowDetailModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ),
    },
  ];

  // Filter configuration for FilterBar
  const filterConfigs: FilterConfig[] = [
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
    {
      id: "location",
      label: "Location",
      type: "select",
      placeholder: "All Locations",
      options: locations.map((l) => ({
        value: l.id,
        label: l.name,
      })),
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      placeholder: "All Statuses",
      options: [
        { value: "Present", label: "Present", count: stats.present },
        { value: "Absent", label: "Absent", count: stats.absent },
        { value: "Late", label: "Late", count: stats.late },
        { value: "On Leave", label: "On Leave", count: stats.onLeave },
        { value: "Remote", label: "Remote" },
      ],
    },
    {
      id: "date",
      label: "Date",
      type: "date",
      placeholder: "Select Date",
    },
  ];

  const handleFilterChange = useCallback(
    (filterId: string, value: FilterValue) => {
      if (value === null) {
        setActiveFilters((prev) => prev.filter((f) => f.filterId !== filterId));
        // Reset the corresponding state
        if (filterId === "department") setSelectedDepartment("all");
        if (filterId === "location") setSelectedLocation("all");
        if (filterId === "status") setSelectedStatus("all");
      } else {
        const config = filterConfigs.find((c) => c.id === filterId);
        const displayValue = typeof value === "string" ? value : "";
        const option = config?.options?.find((o) => o.value === displayValue);

        // Update the corresponding state
        if (filterId === "department") setSelectedDepartment(displayValue);
        if (filterId === "location") setSelectedLocation(displayValue);
        if (filterId === "status") setSelectedStatus(displayValue);

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
    [filterConfigs],
  );

  const handleClearFilter = useCallback((filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.filterId !== filterId));
    if (filterId === "department") setSelectedDepartment("all");
    if (filterId === "location") setSelectedLocation("all");
    if (filterId === "status") setSelectedStatus("all");
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveFilters([]);
    setSelectedDepartment("all");
    setSelectedLocation("all");
    setSelectedStatus("all");
    setSearchQuery("");
  }, []);

  // Handle export
  const handleExport = useCallback(() => {
    const summaryItems = [
      { label: "Total Employees", value: stats.totalEmployees },
      { label: "Present", value: stats.present },
      { label: "Absent", value: stats.absent },
      { label: "Late", value: stats.late },
    ];

    const details = filteredRecords.map((record) => ({
      Employee: record.employeeName,
      Status: record.status,
      "Check In": record.checkIn || "-",
      "Check Out": record.checkOut || "-",
      "Work Hours": `${record.workHours.toFixed(1)}h`,
      Location: record.locationName,
    }));

    setExportData(
      createExportData(
        `Attendance Report - ${format(new Date(selectedDate), "MMM d, yyyy")}`,
        summaryItems,
        details,
      ),
    );
    setShowExportModal(true);
  }, [filteredRecords, selectedDate, stats]);

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
            Attendance
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
            Track and manage employee attendance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Clock className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards with ColoredStatsCard */}
      <StatsGrid columns={5}>
        <ColoredStatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          subtitle="Active workforce"
        />
        <ColoredStatsCard
          title="Present Today"
          value={stats.present}
          icon={<UserCheck className="w-6 h-6" />}
          color="emerald"
          trend={{
            value: stats.attendanceRate,
            isPositive: stats.attendanceRate >= 90,
            label: "attendance rate",
          }}
          sparkle
        />
        <ColoredStatsCard
          title="Absent"
          value={stats.absent}
          icon={<XCircle className="w-6 h-6" />}
          color="danger"
          subtitle="Not checked in"
        />
        <ColoredStatsCard
          title="Late Arrivals"
          value={stats.late}
          icon={<Timer className="w-6 h-6" />}
          color="amber"
          subtitle="After 9:00 AM"
        />
        <ColoredStatsCard
          title="On Leave"
          value={stats.onLeave}
          icon={<Palmtree className="w-6 h-6" />}
          color="purple"
          subtitle="Approved leaves"
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

      {/* Daily View Tab */}
      <TabPanel id="daily" activeTab={activeTab}>
        <Card className="p-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                options={[
                  { value: "all", label: "All Departments" },
                  ...departments.map((d) => ({ value: d.name, label: d.name })),
                ]}
                className="w-40"
              />
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                options={[
                  { value: "all", label: "All Locations" },
                  ...locations.map((l) => ({ value: l.id, label: l.name })),
                ]}
                className="w-40"
              />
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "Present", label: "Present" },
                  { value: "Absent", label: "Absent" },
                  { value: "Late", label: "Late" },
                  { value: "On Leave", label: "On Leave" },
                  { value: "Remote", label: "Remote" },
                ]}
                className="w-36"
              />
            </div>
          </div>

          {/* Table */}
          <Table data={filteredRecords} columns={columns} searchable={false} />
        </Card>
      </TabPanel>

      {/* Weekly Report Tab */}
      <TabPanel id="weekly" activeTab={activeTab}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Weekly Attendance Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient
                      id="colorPresent"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="present"
                    name="Present"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPresent)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Status Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {statusDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </TabPanel>

      {/* Monthly Report Tab */}
      <TabPanel id="monthly" activeTab={activeTab}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">
              Monthly Attendance Report
            </h3>
            <div className="flex items-center gap-3">
              <Select
                options={[
                  { value: "2024-01", label: "January 2024" },
                  { value: "2024-02", label: "February 2024" },
                  { value: "2024-03", label: "March 2024" },
                ]}
                defaultValue="2024-01"
              />
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="present"
                  name="Present"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="absent"
                  name="Absent"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="late"
                  name="Late"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </TabPanel>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Attendance Details"
        size="md"
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedRecord.employeeName} size="lg" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedRecord.employeeName}
                </h3>
                <p className="text-sm text-gray-500">
                  {
                    employees.find((e) => e.id === selectedRecord.employeeId)
                      ?.position
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(selectedRecord.date), "MMM d, yyyy")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <StatusBadge status={selectedRecord.status as any} />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Check In</p>
                <p className="font-medium text-gray-800">
                  {selectedRecord.checkIn || "-"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Check Out</p>
                <p className="font-medium text-gray-800">
                  {selectedRecord.checkOut || "-"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Work Hours</p>
                <p className="font-medium text-gray-800">
                  {selectedRecord.workHours.toFixed(1)} hours
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Overtime</p>
                <p className="font-medium text-gray-800">
                  {selectedRecord.overtimeHours} hours
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                <p className="text-sm text-gray-500">Location</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-800">
                    {selectedRecord.locationName}
                  </p>
                </div>
              </div>
            </div>

            {selectedRecord.notes && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-800">
                  {selectedRecord.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Record
              </Button>
            </div>
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

export default AttendancePage;
