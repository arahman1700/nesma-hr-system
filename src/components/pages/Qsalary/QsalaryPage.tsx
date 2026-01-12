import React, { useState, useMemo } from "react";
import {
  Wallet,
  Download,
  Search,
  Eye,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Calculator,
  Send,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card, StatCard } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Avatar } from "../../common/Avatar";
import { Modal } from "../../common/Modal";
import { ExportButton } from "../../common/ExportButton";
import { employees } from "../../../data";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
import { format } from "date-fns";
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

// Mock Qsalary advance requests
const advanceRequests = employees.slice(0, 15).map((emp, index) => ({
  id: `QSA-${String(index + 1).padStart(4, "0")}`,
  employeeId: emp.id,
  employeeName: emp.fullName,
  department: emp.department,
  salary: emp.basicSalary,
  requestedAmount: Math.round(emp.basicSalary * (0.3 + Math.random() * 0.3)),
  approvedAmount: index % 3 === 0 ? Math.round(emp.basicSalary * 0.4) : null,
  status: ["Pending", "Approved", "Disbursed", "Rejected"][index % 4] as
    | "Pending"
    | "Approved"
    | "Disbursed"
    | "Rejected",
  requestDate: `2024-01-${String(15 - index).padStart(2, "0")}`,
  reason: ["Emergency", "Medical", "Education", "Personal"][index % 4],
  repaymentMethod: index % 2 === 0 ? "Full Deduction" : "Installments",
  installments: index % 2 === 0 ? 1 : Math.ceil(Math.random() * 3) + 1,
}));

const COLORS = ["#9B59B6", "#8E44AD", "#7D3C98", "#6C3483"];

export const QsalaryPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<
    (typeof advanceRequests)[0] | null
  >(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = advanceRequests.filter(
      (r) => r.status === "Pending",
    ).length;
    const approved = advanceRequests.filter(
      (r) => r.status === "Approved",
    ).length;
    const disbursed = advanceRequests.filter(
      (r) => r.status === "Disbursed",
    ).length;
    const totalDisbursed = advanceRequests
      .filter((r) => r.status === "Disbursed")
      .reduce((acc, r) => acc + (r.approvedAmount || 0), 0);
    const avgAdvance = Math.round(
      advanceRequests.reduce((acc, r) => acc + r.requestedAmount, 0) /
        advanceRequests.length,
    );

    return { pending, approved, disbursed, totalDisbursed, avgAdvance };
  }, []);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return advanceRequests.filter((request) => {
      const matchesSearch = request.employeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || request.status === selectedStatus;
      const matchesDepartment =
        selectedDepartment === "all" ||
        request.department === selectedDepartment;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [searchQuery, selectedStatus, selectedDepartment]);

  // Chart data
  const statusChartData = [
    { name: "Pending", value: stats.pending },
    { name: "Approved", value: stats.approved },
    { name: "Disbursed", value: stats.disbursed },
    {
      name: "Rejected",
      value: advanceRequests.filter((r) => r.status === "Rejected").length,
    },
  ];

  const columns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (request: (typeof advanceRequests)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar name={request.employeeName} size="sm" />
          <div>
            <p
              className={cn(
                "font-medium",
                isDark ? "text-white" : "text-gray-800",
              )}
            >
              {request.employeeName}
            </p>
            <p
              className={cn(
                "text-xs",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            >
              {request.department}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "salary",
      label: "Base Salary",
      render: (request: (typeof advanceRequests)[0]) => (
        <span
          className={cn(
            "font-medium",
            isDark ? "text-gray-300" : "text-gray-700",
          )}
        >
          SAR {request.salary.toLocaleString()}
        </span>
      ),
    },
    {
      key: "requested",
      label: "Requested",
      render: (request: (typeof advanceRequests)[0]) => (
        <span
          className={cn(
            "font-semibold",
            isDark ? "text-purple-400" : "text-purple-600",
          )}
        >
          SAR {request.requestedAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (request: (typeof advanceRequests)[0]) => (
        <Badge
          className={cn(
            isDark
              ? "bg-purple-500/20 text-purple-400"
              : "bg-purple-50 text-purple-600",
          )}
        >
          {request.reason}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (request: (typeof advanceRequests)[0]) => (
        <Badge
          className={cn(
            request.status === "Pending" &&
              (isDark
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-yellow-50 text-yellow-600"),
            request.status === "Approved" &&
              (isDark
                ? "bg-blue-500/20 text-blue-400"
                : "bg-blue-50 text-blue-600"),
            request.status === "Disbursed" &&
              (isDark
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"),
            request.status === "Rejected" &&
              (isDark
                ? "bg-red-500/20 text-red-400"
                : "bg-red-50 text-red-600"),
          )}
        >
          <span className="flex items-center gap-1">
            {request.status === "Pending" && <Clock className="w-3 h-3" />}
            {request.status === "Approved" && (
              <CheckCircle className="w-3 h-3" />
            )}
            {request.status === "Disbursed" && <Send className="w-3 h-3" />}
            {request.status === "Rejected" && (
              <AlertCircle className="w-3 h-3" />
            )}
            {request.status}
          </span>
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (request: (typeof advanceRequests)[0]) => (
        <button
          onClick={() => {
            setSelectedRequest(request);
            setShowDetailModal(true);
          }}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            isDark ? "hover:bg-white/10" : "hover:bg-gray-100",
          )}
          title="View Details"
        >
          <Eye
            className={cn(
              "w-4 h-4",
              isDark ? "text-gray-400" : "text-gray-500",
            )}
          />
        </button>
      ),
    },
  ];

  const exportData = {
    headers: [
      "Employee",
      "Department",
      "Salary",
      "Requested Amount",
      "Reason",
      "Status",
    ],
    rows: filteredRequests.map((r) => [
      r.employeeName,
      r.department,
      r.salary,
      r.requestedAmount,
      r.reason,
      r.status,
    ]),
    title: "Qsalary Advance Requests",
    filename: "qsalary_report",
  };

  const formatCurrency = (amount: number) => `SAR ${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Page Header with Logo */}
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl",
          isDark
            ? "bg-gradient-to-r from-purple-900/50 to-purple-800/30 border border-purple-500/20"
            : "bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200",
        )}
      >
        <div className="flex items-center gap-4">
          <img
            src={`${import.meta.env.BASE_URL}assets/logos/qsalary.svg`}
            alt="Qsalary"
            className="h-16 w-auto"
          />
          <div>
            <h1
              className={cn(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              Qsalary
            </h1>
            <p
              className={cn(
                "mt-1",
                isDark ? "text-purple-300/70" : "text-purple-700",
              )}
            >
              Instant Salary Advance - سلفة راتب فورية
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ExportButton data={exportData} variant="default" size="sm" />
          <Button
            onClick={() => setShowRequestModal(true)}
            className={
              isDark
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }
          >
            <Wallet className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Pending Requests"
          value={stats.pending}
          icon={<Clock className="w-5 h-5" />}
          color="warning"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="w-5 h-5" />}
          color="info"
        />
        <StatCard
          title="Disbursed"
          value={stats.disbursed}
          icon={<Send className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          title="Total Disbursed"
          value={formatCurrency(stats.totalDisbursed)}
          icon={<DollarSign className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Avg. Advance"
          value={formatCurrency(stats.avgAdvance)}
          icon={<Calculator className="w-5 h-5" />}
          color="secondary"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests Table */}
        <Card
          className={cn(
            "lg:col-span-2 p-6",
            isDark && "bg-[var(--theme-card)]",
          )}
        >
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
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2",
                  isDark
                    ? "bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-purple-500/20 focus:border-purple-500/50"
                    : "border border-gray-200 focus:ring-purple-500/20 focus:border-purple-500",
                )}
              />
            </div>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: "all", label: "All Status" },
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Disbursed", label: "Disbursed" },
                { value: "Rejected", label: "Rejected" },
              ]}
              className="w-36"
            />
          </div>

          <Table data={filteredRequests} columns={columns} searchable={false} />
        </Card>

        {/* Charts */}
        <Card className={cn("p-6", isDark && "bg-[var(--theme-card)]")}>
          <h3
            className={cn(
              "font-semibold mb-4",
              isDark ? "text-white" : "text-gray-800",
            )}
          >
            Request Status Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1e293b" : "#fff",
                    borderColor: isDark ? "#334155" : "#e5e7eb",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusChartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span
                  className={cn(
                    "text-sm",
                    isDark ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="New Salary Advance Request"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Employee"
            options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
          />
          <Input
            label="Requested Amount (SAR)"
            type="number"
            placeholder="Enter amount"
          />
          <Select
            label="Reason"
            options={[
              { value: "Emergency", label: "Emergency" },
              { value: "Medical", label: "Medical" },
              { value: "Education", label: "Education" },
              { value: "Personal", label: "Personal" },
            ]}
          />
          <Select
            label="Repayment Method"
            options={[
              { value: "full", label: "Full Deduction (Next Salary)" },
              { value: "2", label: "2 Installments" },
              { value: "3", label: "3 Installments" },
              { value: "4", label: "4 Installments" },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowRequestModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowRequestModal(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Request Details"
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <Avatar name={selectedRequest.employeeName} size="lg" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedRequest.employeeName}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedRequest.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Base Salary</p>
                <p className="font-semibold text-gray-800">
                  SAR {selectedRequest.salary.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <p className="text-xs text-purple-600">Requested Amount</p>
                <p className="font-semibold text-purple-700">
                  SAR {selectedRequest.requestedAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Reason</p>
                <p className="font-semibold text-gray-800">
                  {selectedRequest.reason}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Repayment</p>
                <p className="font-semibold text-gray-800">
                  {selectedRequest.repaymentMethod}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              {selectedRequest.status === "Pending" && (
                <>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Reject
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QsalaryPage;
