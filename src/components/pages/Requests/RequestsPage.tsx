import React, { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Paperclip,
  ArrowRight,
  User,
  Briefcase,
  Wallet,
  GraduationCap,
  Truck,
  FileCheck,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card } from "../../common/Card";
import { ColoredStatsCard, cardColors } from "../../common/ColoredStatsCard";
import { FilterBar, FilterConfig, ActiveFilter } from "../../common/FilterBar";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge, StatusBadge, PriorityBadge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Tabs, TabPanel } from "../../common/Tabs";
import { Avatar } from "../../common/Avatar";
import { Modal } from "../../common/Modal";
import { useTheme } from "../../../contexts/ThemeContext";
import { requests, employees, departments } from "../../../data";
import { cn } from "../../../utils/cn";
import { format } from "date-fns";

type RequestType =
  | "Leave"
  | "Overtime"
  | "Document"
  | "Equipment"
  | "Transfer"
  | "Training"
  | "Advance"
  | "Other";
type RequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "In Progress"
  | "Completed";

const requestTypeIcons: Record<RequestType, React.ReactNode> = {
  Leave: <FileText className="w-5 h-5" />,
  Overtime: <Clock className="w-5 h-5" />,
  Document: <FileCheck className="w-5 h-5" />,
  Equipment: <Briefcase className="w-5 h-5" />,
  Transfer: <Truck className="w-5 h-5" />,
  Training: <GraduationCap className="w-5 h-5" />,
  Advance: <Wallet className="w-5 h-5" />,
  Other: <FileText className="w-5 h-5" />,
};

const requestTypeColors: Record<RequestType, string> = {
  Leave: "#10B981",
  Overtime: "#F59E0B",
  Document: "#3B82F6",
  Equipment: "#8B5CF6",
  Transfer: "#EC4899",
  Training: "#14B8A6",
  Advance: "#EF4444",
  Other: "#6B7280",
};

const statusConfig: Record<
  RequestStatus,
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
  "In Progress": {
    color: "text-secondary-600",
    bgColor: "bg-secondary-50",
    icon: <Clock className="w-4 h-4" />,
  },
  Completed: {
    color: "text-success-600",
    bgColor: "bg-success-50",
    icon: <CheckCircle className="w-4 h-4" />,
  },
};

export const RequestsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<
    (typeof requests)[0] | null
  >(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === "Pending").length;
    const inProgress = requests.filter(
      (r) => r.status === "In Progress",
    ).length;
    const approved = requests.filter(
      (r) => r.status === "Approved" || r.status === "Completed",
    ).length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;
    return { pending, inProgress, approved, rejected };
  }, []);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "all" || request.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || request.status === selectedStatus;
      const matchesPriority =
        selectedPriority === "all" || request.priority === selectedPriority;
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pending" && request.status === "Pending") ||
        (activeTab === "my-requests" && request.employeeId === "emp-001");
      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesPriority &&
        matchesTab
      );
    });
  }, [searchQuery, selectedType, selectedStatus, selectedPriority, activeTab]);

  const tabs = [
    {
      id: "all",
      label: "All Requests",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "pending",
      label: "Pending Approval",
      icon: <Clock className="w-4 h-4" />,
      badge: stats.pending,
    },
    {
      id: "my-requests",
      label: "My Requests",
      icon: <User className="w-4 h-4" />,
    },
  ];

  const columns = [
    {
      key: "request",
      label: "Request",
      sortable: true,
      render: (request: (typeof requests)[0]) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${requestTypeColors[request.type as RequestType]}20`,
            }}
          >
            <span
              style={{ color: requestTypeColors[request.type as RequestType] }}
            >
              {requestTypeIcons[request.type as RequestType]}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{request.title}</p>
            <p className="text-xs text-gray-500">#{request.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (request: (typeof requests)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar name={request.employeeName} size="sm" />
          <div>
            <p className="font-medium text-gray-800">{request.employeeName}</p>
            <p className="text-xs text-gray-500">
              {employees.find((e) => e.id === request.employeeId)?.department}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (request: (typeof requests)[0]) => (
        <Badge
          style={{
            backgroundColor: `${requestTypeColors[request.type as RequestType]}20`,
            color: requestTypeColors[request.type as RequestType],
          }}
        >
          {request.type}
        </Badge>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (request: (typeof requests)[0]) => (
        <PriorityBadge priority={request.priority as any} />
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (request: (typeof requests)[0]) => {
        const config = statusConfig[request.status as RequestStatus];
        return (
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full",
              config.bgColor,
            )}
          >
            <span className={config.color}>{config.icon}</span>
            <span className={cn("text-sm font-medium", config.color)}>
              {request.status}
            </span>
          </div>
        );
      },
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (request: (typeof requests)[0]) => (
        <span className="text-sm text-gray-600">
          {format(new Date(request.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (request: (typeof requests)[0]) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedRequest(request);
              setShowDetailModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          {request.status === "Pending" && (
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
            Requests
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
            Manage and track all employee requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowRequestModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards - Colored */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ColoredStatsCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="w-6 h-6" />}
          color="amber"
          trend={{ value: 5, isPositive: false }}
        />
        <ColoredStatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={<ArrowRight className="w-6 h-6" />}
          color="cyan"
          trend={{ value: 10, isPositive: true }}
        />
        <ColoredStatsCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="w-6 h-6" />}
          color="emerald"
          trend={{ value: 15, isPositive: true }}
        />
        <ColoredStatsCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="w-6 h-6" />}
          color="rose"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="modern"
      />

      {/* Main Content */}
      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
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
                { value: "Leave", label: "Leave" },
                { value: "Overtime", label: "Overtime" },
                { value: "Document", label: "Document" },
                { value: "Equipment", label: "Equipment" },
                { value: "Transfer", label: "Transfer" },
                { value: "Training", label: "Training" },
                { value: "Advance", label: "Advance" },
                { value: "Other", label: "Other" },
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
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
              ]}
              className="w-36"
            />
            <Select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              options={[
                { value: "all", label: "All Priority" },
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
                { value: "Urgent", label: "Urgent" },
              ]}
              className="w-36"
            />
          </div>
        </div>

        {/* Table */}
        <Table data={filteredRequests} columns={columns} searchable={false} />
      </Card>

      {/* New Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="New Request"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Request Type"
            options={[
              { value: "Leave", label: "Leave Request" },
              { value: "Overtime", label: "Overtime Request" },
              { value: "Document", label: "Document Request" },
              { value: "Equipment", label: "Equipment Request" },
              { value: "Transfer", label: "Transfer Request" },
              { value: "Training", label: "Training Request" },
              { value: "Advance", label: "Salary Advance" },
              { value: "Other", label: "Other" },
            ]}
          />
          <Input label="Title" placeholder="Enter request title..." />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Enter request details..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              rows={4}
            />
          </div>
          <Select
            label="Priority"
            options={[
              { value: "Low", label: "Low" },
              { value: "Medium", label: "Medium" },
              { value: "High", label: "High" },
              { value: "Urgent", label: "Urgent" },
            ]}
            defaultValue="Medium"
          />
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

      {/* Request Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${requestTypeColors[selectedRequest.type as RequestType]}20`,
                  }}
                >
                  <span
                    style={{
                      color:
                        requestTypeColors[selectedRequest.type as RequestType],
                    }}
                  >
                    {requestTypeIcons[selectedRequest.type as RequestType]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedRequest.title}
                  </h3>
                  <p className="text-sm text-gray-500">#{selectedRequest.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={selectedRequest.priority as any} />
                {(() => {
                  const config =
                    statusConfig[selectedRequest.status as RequestStatus];
                  return (
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full",
                        config.bgColor,
                      )}
                    >
                      <span className={config.color}>{config.icon}</span>
                      <span className={cn("text-sm font-medium", config.color)}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Employee Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar name={selectedRequest.employeeName} size="md" />
              <div>
                <p className="font-medium text-gray-800">
                  {selectedRequest.employeeName}
                </p>
                <p className="text-sm text-gray-500">
                  {
                    employees.find((e) => e.id === selectedRequest.employeeId)
                      ?.position
                  }{" "}
                  -
                  {
                    employees.find((e) => e.id === selectedRequest.employeeId)
                      ?.department
                  }
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Request Type</p>
                <Badge
                  className="mt-1"
                  style={{
                    backgroundColor: `${requestTypeColors[selectedRequest.type as RequestType]}20`,
                    color:
                      requestTypeColors[selectedRequest.type as RequestType],
                  }}
                >
                  {selectedRequest.type}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(selectedRequest.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-800">{selectedRequest.description}</p>
            </div>

            {/* Approval Flow */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Approval Flow</h4>
              <div className="space-y-3">
                {selectedRequest.approvalFlow.map((step, index) => {
                  const stepConfig =
                    statusConfig[step.status as RequestStatus] ||
                    statusConfig.Pending;
                  return (
                    <div
                      key={step.step}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg border",
                        step.status === "Approved" &&
                          "bg-success-50 border-success-100",
                        step.status === "Rejected" &&
                          "bg-error-50 border-error-100",
                        step.status === "Pending" &&
                          "bg-gray-50 border-gray-100",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          step.status === "Approved" && "bg-success text-white",
                          step.status === "Rejected" && "bg-error text-white",
                          step.status === "Pending" &&
                            "bg-gray-200 text-gray-600",
                        )}
                      >
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {step.approverName}
                        </p>
                        {step.date && (
                          <p className="text-xs text-gray-500">
                            {format(new Date(step.date), "MMM d, yyyy HH:mm")}
                          </p>
                        )}
                        {step.comments && (
                          <p className="text-sm text-gray-600 mt-1">
                            {step.comments}
                          </p>
                        )}
                      </div>
                      <span className={stepConfig.color}>
                        {stepConfig.icon}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            {selectedRequest.status === "Pending" && (
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

            {selectedRequest.status !== "Pending" && (
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
    </div>
  );
};

export default RequestsPage;
