import React, { useState, useMemo } from "react";
import {
  IdCard,
  Plus,
  Download,
  Search,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  FileText,
  Plane,
  Building2,
  Users,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card, StatCard } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Tabs, TabPanel } from "../../common/Tabs";
import { Avatar } from "../../common/Avatar";
import { Modal } from "../../common/Modal";
import { employees } from "../../../data";
import { cn } from "../../../utils/cn";
import { format, differenceInDays } from "date-fns";
import { useTheme } from "../../../contexts/ThemeContext";

type ServiceType =
  | "Issue Iqama"
  | "Renew Iqama"
  | "Transfer Iqama"
  | "Exit Re-entry"
  | "Final Exit"
  | "Work Visa";
type ServiceStatus = "Pending" | "In Progress" | "Completed" | "Rejected";

const serviceTypeColors: Record<ServiceType, string> = {
  "Issue Iqama": "#10B981",
  "Renew Iqama": "#3B82F6",
  "Transfer Iqama": "#8B5CF6",
  "Exit Re-entry": "#F59E0B",
  "Final Exit": "#EF4444",
  "Work Visa": "#14B8A6",
};

const serviceTypeIcons: Record<ServiceType, React.ReactNode> = {
  "Issue Iqama": <IdCard className="w-5 h-5" />,
  "Renew Iqama": <RefreshCw className="w-5 h-5" />,
  "Transfer Iqama": <Building2 className="w-5 h-5" />,
  "Exit Re-entry": <Plane className="w-5 h-5" />,
  "Final Exit": <Plane className="w-5 h-5" />,
  "Work Visa": <FileText className="w-5 h-5" />,
};

// Mock Muqeem services data
const muqeemServices = [
  {
    id: "MQ-001",
    employeeId: "emp-001",
    employeeName: "Ahmed Al-Rashid",
    serviceType: "Renew Iqama",
    requestDate: "2024-01-15",
    status: "Completed",
    currentIqamaNumber: "2451234567",
    expiryDate: "2025-01-15",
    fee: 650,
  },
  {
    id: "MQ-002",
    employeeId: "emp-002",
    employeeName: "Sara Abdullah",
    serviceType: "Exit Re-entry",
    requestDate: "2024-01-14",
    status: "In Progress",
    currentIqamaNumber: "2451234568",
    expiryDate: "2024-06-20",
    fee: 200,
  },
  {
    id: "MQ-003",
    employeeId: "emp-003",
    employeeName: "Mohammed Hassan",
    serviceType: "Issue Iqama",
    requestDate: "2024-01-13",
    status: "Pending",
    fee: 650,
  },
  {
    id: "MQ-004",
    employeeId: "emp-004",
    employeeName: "Fatima Al-Zahrani",
    serviceType: "Transfer Iqama",
    requestDate: "2024-01-12",
    status: "Completed",
    currentIqamaNumber: "2451234570",
    expiryDate: "2024-08-15",
    fee: 2000,
  },
  {
    id: "MQ-005",
    employeeId: "emp-005",
    employeeName: "Khalid Ibrahim",
    serviceType: "Final Exit",
    requestDate: "2024-01-11",
    status: "Rejected",
    currentIqamaNumber: "2451234571",
    notes: "Outstanding violations",
  },
];

// Employees with expiring Iqamas
const expiringIqamas = employees
  .filter((e) => e.iqamaExpiry)
  .map((e) => ({
    ...e,
    daysUntilExpiry: differenceInDays(new Date(e.iqamaExpiry!), new Date()),
  }))
  .filter((e) => e.daysUntilExpiry <= 90 && e.daysUntilExpiry > 0)
  .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

export const MuqeemPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";

  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<
    (typeof muqeemServices)[0] | null
  >(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = muqeemServices.filter((s) => s.status === "Pending").length;
    const inProgress = muqeemServices.filter(
      (s) => s.status === "In Progress",
    ).length;
    const completed = muqeemServices.filter(
      (s) => s.status === "Completed",
    ).length;
    const expiring = expiringIqamas.length;
    return { pending, inProgress, completed, expiring };
  }, []);

  // Filter services
  const filteredServices = useMemo(() => {
    return muqeemServices.filter((service) => {
      const matchesSearch = service.employeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesService =
        selectedService === "all" || service.serviceType === selectedService;
      const matchesStatus =
        selectedStatus === "all" || service.status === selectedStatus;
      return matchesSearch && matchesService && matchesStatus;
    });
  }, [searchQuery, selectedService, selectedStatus]);

  const tabs = [
    {
      id: "services",
      label: "Muqeem Services",
      icon: <IdCard className="w-4 h-4" />,
    },
    {
      id: "expiring",
      label: "Expiring Iqamas",
      icon: <AlertCircle className="w-4 h-4" />,
      badge: stats.expiring,
    },
    {
      id: "iqama",
      label: "Iqama Info",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const columns = [
    {
      key: "service",
      label: "Service",
      sortable: true,
      render: (service: (typeof muqeemServices)[0]) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${serviceTypeColors[service.serviceType as ServiceType]}20`,
            }}
          >
            <span
              style={{
                color: serviceTypeColors[service.serviceType as ServiceType],
              }}
            >
              {serviceTypeIcons[service.serviceType as ServiceType]}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{service.serviceType}</p>
            <p className="text-xs text-gray-500">#{service.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (service: (typeof muqeemServices)[0]) => (
        <div className="flex items-center gap-2">
          <Avatar name={service.employeeName} size="sm" />
          <span className="text-sm text-gray-700">{service.employeeName}</span>
        </div>
      ),
    },
    {
      key: "iqama",
      label: "Iqama Number",
      render: (service: (typeof muqeemServices)[0]) => (
        <span className="text-sm font-mono text-gray-600">
          {service.currentIqamaNumber || "-"}
        </span>
      ),
    },
    {
      key: "date",
      label: "Request Date",
      sortable: true,
      render: (service: (typeof muqeemServices)[0]) => (
        <span className="text-sm text-gray-600">
          {format(new Date(service.requestDate), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "fee",
      label: "Fee",
      render: (service: (typeof muqeemServices)[0]) => (
        <span className="text-sm font-medium text-gray-800">
          {service.fee ? `SAR ${service.fee}` : "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (service: (typeof muqeemServices)[0]) => (
        <Badge
          className={cn(
            service.status === "Pending" && "bg-warning-50 text-warning-600",
            service.status === "In Progress" &&
              "bg-secondary-50 text-secondary-600",
            service.status === "Completed" && "bg-success-50 text-success-600",
            service.status === "Rejected" && "bg-error-50 text-error-600",
          )}
        >
          <span className="flex items-center gap-1">
            {service.status === "Pending" && <Clock className="w-3 h-3" />}
            {service.status === "In Progress" && (
              <RefreshCw className="w-3 h-3" />
            )}
            {service.status === "Completed" && (
              <CheckCircle className="w-3 h-3" />
            )}
            {service.status === "Rejected" && <XCircle className="w-3 h-3" />}
            {service.status}
          </span>
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (service: (typeof muqeemServices)[0]) => (
        <button
          onClick={() => {
            setSelectedRequest(service);
            setShowDetailModal(true);
          }}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-gray-500" />
        </button>
      ),
    },
  ];

  const expiringColumns = [
    {
      key: "employee",
      label: "Employee",
      render: (emp: (typeof expiringIqamas)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar name={emp.fullName} size="sm" />
          <div>
            <p className="font-medium text-gray-800">{emp.fullName}</p>
            <p className="text-xs text-gray-500">{emp.position}</p>
          </div>
        </div>
      ),
    },
    {
      key: "iqama",
      label: "Iqama Number",
      render: (emp: (typeof expiringIqamas)[0]) => (
        <span className="text-sm font-mono text-gray-600">
          {emp.iqamaNumber}
        </span>
      ),
    },
    {
      key: "expiry",
      label: "Expiry Date",
      render: (emp: (typeof expiringIqamas)[0]) => (
        <span className="text-sm text-gray-600">
          {format(new Date(emp.iqamaExpiry!), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "days",
      label: "Days Remaining",
      render: (emp: (typeof expiringIqamas)[0]) => (
        <Badge
          className={cn(
            emp.daysUntilExpiry <= 30 && "bg-error-50 text-error-600",
            emp.daysUntilExpiry > 30 &&
              emp.daysUntilExpiry <= 60 &&
              "bg-warning-50 text-warning-600",
            emp.daysUntilExpiry > 60 && "bg-success-50 text-success-600",
          )}
        >
          {emp.daysUntilExpiry} days
        </Badge>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: () => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowRequestModal(true)}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Renew
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header with Logo */}
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl",
          isDark
            ? "bg-gradient-to-r from-orange-900/50 to-orange-800/30 border border-orange-500/20"
            : "bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200",
        )}
      >
        <div className="flex items-center gap-4">
          <img
            src={`${import.meta.env.BASE_URL}assets/logos/muqeem.svg`}
            alt="Muqeem"
            className="h-14 w-auto"
          />
          <div>
            <h1
              className={cn(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              Muqeem Services
            </h1>
            <p
              className={cn(
                "mt-1",
                isDark ? "text-orange-300/70" : "text-orange-700",
              )}
            >
              Manage Iqama and visa services - خدمات مقيم
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className={isDark ? "border-orange-500/30 text-orange-400" : ""}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setShowRequestModal(true)}
            className={
              isDark
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Requests"
          value={stats.pending}
          icon={<Clock className="w-6 h-6" />}
          color="warning"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<RefreshCw className="w-6 h-6" />}
          color="secondary"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiring}
          icon={<AlertCircle className="w-6 h-6" />}
          color="error"
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.keys(serviceTypeColors).map((type) => (
            <button
              key={type}
              onClick={() => setShowRequestModal(true)}
              className="p-4 border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all text-center group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{
                  backgroundColor: `${serviceTypeColors[type as ServiceType]}20`,
                }}
              >
                <span style={{ color: serviceTypeColors[type as ServiceType] }}>
                  {serviceTypeIcons[type as ServiceType]}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary">
                {type}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="modern"
      />

      {/* Services Tab */}
      <TabPanel id="services" activeTab={activeTab}>
        <Card className="p-6">
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
            <div className="flex gap-3">
              <Select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                options={[
                  { value: "all", label: "All Services" },
                  ...Object.keys(serviceTypeColors).map((t) => ({
                    value: t,
                    label: t,
                  })),
                ]}
                className="w-44"
              />
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "Pending", label: "Pending" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Completed", label: "Completed" },
                  { value: "Rejected", label: "Rejected" },
                ]}
                className="w-36"
              />
            </div>
          </div>

          <Table data={filteredServices} columns={columns} searchable={false} />
        </Card>
      </TabPanel>

      {/* Expiring Iqamas Tab */}
      <TabPanel id="expiring" activeTab={activeTab}>
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 p-4 bg-warning-50 rounded-lg border border-warning-100">
              <AlertCircle className="w-5 h-5 text-warning-600" />
              <p className="text-sm text-warning-800">
                <strong>{expiringIqamas.length} employees</strong> have Iqamas
                expiring within the next 90 days
              </p>
            </div>
          </div>

          <Table
            data={expiringIqamas}
            columns={expiringColumns}
            searchable={true}
            searchPlaceholder="Search employees..."
          />
        </Card>
      </TabPanel>

      {/* Iqama Info Tab */}
      <TabPanel id="iqama" activeTab={activeTab}>
        <Card className="p-6">
          <Table
            data={employees.filter((e) => e.iqamaNumber)}
            columns={[
              {
                key: "employee",
                label: "Employee",
                render: (emp: (typeof employees)[0]) => (
                  <div className="flex items-center gap-3">
                    <Avatar name={emp.fullName} size="sm" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {emp.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{emp.position}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: "iqama",
                label: "Iqama Number",
                render: (emp: (typeof employees)[0]) => (
                  <span className="font-mono text-sm">{emp.iqamaNumber}</span>
                ),
              },
              {
                key: "expiry",
                label: "Expiry Date",
                render: (emp: (typeof employees)[0]) => (
                  <span className="text-sm">
                    {emp.iqamaExpiry
                      ? format(new Date(emp.iqamaExpiry), "MMM d, yyyy")
                      : "-"}
                  </span>
                ),
              },
              {
                key: "nationality",
                label: "Nationality",
                render: (emp: (typeof employees)[0]) => (
                  <span className="text-sm">{emp.nationality}</span>
                ),
              },
            ]}
            searchable={true}
            searchPlaceholder="Search by name or Iqama number..."
          />
        </Card>
      </TabPanel>

      {/* New Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="New Muqeem Request"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Service Type"
            options={Object.keys(serviceTypeColors).map((t) => ({
              value: t,
              label: t,
            }))}
          />
          <Select
            label="Employee"
            options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
          />
          <Input
            label="Current Iqama Number"
            placeholder="Enter Iqama number..."
          />
          <Input label="Notes" placeholder="Additional notes..." />
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

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Service Request Details"
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${serviceTypeColors[selectedRequest.serviceType as ServiceType]}20`,
                }}
              >
                <span
                  style={{
                    color:
                      serviceTypeColors[
                        selectedRequest.serviceType as ServiceType
                      ],
                  }}
                >
                  {serviceTypeIcons[selectedRequest.serviceType as ServiceType]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedRequest.serviceType}
                </h3>
                <p className="text-sm text-gray-500">#{selectedRequest.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Employee</p>
                <p className="font-medium text-gray-800">
                  {selectedRequest.employeeName}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <Badge
                  className={cn(
                    "mt-1",
                    selectedRequest.status === "Completed" &&
                      "bg-success-50 text-success-600",
                    selectedRequest.status === "Pending" &&
                      "bg-warning-50 text-warning-600",
                    selectedRequest.status === "In Progress" &&
                      "bg-secondary-50 text-secondary-600",
                    selectedRequest.status === "Rejected" &&
                      "bg-error-50 text-error-600",
                  )}
                >
                  {selectedRequest.status}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Iqama Number</p>
                <p className="font-mono font-medium text-gray-800">
                  {selectedRequest.currentIqamaNumber || "-"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Request Date</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(selectedRequest.requestDate), "MMM d, yyyy")}
                </p>
              </div>
              {selectedRequest.fee && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Service Fee</p>
                  <p className="font-medium text-gray-800">
                    SAR {selectedRequest.fee}
                  </p>
                </div>
              )}
              {selectedRequest.expiryDate && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">New Expiry Date</p>
                  <p className="font-medium text-gray-800">
                    {format(
                      new Date(selectedRequest.expiryDate),
                      "MMM d, yyyy",
                    )}
                  </p>
                </div>
              )}
            </div>

            {selectedRequest.notes && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-800">
                  {selectedRequest.notes}
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
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MuqeemPage;
