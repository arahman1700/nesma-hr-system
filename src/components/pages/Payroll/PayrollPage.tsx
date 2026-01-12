import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Download,
  Upload,
  Search,
  Eye,
  FileText,
  Users,
  TrendingUp,
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
import { ColoredStatsCard, StatsGrid } from "../../common/ColoredStatsCard";
import {
  DataExportModal,
  createExportData,
} from "../../common/DataExportModal";
import { payrollRecords, employees, departments } from "../../../data";
import { useTheme } from "../../../contexts/ThemeContext";
import { cn } from "../../../utils/cn";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type PayrollStatus = "Draft" | "Pending" | "Approved" | "Paid";

const statusConfig: Record<
  PayrollStatus,
  { color: string; bgColor: string; icon: React.ReactNode }
> = {
  Draft: {
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: <FileText className="w-4 h-4" />,
  },
  Pending: {
    color: "text-warning-600",
    bgColor: "bg-warning-50",
    icon: <Clock className="w-4 h-4" />,
  },
  Approved: {
    color: "text-secondary-600",
    bgColor: "bg-secondary-50",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  Paid: {
    color: "text-success-600",
    bgColor: "bg-success-50",
    icon: <CheckCircle className="w-4 h-4" />,
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
  const [selectedRecord, setSelectedRecord] = useState<
    (typeof payrollRecords)[0] | null
  >(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ReturnType<
    typeof createExportData
  > | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const currentMonthRecords = payrollRecords.filter(
      (r) => `${r.year}-${r.month.padStart(2, "0")}` === selectedMonth,
    );
    const totalGross = currentMonthRecords.reduce(
      (acc, r) => acc + r.grossSalary,
      0,
    );
    const totalNet = currentMonthRecords.reduce(
      (acc, r) => acc + r.netSalary,
      0,
    );
    const totalDeductions = currentMonthRecords.reduce(
      (acc, r) => acc + r.totalDeductions,
      0,
    );
    const employeeCount = currentMonthRecords.length;
    const paidCount = currentMonthRecords.filter(
      (r) => r.status === "Paid",
    ).length;
    return { totalGross, totalNet, totalDeductions, employeeCount, paidCount };
  }, [selectedMonth]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      const matchesSearch = record.employeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMonth =
        `${record.year}-${record.month.padStart(2, "0")}` === selectedMonth;
      const employee = employees.find((e) => e.id === record.employeeId);
      const matchesDepartment =
        selectedDepartment === "all" ||
        employee?.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === "all" || record.status === selectedStatus;
      return (
        matchesSearch && matchesMonth && matchesDepartment && matchesStatus
      );
    });
  }, [searchQuery, selectedMonth, selectedDepartment, selectedStatus]);

  // Chart data
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthRecords = payrollRecords.filter(
      (r) => `${r.year}-${r.month.padStart(2, "0")}` === monthStr,
    );
    return {
      month: format(date, "MMM"),
      gross: monthRecords.reduce((acc, r) => acc + r.grossSalary, 0),
      net: monthRecords.reduce((acc, r) => acc + r.netSalary, 0),
    };
  });

  const departmentData = departments
    .map((dept) => {
      const deptEmployees = employees.filter((e) => e.department === dept.name);
      const deptPayroll = payrollRecords.filter(
        (r) =>
          deptEmployees.some((e) => e.id === r.employeeId) &&
          `${r.year}-${r.month.padStart(2, "0")}` === selectedMonth,
      );
      return {
        name: dept.name,
        total: deptPayroll.reduce((acc, r) => acc + r.netSalary, 0),
        color: dept.color,
      };
    })
    .filter((d) => d.total > 0);

  const tabs = [
    {
      id: "payroll",
      label: "Payroll",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: "payslips",
      label: "Payslips",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <TrendingUp className="w-4 h-4" />,
    },
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
              <p className="font-medium text-gray-800">{record.employeeName}</p>
              <p className="text-xs text-gray-500">{employee?.position}</p>
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
        <span className="font-medium text-gray-800">
          SAR {record.basicSalary.toLocaleString()}
        </span>
      ),
    },
    {
      key: "allowances",
      label: "Allowances",
      render: (record: (typeof payrollRecords)[0]) => {
        const total =
          record.housingAllowance +
          record.transportAllowance +
          record.otherAllowances;
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
        <span className="font-semibold text-gray-900">
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
      key: "actions",
      label: "Actions",
      render: (record: (typeof payrollRecords)[0]) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedRecord(record);
              setShowPayslipModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Payslip"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Print"
          >
            <Printer className="w-4 h-4 text-gray-500" />
          </button>
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
      {
        label: "Total Deductions",
        value: formatCurrency(stats.totalDeductions),
      },
      { label: "Employees", value: stats.employeeCount },
    ];

    const details = filteredRecords.map((record) => {
      const employee = employees.find((e) => e.id === record.employeeId);
      return {
        Employee: record.employeeName,
        Position: employee?.position || "-",
        "Basic Salary": formatCurrency(record.basicSalary),
        Allowances: formatCurrency(
          record.housingAllowance +
            record.transportAllowance +
            record.otherAllowances,
        ),
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              isGlass
                ? "text-[#2E3192]"
                : isDark
                  ? "text-white"
                  : "text-gray-900",
            )}
          >
            Payroll
          </h1>
          <p
            className={cn(
              "mt-1",
              isGlass
                ? "text-[#2E3192]/70"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-500",
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
      </div>

      {/* Stats Cards */}
      <StatsGrid columns={5}>
        <ColoredStatsCard
          title="Total Gross"
          value={formatCurrency(stats.totalGross)}
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
          subtitle="Before deductions"
          sparkle
        />
        <ColoredStatsCard
          title="Total Net"
          value={formatCurrency(stats.totalNet)}
          icon={<Wallet className="w-6 h-6" />}
          color="emerald"
          subtitle="After deductions"
        />
        <ColoredStatsCard
          title="Total Deductions"
          value={formatCurrency(stats.totalDeductions)}
          icon={<AlertCircle className="w-6 h-6" />}
          color="danger"
          subtitle="GOSI + Others"
        />
        <ColoredStatsCard
          title="Employees"
          value={stats.employeeCount}
          icon={<Users className="w-6 h-6" />}
          color="purple"
          subtitle="In payroll"
        />
        <ColoredStatsCard
          title="Paid"
          value={`${stats.paidCount}/${stats.employeeCount}`}
          icon={<CheckCircle className="w-6 h-6" />}
          color="cyan"
          trend={{
            value: Math.round((stats.paidCount / stats.employeeCount) * 100),
            isPositive: true,
            label: "completion",
          }}
        />
      </StatsGrid>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="separated"
      />

      {/* Payroll Tab */}
      <TabPanel id="payroll" activeTab={activeTab}>
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
          {filteredRecords.map((record) => {
            const config = statusConfig[record.status as PayrollStatus];
            const employee = employees.find((e) => e.id === record.employeeId);
            return (
              <Card
                key={record.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={record.employeeName} size="md" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {record.employeeName}
                      </p>
                      <p className="text-xs text-gray-500">
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
                    <span className="text-gray-500">Basic Salary</span>
                    <span className="font-medium">
                      {formatCurrency(record.basicSalary)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Allowances</span>
                    <span className="text-success-600">
                      +
                      {formatCurrency(
                        record.housingAllowance +
                          record.transportAllowance +
                          record.otherAllowances,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Deductions</span>
                    <span className="text-error-600">
                      -{formatCurrency(record.totalDeductions)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between">
                    <span className="font-medium text-gray-800">
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
              </Card>
            );
          })}
        </div>
      </TabPanel>

      {/* Reports Tab */}
      <TabPanel id="reports" activeTab={activeTab}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Payroll Trend (6 Months)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value) =>
                      value !== undefined ? formatCurrency(Number(value)) : ""
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="gross"
                    name="Gross"
                    stroke="#5B4CCC"
                    strokeWidth={2}
                    dot={{ fill: "#5B4CCC" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    name="Net"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Payroll by Department
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    type="number"
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#6B7280"
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value) =>
                      value !== undefined ? formatCurrency(Number(value)) : ""
                    }
                  />
                  <Bar dataKey="total" fill="#5B4CCC" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Summary Cards */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-4">
              Monthly Summary - {format(new Date(selectedMonth), "MMMM yyyy")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary-light rounded-lg">
                <p className="text-sm text-gray-600">Total Basic Salary</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(
                    filteredRecords.reduce((acc, r) => acc + r.basicSalary, 0),
                  )}
                </p>
              </div>
              <div className="p-4 bg-success-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Allowances</p>
                <p className="text-xl font-bold text-success">
                  {formatCurrency(
                    filteredRecords.reduce(
                      (acc, r) =>
                        acc +
                        r.housingAllowance +
                        r.transportAllowance +
                        r.otherAllowances,
                      0,
                    ),
                  )}
                </p>
              </div>
              <div className="p-4 bg-error-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-xl font-bold text-error">
                  {formatCurrency(
                    filteredRecords.reduce(
                      (acc, r) => acc + r.totalDeductions,
                      0,
                    ),
                  )}
                </p>
              </div>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm text-gray-600">GOSI Contribution</p>
                <p className="text-xl font-bold text-secondary">
                  {formatCurrency(
                    filteredRecords.reduce(
                      (acc, r) => acc + r.gosiEmployee + r.gosiCompany,
                      0,
                    ),
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </TabPanel>

      {/* Payslip Modal */}
      <Modal
        isOpen={showPayslipModal}
        onClose={() => setShowPayslipModal(false)}
        title="Payslip Details"
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">NESMA HR</h2>
              <p className="text-sm text-gray-500">
                Payslip for{" "}
                {format(
                  new Date(`${selectedRecord.year}-${selectedRecord.month}-01`),
                  "MMMM yyyy",
                )}
              </p>
            </div>

            {/* Employee Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar name={selectedRecord.employeeName} size="lg" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {selectedRecord.employeeName}
                </p>
                <p className="text-sm text-gray-500">
                  {
                    employees.find((e) => e.id === selectedRecord.employeeId)
                      ?.position
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-medium text-gray-800">
                  {selectedRecord.employeeId}
                </p>
              </div>
            </div>

            {/* Earnings */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                Earnings
              </h4>
              <div className="space-y-2 bg-success-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-medium">
                    {formatCurrency(selectedRecord.basicSalary)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Housing Allowance</span>
                  <span className="font-medium">
                    {formatCurrency(selectedRecord.housingAllowance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport Allowance</span>
                  <span className="font-medium">
                    {formatCurrency(selectedRecord.transportAllowance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Allowances</span>
                  <span className="font-medium">
                    {formatCurrency(selectedRecord.otherAllowances)}
                  </span>
                </div>
                {selectedRecord.overtime > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overtime</span>
                    <span className="font-medium">
                      {formatCurrency(selectedRecord.overtime)}
                    </span>
                  </div>
                )}
                {selectedRecord.bonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bonus</span>
                    <span className="font-medium">
                      {formatCurrency(selectedRecord.bonus)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-success-200">
                  <span className="font-semibold text-gray-800">
                    Total Earnings
                  </span>
                  <span className="font-bold text-success">
                    {formatCurrency(selectedRecord.grossSalary)}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-error" />
                Deductions
              </h4>
              <div className="space-y-2 bg-error-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">GOSI (Employee)</span>
                  <span className="font-medium">
                    {formatCurrency(selectedRecord.gosiEmployee)}
                  </span>
                </div>
                {selectedRecord.absenceDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Absence Deduction</span>
                    <span className="font-medium">
                      {formatCurrency(selectedRecord.absenceDeduction)}
                    </span>
                  </div>
                )}
                {selectedRecord.loanDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Deduction</span>
                    <span className="font-medium">
                      {formatCurrency(selectedRecord.loanDeduction)}
                    </span>
                  </div>
                )}
                {selectedRecord.otherDeductions > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other Deductions</span>
                    <span className="font-medium">
                      {formatCurrency(selectedRecord.otherDeductions)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-error-200">
                  <span className="font-semibold text-gray-800">
                    Total Deductions
                  </span>
                  <span className="font-bold text-error">
                    {formatCurrency(selectedRecord.totalDeductions)}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-primary-light rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  Net Salary
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(selectedRecord.netSalary)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowPayslipModal(false)}
              >
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
        )}
      </Modal>

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
          <div className="p-4 bg-warning-50 rounded-lg border border-warning-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning-600 mt-0.5" />
              <div>
                <p className="font-medium text-warning-800">
                  Before running payroll:
                </p>
                <ul className="text-sm text-warning-700 mt-1 list-disc list-inside">
                  <li>Ensure all attendance records are finalized</li>
                  <li>Review any pending leave requests</li>
                  <li>Verify loan and advance deductions</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowRunPayrollModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowRunPayrollModal(false)}>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Payroll
            </Button>
          </div>
        </div>
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

export default PayrollPage;
