import React, { useState, useMemo } from "react";
import {
  Building2,
  Download,
  Search,
  Upload,
  FileText,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card, StatCard } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Avatar } from "../../common/Avatar";
import { ExportButton } from "../../common/ExportButton";
import { IconBox } from "../../common/IconBox";
import { employees, departments } from "../../../data";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
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

// Mock GOSI data
const gosiRecords = employees
  .filter((e) => e.status === "Active")
  .map((emp, index) => ({
    id: `GOSI-${String(index + 1).padStart(3, "0")}`,
    employeeId: emp.id,
    employeeName: emp.fullName,
    iqamaNumber:
      emp.iqamaNumber || `245${Math.floor(Math.random() * 10000000)}`,
    wage: emp.basicSalary,
    employeeContribution: Math.round(emp.basicSalary * 0.1),
    companyContribution: Math.round(emp.basicSalary * 0.12),
    totalContribution: Math.round(emp.basicSalary * 0.22),
    month: "01",
    year: 2024,
    status: "Active",
    nationality: emp.nationality,
  }));

export const GOSIPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedNationality, setSelectedNationality] = useState("all");

  // Calculate statistics
  const stats = useMemo(() => {
    const saudiEmployees = gosiRecords.filter(
      (r) => r.nationality === "Saudi Arabia",
    ).length;
    const nonSaudiEmployees = gosiRecords.filter(
      (r) => r.nationality !== "Saudi Arabia",
    ).length;
    const totalEmployeeContribution = gosiRecords.reduce(
      (acc, r) => acc + r.employeeContribution,
      0,
    );
    const totalCompanyContribution = gosiRecords.reduce(
      (acc, r) => acc + r.companyContribution,
      0,
    );
    const totalContribution =
      totalEmployeeContribution + totalCompanyContribution;
    return {
      saudiEmployees,
      nonSaudiEmployees,
      totalEmployeeContribution,
      totalCompanyContribution,
      totalContribution,
    };
  }, []);

  // Filter records
  const filteredRecords = useMemo(() => {
    return gosiRecords.filter((record) => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.iqamaNumber.includes(searchQuery);
      const employee = employees.find((e) => e.id === record.employeeId);
      const matchesDepartment =
        selectedDepartment === "all" ||
        employee?.department === selectedDepartment;
      const matchesNationality =
        selectedNationality === "all" ||
        (selectedNationality === "Saudi" &&
          record.nationality === "Saudi Arabia") ||
        (selectedNationality === "Non-Saudi" &&
          record.nationality !== "Saudi Arabia");
      return matchesSearch && matchesDepartment && matchesNationality;
    });
  }, [searchQuery, selectedDepartment, selectedNationality]);

  // Chart data
  const contributionByDept = departments
    .map((dept) => {
      const deptEmployees = employees.filter((e) => e.department === dept.name);
      const deptRecords = gosiRecords.filter((r) =>
        deptEmployees.some((e) => e.id === r.employeeId),
      );
      return {
        name: dept.name,
        contribution: deptRecords.reduce(
          (acc, r) => acc + r.totalContribution,
          0,
        ),
      };
    })
    .filter((d) => d.contribution > 0);

  const nationalityData = [
    { name: "Saudi", value: stats.saudiEmployees, color: "#10B981" },
    { name: "Non-Saudi", value: stats.nonSaudiEmployees, color: "#3B82F6" },
  ];

  const columns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (record: (typeof gosiRecords)[0]) => {
        const employee = employees.find((e) => e.id === record.employeeId);
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={record.employeeName}
              size="sm"
              src={employee?.photo}
            />
            <div>
              <p
                className={cn(
                  "font-medium",
                  isDark ? "text-white" : "text-gray-800",
                )}
              >
                {record.employeeName}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500",
                )}
              >
                {employee?.position}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "iqama",
      label: "Iqama/ID Number",
      render: (record: (typeof gosiRecords)[0]) => (
        <span
          className={cn(
            "font-mono text-sm",
            isDark ? "text-gray-300" : "text-gray-600",
          )}
        >
          {record.iqamaNumber}
        </span>
      ),
    },
    {
      key: "nationality",
      label: "Nationality",
      render: (record: (typeof gosiRecords)[0]) => (
        <Badge
          className={cn(
            record.nationality === "Saudi Arabia"
              ? isDark
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"
              : isDark
                ? "bg-sky-500/20 text-sky-400"
                : "bg-sky-50 text-sky-600",
          )}
        >
          {record.nationality === "Saudi Arabia" ? "Saudi" : record.nationality}
        </Badge>
      ),
    },
    {
      key: "wage",
      label: "Wage",
      sortable: true,
      render: (record: (typeof gosiRecords)[0]) => (
        <span
          className={cn("font-medium", isDark ? "text-white" : "text-gray-800")}
        >
          SAR {record.wage.toLocaleString()}
        </span>
      ),
    },
    {
      key: "employee_contrib",
      label: "Employee (10%)",
      render: (record: (typeof gosiRecords)[0]) => (
        <span
          className={cn(
            "font-medium",
            isDark ? "text-rose-400" : "text-rose-600",
          )}
        >
          SAR {record.employeeContribution.toLocaleString()}
        </span>
      ),
    },
    {
      key: "company_contrib",
      label: "Company (12%)",
      render: (record: (typeof gosiRecords)[0]) => (
        <span
          className={cn(
            "font-medium",
            isDark ? "text-[#80D1E9]" : "text-[#2E3192]",
          )}
        >
          SAR {record.companyContribution.toLocaleString()}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      render: (record: (typeof gosiRecords)[0]) => (
        <span
          className={cn(
            "font-semibold",
            isDark ? "text-white" : "text-gray-900",
          )}
        >
          SAR {record.totalContribution.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: () => (
        <Badge
          className={cn(
            isDark
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-emerald-50 text-emerald-600",
          )}
        >
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        </Badge>
      ),
    },
  ];

  const formatCurrency = (amount: number) => `SAR ${amount.toLocaleString()}`;

  // Export data
  const exportData = {
    headers: [
      "Employee",
      "Iqama",
      "Nationality",
      "Wage",
      "Employee Contrib",
      "Company Contrib",
      "Total",
    ],
    rows: filteredRecords.map((r) => [
      r.employeeName,
      r.iqamaNumber,
      r.nationality,
      r.wage,
      r.employeeContribution,
      r.companyContribution,
      r.totalContribution,
    ]),
    title: "GOSI Contributions Report",
    filename: "gosi_report",
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Logo */}
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl",
          isDark
            ? "bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 border border-emerald-500/20"
            : "bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200",
        )}
      >
        <div className="flex items-center gap-4">
          <img
            src={`${import.meta.env.BASE_URL}assets/logos/gosi.svg`}
            alt="GOSI"
            className="h-14 w-auto rounded-lg shadow-lg"
          />
          <div>
            <h1
              className={cn(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              GOSI
            </h1>
            <p
              className={cn(
                "mt-1",
                isDark ? "text-emerald-300/70" : "text-emerald-700",
              )}
            >
              General Organization for Social Insurance - التأمينات الاجتماعية
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className={isDark ? "border-emerald-500/30 text-emerald-400" : ""}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
          <ExportButton data={exportData} variant="default" size="sm" />
          <Button
            className={
              isDark
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Saudi Employees"
          value={stats.saudiEmployees}
          icon={<Users className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          title="Non-Saudi"
          value={stats.nonSaudiEmployees}
          icon={<Users className="w-5 h-5" />}
          color="info"
        />
        <StatCard
          title="Employee Contrib."
          value={formatCurrency(stats.totalEmployeeContribution)}
          icon={<DollarSign className="w-5 h-5" />}
          color="warning"
        />
        <StatCard
          title="Company Contrib."
          value={formatCurrency(stats.totalCompanyContribution)}
          icon={<Building2 className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Total Contrib."
          value={formatCurrency(stats.totalContribution)}
          icon={<TrendingUp className="w-5 h-5" />}
          color="success"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn(
                "font-semibold",
                isDark ? "text-white" : "text-gray-800",
              )}
            >
              Contribution by Department
            </h3>
            <ExportButton
              variant="icon"
              size="sm"
              data={{
                headers: ["Department", "Total Contribution"],
                rows: contributionByDept.map((d) => [d.name, d.contribution]),
                title: "GOSI by Department",
                filename: "gosi_by_department",
              }}
            />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributionByDept} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  type="number"
                  stroke={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize={12}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1F2937" : "white",
                    border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    color: isDark ? "#F3F4F6" : "#1F2937",
                  }}
                  formatter={(value) =>
                    value !== undefined ? formatCurrency(Number(value)) : ""
                  }
                />
                <Bar
                  dataKey="contribution"
                  fill={isDark ? "#10B981" : "#059669"}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3
            className={cn(
              "font-semibold mb-4",
              isDark ? "text-white" : "text-gray-800",
            )}
          >
            Employees by Nationality
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nationalityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {nationalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1F2937" : "white",
                    border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    color: isDark ? "#F3F4F6" : "#1F2937",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {nationalityData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className={cn(
                    "text-sm",
                    isDark ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3
            className={cn(
              "font-semibold",
              isDark ? "text-white" : "text-gray-800",
            )}
          >
            Monthly Summary
          </h3>
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={cn(
              "p-4 rounded-xl",
              isDark ? "bg-white/5 border border-white/10" : "bg-gray-50",
            )}
          >
            <p
              className={cn(
                "text-sm",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            >
              Total Wages
            </p>
            <p
              className={cn(
                "text-xl font-bold mt-1",
                isDark ? "text-white" : "text-gray-800",
              )}
            >
              {formatCurrency(gosiRecords.reduce((acc, r) => acc + r.wage, 0))}
            </p>
          </div>
          <div
            className={cn(
              "p-4 rounded-xl",
              isDark
                ? "bg-rose-500/10 border border-rose-500/20"
                : "bg-rose-50",
            )}
          >
            <p
              className={cn(
                "text-sm",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            >
              Employee Deduction (10%)
            </p>
            <p
              className={cn(
                "text-xl font-bold mt-1",
                isDark ? "text-rose-400" : "text-rose-600",
              )}
            >
              {formatCurrency(stats.totalEmployeeContribution)}
            </p>
          </div>
          <div
            className={cn(
              "p-4 rounded-xl",
              isDark
                ? "bg-[#2E3192]/20 border border-[#2E3192]/30"
                : "bg-[#2E3192]/5",
            )}
          >
            <p
              className={cn(
                "text-sm",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            >
              Company Share (12%)
            </p>
            <p
              className={cn(
                "text-xl font-bold mt-1",
                isDark ? "text-[#80D1E9]" : "text-[#2E3192]",
              )}
            >
              {formatCurrency(stats.totalCompanyContribution)}
            </p>
          </div>
          <div
            className={cn(
              "p-4 rounded-xl",
              isDark
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "bg-emerald-50",
            )}
          >
            <p
              className={cn(
                "text-sm",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            >
              Total to GOSI
            </p>
            <p
              className={cn(
                "text-xl font-bold mt-1",
                isDark ? "text-emerald-400" : "text-emerald-600",
              )}
            >
              {formatCurrency(stats.totalContribution)}
            </p>
          </div>
        </div>
      </Card>

      {/* Employees Table */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
                isDark ? "text-gray-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl text-sm",
                "focus:outline-none focus:ring-2",
                isDark
                  ? "bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-[#80D1E9]/20 focus:border-[#80D1E9]/50"
                  : "border border-gray-200 focus:ring-[#2E3192]/20 focus:border-[#2E3192]",
              )}
            />
          </div>
          <div className="flex gap-3">
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
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              options={[
                { value: "all", label: "All Nationalities" },
                { value: "Saudi", label: "Saudi" },
                { value: "Non-Saudi", label: "Non-Saudi" },
              ]}
              className="w-40"
            />
          </div>
        </div>

        <Table data={filteredRecords} columns={columns} searchable={false} />
      </Card>
    </div>
  );
};

export default GOSIPage;
