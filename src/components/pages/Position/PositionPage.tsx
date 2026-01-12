import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Plus,
  Download,
  Search,
  Edit,
  Trash2,
  Users,
  Building2,
  Eye,
  ChevronRight,
  Award,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card, StatCard } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Tabs, TabPanel } from "../../common/Tabs";
import { Avatar, AvatarGroup } from "../../common/Avatar";
import { Modal } from "../../common/Modal";
import { positions, employees, departments } from "../../../data";
import { cn } from "../../../utils/cn";

export const PositionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<
    (typeof positions)[0] | null
  >(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = positions.length;
    const filled = positions.filter((p) => p.employeeCount > 0).length;
    const vacant = positions.filter((p) => p.isVacant).length;
    const totalEmployees = positions.reduce(
      (acc, p) => acc + p.employeeCount,
      0,
    );
    return { total, filled, vacant, totalEmployees };
  }, []);

  // Filter positions
  const filteredPositions = useMemo(() => {
    return positions.filter((position) => {
      const matchesSearch = position.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "all" ||
        position.departmentId === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment]);

  // Group positions by department
  const positionsByDepartment = useMemo(() => {
    return departments
      .map((dept) => ({
        ...dept,
        positions: positions.filter((p) => p.departmentId === dept.id),
      }))
      .filter((d) => d.positions.length > 0);
  }, []);

  const tabs = [
    { id: "list", label: "List View", icon: <Briefcase className="w-4 h-4" /> },
    {
      id: "hierarchy",
      label: "Hierarchy",
      icon: <Building2 className="w-4 h-4" />,
    },
  ];

  const columns = [
    {
      key: "position",
      label: "Position",
      sortable: true,
      render: (position: (typeof positions)[0]) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${position.color}20` }}
          >
            <Briefcase className="w-5 h-5" style={{ color: position.color }} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{position.name}</p>
            {position.nameAr && (
              <p className="text-xs text-gray-500">{position.nameAr}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      render: (position: (typeof positions)[0]) => (
        <span className="text-sm text-gray-600">{position.departmentName}</span>
      ),
    },
    {
      key: "reportsTo",
      label: "Reports To",
      render: (position: (typeof positions)[0]) => (
        <span className="text-sm text-gray-600">
          {position.reportsToName || "-"}
        </span>
      ),
    },
    {
      key: "employees",
      label: "Employees",
      render: (position: (typeof positions)[0]) => {
        const positionEmployees = employees.filter(
          (e) => e.positionId === position.id,
        );
        return (
          <div className="flex items-center gap-2">
            {positionEmployees.length > 0 ? (
              <>
                <AvatarGroup
                  users={positionEmployees
                    .slice(0, 3)
                    .map((e) => ({ name: e.fullName }))}
                  max={3}
                  size="xs"
                />
                <span className="text-sm text-gray-600">
                  {position.employeeCount}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-400">No employees</span>
            )}
          </div>
        );
      },
    },
    {
      key: "salary",
      label: "Salary Range",
      render: (position: (typeof positions)[0]) =>
        position.salaryRange ? (
          <span className="text-sm text-gray-600">
            SAR {position.salaryRange.min.toLocaleString()} -{" "}
            {position.salaryRange.max.toLocaleString()}
          </span>
        ) : (
          <span className="text-sm text-gray-400">Not set</span>
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (position: (typeof positions)[0]) => (
        <Badge
          className={cn(
            position.isVacant
              ? "bg-warning-50 text-warning-600"
              : "bg-success-50 text-success-600",
          )}
        >
          {position.isVacant ? "Vacant" : "Filled"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (position: (typeof positions)[0]) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedPosition(position);
              setShowDetailModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => {
              setSelectedPosition(position);
              setShowPositionModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 hover:bg-error-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Positions</h1>
          <p className="text-gray-500 mt-1">
            Manage company positions and hierarchy
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => {
              setSelectedPosition(null);
              setShowPositionModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Position
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Positions"
          value={stats.total}
          icon={<Briefcase className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Filled Positions"
          value={stats.filled}
          icon={<Users className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Vacant Positions"
          value={stats.vacant}
          icon={<Award className="w-6 h-6" />}
          color="warning"
        />
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users className="w-6 h-6" />}
          color="secondary"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="modern" />

      {/* List View */}
      <TabPanel id="list" activeTab={activeTab}>
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              options={[
                { value: "all", label: "All Departments" },
                ...departments.map((d) => ({ value: d.id, label: d.name })),
              ]}
              className="w-48"
            />
          </div>

          <Table
            data={filteredPositions}
            columns={columns}
            searchable={false}
          />
        </Card>
      </TabPanel>

      {/* Hierarchy View */}
      <TabPanel id="hierarchy" activeTab={activeTab}>
        <div className="space-y-6">
          {positionsByDepartment.map((dept) => (
            <Card key={dept.id} className="p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${dept.color}20` }}
                >
                  <Building2
                    className="w-5 h-5"
                    style={{ color: dept.color }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                  <p className="text-sm text-gray-500">
                    {dept.positions.length} positions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dept.positions.map((position) => {
                  const positionEmployees = employees.filter(
                    (e) => e.positionId === position.id,
                  );
                  return (
                    <div
                      key={position.id}
                      className="p-4 border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedPosition(position);
                        setShowDetailModal(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${position.color}20` }}
                          >
                            <Briefcase
                              className="w-4 h-4"
                              style={{ color: position.color }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {position.name}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            position.isVacant
                              ? "bg-warning-50 text-warning-600"
                              : "bg-success-50 text-success-600",
                          )}
                        >
                          {position.isVacant ? "Vacant" : "Filled"}
                        </Badge>
                      </div>

                      {position.reportsToName && (
                        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          Reports to: {position.reportsToName}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {positionEmployees.length > 0 ? (
                          <AvatarGroup
                            users={positionEmployees
                              .slice(0, 4)
                              .map((e) => ({ name: e.fullName }))}
                            max={4}
                            size="xs"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            No employees
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {position.employeeCount}{" "}
                          {position.employeeCount === 1
                            ? "employee"
                            : "employees"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </TabPanel>

      {/* Add/Edit Position Modal */}
      <Modal
        isOpen={showPositionModal}
        onClose={() => setShowPositionModal(false)}
        title={selectedPosition ? "Edit Position" : "Add Position"}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Position Name (English)"
              placeholder="e.g., Software Engineer"
              defaultValue={selectedPosition?.name}
            />
            <Input
              label="Position Name (Arabic)"
              placeholder="e.g., مهندس برمجيات"
              defaultValue={selectedPosition?.nameAr}
            />
          </div>
          <Select
            label="Department"
            options={departments.map((d) => ({ value: d.id, label: d.name }))}
            defaultValue={selectedPosition?.departmentId}
          />
          <Select
            label="Reports To"
            options={[
              { value: "", label: "None" },
              ...positions.map((p) => ({ value: p.id, label: p.name })),
            ]}
            defaultValue={selectedPosition?.reportsTo}
          />
          <Select
            label="Permission Group"
            options={[
              { value: "admin", label: "Admin" },
              { value: "manager", label: "Manager" },
              { value: "supervisor", label: "Supervisor" },
              { value: "employee", label: "Employee" },
            ]}
            defaultValue={selectedPosition?.permissionGroup}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Salary (SAR)"
              type="number"
              placeholder="e.g., 5000"
              defaultValue={selectedPosition?.salaryRange?.min?.toString()}
            />
            <Input
              label="Max Salary (SAR)"
              type="number"
              placeholder="e.g., 15000"
              defaultValue={selectedPosition?.salaryRange?.max?.toString()}
            />
          </div>
          <Input
            label="Color"
            type="color"
            defaultValue={selectedPosition?.color || "#5B4CCC"}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Position description..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              rows={3}
              defaultValue={selectedPosition?.description}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPositionModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowPositionModal(false)}>
              {selectedPosition ? "Update Position" : "Create Position"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Position Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Position Details"
        size="lg"
      >
        {selectedPosition && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedPosition.color}20` }}
              >
                <Briefcase
                  className="w-8 h-8"
                  style={{ color: selectedPosition.color }}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedPosition.name}
                </h3>
                {selectedPosition.nameAr && (
                  <p className="text-gray-500">{selectedPosition.nameAr}</p>
                )}
                <p className="text-sm text-gray-500">
                  {selectedPosition.departmentName}
                </p>
              </div>
              <Badge
                className={cn(
                  "ml-auto",
                  selectedPosition.isVacant
                    ? "bg-warning-50 text-warning-600"
                    : "bg-success-50 text-success-600",
                )}
              >
                {selectedPosition.isVacant ? "Vacant" : "Filled"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Reports To</p>
                <p className="font-medium text-gray-800">
                  {selectedPosition.reportsToName || "None"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Permission Group</p>
                <p className="font-medium text-gray-800 capitalize">
                  {selectedPosition.permissionGroup}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Salary Range</p>
                <p className="font-medium text-gray-800">
                  {selectedPosition.salaryRange
                    ? `SAR ${selectedPosition.salaryRange.min.toLocaleString()} - ${selectedPosition.salaryRange.max.toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Employees</p>
                <p className="font-medium text-gray-800">
                  {selectedPosition.employeeCount}
                </p>
              </div>
            </div>

            {selectedPosition.description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700">{selectedPosition.description}</p>
              </div>
            )}

            {/* Employees in this position */}
            {(() => {
              const positionEmployees = employees.filter(
                (e) => e.positionId === selectedPosition.id,
              );
              return positionEmployees.length > 0 ? (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">
                    Current Employees
                  </h4>
                  <div className="space-y-2">
                    {positionEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Avatar name={emp.fullName} size="sm" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {emp.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {emp.department}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowPositionModal(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Position
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PositionPage;
