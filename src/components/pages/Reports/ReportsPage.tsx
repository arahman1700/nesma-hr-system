import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Palmtree,
  FileText,
  Building2,
  MapPin,
  Target,
  Activity,
  Award,
  RefreshCw,
  Eye,
  Maximize2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  UserCheck,
  FileWarning,
  AlertTriangle,
} from "lucide-react";
import {
  Button,
  Card,
  Tabs,
  TabPanel,
  Badge,
  Select,
} from "../../common";
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
import {
  SkeletonCard,
  EnhancedAvatar,
} from "../../common/EnhancedUI";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  employees,
  departments,
  attendanceRecords,
  leaves,
  payrollRecords,
} from "../../../data";
import { format, subMonths, differenceInDays } from "date-fns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  Bar,
} from "recharts";

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "amber" | "red" | "purple";
  sparklineData?: number[];
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon,
  color,
  sparklineData,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      light: "bg-blue-500/10",
      text: "text-blue-500",
    },
    green: {
      bg: "from-emerald-500 to-emerald-600",
      light: "bg-emerald-500/10",
      text: "text-emerald-500",
    },
    amber: {
      bg: "from-amber-500 to-amber-600",
      light: "bg-amber-500/10",
      text: "text-amber-500",
    },
    red: {
      bg: "from-rose-500 to-rose-600",
      light: "bg-rose-500/10",
      text: "text-rose-500",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      light: "bg-purple-500/10",
      text: "text-purple-500",
    },
  };

  const isPositive = change >= 0;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "relative p-6 rounded-2xl overflow-hidden",
        isGlass
          ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
          : isDark
            ? "bg-gray-800/80 border border-gray-700"
            : "bg-white border border-gray-100 shadow-sm"
      )}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl",
          `bg-gradient-to-br ${colorClasses[color].bg}`
        )}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "p-3 rounded-xl",
              colorClasses[color].light,
              colorClasses[color].text
            )}
          >
            {icon}
          </div>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              isPositive
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-rose-500"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
        </div>

        <p
          className={cn(
            "text-sm mb-1",
            isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "text-3xl font-bold",
            isGlass || isDark ? "text-white" : "text-gray-900"
          )}
        >
          {value}
        </p>
        <p
          className={cn(
            "text-xs mt-2",
            isGlass ? "text-white/40" : isDark ? "text-gray-500" : "text-gray-400"
          )}
        >
          {changeLabel}
        </p>

        {sparklineData && (
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map((v, i) => ({ v, i }))}>
                <defs>
                  <linearGradient id={`kpi-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={
                        color === "blue"
                          ? "#3B82F6"
                          : color === "green"
                            ? "#10B981"
                            : color === "amber"
                              ? "#F59E0B"
                              : color === "red"
                                ? "#EF4444"
                                : "#8B5CF6"
                      }
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        color === "blue"
                          ? "#3B82F6"
                          : color === "green"
                            ? "#10B981"
                            : color === "amber"
                              ? "#F59E0B"
                              : color === "red"
                                ? "#EF4444"
                                : "#8B5CF6"
                      }
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={
                    color === "blue"
                      ? "#3B82F6"
                      : color === "green"
                        ? "#10B981"
                        : color === "amber"
                          ? "#F59E0B"
                          : color === "red"
                            ? "#EF4444"
                            : "#8B5CF6"
                  }
                  strokeWidth={2}
                  fill={`url(#kpi-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Reports Dashboard Page
const ReportsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("month");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Calculate stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const onLeave = employees.filter((e) => e.status === "On Leave").length;
  const totalPayroll = payrollRecords.reduce((sum, p) => sum + p.netSalary, 0);
  const avgAttendance = 94.5;
  const avgPerformance = 4.2;

  // Monthly trends data
  const monthlyTrends = [
    { month: "Jul", employees: 72, payroll: 420000, attendance: 92, turnover: 2 },
    { month: "Aug", employees: 74, payroll: 435000, attendance: 94, turnover: 1 },
    { month: "Sep", employees: 75, payroll: 445000, attendance: 93, turnover: 3 },
    { month: "Oct", employees: 78, payroll: 455000, attendance: 95, turnover: 1 },
    { month: "Nov", employees: 80, payroll: 465000, attendance: 94, turnover: 2 },
    { month: "Dec", employees: 80, payroll: 470000, attendance: 96, turnover: 0 },
  ];

  // Department performance
  const departmentPerformance = departments.map((dept) => ({
    name: dept.name,
    employees: employees.filter((e) => e.department === dept.name).length,
    attendance: Math.round(85 + Math.random() * 15),
    performance: (3.5 + Math.random() * 1.5).toFixed(1),
    color: ["#2E3192", "#80D1E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][
      departments.indexOf(dept) % 6
    ],
  }));

  // Leave types distribution
  const leaveDistribution = [
    { name: "Annual Leave", value: 45, color: "#2E3192" },
    { name: "Sick Leave", value: 20, color: "#EF4444" },
    { name: "Emergency", value: 10, color: "#F59E0B" },
    { name: "Maternity", value: 5, color: "#EC4899" },
    { name: "Other", value: 8, color: "#6B7280" },
  ];

  // Payroll breakdown
  const payrollBreakdown = [
    { name: "Basic Salary", value: 65, color: "#2E3192" },
    { name: "Housing", value: 20, color: "#80D1E9" },
    { name: "Transport", value: 10, color: "#10B981" },
    { name: "Other", value: 5, color: "#F59E0B" },
  ];

  // Turnover analysis
  const turnoverData = [
    { name: "Jan", hired: 5, left: 2 },
    { name: "Feb", hired: 3, left: 1 },
    { name: "Mar", hired: 4, left: 3 },
    { name: "Apr", hired: 6, left: 2 },
    { name: "May", hired: 4, left: 1 },
    { name: "Jun", hired: 3, left: 2 },
  ];

  // Recent activities
  const recentActivities = [
    { time: "Today, 10:30 AM", event: "Monthly payroll processed", type: "success" as const },
    { time: "Today, 09:15 AM", event: "5 new leave requests submitted", type: "info" as const },
    { time: "Yesterday", event: "Performance reviews completed", type: "success" as const },
    { time: "2 days ago", event: "3 documents expiring soon", type: "warning" as const },
    { time: "3 days ago", event: "New employee onboarded", type: "success" as const },
  ];

  // Expiring documents count
  const expiringDocs = employees.filter((emp) => {
    if (!emp.iqamaExpiry) return false;
    const daysUntil = differenceInDays(new Date(emp.iqamaExpiry), new Date());
    return daysUntil > 0 && daysUntil < 90;
  }).length;

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "workforce", label: "Workforce", icon: <Users className="w-4 h-4" /> },
    { id: "financial", label: "Financial", icon: <DollarSign className="w-4 h-4" /> },
    { id: "attendance", label: "Attendance", icon: <Clock className="w-4 h-4" /> },
    { id: "compliance", label: "Compliance", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              isGlass || isDark ? "text-white" : "text-gray-800"
            )}
          >
            Reports & Analytics
          </h1>
          <p
            className={cn(
              isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
            )}
          >
            Comprehensive HR insights and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "quarter", label: "This Quarter" },
              { value: "year", label: "This Year" },
            ]}
            className="w-40"
          />
          <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button icon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Employees"
          value={totalEmployees}
          change={5.2}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          sparklineData={[65, 68, 70, 72, 75, 78, 80]}
        />
        <KPICard
          title="Attendance Rate"
          value={`${avgAttendance}%`}
          change={2.1}
          icon={<UserCheck className="w-6 h-6" />}
          color="green"
          sparklineData={[91, 93, 92, 94, 95, 94, 96]}
        />
        <KPICard
          title="Monthly Payroll"
          value={`${(totalPayroll / 1000).toFixed(0)}K`}
          change={3.5}
          changeLabel="SAR vs last month"
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
          sparklineData={[420, 435, 445, 455, 465, 470]}
        />
        <KPICard
          title="On Leave"
          value={onLeave}
          change={-15}
          icon={<Palmtree className="w-6 h-6" />}
          color="amber"
          sparklineData={[8, 6, 7, 5, 6, 4]}
        />
        <KPICard
          title="Expiring Docs"
          value={expiringDocs}
          change={expiringDocs > 5 ? 25 : -10}
          icon={<FileWarning className="w-6 h-6" />}
          color="red"
          sparklineData={[3, 5, 4, 6, 5, expiringDocs]}
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="modern"
      />

      {/* Overview Tab */}
      <TabPanel id="overview" activeTab={activeTab}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <ChartWrapper
              title="Monthly Trends"
              subtitle="Employee count and payroll over time"
              trend={{ value: 5.2, isPositive: true }}
              onExport={() => console.log("Export")}
            >
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E3192" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2E3192" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#E5E7EB"}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1F2937" : "#fff",
                      border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "12px",
                      color: isDark ? "#F3F4F6" : "#1F2937",
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="payroll"
                    name="Payroll (SAR)"
                    stroke="#2E3192"
                    fill="url(#payrollGrad)"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="employees"
                    name="Employees"
                    fill="#80D1E9"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="attendance"
                    name="Attendance %"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Side Widgets */}
          <div className="space-y-6">
            {/* Department Performance */}
            <ChartWrapper
              title="Department Performance"
              subtitle="By employee count"
            >
              <EnhancedDonutChart
                data={departmentPerformance.map((d) => ({
                  name: d.name,
                  value: d.employees,
                  color: d.color,
                }))}
                height={200}
                innerRadius={40}
                outerRadius={70}
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
              <h3
                className={cn(
                  "text-lg font-semibold mb-4",
                  isGlass || isDark ? "text-white" : "text-gray-800"
                )}
              >
                Recent Activity
              </h3>
              <TimelineChart data={recentActivities} maxItems={5} />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Turnover Analysis */}
          <ChartWrapper
            title="Turnover Analysis"
            subtitle="Hiring vs departures"
          >
            <EnhancedBarChart
              data={turnoverData}
              dataKeys={[
                { key: "hired", color: "#10B981", name: "Hired" },
                { key: "left", color: "#EF4444", name: "Left" },
              ]}
              height={200}
            />
          </ChartWrapper>

          {/* Leave Distribution */}
          <ChartWrapper
            title="Leave Distribution"
            subtitle="By leave type"
          >
            <EnhancedDonutChart
              data={leaveDistribution}
              height={200}
              innerRadius={40}
              outerRadius={70}
            />
          </ChartWrapper>

          {/* Payroll Breakdown */}
          <ChartWrapper
            title="Payroll Breakdown"
            subtitle="Salary components"
          >
            <EnhancedDonutChart
              data={payrollBreakdown}
              height={200}
              innerRadius={40}
              outerRadius={70}
            />
          </ChartWrapper>
        </div>
      </TabPanel>

      {/* Workforce Tab */}
      <TabPanel id="workforce" activeTab={activeTab}>
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InteractiveStatCard
              title="Total Headcount"
              value={totalEmployees}
              icon={<Users className="w-5 h-5" />}
              color="blue"
              trend={{ value: 5.2, isPositive: true }}
              sparkline={[65, 68, 70, 72, 75, 78, 80]}
            />
            <InteractiveStatCard
              title="New Hires (MTD)"
              value={5}
              icon={<UserCheck className="w-5 h-5" />}
              color="green"
              sparkline={[2, 3, 4, 3, 5, 4, 5]}
            />
            <InteractiveStatCard
              title="Turnover Rate"
              value="2.5%"
              icon={<Activity className="w-5 h-5" />}
              color="amber"
              trend={{ value: -0.5, isPositive: true }}
            />
            <InteractiveStatCard
              title="Avg Tenure"
              value="3.5y"
              icon={<Award className="w-5 h-5" />}
              color="purple"
            />
          </div>

          {/* Department Table */}
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
            <h3
              className={cn(
                "text-lg font-semibold mb-4",
                isGlass || isDark ? "text-white" : "text-gray-800"
              )}
            >
              Department Overview
            </h3>
            <DataTable
              headers={["Department", "Employees", "Attendance", "Performance", "Status"]}
              rows={departmentPerformance.map((dept) => [
                <div className="flex items-center gap-3" key={dept.name}>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  {dept.name}
                </div>,
                dept.employees,
                `${dept.attendance}%`,
                <div className="flex items-center gap-1" key={`perf-${dept.name}`}>
                  <span>{dept.performance}</span>
                  <span className="text-amber-500">/5</span>
                </div>,
                <Badge
                  variant={Number(dept.performance) >= 4 ? "success" : "warning"}
                  size="sm"
                  key={`badge-${dept.name}`}
                >
                  {Number(dept.performance) >= 4 ? "Excellent" : "Good"}
                </Badge>,
              ])}
            />
          </div>
        </div>
      </TabPanel>

      {/* Financial Tab */}
      <TabPanel id="financial" activeTab={activeTab}>
        <div className="space-y-6">
          {/* Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InteractiveStatCard
              title="Monthly Payroll"
              value={`${(totalPayroll / 1000).toFixed(0)}K SAR`}
              icon={<DollarSign className="w-5 h-5" />}
              color="blue"
              trend={{ value: 3.5, isPositive: true }}
              sparkline={[420, 435, 445, 455, 465, 470]}
            />
            <InteractiveStatCard
              title="Avg Salary"
              value={`${Math.round(totalPayroll / totalEmployees / 1000)}K SAR`}
              icon={<Briefcase className="w-5 h-5" />}
              color="green"
            />
            <InteractiveStatCard
              title="Benefits Cost"
              value="85K SAR"
              icon={<Award className="w-5 h-5" />}
              color="purple"
              trend={{ value: 2.1, isPositive: false }}
            />
            <InteractiveStatCard
              title="YTD Spend"
              value="2.8M SAR"
              icon={<Target className="w-5 h-5" />}
              color="amber"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper
              title="Payroll Trend"
              subtitle="Monthly payroll over time"
              trend={{ value: 3.5, isPositive: true }}
            >
              <EnhancedAreaChart
                data={monthlyTrends.map((m) => ({
                  name: m.month,
                  payroll: m.payroll,
                }))}
                dataKeys={[{ key: "payroll", color: "#2E3192", name: "Payroll (SAR)" }]}
                height={300}
              />
            </ChartWrapper>

            <ChartWrapper
              title="Salary Components"
              subtitle="Breakdown of salary types"
            >
              <EnhancedDonutChart
                data={payrollBreakdown}
                height={300}
                innerRadius={60}
                outerRadius={100}
                centerContent={
                  <div className="text-center">
                    <p className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {(totalPayroll / 1000).toFixed(0)}K
                    </p>
                    <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                      Total SAR
                    </p>
                  </div>
                }
              />
            </ChartWrapper>
          </div>
        </div>
      </TabPanel>

      {/* Attendance Tab */}
      <TabPanel id="attendance" activeTab={activeTab}>
        <div className="space-y-6">
          {/* Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InteractiveStatCard
              title="Avg Attendance"
              value={`${avgAttendance}%`}
              icon={<UserCheck className="w-5 h-5" />}
              color="green"
              trend={{ value: 2.1, isPositive: true }}
              sparkline={[91, 93, 92, 94, 95, 94, 96]}
            />
            <InteractiveStatCard
              title="Late Arrivals"
              value={8}
              icon={<Clock className="w-5 h-5" />}
              color="amber"
              trend={{ value: 15, isPositive: false }}
            />
            <InteractiveStatCard
              title="Absent Today"
              value={3}
              icon={<AlertTriangle className="w-5 h-5" />}
              color="red"
            />
            <InteractiveStatCard
              title="Remote Work"
              value={12}
              icon={<Building2 className="w-5 h-5" />}
              color="purple"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper
              title="Attendance Trend"
              subtitle="Weekly attendance rate"
            >
              <EnhancedAreaChart
                data={monthlyTrends.map((m) => ({
                  name: m.month,
                  attendance: m.attendance,
                }))}
                dataKeys={[{ key: "attendance", color: "#10B981", name: "Attendance %" }]}
                height={300}
              />
            </ChartWrapper>

            <ChartWrapper
              title="Attendance by Department"
              subtitle="Current month"
            >
              <EnhancedBarChart
                data={departmentPerformance.map((d) => ({
                  name: d.name,
                  attendance: d.attendance,
                }))}
                dataKeys={[{ key: "attendance", color: "#2E3192", name: "Attendance %" }]}
                height={300}
                layout="vertical"
              />
            </ChartWrapper>
          </div>
        </div>
      </TabPanel>

      {/* Compliance Tab */}
      <TabPanel id="compliance" activeTab={activeTab}>
        <div className="space-y-6">
          {/* Compliance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InteractiveStatCard
              title="Expiring Iqamas"
              value={expiringDocs}
              icon={<FileWarning className="w-5 h-5" />}
              color={expiringDocs > 5 ? "red" : "amber"}
              subtitle="Within 90 days"
            />
            <InteractiveStatCard
              title="Missing Docs"
              value={2}
              icon={<FileText className="w-5 h-5" />}
              color="amber"
            />
            <InteractiveStatCard
              title="Policy Compliance"
              value="98%"
              icon={<Target className="w-5 h-5" />}
              color="green"
              trend={{ value: 2, isPositive: true }}
            />
            <InteractiveStatCard
              title="Training Due"
              value={5}
              icon={<Award className="w-5 h-5" />}
              color="purple"
            />
          </div>

          {/* Compliance Table */}
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
              <h3
                className={cn(
                  "text-lg font-semibold",
                  isGlass || isDark ? "text-white" : "text-gray-800"
                )}
              >
                Document Expiry Alerts
              </h3>
              <Badge variant="warning" size="sm">
                {expiringDocs} alerts
              </Badge>
            </div>
            <DataTable
              headers={["Employee", "Document", "Expiry Date", "Days Left", "Action"]}
              rows={employees
                .filter((emp) => {
                  if (!emp.iqamaExpiry) return false;
                  const daysUntil = differenceInDays(new Date(emp.iqamaExpiry), new Date());
                  return daysUntil > 0 && daysUntil < 90;
                })
                .slice(0, 5)
                .map((emp) => {
                  const daysUntil = differenceInDays(
                    new Date(emp.iqamaExpiry!),
                    new Date()
                  );
                  return [
                    <div className="flex items-center gap-3" key={emp.id}>
                      <EnhancedAvatar src={emp.photo} name={emp.fullName} size="sm" />
                      {emp.fullName}
                    </div>,
                    "Iqama",
                    format(new Date(emp.iqamaExpiry!), "MMM dd, yyyy"),
                    <Badge
                      variant={daysUntil < 30 ? "error" : "warning"}
                      size="sm"
                      key={`days-${emp.id}`}
                    >
                      {daysUntil} days
                    </Badge>,
                    <Button variant="outline" size="sm" key={`btn-${emp.id}`}>
                      Renew
                    </Button>,
                  ];
                })}
            />
          </div>
        </div>
      </TabPanel>
    </div>
  );
};

export default ReportsPage;
