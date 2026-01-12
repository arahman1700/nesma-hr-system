import React, { useState, useMemo } from "react";
import {
  Clock,
  Calendar,
  Users,
  Plus,
  Download,
  Filter,
  Search,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CheckCircle,
  AlertCircle,
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
import { shifts, shiftAssignments, employees, locations } from "../../../data";
import { cn } from "../../../utils/cn";
import {
  format,
  addDays,
  startOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

const shiftIcons: Record<string, React.ReactNode> = {
  Morning: <Sunrise className="w-5 h-5" />,
  Day: <Sun className="w-5 h-5" />,
  Evening: <Sunset className="w-5 h-5" />,
  Night: <Moon className="w-5 h-5" />,
  Flexible: <Clock className="w-5 h-5" />,
  Remote: <Users className="w-5 h-5" />,
};

export const ShiftsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("shifts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<(typeof shifts)[0] | null>(
    null,
  );
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date()),
  );

  // Get week days
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: addDays(currentWeekStart, 6),
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const totalShifts = shifts.length;
    const totalAssignments = shiftAssignments.length;
    const avgWorkHours =
      shifts.reduce((acc, s) => acc + s.workHours, 0) / shifts.length;
    const employeesWithShifts = new Set(
      shiftAssignments.map((a) => a.employeeId),
    ).size;
    return {
      totalShifts,
      totalAssignments,
      avgWorkHours: avgWorkHours.toFixed(1),
      employeesWithShifts,
    };
  }, []);

  // Filter shifts
  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const matchesSearch = shift.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLocation =
        selectedLocation === "all" || shift.locationId === selectedLocation;
      return matchesSearch && matchesLocation;
    });
  }, [searchQuery, selectedLocation]);

  // Get assignments for schedule view
  const getAssignmentsForDay = (date: Date, employeeId: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return shiftAssignments.find(
      (a) => a.date === dateStr && a.employeeId === employeeId,
    );
  };

  const tabs = [
    { id: "shifts", label: "Shift Types", icon: <Clock className="w-4 h-4" /> },
    {
      id: "schedule",
      label: "Weekly Schedule",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const shiftColumns = [
    {
      key: "name",
      label: "Shift Name",
      sortable: true,
      render: (shift: (typeof shifts)[0]) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${shift.color}20` }}
          >
            <span style={{ color: shift.color }}>
              {shiftIcons[shift.name.split(" ")[0]] || (
                <Clock className="w-5 h-5" />
              )}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{shift.name}</p>
            {shift.nameAr && (
              <p className="text-xs text-gray-500">{shift.nameAr}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "timing",
      label: "Timing",
      render: (shift: (typeof shifts)[0]) => (
        <div>
          <p className="font-medium text-gray-800">
            {shift.startTime} - {shift.endTime}
          </p>
          <p className="text-xs text-gray-500">{shift.workHours} hours</p>
        </div>
      ),
    },
    {
      key: "break",
      label: "Break",
      render: (shift: (typeof shifts)[0]) => (
        <span className="text-sm text-gray-600">{shift.breakDuration} min</span>
      ),
    },
    {
      key: "allowance",
      label: "Allowance",
      render: (shift: (typeof shifts)[0]) => (
        <span className="text-sm font-medium text-gray-800">
          {shift.allowance > 0 ? `SAR ${shift.allowance}` : "-"}
        </span>
      ),
    },
    {
      key: "employees",
      label: "Assigned Employees",
      render: (shift: (typeof shifts)[0]) => {
        const assignedEmployees = employees.filter((e) =>
          shift.employees.includes(e.id),
        );
        return (
          <div className="flex items-center gap-2">
            <AvatarGroup
              users={assignedEmployees
                .slice(0, 4)
                .map((e) => ({ name: e.fullName }))}
              max={4}
              size="sm"
            />
            <span className="text-sm text-gray-500">
              {shift.employees.length} employees
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (shift: (typeof shifts)[0]) => (
        <Badge
          className={cn(
            shift.isDefault
              ? "bg-success-50 text-success-600"
              : "bg-gray-100 text-gray-600",
          )}
        >
          {shift.isDefault ? "Default" : "Custom"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (shift: (typeof shifts)[0]) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedShift(shift);
              setShowShiftModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 text-gray-500" />
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

  const assignmentColumns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (assignment: (typeof shiftAssignments)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar name={assignment.employeeName} size="sm" />
          <div>
            <p className="font-medium text-gray-800">
              {assignment.employeeName}
            </p>
            <p className="text-xs text-gray-500">
              {employees.find((e) => e.id === assignment.employeeId)?.position}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "shift",
      label: "Shift",
      sortable: true,
      render: (assignment: (typeof shiftAssignments)[0]) => {
        const shift = shifts.find((s) => s.id === assignment.shiftId);
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: shift?.color }}
            />
            <span className="text-sm text-gray-800">
              {assignment.shiftName}
            </span>
          </div>
        );
      },
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (assignment: (typeof shiftAssignments)[0]) => (
        <span className="text-sm text-gray-600">
          {format(new Date(assignment.date), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (assignment: (typeof shiftAssignments)[0]) => (
        <Badge
          className={cn(
            assignment.status === "Completed" &&
              "bg-success-50 text-success-600",
            assignment.status === "Scheduled" &&
              "bg-secondary-50 text-secondary-600",
            assignment.status === "Missed" && "bg-error-50 text-error-600",
          )}
        >
          <span className="flex items-center gap-1">
            {assignment.status === "Completed" && (
              <CheckCircle className="w-3 h-3" />
            )}
            {assignment.status === "Missed" && (
              <AlertCircle className="w-3 h-3" />
            )}
            {assignment.status}
          </span>
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shifts</h1>
          <p className="text-gray-500 mt-1">Manage work shifts and schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => {
              setSelectedShift(null);
              setShowShiftModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Shifts"
          value={stats.totalShifts}
          icon={<Clock className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Assignments"
          value={stats.totalAssignments}
          icon={<Calendar className="w-6 h-6" />}
          color="secondary"
        />
        <StatCard
          title="Avg Work Hours"
          value={`${stats.avgWorkHours}h`}
          icon={<Clock className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Employees Assigned"
          value={stats.employeesWithShifts}
          icon={<Users className="w-6 h-6" />}
          color="warning"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="modern" />

      {/* Shift Types Tab */}
      <TabPanel id="shifts" activeTab={activeTab}>
        <Card className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search shifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              options={[
                { value: "all", label: "All Locations" },
                ...locations.map((l) => ({ value: l.id, label: l.name })),
              ]}
              className="w-48"
            />
          </div>

          {/* Shifts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredShifts.map((shift) => {
              const assignedEmployees = employees.filter((e) =>
                shift.employees.includes(e.id),
              );
              return (
                <div
                  key={shift.id}
                  className="p-4 border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                  style={{
                    borderLeftColor: shift.color,
                    borderLeftWidth: "4px",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${shift.color}20` }}
                      >
                        <span style={{ color: shift.color }}>
                          {shiftIcons[shift.name.split(" ")[0]] || (
                            <Clock className="w-5 h-5" />
                          )}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {shift.name}
                        </h3>
                        {shift.isDefault && (
                          <Badge className="bg-success-50 text-success-600 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Time</span>
                      <span className="font-medium text-gray-800">
                        {shift.startTime} - {shift.endTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Work Hours</span>
                      <span className="font-medium text-gray-800">
                        {shift.workHours}h
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Break</span>
                      <span className="font-medium text-gray-800">
                        {shift.breakDuration} min
                      </span>
                    </div>
                    {shift.allowance > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Allowance</span>
                        <span className="font-medium text-success-600">
                          SAR {shift.allowance}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <AvatarGroup
                      users={assignedEmployees
                        .slice(0, 5)
                        .map((e) => ({ name: e.fullName }))}
                      max={5}
                      size="xs"
                    />
                    <span className="text-xs text-gray-500">
                      {shift.employees.length} employees
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </TabPanel>

      {/* Weekly Schedule Tab */}
      <TabPanel id="schedule" activeTab={activeTab}>
        <Card className="p-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentWeekStart(addDays(currentWeekStart, -7))
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-800">
                {format(currentWeekStart, "MMM d")} -{" "}
                {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
              </h3>
              <button
                onClick={() =>
                  setCurrentWeekStart(addDays(currentWeekStart, 7))
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <Button onClick={() => setShowAssignModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Assign Shift
            </Button>
          </div>

          {/* Schedule Grid */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 w-48">
                    Employee
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.toISOString()}
                      className={cn(
                        "text-center py-3 px-2 font-semibold text-gray-600",
                        isSameDay(day, new Date()) &&
                          "bg-primary-light rounded-t-lg",
                      )}
                    >
                      <div className="text-xs text-gray-500">
                        {format(day, "EEE")}
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          isSameDay(day, new Date()) && "text-primary",
                        )}
                      >
                        {format(day, "d")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 10).map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={employee.fullName} size="sm" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {employee.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {employee.position}
                          </p>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day) => {
                      const assignment = getAssignmentsForDay(day, employee.id);
                      const shift = assignment
                        ? shifts.find((s) => s.id === assignment.shiftId)
                        : null;
                      return (
                        <td
                          key={day.toISOString()}
                          className={cn(
                            "py-3 px-2 text-center",
                            isSameDay(day, new Date()) && "bg-primary-light/50",
                          )}
                        >
                          {shift ? (
                            <div
                              className="px-2 py-1 rounded-lg text-xs font-medium mx-auto max-w-[80px]"
                              style={{
                                backgroundColor: `${shift.color}20`,
                                color: shift.color,
                              }}
                            >
                              {shift.name.split(" ")[0]}
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shift Legend */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Shifts:</span>
            {shifts.map((shift) => (
              <div key={shift.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: shift.color }}
                />
                <span className="text-sm text-gray-600">{shift.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </TabPanel>

      {/* Assignments Tab */}
      <TabPanel id="assignments" activeTab={activeTab}>
        <Card className="p-6">
          <Table
            data={shiftAssignments}
            columns={assignmentColumns}
            searchable={true}
            searchPlaceholder="Search assignments..."
          />
        </Card>
      </TabPanel>

      {/* Add/Edit Shift Modal */}
      <Modal
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
        title={selectedShift ? "Edit Shift" : "Add New Shift"}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Shift Name (English)"
              placeholder="e.g., Morning Shift"
              defaultValue={selectedShift?.name}
            />
            <Input
              label="Shift Name (Arabic)"
              placeholder="e.g., الوردية الصباحية"
              defaultValue={selectedShift?.nameAr}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              defaultValue={selectedShift?.startTime}
            />
            <Input
              label="End Time"
              type="time"
              defaultValue={selectedShift?.endTime}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Break Duration (minutes)"
              type="number"
              defaultValue={selectedShift?.breakDuration?.toString()}
            />
            <Input
              label="Shift Allowance (SAR)"
              type="number"
              defaultValue={selectedShift?.allowance?.toString()}
            />
          </div>
          <Select
            label="Location"
            options={[
              { value: "", label: "All Locations" },
              ...locations.map((l) => ({ value: l.id, label: l.name })),
            ]}
            defaultValue={selectedShift?.locationId}
          />
          <Input
            label="Color"
            type="color"
            defaultValue={selectedShift?.color || "#5B4CCC"}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowShiftModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowShiftModal(false)}>
              {selectedShift ? "Update Shift" : "Create Shift"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign Shift Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Shift"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Employee"
            options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
          />
          <Select
            label="Shift"
            options={shifts.map((s) => ({ value: s.id, label: s.name }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="End Date" type="date" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAssignModal(false)}>
              Assign Shift
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShiftsPage;
