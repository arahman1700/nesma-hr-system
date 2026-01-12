import React, { useState, useMemo } from "react";
import {
  Shield,
  Search,
  Plus,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Heart,
  UserPlus,
  Eye,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card, StatCard } from "../../common/Card";
import { Select } from "../../common/Select";
import { Input } from "../../common/Input";
import { Badge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Tabs, TabPanel } from "../../common/Tabs";
import { Avatar } from "../../common/Avatar";
import { Modal } from "../../common/Modal";
import { ExportButton } from "../../common/ExportButton";
import { employees } from "../../../data";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
import { format, differenceInDays } from "date-fns";

// Mock Tameeni data
const tameeniMembers = employees
  .filter((e) => e.status === "Active")
  .map((emp, index) => ({
    id: `TAM-${String(index + 1).padStart(3, "0")}`,
    employeeId: emp.id,
    employeeName: emp.fullName,
    photo: emp.photo,
    position: emp.position,
    policyNumber: `POL-${Math.floor(Math.random() * 1000000)}`,
    insuranceClass: ["A", "B", "C", "VIP"][Math.floor(Math.random() * 4)],
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    premium: [500, 750, 1000, 2000][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.1 ? "Active" : "Expired",
    dependents:
      Math.random() > 0.5
        ? [
            { name: "Spouse", relation: "Spouse", dob: "1990-05-15" },
            { name: "Child 1", relation: "Child", dob: "2015-08-20" },
          ]
        : [],
  }));

const classColors = {
  VIP: "#8B5CF6",
  A: "#10B981",
  B: "#3B82F6",
  C: "#F59E0B",
};

export const TameeniPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";

  const [activeTab, setActiveTab] = useState("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<
    (typeof tameeniMembers)[0] | null
  >(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const active = tameeniMembers.filter((m) => m.status === "Active").length;
    const expired = tameeniMembers.filter((m) => m.status === "Expired").length;
    const totalDependents = tameeniMembers.reduce(
      (acc, m) => acc + m.dependents.length,
      0,
    );
    const totalPremium = tameeniMembers
      .filter((m) => m.status === "Active")
      .reduce((acc, m) => acc + m.premium, 0);
    const expiringSoon = tameeniMembers.filter((m) => {
      const daysUntil = differenceInDays(new Date(m.endDate), new Date());
      return daysUntil <= 30 && daysUntil > 0;
    }).length;
    return { active, expired, totalDependents, totalPremium, expiringSoon };
  }, []);

  // Filter members
  const filteredMembers = useMemo(() => {
    return tameeniMembers.filter((member) => {
      const matchesSearch =
        member.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass =
        selectedClass === "all" || member.insuranceClass === selectedClass;
      const matchesStatus =
        selectedStatus === "all" || member.status === selectedStatus;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [searchQuery, selectedClass, selectedStatus]);

  const tabs = [
    { id: "members", label: "Members", icon: <Users className="w-4 h-4" /> },
    {
      id: "dependents",
      label: "Dependents",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: "expiring",
      label: "Expiring Soon",
      icon: <AlertCircle className="w-4 h-4" />,
      badge: stats.expiringSoon,
    },
  ];

  const columns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (member: (typeof tameeniMembers)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar name={member.employeeName} size="sm" src={member.photo} />
          <div>
            <p
              className={cn(
                "font-medium",
                isDark ? "text-white" : "text-gray-800",
              )}
            >
              {member.employeeName}
            </p>
            <p
              className={cn(
                "text-xs",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            >
              {member.position}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "policy",
      label: "Policy Number",
      render: (member: (typeof tameeniMembers)[0]) => (
        <span
          className={cn(
            "font-mono text-sm",
            isDark ? "text-gray-300" : "text-gray-600",
          )}
        >
          {member.policyNumber}
        </span>
      ),
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
      render: (member: (typeof tameeniMembers)[0]) => (
        <Badge
          style={{
            backgroundColor: isDark
              ? `${classColors[member.insuranceClass as keyof typeof classColors]}30`
              : `${classColors[member.insuranceClass as keyof typeof classColors]}20`,
            color:
              classColors[member.insuranceClass as keyof typeof classColors],
          }}
        >
          Class {member.insuranceClass}
        </Badge>
      ),
    },
    {
      key: "validity",
      label: "Validity",
      render: (member: (typeof tameeniMembers)[0]) => (
        <div className="text-sm">
          <p className={cn(isDark ? "text-white" : "text-gray-800")}>
            {format(new Date(member.startDate), "MMM d, yyyy")}
          </p>
          <p className={cn(isDark ? "text-gray-400" : "text-gray-500")}>
            to {format(new Date(member.endDate), "MMM d, yyyy")}
          </p>
        </div>
      ),
    },
    {
      key: "dependents",
      label: "Dependents",
      render: (member: (typeof tameeniMembers)[0]) => (
        <span
          className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}
        >
          {member.dependents.length}
        </span>
      ),
    },
    {
      key: "premium",
      label: "Premium",
      sortable: true,
      render: (member: (typeof tameeniMembers)[0]) => (
        <span
          className={cn("font-medium", isDark ? "text-white" : "text-gray-800")}
        >
          SAR {member.premium}/mo
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (member: (typeof tameeniMembers)[0]) => (
        <Badge
          className={cn(
            member.status === "Active" &&
              (isDark
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-success-50 text-success-600"),
            member.status === "Expired" &&
              (isDark
                ? "bg-rose-500/20 text-rose-400"
                : "bg-error-50 text-error-600"),
          )}
        >
          <span className="flex items-center gap-1">
            {member.status === "Active" && <CheckCircle className="w-3 h-3" />}
            {member.status === "Expired" && <AlertCircle className="w-3 h-3" />}
            {member.status}
          </span>
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (member: (typeof tameeniMembers)[0]) => (
        <button
          onClick={() => {
            setSelectedMember(member);
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

  // All dependents
  const allDependents = tameeniMembers.flatMap((m) =>
    m.dependents.map((d) => ({
      ...d,
      employeeName: m.employeeName,
      employeeId: m.employeeId,
      policyNumber: m.policyNumber,
      insuranceClass: m.insuranceClass,
    })),
  );

  const dependentColumns = [
    {
      key: "name",
      label: "Dependent Name",
      render: (dep: (typeof allDependents)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar name={dep.name} size="sm" />
          <span
            className={cn(
              "font-medium",
              isDark ? "text-white" : "text-gray-800",
            )}
          >
            {dep.name}
          </span>
        </div>
      ),
    },
    {
      key: "relation",
      label: "Relation",
      render: (dep: (typeof allDependents)[0]) => (
        <Badge
          className={cn(
            isDark
              ? "bg-cyan-500/20 text-cyan-400"
              : "bg-secondary-50 text-secondary-600",
          )}
        >
          {dep.relation}
        </Badge>
      ),
    },
    {
      key: "employee",
      label: "Employee",
      render: (dep: (typeof allDependents)[0]) => (
        <span
          className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}
        >
          {dep.employeeName}
        </span>
      ),
    },
    {
      key: "dob",
      label: "Date of Birth",
      render: (dep: (typeof allDependents)[0]) => (
        <span
          className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}
        >
          {format(new Date(dep.dob), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "class",
      label: "Class",
      render: (dep: (typeof allDependents)[0]) => (
        <Badge
          style={{
            backgroundColor: isDark
              ? `${classColors[dep.insuranceClass as keyof typeof classColors]}30`
              : `${classColors[dep.insuranceClass as keyof typeof classColors]}20`,
            color: classColors[dep.insuranceClass as keyof typeof classColors],
          }}
        >
          Class {dep.insuranceClass}
        </Badge>
      ),
    },
  ];

  // Expiring members
  const expiringMembers = tameeniMembers
    .filter((m) => {
      const daysUntil = differenceInDays(new Date(m.endDate), new Date());
      return daysUntil <= 60 && daysUntil > 0;
    })
    .map((m) => ({
      ...m,
      daysUntilExpiry: differenceInDays(new Date(m.endDate), new Date()),
    }))
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  // Export data
  const exportData = {
    headers: [
      "Employee",
      "Policy Number",
      "Class",
      "Start Date",
      "End Date",
      "Premium",
      "Dependents",
      "Status",
    ],
    rows: filteredMembers.map((m) => [
      m.employeeName,
      m.policyNumber,
      m.insuranceClass,
      m.startDate,
      m.endDate,
      m.premium,
      m.dependents.length,
      m.status,
    ]),
    title: "Tameeni Insurance Report",
    filename: "tameeni_report",
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Logo */}
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl",
          isDark
            ? "bg-gradient-to-r from-cyan-900/50 to-cyan-800/30 border border-cyan-500/20"
            : "bg-gradient-to-r from-cyan-50 to-cyan-100/50 border border-cyan-200",
        )}
      >
        <div className="flex items-center gap-4">
          <img
            src={`${import.meta.env.BASE_URL}assets/logos/tameeni.svg`}
            alt="Tameeni"
            className="h-14 w-auto rounded-lg shadow-lg"
          />
          <div>
            <h1
              className={cn(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              Tameeni
            </h1>
            <p
              className={cn(
                "mt-1",
                isDark ? "text-cyan-300/70" : "text-cyan-700",
              )}
            >
              Medical Insurance Management - تأمّني
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ExportButton data={exportData} variant="default" size="sm" />
          <Button
            onClick={() => setShowAddModal(true)}
            className={
              isDark
                ? "bg-cyan-600 hover:bg-cyan-700"
                : "bg-cyan-600 hover:bg-cyan-700 text-white"
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Active Members"
          value={stats.active}
          icon={<Users className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          title="Dependents"
          value={stats.totalDependents}
          icon={<Heart className="w-5 h-5" />}
          color="secondary"
        />
        <StatCard
          title="Monthly Premium"
          value={`SAR ${stats.totalPremium.toLocaleString()}`}
          icon={<Shield className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon={<AlertCircle className="w-5 h-5" />}
          color="warning"
        />
        <StatCard
          title="Expired"
          value={stats.expired}
          icon={<Clock className="w-5 h-5" />}
          color="error"
        />
      </div>

      {/* Class Distribution */}
      <Card className="p-6">
        <h3
          className={cn(
            "font-semibold mb-4",
            isDark ? "text-white" : "text-gray-800",
          )}
        >
          Insurance Class Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(classColors).map(([className, color]) => {
            const count = tameeniMembers.filter(
              (m) => m.insuranceClass === className && m.status === "Active",
            ).length;
            return (
              <div
                key={className}
                className={cn(
                  "p-4 rounded-xl border-2",
                  isDark ? "border-opacity-40" : "",
                )}
                style={{
                  borderColor: `${color}${isDark ? "60" : "40"}`,
                  backgroundColor: `${color}${isDark ? "15" : "10"}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg" style={{ color }}>
                    Class {className}
                  </span>
                  <Shield className="w-5 h-5" style={{ color }} />
                </div>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isDark ? "text-white" : "text-gray-800",
                  )}
                >
                  {count}
                </p>
                <p className={cn(isDark ? "text-gray-400" : "text-gray-500")}>
                  members
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="modern"
      />

      {/* Members Tab */}
      <TabPanel id="members" activeTab={activeTab}>
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
                placeholder="Search by name or policy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-xl text-sm",
                  "focus:outline-none focus:ring-2",
                  isDark
                    ? "bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-cyan-500/20 focus:border-cyan-500/50"
                    : "border border-gray-200 focus:ring-cyan-500/20 focus:border-cyan-500",
                )}
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={[
                  { value: "all", label: "All Classes" },
                  { value: "VIP", label: "VIP" },
                  { value: "A", label: "Class A" },
                  { value: "B", label: "Class B" },
                  { value: "C", label: "Class C" },
                ]}
                className="w-36"
              />
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "Active", label: "Active" },
                  { value: "Expired", label: "Expired" },
                ]}
                className="w-36"
              />
            </div>
          </div>

          <Table data={filteredMembers} columns={columns} searchable={false} />
        </Card>
      </TabPanel>

      {/* Dependents Tab */}
      <TabPanel id="dependents" activeTab={activeTab}>
        <Card className="p-6">
          <Table
            data={allDependents}
            columns={dependentColumns}
            searchable={true}
            searchPlaceholder="Search dependents..."
          />
        </Card>
      </TabPanel>

      {/* Expiring Tab */}
      <TabPanel id="expiring" activeTab={activeTab}>
        <Card className="p-6">
          {expiringMembers.length > 0 ? (
            <div className="space-y-4">
              {expiringMembers.map((member) => (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border",
                    member.daysUntilExpiry <= 30
                      ? isDark
                        ? "bg-rose-500/10 border-rose-500/20"
                        : "bg-error-50 border-error-100"
                      : isDark
                        ? "bg-amber-500/10 border-amber-500/20"
                        : "bg-warning-50 border-warning-100",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={member.employeeName}
                      size="md"
                      src={member.photo}
                    />
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          isDark ? "text-white" : "text-gray-800",
                        )}
                      >
                        {member.employeeName}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-gray-400" : "text-gray-500",
                        )}
                      >
                        {member.position}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isDark ? "text-gray-500" : "text-gray-400",
                        )}
                      >
                        Policy: {member.policyNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={cn(
                        member.daysUntilExpiry <= 30
                          ? isDark
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-error-100 text-error-700"
                          : isDark
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-warning-100 text-warning-700",
                      )}
                    >
                      {member.daysUntilExpiry} days remaining
                    </Badge>
                    <p
                      className={cn(
                        "text-sm mt-1",
                        isDark ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      Expires: {format(new Date(member.endDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className={
                      isDark
                        ? "bg-cyan-600 hover:bg-cyan-700"
                        : "bg-cyan-600 hover:bg-cyan-700 text-white"
                    }
                  >
                    Renew
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle
                className={cn(
                  "w-16 h-16 mx-auto mb-4",
                  isDark ? "text-emerald-400" : "text-success",
                )}
              />
              <h3
                className={cn(
                  "text-lg font-medium",
                  isDark ? "text-gray-300" : "text-gray-600",
                )}
              >
                All policies are up to date
              </h3>
              <p className={cn(isDark ? "text-gray-500" : "text-gray-500")}>
                No policies expiring in the next 60 days
              </p>
            </div>
          )}
        </Card>
      </TabPanel>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Insurance Member"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Employee"
            options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
          />
          <Select
            label="Insurance Class"
            options={[
              { value: "VIP", label: "VIP" },
              { value: "A", label: "Class A" },
              { value: "B", label: "Class B" },
              { value: "C", label: "Class C" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="End Date" type="date" />
          </div>
          <Input
            label="Monthly Premium (SAR)"
            type="number"
            placeholder="Enter premium amount..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setShowAddModal(false)}
              className={
                isDark
                  ? "bg-cyan-600 hover:bg-cyan-700"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white"
              }
            >
              Add Member
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Insurance Details"
        size="md"
      >
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar
                name={selectedMember.employeeName}
                size="lg"
                src={selectedMember.photo}
              />
              <div>
                <h3
                  className={cn(
                    "font-semibold",
                    isDark ? "text-white" : "text-gray-800",
                  )}
                >
                  {selectedMember.employeeName}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  Policy: {selectedMember.policyNumber}
                </p>
              </div>
              <Badge
                className="ml-auto"
                style={{
                  backgroundColor: isDark
                    ? `${classColors[selectedMember.insuranceClass as keyof typeof classColors]}30`
                    : `${classColors[selectedMember.insuranceClass as keyof typeof classColors]}20`,
                  color:
                    classColors[
                      selectedMember.insuranceClass as keyof typeof classColors
                    ],
                }}
              >
                Class {selectedMember.insuranceClass}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  Start Date
                </p>
                <p
                  className={cn(
                    "font-medium",
                    isDark ? "text-white" : "text-gray-800",
                  )}
                >
                  {format(new Date(selectedMember.startDate), "MMM d, yyyy")}
                </p>
              </div>
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
                  End Date
                </p>
                <p
                  className={cn(
                    "font-medium",
                    isDark ? "text-white" : "text-gray-800",
                  )}
                >
                  {format(new Date(selectedMember.endDate), "MMM d, yyyy")}
                </p>
              </div>
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
                  Monthly Premium
                </p>
                <p
                  className={cn(
                    "font-medium",
                    isDark ? "text-white" : "text-gray-800",
                  )}
                >
                  SAR {selectedMember.premium}
                </p>
              </div>
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
                  Status
                </p>
                <Badge
                  className={cn(
                    "mt-1",
                    selectedMember.status === "Active"
                      ? isDark
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-success-50 text-success-600"
                      : isDark
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-error-50 text-error-600",
                  )}
                >
                  {selectedMember.status}
                </Badge>
              </div>
            </div>

            {selectedMember.dependents.length > 0 && (
              <div>
                <h4
                  className={cn(
                    "font-medium mb-3",
                    isDark ? "text-white" : "text-gray-800",
                  )}
                >
                  Dependents
                </h4>
                <div className="space-y-2">
                  {selectedMember.dependents.map((dep, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl",
                        isDark
                          ? "bg-white/5 border border-white/10"
                          : "bg-gray-50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={dep.name} size="sm" />
                        <div>
                          <p
                            className={cn(
                              "font-medium",
                              isDark ? "text-white" : "text-gray-800",
                            )}
                          >
                            {dep.name}
                          </p>
                          <p
                            className={cn(
                              "text-xs",
                              isDark ? "text-gray-400" : "text-gray-500",
                            )}
                          >
                            {dep.relation}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          isDark ? "text-gray-400" : "text-gray-500",
                        )}
                      >
                        DOB: {format(new Date(dep.dob), "MMM d, yyyy")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              <Button
                className={
                  isDark
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-cyan-600 hover:bg-cyan-700 text-white"
                }
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Dependent
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TameeniPage;
