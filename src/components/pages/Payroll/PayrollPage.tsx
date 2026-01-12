import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Download,
  Upload,
  Search,
  Eye,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  CreditCard,
  Wallet,
  Calculator,
  Send,
  Printer,
  X,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Banknote,
  CircleDollarSign,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge, StatusBadge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Tabs, TabPanel } from "../../common/Tabs";
import { Avatar } from "../../common/Avatar";
import { Modal } from "../../common/Modal";
import { InteractiveStatCard, DetailModal, DataTable, SummaryStats } from "../../common/InteractiveCard";
import { ChartWrapper, EnhancedAreaChart, EnhancedDonutChart, EnhancedBarChart, ProgressRing, StatComparison } from "../../common/AdvancedCharts";
import {
  DataExportModal,
  createExportData,
} from "../../common/DataExportModal";
import { payrollRecords, employees, departments } from "../../../data";
import { useTheme } from "../../../contexts/ThemeContext";
import { cn } from "../../../utils/cn";
import { format } from "date-fns";

type PayrollStatus = "Draft" | "Pending" | "Approved" | "Paid";

const statusConfig: Record<
  PayrollStatus,
  { color: string; bgColor: string; icon: React.ReactNode; textColor: string }
> = {
  Draft: {
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: <FileText className="w-4 h-4" />,
    textColor: "#6B7280",
  },
  Pending: {
    color: "text-warning-600",
    bgColor: "bg-warning-50",
    icon: <Clock className="w-4 h-4" />,
    textColor: "#F59E0B",
  },
  Approved: {
    color: "text-secondary-600",
    bgColor: "bg-secondary-50",
    icon: <CheckCircle className="w-4 h-4" />,
    textColor: "#3B82F6",
  },
  Paid: {
    color: "text-success-600",
    bgColor: "bg-success-50",
    icon: <CheckCircle className="w-4 h-4" />,
    textColor: "#10B981",
  },
};

export const PayrollPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [activeTab, setActiveTab] = useState("payroll");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showRunPayrollModal, setShowRunPayrollModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<(typeof payrollRecords)[0] | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ReturnType<typeof createExportData> | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const currentMonthRecords = payrollRecords.filter(
      (r) => `${r.year}-${r.month.padStart(2, "0")}` === selectedMonth,
    );
    const totalGross = currentMonthRecords.reduce((acc, r) => acc + r.grossSalary, 0);
    const totalNet = currentMonthRecords.reduce((acc, r) => acc + r.netSalary, 0);
    const totalDeductions = currentMonthRecords.reduce((acc, r) => acc + r.totalDeductions, 0);
    const employeeCount = currentMonthRecords.length;
    const paidCount = currentMonthRecords.filter((r) => r.status === "Paid").length;
    const pendingCount = currentMonthRecords.filter((r) => r.status === "Pending").length;
    const avgSalary = employeeCount > 0 ? Math.round(totalNet / employeeCount) : 0;
    return { totalGross, totalNet, totalDeductions, employeeCount, paidCount, pendingCount, avgSalary };
  }, [selectedMonth]);

  // Previous month stats for comparison
  const previousMonthStats = useMemo(() => {
    const date = new Date(selectedMonth);
    date.setMonth(date.getMonth() - 1);
    const prevMonthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const prevMonthRecords = payrollRecords.filter(
      (r) => `${r.year}-${r.month.padStart(2, "0")}` === prevMonthStr,
    );
    const totalNet = prevMonthRecords.reduce((acc, r) => acc + r.netSalary, 0);
    return { totalNet };
  }, [selectedMonth]);

  // Sparkline data
  const payrollSparkline = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthRecords = payrollRecords.filter(
        (r) => `${r.year}-${r.month.padStart(2, "0")}` === monthStr,
      );
      return monthRecords.reduce((acc, r) => acc + r.netSalary, 0) / 1000;
    });
  }, []);

  // Filter records
  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMonth = `${record.year}-${record.month.padStart(2, "0")}` === selectedMonth;
      const employee = employees.find((e) => e.id === record.employeeId);
      const matchesDepartment = selectedDepartment === "all" || employee?.department === selectedDepartment;
      const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
      return matchesSearch && matchesMonth && matchesDepartment && matchesStatus;
    });
  }, [searchQuery, selectedMonth, selectedDepartment, selectedStatus]);

  // Chart data - Monthly trend
  const monthlyTrendData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthRecords = payrollRecords.filter(
        (r) => `${r.year}-${r.month.padStart(2, "0")}` === monthStr,
      );
      return {
        name: format(date, "MMM"),
        gross: monthRecords.reduce((acc, r) => acc + r.grossSalary, 0),
        net: monthRecords.reduce((acc, r) => acc + r.netSalary, 0),
        deductions: monthRecords.reduce((acc, r) => acc + r.totalDeductions, 0),
      };
    });
  }, []);

  // Department payroll distribution
  const departmentData = useMemo(() => {
    return departments
      .map((dept) => {
        const deptEmployees = employees.filter((e) => e.department === dept.name);
        const deptPayroll = payrollRecords.filter(
          (r) =>
            deptEmployees.some((e) => e.id === r.employeeId) &&
            `${r.year}-${r.month.padStart(2, "0")}` === selectedMonth,
        );
        return {
          name: dept.name,
          value: deptPayroll.reduce((acc, r) => acc + r.netSalary, 0),
          color: dept.color,
        };
      })
      .filter((d) => d.value > 0);
  }, [selectedMonth]);

  // Salary breakdown chart data
  const salaryBreakdownData = useMemo(() => {
    const currentMonthRecords = payrollRecords.filter(
      (r) => `${r.year}-${r.month.padStart(2, "0")}` === selectedMonth,
    );
    const basicSalary = currentMonthRecords.reduce((acc, r) => acc + r.basicSalary, 0);
    const housing = currentMonthRecords.reduce((acc, r) => acc + r.housingAllowance, 0);
    const transport = currentMonthRecords.reduce((acc, r) => acc + r.transportAllowance, 0);
    const other = currentMonthRecords.reduce((acc, r) => acc + r.otherAllowances, 0);
    const deductions = currentMonthRecords.reduce((acc, r) => acc + r.totalDeductions, 0);

    return [
      { name: "Basic Salary", value: basicSalary, color: "#2E3192" },
      { name: "Housing", value: housing, color: "#10B981" },
      { name: "Transport", value: transport, color: "#F59E0B" },
      { name: "Other", value: other, color: "#8B5CF6" },
    ];
  }, [selectedMonth]);

  const tabs = [
    { id: "payroll", label: "Payroll", icon: <DollarSign className="w-4 h-4" /> },
    { id: "payslips", label: "Payslips", icon: <FileText className="w-4 h-4" /> },
    { id: "reports", label: "Reports", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const columns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (record: (typeof payrollRecords)[0]) => {
        const employee = employees.find((e) => e.id === record.employeeId);
        return (
          <div className="flex items-center gap-3">
            <Avatar name={record.employeeName} size="sm" />
            <div>
              <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>{record.employeeName}</p>
              <p className={cn("text-xs", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>{employee?.position}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "basicSalary",
      label: "Basic Salary",
      sortable: true,
      render: (record: (typeof payrollRecords)[0]) => (
        <span className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
          SAR {record.basicSalary.toLocaleString()}
        </span>
      ),
    },
    {
      key: "allowances",
      label: "Allowances",
      render: (record: (typeof payrollRecords)[0]) => {
        const total = record.housingAllowance + record.transportAllowance + record.otherAllowances;
        return (
          <span className="text-success-600 font-medium">
            +SAR {total.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: "deductions",
      label: "Deductions",
      render: (record: (typeof payrollRecords)[0]) => (
        <span className="text-error-600 font-medium">
          -SAR {record.totalDeductions.toLocaleString()}
        </span>
      ),
    },
    {
      key: "netSalary",
      label: "Net Salary",
      sortable: true,
      render: (record: (typeof payrollRecords)[0]) => (
        <span className={cn("font-semibold", isDark || isGlass ? "text-white" : "text-gray-900")}>
          SAR {record.netSalary.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (record: (typeof payrollRecords)[0]) => {
        const config = statusConfig[record.status as PayrollStatus];
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full", config.bgColor)}
          >
            <span className={config.color}>{config.icon}</span>
            <span className={cn("text-sm font-medium", config.color)}>{record.status}</span>
          </motion.div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (record: (typeof payrollRecords)[0]) => (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedRecord(record);
              setShowPayslipModal(true);
            }}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isDark || isGlass ? "hover:bg-white/10" : "hover:bg-gray-100"
            )}
            title="View Payslip"
          >
            <Eye className={cn("w-4 h-4", isDark || isGlass ? "text-gray-400" : "text-gray-500")} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isDark || isGlass ? "hover:bg-white/10" : "hover:bg-gray-100"
            )}
            title="Download"
          >
            <Download className={cn("w-4 h-4", isDark || isGlass ? "text-gray-400" : "text-gray-500")} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isDark || isGlass ? "hover:bg-white/10" : "hover:bg-gray-100"
            )}
            title="Print"
          >
            <Printer className={cn("w-4 h-4", isDark || isGlass ? "text-gray-400" : "text-gray-500")} />
          </motion.button>
        </div>
      ),
    },
  ];

  const formatCurrency = (amount: number) => `SAR ${amount.toLocaleString()}`;

  // Handle export
  const handleExport = () => {
    const summaryItems = [
      { label: "Total Gross", value: formatCurrency(stats.totalGross) },
      { label: "Total Net", value: formatCurrency(stats.totalNet) },
      { label: "Total Deductions", value: formatCurrency(stats.totalDeductions) },
      { label: "Employees", value: stats.employeeCount },
    ];

    const details = filteredRecords.map((record) => {
      const employee = employees.find((e) => e.id === record.employeeId);
      return {
        Employee: record.employeeName,
        Position: employee?.position || "-",
        "Basic Salary": formatCurrency(record.basicSalary),
        Allowances: formatCurrency(record.housingAllowance + record.transportAllowance + record.otherAllowances),
        Deductions: formatCurrency(record.totalDeductions),
        "Net Salary": formatCurrency(record.netSalary),
        Status: record.status,
      };
    });

    setExportData(
      createExportData(
        `Payroll Report - ${format(new Date(selectedMonth), "MMMM yyyy")}`,
        summaryItems,
        details,
      ),
    );
    setShowExportModal(true);
  };

  // Total Gross detail content
  const grossDetailContent = (
    <div className="space-y-6">
      <SummaryStats
        stats={[
          { label: "Basic Salary", value: formatCurrency(salaryBreakdownData[0]?.value || 0), color: "text-[#2E3192]" },
          { label: "Housing", value: formatCurrency(salaryBreakdownData[1]?.value || 0), color: "text-emerald-500" },
          { label: "Transport", value: formatCurrency(salaryBreakdownData[2]?.value || 0), color: "text-amber-500" },
          { label: "Other", value: formatCurrency(salaryBreakdownData[3]?.value || 0), color: "text-purple-500" },
        ]}
      />
      <div>
        <h4 className={cn("text-sm font-medium mb-4", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
          Salary Components Breakdown
        </h4>
        <div className="space-y-3">
          {salaryBreakdownData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between mb-1">
                <span className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>{item.name}</span>
                <span className={cn("text-sm font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                  {formatCurrency(item.value)}
                </span>
              </div>
              <div className={cn("h-2 rounded-full overflow-hidden", isDark || isGlass ? "bg-gray-700" : "bg-gray-100")}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / stats.totalGross) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Employees detail content
  const employeesDetailContent = (
    <div className="space-y-4">
      <SummaryStats
        stats={[
          { label: "Paid", value: stats.paidCount, color: "text-emerald-500" },
          { label: "Pending", value: stats.pendingCount, color: "text-amber-500" },
          { label: "Avg Salary", value: formatCurrency(stats.avgSalary) },
          { label: "Total", value: stats.employeeCount, color: "text-blue-500" },
        ]}
      />
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {filteredRecords.slice(0, 10).map((record, index) => {
          const config = statusConfig[record.status as PayrollStatus];
          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-4 rounded-xl flex items-center justify-between",
                isGlass ? "bg-white/5" : isDark ? "bg-gray-800" : "bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar name={record.employeeName} size="sm" />
                <div>
                  <p className={cn("font-medium", isGlass || isDark ? "text-white" : "text-gray-800")}>
                    {record.employeeName}
                  </p>
                  <p className={cn("text-xs", isGlass || isDark ? "text-gray-400" : "text-gray-500")}>
                    {formatCurrency(record.netSalary)}
                  </p>
                </div>
              </div>
              <div className={cn("px-2 py-1 rounded-full text-xs font-medium", config.bgColor, config.color)}>
                {record.status}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Calculate change percentage
  const netChangePercent = previousMonthStats.totalNet > 0
    ? Math.round(((stats.totalNet - previousMonthStats.totalNet) / previousMonthStats.totalNet) * 100)
    : 0;

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
              isGlass ? "text-[#2E3192]" : isDark ? "text-white" : "text-gray-900",
            )}
          >
            Payroll
          </h1>
          <p
            className={cn(
              "mt-1",
              isGlass ? "text-[#2E3192]/70" : isDark ? "text-gray-400" : "text-gray-500",
            )}
          >
            Manage employee salaries and payments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowRunPayrollModal(true)}>
            <Calculator className="w-4 h-4 mr-2" />
            Run Payroll
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
          title="Total Gross"
          value={formatCurrency(stats.totalGross)}
          icon={<DollarSign className="w-5 h-5" />}
          color="blue"
          sparkline={payrollSparkline}
          subtitle="Before deductions"
          detailTitle="Gross Salary Breakdown"
          detailContent={grossDetailContent}
          actions={[
            { label: "View Reports", onClick: () => setActiveTab("reports"), variant: "primary" },
            { label: "Export", onClick: handleExport, variant: "secondary" },
          ]}
        />
        <InteractiveStatCard
          title="Total Net"
          value={formatCurrency(stats.totalNet)}
          icon={<Wallet className="w-5 h-5" />}
          color="green"
          trend={{
            value: Math.abs(netChangePercent),
            isPositive: netChangePercent >= 0,
            label: "vs last month",
          }}
          subtitle="After deductions"
        />
        <InteractiveStatCard
          title="Total Deductions"
          value={formatCurrency(stats.totalDeductions)}
          icon={<AlertCircle className="w-5 h-5" />}
          color="red"
          subtitle="GOSI + Others"
        />
        <InteractiveStatCard
          title="Employees"
          value={stats.employeeCount}
          icon={<Users className="w-5 h-5" />}
          color="purple"
          subtitle="In payroll"
          detailTitle="Employees in Payroll"
          detailContent={employeesDetailContent}
        />
        <InteractiveStatCard
          title="Paid"
          value={`${stats.paidCount}/${stats.employeeCount}`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="cyan"
          trend={{
            value: stats.employeeCount > 0 ? Math.round((stats.paidCount / stats.employeeCount) * 100) : 0,
            isPositive: true,
            label: "completion",
          }}
          onClick={() => setShowComparisonModal(true)}
        />
      </motion.div>

      {/* Quick Comparison Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                Monthly Comparison
              </p>
              <p className={cn("text-xl font-bold mt-1", isDark || isGlass ? "text-white" : "text-gray-800")}>
                {formatCurrency(stats.totalNet)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {netChangePercent >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-rose-500" />
                )}
                <span className={cn("text-sm font-medium", netChangePercent >= 0 ? "text-emerald-500" : "text-rose-500")}>
                  {Math.abs(netChangePercent)}% vs last month
                </span>
              </div>
            </div>
            <div className="h-16 w-24">
              <svg viewBox="0 0 100 40" className="w-full h-full">
                <defs>
                  <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,35 ${payrollSparkline.map((v, i) => `L${(i / 5) * 100},${40 - (v / Math.max(...payrollSparkline)) * 35}`).join(" ")} L100,35`}
                  fill="url(#miniGradient)"
                />
                <path
                  d={`M0,${40 - (payrollSparkline[0] / Math.max(...payrollSparkline)) * 35} ${payrollSparkline.map((v, i) => `L${(i / 5) * 100},${40 - (v / Math.max(...payrollSparkline)) * 35}`).join(" ")}`}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                Payment Progress
              </p>
              <p className={cn("text-xl font-bold mt-1", isDark || isGlass ? "text-white" : "text-gray-800")}>
                {stats.paidCount} of {stats.employeeCount} Paid
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className={cn("flex-1 h-2 rounded-full max-w-[120px]", isDark || isGlass ? "bg-gray-700" : "bg-gray-100")}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.employeeCount > 0 ? (stats.paidCount / stats.employeeCount) * 100 : 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
                <span className={cn("text-sm", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                  {stats.employeeCount > 0 ? Math.round((stats.paidCount / stats.employeeCount) * 100) : 0}%
                </span>
              </div>
            </div>
            <ProgressRing
              value={stats.paidCount}
              maxValue={stats.employeeCount || 1}
              size={70}
              strokeWidth={8}
              color="#10B981"
              showPercentage={true}
            />
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="modern" />

      {/* Payroll Tab */}
      <TabPanel id="payroll" activeTab={activeTab}>
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
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-40"
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
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "Draft", label: "Draft" },
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Paid", label: "Paid" },
                ]}
                className="w-36"
              />
            </div>
          </div>

          {/* Table */}
          <Table data={filteredRecords} columns={columns} searchable={false} />
        </Card>
      </TabPanel>

      {/* Payslips Tab */}
      <TabPanel id="payslips" activeTab={activeTab}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record, index) => {
            const config = statusConfig[record.status as PayrollStatus];
            const employee = employees.find((e) => e.id === record.employeeId);
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn("p-4 hover:shadow-lg transition-all cursor-pointer group", isDark || isGlass ? "hover:border-white/20" : "hover:border-primary/30")}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={record.employeeName} size="md" />
                      <div>
                        <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                          {record.employeeName}
                        </p>
                        <p className={cn("text-xs", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                          {employee?.position}
                        </p>
                      </div>
                    </div>
                    <div className={cn("px-2 py-1 rounded-full", config.bgColor)}>
                      <span className={cn("text-xs font-medium", config.color)}>
                        {record.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className={cn(isDark || isGlass ? "text-gray-400" : "text-gray-500")}>Basic Salary</span>
                      <span className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                        {formatCurrency(record.basicSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={cn(isDark || isGlass ? "text-gray-400" : "text-gray-500")}>Allowances</span>
                      <span className="text-success-600">
                        +{formatCurrency(record.housingAllowance + record.transportAllowance + record.otherAllowances)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={cn(isDark || isGlass ? "text-gray-400" : "text-gray-500")}>Deductions</span>
                      <span className="text-error-600">
                        -{formatCurrency(record.totalDeductions)}
                      </span>
                    </div>
                    <div className={cn("pt-2 border-t flex justify-between", isDark || isGlass ? "border-gray-700" : "border-gray-100")}>
                      <span className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                        Net Salary
                      </span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(record.netSalary)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowPayslipModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>

                  {/* Hover effect indicator */}
                  <div className={cn(
                    "absolute bottom-2 right-2 flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity",
                    isDark || isGlass ? "text-gray-400" : "text-gray-400"
                  )}>
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </TabPanel>

      {/* Reports Tab */}
      <TabPanel id="reports" activeTab={activeTab}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWrapper
            title="Payroll Trend (6 Months)"
            subtitle="Gross vs Net salary comparison"
            trend={{ value: netChangePercent >= 0 ? netChangePercent : Math.abs(netChangePercent), isPositive: netChangePercent >= 0 }}
            onExport={handleExport}
          >
            <EnhancedAreaChart
              data={monthlyTrendData}
              dataKeys={[
                { key: "gross", color: "#5B4CCC", name: "Gross" },
                { key: "net", color: "#10B981", name: "Net" },
              ]}
              height={280}
            />
          </ChartWrapper>

          <ChartWrapper
            title="Payroll by Department"
            subtitle="Distribution across departments"
          >
            <EnhancedDonutChart
              data={departmentData}
              height={280}
              innerRadius={50}
              outerRadius={90}
              centerContent={
                <div className="text-center">
                  <p className={cn("text-xl font-bold", isDark || isGlass ? "text-white" : "text-gray-800")}>
                    {formatCurrency(departmentData.reduce((sum, d) => sum + d.value, 0))}
                  </p>
                  <p className={cn("text-xs", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                    Total
                  </p>
                </div>
              }
            />
          </ChartWrapper>

          <ChartWrapper
            title="Salary Components"
            subtitle="Breakdown of salary components"
          >
            <EnhancedBarChart
              data={[
                { name: "Basic", value: salaryBreakdownData[0]?.value || 0 },
                { name: "Housing", value: salaryBreakdownData[1]?.value || 0 },
                { name: "Transport", value: salaryBreakdownData[2]?.value || 0 },
                { name: "Other", value: salaryBreakdownData[3]?.value || 0 },
              ]}
              dataKeys={[{ key: "value", color: "#2E3192", name: "Amount" }]}
              height={280}
            />
          </ChartWrapper>

          {/* Summary Cards */}
          <Card className="p-6">
            <h3 className={cn("font-semibold mb-4", isDark || isGlass ? "text-white" : "text-gray-800")}>
              Monthly Summary - {format(new Date(selectedMonth), "MMMM yyyy")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-primary-light rounded-lg"
              >
                <p className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>Total Basic Salary</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(filteredRecords.reduce((acc, r) => acc + r.basicSalary, 0))}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-success-50 rounded-lg"
              >
                <p className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>Total Allowances</p>
                <p className="text-xl font-bold text-success">
                  {formatCurrency(
                    filteredRecords.reduce(
                      (acc, r) => acc + r.housingAllowance + r.transportAllowance + r.otherAllowances,
                      0,
                    )
                  )}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-error-50 rounded-lg"
              >
                <p className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>Total Deductions</p>
                <p className="text-xl font-bold text-error">
                  {formatCurrency(filteredRecords.reduce((acc, r) => acc + r.totalDeductions, 0))}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-secondary-50 rounded-lg"
              >
                <p className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>GOSI Contribution</p>
                <p className="text-xl font-bold text-secondary">
                  {formatCurrency(filteredRecords.reduce((acc, r) => acc + r.gosiEmployee + r.gosiCompany, 0))}
                </p>
              </motion.div>
            </div>

            {/* Month over Month Comparison */}
            <div className={cn("mt-6 pt-4 border-t", isDark || isGlass ? "border-gray-700" : "border-gray-200")}>
              <StatComparison
                current={{ label: "This Month", value: stats.totalNet }}
                previous={{ label: "Last Month", value: previousMonthStats.totalNet }}
                format={formatCurrency}
              />
            </div>
          </Card>
        </div>
      </TabPanel>

      {/* Payslip Modal - Enhanced */}
      <AnimatePresence>
        {showPayslipModal && selectedRecord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayslipModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl",
                "max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl",
                isGlass
                  ? "bg-white/10 backdrop-blur-2xl border border-white/20"
                  : isDark
                    ? "bg-gray-900 border border-gray-700"
                    : "bg-white border border-gray-200"
              )}
            >
              {/* Header */}
              <div className="relative p-6 pb-4 bg-gradient-to-r from-[#2E3192] to-[#5B4CCC] text-white">
                <button
                  onClick={() => setShowPayslipModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Payslip Details</h2>
                    <p className="text-white/80">
                      {format(new Date(`${selectedRecord.year}-${selectedRecord.month}-01`), "MMMM yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                {/* Employee Info */}
                <div className={cn("flex items-center gap-4 p-4 rounded-xl", isDark || isGlass ? "bg-white/5" : "bg-gray-50")}>
                  <Avatar name={selectedRecord.employeeName} size="lg" />
                  <div className="flex-1">
                    <p className={cn("font-semibold", isDark || isGlass ? "text-white" : "text-gray-800")}>
                      {selectedRecord.employeeName}
                    </p>
                    <p className={cn("text-sm", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
                      {employees.find((e) => e.id === selectedRecord.employeeId)?.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>Employee ID</p>
                    <p className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                      {selectedRecord.employeeId}
                    </p>
                  </div>
                </div>

                {/* Earnings */}
                <div>
                  <h4 className={cn("font-semibold mb-3 flex items-center gap-2", isDark || isGlass ? "text-white" : "text-gray-800")}>
                    <TrendingUp className="w-4 h-4 text-success" />
                    Earnings
                  </h4>
                  <div className={cn("space-y-2 rounded-xl p-4", isDark || isGlass ? "bg-emerald-500/10" : "bg-success-50")}>
                    {[
                      { label: "Basic Salary", value: selectedRecord.basicSalary },
                      { label: "Housing Allowance", value: selectedRecord.housingAllowance },
                      { label: "Transport Allowance", value: selectedRecord.transportAllowance },
                      { label: "Other Allowances", value: selectedRecord.otherAllowances },
                      ...(selectedRecord.overtime > 0 ? [{ label: "Overtime", value: selectedRecord.overtime }] : []),
                      ...(selectedRecord.bonus > 0 ? [{ label: "Bonus", value: selectedRecord.bonus }] : []),
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex justify-between"
                      >
                        <span className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>{item.label}</span>
                        <span className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                          {formatCurrency(item.value)}
                        </span>
                      </motion.div>
                    ))}
                    <div className={cn("flex justify-between pt-2 border-t", isDark || isGlass ? "border-emerald-500/30" : "border-success-200")}>
                      <span className={cn("font-semibold", isDark || isGlass ? "text-white" : "text-gray-800")}>Total Earnings</span>
                      <span className="font-bold text-success">{formatCurrency(selectedRecord.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className={cn("font-semibold mb-3 flex items-center gap-2", isDark || isGlass ? "text-white" : "text-gray-800")}>
                    <AlertCircle className="w-4 h-4 text-error" />
                    Deductions
                  </h4>
                  <div className={cn("space-y-2 rounded-xl p-4", isDark || isGlass ? "bg-rose-500/10" : "bg-error-50")}>
                    {[
                      { label: "GOSI (Employee)", value: selectedRecord.gosiEmployee },
                      ...(selectedRecord.absenceDeduction > 0 ? [{ label: "Absence Deduction", value: selectedRecord.absenceDeduction }] : []),
                      ...(selectedRecord.loanDeduction > 0 ? [{ label: "Loan Deduction", value: selectedRecord.loanDeduction }] : []),
                      ...(selectedRecord.otherDeductions > 0 ? [{ label: "Other Deductions", value: selectedRecord.otherDeductions }] : []),
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex justify-between"
                      >
                        <span className={cn("text-sm", isDark || isGlass ? "text-gray-300" : "text-gray-600")}>{item.label}</span>
                        <span className={cn("font-medium", isDark || isGlass ? "text-white" : "text-gray-800")}>
                          {formatCurrency(item.value)}
                        </span>
                      </motion.div>
                    ))}
                    <div className={cn("flex justify-between pt-2 border-t", isDark || isGlass ? "border-rose-500/30" : "border-error-200")}>
                      <span className={cn("font-semibold", isDark || isGlass ? "text-white" : "text-gray-800")}>Total Deductions</span>
                      <span className="font-bold text-error">{formatCurrency(selectedRecord.totalDeductions)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("rounded-xl p-4", isDark || isGlass ? "bg-[#2E3192]/20" : "bg-primary-light")}
                >
                  <div className="flex justify-between items-center">
                    <span className={cn("text-lg font-semibold", isDark || isGlass ? "text-white" : "text-gray-800")}>
                      Net Salary
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedRecord.netSalary)}
                    </span>
                  </div>
                </motion.div>

                {/* Actions */}
                <div className={cn("flex justify-end gap-3 pt-4 border-t", isDark || isGlass ? "border-gray-700" : "border-gray-100")}>
                  <Button variant="outline" onClick={() => setShowPayslipModal(false)}>
                    Close
                  </Button>
                  <Button variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Run Payroll Modal */}
      <Modal
        isOpen={showRunPayrollModal}
        onClose={() => setShowRunPayrollModal(false)}
        title="Run Payroll"
        size="md"
      >
        <div className="space-y-4">
          <Input label="Payroll Month" type="month" />
          <Select
            label="Department"
            options={[
              { value: "all", label: "All Departments" },
              ...departments.map((d) => ({ value: d.id, label: d.name })),
            ]}
          />
          <div className={cn("p-4 rounded-lg border", isDark || isGlass ? "bg-amber-500/10 border-amber-500/30" : "bg-warning-50 border-warning-100")}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning-600 mt-0.5" />
              <div>
                <p className={cn("font-medium", isDark || isGlass ? "text-amber-400" : "text-warning-800")}>
                  Before running payroll:
                </p>
                <ul className={cn("text-sm mt-1 list-disc list-inside", isDark || isGlass ? "text-amber-300/80" : "text-warning-700")}>
                  <li>Ensure all attendance records are finalized</li>
                  <li>Review any pending leave requests</li>
                  <li>Verify loan and advance deductions</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowRunPayrollModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRunPayrollModal(false)}>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Payroll
            </Button>
          </div>
        </div>
      </Modal>

      {/* Comparison Modal */}
      <DetailModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        title="Payment Status Overview"
        subtitle="Current month payment progress"
        icon={<CheckCircle className="w-6 h-6" />}
        color="cyan"
        actions={[
          { label: "Process Pending", onClick: () => setShowComparisonModal(false), variant: "primary" },
          { label: "Close", onClick: () => setShowComparisonModal(false), variant: "secondary" },
        ]}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <ProgressRing
              value={stats.paidCount}
              maxValue={stats.employeeCount || 1}
              size={150}
              strokeWidth={12}
              color="#10B981"
              label="Completion"
            />
          </div>
          <SummaryStats
            stats={[
              { label: "Paid", value: stats.paidCount, color: "text-emerald-500" },
              { label: "Pending", value: stats.pendingCount, color: "text-amber-500" },
              { label: "Total", value: stats.employeeCount, color: "text-blue-500" },
              { label: "Total Amount", value: formatCurrency(stats.totalNet) },
            ]}
          />
          <div className="space-y-3">
            <h4 className={cn("text-sm font-medium", isDark || isGlass ? "text-gray-400" : "text-gray-500")}>
              Pending Payments
            </h4>
            {filteredRecords
              .filter((r) => r.status !== "Paid")
              .slice(0, 5)
              .map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "p-3 rounded-xl flex items-center justify-between",
                    isGlass ? "bg-white/5" : isDark ? "bg-gray-800" : "bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={record.employeeName} size="sm" />
                    <div>
                      <p className={cn("font-medium text-sm", isGlass || isDark ? "text-white" : "text-gray-800")}>
                        {record.employeeName}
                      </p>
                      <p className={cn("text-xs", isGlass || isDark ? "text-gray-400" : "text-gray-500")}>
                        {formatCurrency(record.netSalary)}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Send className="w-3 h-3 mr-1" />
                    Pay
                  </Button>
                </motion.div>
              ))}
          </div>
        </div>
      </DetailModal>

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

export default PayrollPage;
