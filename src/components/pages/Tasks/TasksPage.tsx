import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  Calendar,
  Users,
  MoreVertical,
  ChevronRight,
  Flag,
  CheckCircle,
  Circle,
  Pause,
  Archive,
  MessageSquare,
  Paperclip,
  Grid,
  List,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card, StatCard } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge, PriorityBadge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Tabs, TabPanel } from "../../common/Tabs";
import { Avatar } from "../../common/Avatar";
import { Modal } from "../../common/Modal";
import { tasks, employees } from "../../../data";
import { cn } from "../../../utils/cn";
import { format, isPast, isToday } from "date-fns";

type TaskStatus =
  | "To Do"
  | "In Progress"
  | "In Review"
  | "Blocked"
  | "Done"
  | "Archived";
type ViewType = "board" | "list";

const statusConfig: Record<
  TaskStatus,
  { color: string; bgColor: string; icon: React.ReactNode }
> = {
  "To Do": {
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: <Circle className="w-4 h-4" />,
  },
  "In Progress": {
    color: "text-secondary-600",
    bgColor: "bg-secondary-50",
    icon: <Clock className="w-4 h-4" />,
  },
  "In Review": {
    color: "text-warning-600",
    bgColor: "bg-warning-50",
    icon: <Eye className="w-4 h-4" />,
  },
  Blocked: {
    color: "text-error-600",
    bgColor: "bg-error-50",
    icon: <Pause className="w-4 h-4" />,
  },
  Done: {
    color: "text-success-600",
    bgColor: "bg-success-50",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  Archived: {
    color: "text-gray-400",
    bgColor: "bg-gray-50",
    icon: <Archive className="w-4 h-4" />,
  },
};

const priorityColors = {
  Low: "text-gray-500",
  Medium: "text-warning-500",
  High: "text-orange-500",
  Urgent: "text-error-500",
};

export const TasksPage: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[0] | null>(
    null,
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const todo = tasks.filter((t) => t.status === "To Do").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const inReview = tasks.filter((t) => t.status === "In Review").length;
    const done = tasks.filter((t) => t.status === "Done").length;
    const overdue = tasks.filter(
      (t) => isPast(new Date(t.dueDate)) && t.status !== "Done",
    ).length;
    return { todo, inProgress, inReview, done, overdue };
  }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || task.status === selectedStatus;
      const matchesPriority =
        selectedPriority === "all" || task.priority === selectedPriority;
      const matchesAssignee =
        selectedAssignee === "all" || task.assignedTo === selectedAssignee;
      return (
        matchesSearch && matchesStatus && matchesPriority && matchesAssignee
      );
    });
  }, [searchQuery, selectedStatus, selectedPriority, selectedAssignee]);

  // Group tasks by status for board view
  const tasksByStatus = useMemo(() => {
    const statuses: TaskStatus[] = [
      "To Do",
      "In Progress",
      "In Review",
      "Done",
    ];
    return statuses.reduce(
      (acc, status) => {
        acc[status] = filteredTasks.filter((t) => t.status === status);
        return acc;
      },
      {} as Record<TaskStatus, typeof tasks>,
    );
  }, [filteredTasks]);

  const columns = [
    {
      key: "task",
      label: "Task",
      sortable: true,
      render: (task: (typeof tasks)[0]) => (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-1.5 rounded",
              statusConfig[task.status as TaskStatus].bgColor,
            )}
          >
            <span className={statusConfig[task.status as TaskStatus].color}>
              {statusConfig[task.status as TaskStatus].icon}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{task.title}</p>
            <p className="text-xs text-gray-500 truncate max-w-[250px]">
              {task.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "assignee",
      label: "Assignee",
      sortable: true,
      render: (task: (typeof tasks)[0]) => (
        <div className="flex items-center gap-2">
          <Avatar name={task.assignedToName} size="sm" />
          <span className="text-sm text-gray-600">{task.assignedToName}</span>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (task: (typeof tasks)[0]) => (
        <PriorityBadge priority={task.priority as any} />
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (task: (typeof tasks)[0]) => {
        const isOverdue =
          isPast(new Date(task.dueDate)) && task.status !== "Done";
        const isDueToday = isToday(new Date(task.dueDate));
        return (
          <div
            className={cn(
              "flex items-center gap-2",
              isOverdue && "text-error-600",
              isDueToday && "text-warning-600",
            )}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </span>
          </div>
        );
      },
    },
    {
      key: "progress",
      label: "Progress",
      render: (task: (typeof tasks)[0]) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[80px]">
            <div
              className={cn(
                "h-2 rounded-full",
                task.progress === 100 ? "bg-success" : "bg-primary",
              )}
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{task.progress}%</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (task: (typeof tasks)[0]) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedTask(task);
              setShowDetailModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button
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

  const TaskCard: React.FC<{ task: (typeof tasks)[0] }> = ({ task }) => {
    const isOverdue = isPast(new Date(task.dueDate)) && task.status !== "Done";
    return (
      <div
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
        onClick={() => {
          setSelectedTask(task);
          setShowDetailModal(true);
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <PriorityBadge priority={task.priority as any} />
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <h4 className="font-medium text-gray-800 mb-2">{task.title}</h4>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full",
                task.progress === 100 ? "bg-success" : "bg-primary",
              )}
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{task.progress}%</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Avatar name={task.assignedToName} size="xs" />
            <span className="text-xs text-gray-500">
              {task.assignedToName.split(" ")[0]}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-error-600" : "text-gray-500",
            )}
          >
            <Calendar className="w-3 h-3" />
            {format(new Date(task.dueDate), "MMM d")}
          </div>
        </div>

        {/* Tags & Attachments */}
        {(task.tags?.length ||
          task.attachments?.length ||
          task.comments?.length) && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            {task.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600"
              >
                {tag}
              </span>
            ))}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Paperclip className="w-3 h-3" />
                {task.attachments.length}
              </div>
            )}
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MessageSquare className="w-3 h-3" />
                {task.comments.length}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-500 mt-1">Track and manage team tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewType("board")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewType === "board" ? "bg-white shadow-sm" : "text-gray-600",
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewType === "list" ? "bg-white shadow-sm" : "text-gray-600",
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowTaskModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="To Do"
          value={stats.todo}
          icon={<Circle className="w-6 h-6" />}
          color="secondary"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<Clock className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="In Review"
          value={stats.inReview}
          icon={<Eye className="w-6 h-6" />}
          color="warning"
        />
        <StatCard
          title="Completed"
          value={stats.done}
          icon={<CheckCircle className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={<AlertCircle className="w-6 h-6" />}
          color="error"
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: "all", label: "All Status" },
                { value: "To Do", label: "To Do" },
                { value: "In Progress", label: "In Progress" },
                { value: "In Review", label: "In Review" },
                { value: "Done", label: "Done" },
                { value: "Blocked", label: "Blocked" },
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
            <Select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              options={[
                { value: "all", label: "All Assignees" },
                ...employees
                  .slice(0, 10)
                  .map((e) => ({ value: e.id, label: e.fullName })),
              ]}
              className="w-44"
            />
          </div>
        </div>
      </Card>

      {/* Board View */}
      {viewType === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
            const config = statusConfig[status as TaskStatus];
            return (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded", config.bgColor)}>
                      <span className={config.color}>{config.icon}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{status}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                      {statusTasks.length}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  {statusTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {statusTasks.length === 0 && (
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center text-sm text-gray-500">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewType === "list" && (
        <Card className="p-6">
          <Table data={filteredTasks} columns={columns} searchable={false} />
        </Card>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Add New Task"
        size="md"
      >
        <div className="space-y-4">
          <Input label="Task Title" placeholder="Enter task title..." />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Enter task description..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assignee"
              options={employees
                .slice(0, 10)
                .map((e) => ({ value: e.id, label: e.fullName }))}
            />
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="Due Date" type="date" />
          </div>
          <Select
            label="Status"
            options={[
              { value: "To Do", label: "To Do" },
              { value: "In Progress", label: "In Progress" },
              { value: "In Review", label: "In Review" },
            ]}
            defaultValue="To Do"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowTaskModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowTaskModal(false)}>Create Task</Button>
          </div>
        </div>
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Task Details"
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <PriorityBadge priority={selectedTask.priority as any} />
                  <Badge
                    className={cn(
                      statusConfig[selectedTask.status as TaskStatus].bgColor,
                      statusConfig[selectedTask.status as TaskStatus].color,
                    )}
                  >
                    {selectedTask.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedTask.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{selectedTask.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Assigned To</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar name={selectedTask.assignedToName} size="sm" />
                  <span className="font-medium text-gray-800">
                    {selectedTask.assignedToName}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Assigned By</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar name={selectedTask.assignedByName} size="sm" />
                  <span className="font-medium text-gray-800">
                    {selectedTask.assignedByName}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(selectedTask.dueDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        selectedTask.progress === 100
                          ? "bg-success"
                          : "bg-primary",
                      )}
                      style={{ width: `${selectedTask.progress}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-800">
                    {selectedTask.progress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            {selectedTask.checklist && selectedTask.checklist.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Checklist</h4>
                <div className="space-y-2">
                  {selectedTask.checklist.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg",
                        item.completed ? "bg-success-50" : "bg-gray-50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center",
                          item.completed
                            ? "bg-success border-success text-white"
                            : "border-gray-300",
                        )}
                      >
                        {item.completed && <CheckCircle className="w-3 h-3" />}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          item.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-700",
                        )}
                      >
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedTask.tags && selectedTask.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Task
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TasksPage;
