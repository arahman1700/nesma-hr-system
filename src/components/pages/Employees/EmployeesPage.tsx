import React, { useState, useCallback, useEffect } from "react";
import {
  Users,
  Grid,
  List,
  Plus,
  Download,
  Upload,
  Mail,
  Search,
  Filter,
  Building2,
  UserPlus,
  UserMinus,
  Activity,
  BarChart3,
  IdCard,
  Award,
  Briefcase,
  MapPin,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Button,
  Card,
  Tabs,
  TabPanel,
  Avatar,
  Badge,
  StatusBadge,
  Input,
  Select,
  Table,
} from "../../common";
import { ColoredStatsCard, StatsGrid } from "../../common/ColoredStatsCard";
import {
  EnhancedStat,
  SkeletonCard,
  SkeletonTable,
  EnhancedAvatar,
  Tooltip,
  EmptyState,
  ProgressIndicator,
} from "../../common/EnhancedUI";
import {
  FilterBar,
  ActiveFilter,
  FilterConfig,
  FilterValue,
} from "../../common/FilterBar";
import {
  HRStatCard,
  EmployeeTypeCard,
  DemographicsCard,
  TenureCard,
  AttendanceRateCard,
} from "../../common/HRDashboardCards";
import { DataExportModal, ExportData } from "../../common/DataExportModal";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
import { employees, departments, positions } from "../../../data";
import { Employee } from "../../../types";

// Team Tab Component
const TeamTab: React.FC<{ employees: Employee[] }> = ({ employees }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter((emp) => {
    const matchesStatus =
      statusFilter === "all" ||
      emp.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDepartment =
      departmentFilter === "all" || emp.department === departmentFilter;
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDepartment && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] max-w-md">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        />
        <Select
          options={[
            { value: "all", label: "All Departments" },
            ...departments.map((d) => ({ value: d.name, label: d.name })),
          ]}
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-48"
        />
        <div
          className={cn(
            "flex items-center gap-1 p-1 rounded-lg",
            isGlass ? "bg-white/10" : isDark ? "bg-gray-700" : "bg-gray-100",
          )}
        >
          <Tooltip content="Grid View" position="top">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                viewMode === "grid"
                  ? isGlass
                    ? "bg-white/20 shadow-sm"
                    : isDark
                      ? "bg-gray-600 shadow-sm"
                      : "bg-white shadow-sm"
                  : isGlass
                    ? "hover:bg-white/10"
                    : isDark
                      ? "hover:bg-gray-600"
                      : "hover:bg-gray-200",
              )}
            >
              <Grid
                className={cn(
                  "w-4 h-4 transition-colors",
                  viewMode === "grid"
                    ? "text-[#2E3192]"
                    : isGlass || isDark
                      ? "text-white/70"
                      : "text-gray-500",
                )}
              />
            </button>
          </Tooltip>
          <Tooltip content="List View" position="top">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                viewMode === "list"
                  ? isGlass
                    ? "bg-white/20 shadow-sm"
                    : isDark
                      ? "bg-gray-600 shadow-sm"
                      : "bg-white shadow-sm"
                  : isGlass
                    ? "hover:bg-white/10"
                    : isDark
                      ? "hover:bg-gray-600"
                      : "hover:bg-gray-200",
              )}
            >
              <List
                className={cn(
                  "w-4 h-4 transition-colors",
                  viewMode === "list"
                    ? "text-[#2E3192]"
                    : isGlass || isDark
                      ? "text-white/70"
                      : "text-gray-500",
                )}
              />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Results count */}
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
        Showing {filteredEmployees.length} of {employees.length} employees
      </p>

      {/* Empty State */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No employees found"
          description="Try adjusting your search or filter criteria"
          action={{
            label: "Clear Filters",
            onClick: () => {
              setSearchTerm("");
              setStatusFilter("all");
              setDepartmentFilter("all");
            },
          }}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <Card
              key={emp.id}
              hover
              className={cn(
                "p-4 group transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
              )}
            >
              <div className="flex items-start gap-4">
                <EnhancedAvatar
                  src={emp.photo}
                  name={emp.fullName}
                  size="lg"
                  status={
                    emp.status === "Active"
                      ? "online"
                      : emp.status === "On Leave"
                        ? "away"
                        : "offline"
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={cn(
                        "font-semibold truncate",
                        isGlass
                          ? "text-[#2E3192]"
                          : isDark
                            ? "text-white"
                            : "text-gray-800",
                      )}
                    >
                      {emp.fullName}
                    </h3>
                  </div>
                  <p
                    className={cn(
                      "text-sm truncate",
                      isGlass
                        ? "text-[#2E3192]/70"
                        : isDark
                          ? "text-gray-400"
                          : "text-gray-500",
                    )}
                  >
                    {emp.position}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-1 truncate",
                      isGlass
                        ? "text-[#2E3192]/50"
                        : isDark
                          ? "text-gray-500"
                          : "text-gray-400",
                    )}
                  >
                    {emp.email}
                  </p>
                  <p
                    className={cn(
                      "text-xs truncate",
                      isGlass
                        ? "text-[#2E3192]/50"
                        : isDark
                          ? "text-gray-500"
                          : "text-gray-400",
                    )}
                  >
                    {emp.phone}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "mt-4 pt-4 border-t flex items-center justify-between",
                  isGlass
                    ? "border-white/10"
                    : isDark
                      ? "border-gray-700"
                      : "border-gray-100",
                )}
              >
                <Badge
                  variant={
                    emp.employmentType === "Full-time" ? "primary" : "default"
                  }
                  size="sm"
                >
                  {emp.employmentType}
                </Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip content="View" position="top">
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isGlass
                          ? "hover:bg-white/10 text-[#2E3192]"
                          : isDark
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-100 text-gray-500",
                      )}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Edit" position="top">
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isGlass
                          ? "hover:bg-white/10 text-[#2E3192]"
                          : isDark
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-100 text-gray-500",
                      )}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Table
          columns={[
            {
              key: "fullName",
              label: "Employee",
              sortable: true,
              render: (row: Employee) => (
                <EnhancedAvatar
                  src={row.photo}
                  name={row.fullName}
                  size="md"
                  status={
                    row.status === "Active"
                      ? "online"
                      : row.status === "On Leave"
                        ? "away"
                        : "offline"
                  }
                  showName
                  subtitle={row.employeeId}
                />
              ),
            },
            { key: "position", label: "Position", sortable: true },
            { key: "department", label: "Department", sortable: true },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            {
              key: "status",
              label: "Status",
              render: (row: Employee) => (
                <StatusBadge status={row.status} size="sm" />
              ),
            },
            {
              key: "actions",
              label: "Actions",
              render: () => (
                <div className="flex gap-1">
                  <Tooltip content="View Details" position="top">
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isGlass
                          ? "hover:bg-white/10 text-[#2E3192]"
                          : isDark
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-100 text-gray-500",
                      )}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Edit" position="top">
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isGlass
                          ? "hover:bg-white/10 text-[#2E3192]"
                          : isDark
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-100 text-gray-500",
                      )}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete" position="top">
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        "hover:bg-rose-500/10 text-rose-500",
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              ),
            },
          ]}
          data={filteredEmployees}
          keyField="id"
          pagination
          pageSize={10}
          searchable={false}
        />
      )}
    </div>
  );
};

// Org Chart Tab
const OrgChartTab: React.FC = () => {
  return (
    <Card>
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-800">
          Organization Chart
        </h3>
        <p className="text-gray-500 mt-2">
          Interactive organization chart coming soon
        </p>
        <Button variant="primary" className="mt-4">
          View Full Chart
        </Button>
      </div>
    </Card>
  );
};

// Onboarding Tab
const OnboardingTab: React.FC = () => {
  const newHires = employees.filter((e) => {
    const hireDate = new Date(e.hireDate);
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - 3);
    return hireDate > monthsAgo;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Card className="px-6 py-4">
            <p className="text-sm text-gray-500">Ready</p>
            <p className="text-2xl font-bold text-success">{newHires.length}</p>
          </Card>
          <Card className="px-6 py-4">
            <p className="text-sm text-gray-500">Draft</p>
            <p className="text-2xl font-bold text-warning">0</p>
          </Card>
        </div>
        <Button icon={<UserPlus className="w-4 h-4" />}>New Hire</Button>
      </div>

      <Table
        columns={[
          {
            key: "fullName",
            label: "Employee",
            render: (row: Employee) => (
              <div className="flex items-center gap-3">
                <Avatar name={row.fullName} size="sm" />
                <div>
                  <p className="font-medium">{row.fullName}</p>
                  <p className="text-xs text-gray-500">{row.employeeId}</p>
                </div>
              </div>
            ),
          },
          { key: "position", label: "Position" },
          { key: "department", label: "Department" },
          { key: "hireDate", label: "Hire Date" },
          {
            key: "status",
            label: "Status",
            render: () => <Badge variant="success">Ready</Badge>,
          },
        ]}
        data={newHires}
        keyField="id"
        emptyMessage="No pending onboarding processes"
      />
    </div>
  );
};

// Offboarding Tab
const OffboardingTab: React.FC = () => {
  return (
    <Card>
      <div className="text-center py-12">
        <UserMinus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-800">Offboarding</h3>
        <p className="text-gray-500 mt-2">No active offboarding processes</p>
        <Button
          variant="outline"
          className="mt-4"
          icon={<Plus className="w-4 h-4" />}
        >
          Initiate Offboarding
        </Button>
      </div>
    </Card>
  );
};

// Tracking Tab
const TrackingTab: React.FC = () => {
  return (
    <Card>
      <div className="text-center py-12">
        <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-800">
          Employee Tracking
        </h3>
        <p className="text-gray-500 mt-2">
          Track employee activities and progress
        </p>
      </div>
    </Card>
  );
};

// Reports Tab
const ReportsTab: React.FC = () => {
  const reportTypes = [
    {
      name: "Employee Directory",
      description: "Full list with contact details",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Department Distribution",
      description: "Employees by department",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      name: "Position Analysis",
      description: "Employees by position/role",
      icon: <Award className="w-5 h-5" />,
    },
    {
      name: "New Hires Report",
      description: "Onboarding in last 90 days",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      name: "Turnover Report",
      description: "Employees left in period",
      icon: <UserMinus className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reportTypes.map((report, index) => (
        <Card key={index} hover className="cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-light rounded-lg text-primary">
              {report.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{report.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{report.description}</p>
              <Button variant="ghost" size="sm" className="mt-2 -ml-3">
                Generate Report
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Muqeem Services Tab
const MuqeemServicesTab: React.FC = () => {
  const expiringIqamas = employees.filter((e) => e.iqamaExpiry).slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button icon={<Plus className="w-4 h-4" />}>Issue New Iqama</Button>
        <Button variant="outline">Transfer Iqama</Button>
        <Button variant="outline">View All</Button>
      </div>

      <Table
        columns={[
          {
            key: "fullName",
            label: "Employee",
            render: (row: Employee) => (
              <div className="flex items-center gap-3">
                <Avatar name={row.fullName} size="sm" />
                <span className="font-medium">{row.fullName}</span>
              </div>
            ),
          },
          { key: "iqamaNumber", label: "Iqama Number" },
          { key: "iqamaExpiry", label: "Expiry Date" },
          {
            key: "status",
            label: "Status",
            render: (row: Employee) => {
              const expiry = row.iqamaExpiry ? new Date(row.iqamaExpiry) : null;
              const now = new Date();
              const daysUntilExpiry = expiry
                ? Math.floor(
                    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                  )
                : 999;

              if (daysUntilExpiry < 30)
                return <Badge variant="error">Expiring Soon</Badge>;
              if (daysUntilExpiry < 90)
                return <Badge variant="warning">Attention</Badge>;
              return <Badge variant="success">Valid</Badge>;
            },
          },
          {
            key: "actions",
            label: "Actions",
            render: () => (
              <Button variant="outline" size="sm">
                Renew
              </Button>
            ),
          },
        ]}
        data={expiringIqamas}
        keyField="id"
      />
    </div>
  );
};

// Performance Tab
const PerformanceTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button icon={<Plus className="w-4 h-4" />}>New Evaluation</Button>
        <Button variant="outline">Set Goals</Button>
        <Button variant="outline" icon={<BarChart3 className="w-4 h-4" />}>
          View Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-500">Top Performers</p>
          <p className="text-3xl font-bold text-success mt-2">5</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-500">Needs Improvement</p>
          <p className="text-3xl font-bold text-warning mt-2">2</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-500">Average Score</p>
          <p className="text-3xl font-bold text-primary mt-2">4.2/5</p>
        </Card>
      </div>

      <Card>
        <div className="text-center py-8">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-800">
            Performance Evaluation
          </h3>
          <p className="text-gray-500 mt-2">
            Start evaluating employee performance
          </p>
        </div>
      </Card>
    </div>
  );
};

// Main Employees Page
const EmployeesPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [activeTab, setActiveTab] = useState("team");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate stats
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const onLeave = employees.filter((e) => e.status === "On Leave").length;
  const newHires = employees.filter((e) => {
    const hireDate = new Date(e.hireDate);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return hireDate > monthAgo;
  }).length;

  // Filter configuration
  const filterConfigs: FilterConfig[] = [
    {
      id: "department",
      label: "Department",
      type: "select",
      placeholder: "All Departments",
      options: departments.map((d) => ({
        value: d.name,
        label: d.name,
        count: employees.filter((e) => e.department === d.name).length,
      })),
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      placeholder: "All Statuses",
      options: [
        { value: "Active", label: "Active", count: activeEmployees },
        { value: "On Leave", label: "On Leave", count: onLeave },
        {
          value: "Inactive",
          label: "Inactive",
          count: employees.length - activeEmployees - onLeave,
        },
      ],
    },
    {
      id: "type",
      label: "Type",
      type: "select",
      placeholder: "All Types",
      options: [
        {
          value: "Full-time",
          label: "Full-time",
          count: employees.filter((e) => e.employmentType === "Full-time")
            .length,
        },
        {
          value: "Part-time",
          label: "Part-time",
          count: employees.filter((e) => e.employmentType === "Part-time")
            .length,
        },
        {
          value: "Contractor",
          label: "Contractor",
          count: employees.filter((e) => e.employmentType === "Contractor")
            .length,
        },
      ],
    },
  ];

  const handleFilterChange = useCallback(
    (filterId: string, value: FilterValue) => {
      if (value === null) {
        setActiveFilters((prev) => prev.filter((f) => f.filterId !== filterId));
      } else {
        const config = filterConfigs.find((c) => c.id === filterId);
        const displayValue = Array.isArray(value)
          ? value.join(", ")
          : typeof value === "object"
            ? JSON.stringify(value)
            : String(value);
        const option = config?.options?.find((o) => o.value === displayValue);

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
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  // Calculate detailed stats for HR cards
  const fullTimeCount = employees.filter(
    (e) => e.employmentType === "Full-time",
  ).length;
  const partTimeCount = employees.filter(
    (e) => e.employmentType === "Part-time",
  ).length;
  const contractorCount = employees.filter(
    (e) => e.employmentType === "Contractor",
  ).length;
  const internCount = employees.filter(
    (e) => e.employmentType === "Intern",
  ).length;

  // Simulate demographics data
  const maleCount = Math.round(employees.length * 0.65);
  const femaleCount = employees.length - maleCount;
  const averageAge = 32;

  // Simulate attendance rate
  const attendanceRate = 94;

  // Handle card click for export
  const handleCardClick = (cardType: string) => {
    let data: ExportData;

    switch (cardType) {
      case "employees":
        data = {
          title: "Employee Directory",
          columns: [
            { key: "id", label: "Employee ID" },
            { key: "name", label: "Full Name" },
            { key: "department", label: "Department" },
            { key: "position", label: "Position" },
            { key: "status", label: "Status" },
            { key: "type", label: "Employment Type" },
          ],
          data: employees.map((emp) => ({
            id: emp.employeeId,
            name: emp.fullName,
            department: emp.department,
            position: emp.position,
            status: emp.status,
            type: emp.employmentType,
          })),
          summary: [
            { label: "Total", value: employees.length },
            { label: "Active", value: activeEmployees },
            { label: "Departments", value: departments.length },
            { label: "New Hires", value: newHires },
          ],
        };
        break;
      default:
        return;
    }

    setExportData(data);
    setShowExportModal(true);
  };

  const tabs = [
    { id: "team", label: "Team", badge: employees.length },
    { id: "org-chart", label: "Org Chart" },
    { id: "onboarding", label: "Onboarding" },
    { id: "offboarding", label: "Offboarding" },
    { id: "tracking", label: "Tracking" },
    { id: "reports", label: "Reports" },
    { id: "muqeem", label: "Muqeem Services" },
    {
      id: "performance",
      label: "Performance",
      icon: <Award className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              isGlass || isDark ? "text-white" : "text-gray-800",
            )}
          >
            Employees
          </h1>
          <p
            className={cn(
              isGlass
                ? "text-white/60"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-500",
            )}
          >
            Manage your organization's workforce
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
            Bulk Import
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button variant="outline" icon={<Mail className="w-4 h-4" />}>
            Send Email
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>Add Employee</Button>
        </div>
      </div>

      {/* Stats Cards - Row 1 with Enhanced Stats */}
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
              value={employees.length}
              icon={<Users className="w-5 h-5" />}
              color="blue"
              trend={{ value: 5, isPositive: true, label: "vs last month" }}
              sparkline={[65, 68, 72, 70, 75, 78, 80]}
              onClick={() => handleCardClick("employees")}
            />
            <EnhancedStat
              label="Active"
              value={activeEmployees}
              icon={<Activity className="w-5 h-5" />}
              color="green"
              trend={{
                value: Math.round((activeEmployees / employees.length) * 100),
                isPositive: true,
                label: "rate",
              }}
              sparkline={[60, 62, 65, 68, 70, 72, 75]}
            />
            <EnhancedStat
              label="New Hires"
              value={newHires}
              icon={<UserPlus className="w-5 h-5" />}
              color="purple"
              sparkline={[2, 3, 1, 4, 2, 3, 5]}
            />
            <EnhancedStat
              label="Departments"
              value={departments.length}
              icon={<Building2 className="w-5 h-5" />}
              color="amber"
              sparkline={[5, 5, 6, 6, 6, 6, 6]}
            />
          </>
        )}
      </div>

      {/* HR Analytics Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EmployeeTypeCard
          fullTime={fullTimeCount}
          partTime={partTimeCount}
          contractors={contractorCount}
          interns={internCount}
        />
        <DemographicsCard
          maleCount={maleCount}
          femaleCount={femaleCount}
          averageAge={averageAge}
        />
        <TenureCard
          averageTenure={3.5}
          under1Year={15}
          oneToThreeYears={35}
          threeToFiveYears={25}
          overFiveYears={25}
        />
        <AttendanceRateCard
          rate={attendanceRate}
          present={72}
          absent={3}
          late={5}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
        onClearAll={handleClearAllFilters}
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

      {/* Tab Panels */}
      <TabPanel id="team" activeTab={activeTab}>
        <TeamTab employees={employees} />
      </TabPanel>
      <TabPanel id="org-chart" activeTab={activeTab}>
        <OrgChartTab />
      </TabPanel>
      <TabPanel id="onboarding" activeTab={activeTab}>
        <OnboardingTab />
      </TabPanel>
      <TabPanel id="offboarding" activeTab={activeTab}>
        <OffboardingTab />
      </TabPanel>
      <TabPanel id="tracking" activeTab={activeTab}>
        <TrackingTab />
      </TabPanel>
      <TabPanel id="reports" activeTab={activeTab}>
        <ReportsTab />
      </TabPanel>
      <TabPanel id="muqeem" activeTab={activeTab}>
        <MuqeemServicesTab />
      </TabPanel>
      <TabPanel id="performance" activeTab={activeTab}>
        <PerformanceTab />
      </TabPanel>

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

export default EmployeesPage;
