import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Grid,
  List,
  Plus,
  Download,
  Upload,
  Mail,
  Search,
  Filter,
  Building2,
  UserPlus,
  UserMinus,
  Activity,
  BarChart3,
  IdCard,
  Award,
  Briefcase,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Phone,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  ChevronRight,
  MoreHorizontal,
  Star,
} from "lucide-react";
import {
  Button,
  Card,
  Tabs,
  TabPanel,
  Avatar,
  Badge,
  StatusBadge,
  Input,
  Select,
  Table,
} from "../../common";
import { ColoredStatsCard, StatsGrid } from "../../common/ColoredStatsCard";
import {
  EnhancedStat,
  SkeletonCard,
  SkeletonTable,
  EnhancedAvatar,
  Tooltip,
  EmptyState,
  ProgressIndicator,
} from "../../common/EnhancedUI";
import {
  InteractiveStatCard,
  DetailModal,
  DataTable,
  SummaryStats,
} from "../../common/InteractiveCard";
import {
  ChartWrapper,
  EnhancedDonutChart,
  EnhancedBarChart,
  ProgressRing,
  TimelineChart,
} from "../../common/AdvancedCharts";
import {
  FilterBar,
  ActiveFilter,
  FilterConfig,
  FilterValue,
} from "../../common/FilterBar";
import {
  HRStatCard,
  EmployeeTypeCard,
  DemographicsCard,
  TenureCard,
  AttendanceRateCard,
} from "../../common/HRDashboardCards";
import { DataExportModal, ExportData } from "../../common/DataExportModal";
import { EmployeeDetailModal } from "../../common/EmployeeDetailModal";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
import { employees, departments, positions } from "../../../data";
import { Employee } from "../../../types";
import { format, differenceInYears } from "date-fns";

// Enhanced Employee Card Component
const EmployeeCard: React.FC<{
  employee: Employee;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ employee, onClick, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";
  const [showMenu, setShowMenu] = useState(false);

  const tenure = differenceInYears(new Date(), new Date(employee.hireDate));

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative p-5 rounded-2xl cursor-pointer group transition-all duration-300",
        isGlass
          ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1] hover:border-white/[0.2]"
          : isDark
            ? "bg-gray-800/80 border border-gray-700 hover:border-gray-600"
            : "bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg"
      )}
      onClick={onClick}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute top-4 right-4 w-3 h-3 rounded-full",
          employee.status === "Active"
            ? "bg-emerald-500"
            : employee.status === "On Leave"
              ? "bg-amber-500"
              : "bg-gray-400"
        )}
      />

      {/* Menu button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={cn(
          "absolute top-4 right-10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
          isGlass
            ? "hover:bg-white/10"
            : isDark
              ? "hover:bg-gray-700"
              : "hover:bg-gray-100"
        )}
      >
        <MoreHorizontal
          className={cn(
            "w-4 h-4",
            isGlass || isDark ? "text-white/60" : "text-gray-400"
          )}
        />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "absolute top-12 right-4 z-10 min-w-[140px] py-1 rounded-lg shadow-lg",
              isGlass
                ? "bg-gray-900/90 backdrop-blur-xl border border-white/10"
                : isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2",
                isGlass
                  ? "text-white/80 hover:bg-white/10"
                  : isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => {
                onClick();
                setShowMenu(false);
              }}
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2",
                isGlass
                  ? "text-white/80 hover:bg-white/10"
                  : isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => {
                onEdit?.();
                setShowMenu(false);
              }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-rose-500 hover:bg-rose-500/10"
              )}
              onClick={() => {
                onDelete?.();
                setShowMenu(false);
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee info */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={employee.photo}
            alt={employee.fullName}
            className="w-16 h-16 rounded-xl object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-semibold truncate",
              isGlass || isDark ? "text-white" : "text-gray-800"
            )}
          >
            {employee.fullName}
          </h3>
          <p
            className={cn(
              "text-sm truncate",
              isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
            )}
          >
            {employee.position}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={employee.employmentType === "Full-time" ? "primary" : "default"}
              size="sm"
            >
              {employee.employmentType}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className={cn(
          "mt-4 pt-4 grid grid-cols-3 gap-4 border-t",
          isGlass
            ? "border-white/10"
            : isDark
              ? "border-gray-700"
              : "border-gray-100"
        )}
      >
        <div className="text-center">
          <p
            className={cn(
              "text-lg font-bold",
              isDark ? "text-[#80D1E9]" : "text-[#2E3192]"
            )}
          >
            {tenure}y
          </p>
          <p
            className={cn(
              "text-xs",
              isGlass ? "text-white/50" : isDark ? "text-gray-500" : "text-gray-400"
            )}
          >
            Tenure
          </p>
        </div>
        <div className="text-center">
          <p
            className={cn(
              "text-lg font-bold",
              isDark ? "text-emerald-400" : "text-emerald-500"
            )}
          >
            96%
          </p>
          <p
            className={cn(
              "text-xs",
              isGlass ? "text-white/50" : isDark ? "text-gray-500" : "text-gray-400"
            )}
          >
            Attendance
          </p>
        </div>
        <div className="text-center">
          <p
            className={cn(
              "text-lg font-bold",
              isDark ? "text-amber-400" : "text-amber-500"
            )}
          >
            4.2
          </p>
          <p
            className={cn(
              "text-xs",
              isGlass ? "text-white/50" : isDark ? "text-gray-500" : "text-gray-400"
            )}
          >
            Rating
          </p>
        </div>
      </div>

      {/* Quick contact */}
      <div
        className={cn(
          "mt-4 pt-4 flex items-center justify-between border-t",
          isGlass
            ? "border-white/10"
            : isDark
              ? "border-gray-700"
              : "border-gray-100"
        )}
      >
        <div className="flex items-center gap-2">
          <Mail className={cn("w-4 h-4", isDark ? "text-gray-500" : "text-gray-400")} />
          <span
            className={cn(
              "text-xs truncate max-w-[120px]",
              isGlass ? "text-white/50" : isDark ? "text-gray-500" : "text-gray-400"
            )}
          >
            {employee.email}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip content="Call" position="top">
            <button
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isGlass
                  ? "hover:bg-white/10"
                  : isDark
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
              )}
            >
              <Phone
                className={cn(
                  "w-4 h-4",
                  isDark ? "text-emerald-400" : "text-emerald-500"
                )}
              />
            </button>
          </Tooltip>
          <Tooltip content="Email" position="top">
            <button
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isGlass
                  ? "hover:bg-white/10"
                  : isDark
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
              )}
            >
              <Mail
                className={cn(
                  "w-4 h-4",
                  isDark ? "text-blue-400" : "text-blue-500"
                )}
              />
            </button>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
};

// Team Tab Component
const TeamTab: React.FC<{
  employees: Employee[];
  onEmployeeClick: (emp: Employee) => void;
  statusFilter?: string;
  departmentFilter?: string;
  typeFilter?: string;
  searchQuery?: string;
}> = ({
  employees: empList,
  onEmployeeClick,
  statusFilter = "all",
  departmentFilter = "all",
  typeFilter = "all",
  searchQuery = ""
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredEmployees = empList.filter((emp) => {
    const matchesStatus =
      statusFilter === "all" ||
      emp.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDepartment =
      departmentFilter === "all" || emp.department === departmentFilter;
    const matchesType =
      typeFilter === "all" || emp.employmentType === typeFilter;
    const matchesSearch =
      !searchQuery ||
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesDepartment && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-sm",
            isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
          )}
        >
          Showing {filteredEmployees.length} of {empList.length} employees
        </p>
        <div
          className={cn(
            "flex items-center gap-1 p-1 rounded-lg",
            isGlass ? "bg-white/10" : isDark ? "bg-gray-700" : "bg-gray-100"
          )}
        >
          <Tooltip content="Grid View" position="top">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                viewMode === "grid"
                  ? isGlass
                    ? "bg-white/20 shadow-sm"
                    : isDark
                      ? "bg-gray-600 shadow-sm"
                      : "bg-white shadow-sm"
                  : isGlass
                    ? "hover:bg-white/10"
                    : isDark
                      ? "hover:bg-gray-600"
                      : "hover:bg-gray-200"
              )}
            >
              <Grid
                className={cn(
                  "w-4 h-4 transition-colors",
                  viewMode === "grid"
                    ? "text-[#2E3192]"
                    : isGlass || isDark
                      ? "text-white/70"
                      : "text-gray-500"
                )}
              />
            </button>
          </Tooltip>
          <Tooltip content="List View" position="top">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                viewMode === "list"
                  ? isGlass
                    ? "bg-white/20 shadow-sm"
                    : isDark
                      ? "bg-gray-600 shadow-sm"
                      : "bg-white shadow-sm"
                  : isGlass
                    ? "hover:bg-white/10"
                    : isDark
                      ? "hover:bg-gray-600"
                      : "hover:bg-gray-200"
              )}
            >
              <List
                className={cn(
                  "w-4 h-4 transition-colors",
                  viewMode === "list"
                    ? "text-[#2E3192]"
                    : isGlass || isDark
                      ? "text-white/70"
                      : "text-gray-500"
                )}
              />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No employees found"
          description="Try adjusting your search or filter criteria using the filter bar above"
        />
      ) : viewMode === "grid" ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredEmployees.map((emp) => (
            <motion.div
              key={emp.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <EmployeeCard
                employee={emp}
                onClick={() => onEmployeeClick(emp)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Table
          columns={[
            {
              key: "fullName",
              label: "Employee",
              sortable: true,
              render: (row: Employee) => (
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onEmployeeClick(row)}
                >
                  <EnhancedAvatar
                    src={row.photo}
                    name={row.fullName}
                    size="md"
                    status={
                      row.status === "Active"
                        ? "online"
                        : row.status === "On Leave"
                          ? "away"
                          : "offline"
                    }
                  />
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        isDark ? "text-white" : "text-gray-800"
                      )}
                    >
                      {row.fullName}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isDark ? "text-gray-500" : "text-gray-400"
                      )}
                    >
                      {row.employeeId}
                    </p>
                  </div>
                </div>
              ),
            },
            { key: "position", label: "Position", sortable: true },
            { key: "department", label: "Department", sortable: true },
            { key: "email", label: "Email" },
            {
              key: "status",
              label: "Status",
              render: (row: Employee) => (
                <StatusBadge status={row.status} size="sm" />
              ),
            },
            {
              key: "actions",
              label: "Actions",
              render: (row: Employee) => (
                <div className="flex gap-1">
                  <Tooltip content="View Details" position="top">
                    <button
                      onClick={() => onEmployeeClick(row)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isGlass
                          ? "hover:bg-white/10 text-[#80D1E9]"
                          : isDark
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-100 text-gray-500"
                      )}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Edit" position="top">
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isGlass
                          ? "hover:bg-white/10 text-[#80D1E9]"
                          : isDark
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-100 text-gray-500"
                      )}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete" position="top">
                    <button className="p-2 rounded-lg transition-colors hover:bg-rose-500/10 text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              ),
            },
          ]}
          data={filteredEmployees}
          keyField="id"
          pagination
          pageSize={10}
          searchable={false}
        />
      )}
    </div>
  );
};

// Org Chart Tab
const OrgChartTab: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";

  return (
    <Card>
      <div className="text-center py-12">
        <Building2
          className={cn(
            "w-16 h-16 mx-auto mb-4",
            isDark ? "text-gray-600" : "text-gray-300"
          )}
        />
        <h3
          className={cn(
            "text-lg font-semibold",
            isDark ? "text-white" : "text-gray-800"
          )}
        >
          Organization Chart
        </h3>
        <p className={isDark ? "text-gray-400" : "text-gray-500"}>
          Interactive organization chart coming soon
        </p>
        <Button variant="primary" className="mt-4">
          View Full Chart
        </Button>
      </div>
    </Card>
  );
};

// Performance Tab with Charts
const PerformanceTab: React.FC<{ employees: Employee[] }> = ({ employees: empList }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const performanceData = [
    { name: "Excellent", value: 15, color: "#10B981" },
    { name: "Good", value: 35, color: "#2E3192" },
    { name: "Average", value: 20, color: "#F59E0B" },
    { name: "Needs Improvement", value: 8, color: "#EF4444" },
  ];

  const monthlyPerformance = [
    { name: "Jan", score: 82 },
    { name: "Feb", score: 85 },
    { name: "Mar", score: 78 },
    { name: "Apr", score: 88 },
    { name: "May", score: 92 },
    { name: "Jun", score: 89 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InteractiveStatCard
          title="Top Performers"
          value={15}
          icon={<Star className="w-5 h-5" />}
          color="green"
          sparkline={[10, 12, 11, 14, 15, 15]}
        />
        <InteractiveStatCard
          title="Average Score"
          value="4.2/5"
          icon={<Target className="w-5 h-5" />}
          color="blue"
        />
        <InteractiveStatCard
          title="Reviews Due"
          value={8}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
          trend={{ value: 3, isPositive: false, label: "this week" }}
        />
        <InteractiveStatCard
          title="Goals Met"
          value="78%"
          icon={<Award className="w-5 h-5" />}
          color="purple"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper
          title="Performance Distribution"
          subtitle="Employee performance ratings"
        >
          <EnhancedDonutChart
            data={performanceData}
            height={280}
            innerRadius={50}
            outerRadius={90}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Performance Trend"
          subtitle="Average score over time"
        >
          <EnhancedBarChart
            data={monthlyPerformance}
            dataKeys={[{ key: "score", color: "#2E3192", name: "Score" }]}
            height={250}
            showLegend={false}
          />
        </ChartWrapper>
      </div>

      {/* Top Performers List */}
      <div
        className={cn(
          "p-6 rounded-2xl",
          isGlass
            ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]"
            : isDark
              ? "bg-gray-800/80 border border-gray-700"
              : "bg-white border border-gray-100 shadow-sm"
        )}
      >
        <h3
          className={cn(
            "text-lg font-semibold mb-4",
            isGlass || isDark ? "text-white" : "text-gray-800"
          )}
        >
          Top Performers This Month
        </h3>
        <div className="space-y-3">
          {empList.slice(0, 5).map((emp, index) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl",
                isGlass
                  ? "bg-white/[0.03] border border-white/[0.08]"
                  : isDark
                    ? "bg-gray-700/50 border border-gray-600"
                    : "bg-gray-50 border border-gray-100"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                    index === 0
                      ? "bg-amber-500 text-white"
                      : index === 1
                        ? "bg-gray-400 text-white"
                        : index === 2
                          ? "bg-amber-700 text-white"
                          : isDark
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-600"
                  )}
                >
                  {index + 1}
                </div>
                <EnhancedAvatar src={emp.photo} name={emp.fullName} size="md" />
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isGlass || isDark ? "text-white" : "text-gray-800"
                    )}
                  >
                    {emp.fullName}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isGlass
                        ? "text-white/60"
                        : isDark
                          ? "text-gray-400"
                          : "text-gray-500"
                    )}
                  >
                    {emp.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          star <= 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <p
                    className={cn(
                      "text-sm mt-1",
                      isGlass
                        ? "text-white/60"
                        : isDark
                          ? "text-gray-400"
                          : "text-gray-500"
                    )}
                  >
                    {(4.5 - index * 0.1).toFixed(1)} rating
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "w-5 h-5",
                    isDark ? "text-gray-600" : "text-gray-300"
                  )}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Employees Page
const EmployeesPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [activeTab, setActiveTab] = useState("team");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Extract filter values from activeFilters
  const getFilterValue = (filterId: string): string => {
    const filter = activeFilters.find(f => f.filterId === filterId);
    return filter ? String(filter.value) : "all";
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle employee click
  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  // Calculate stats
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const onLeave = employees.filter((e) => e.status === "On Leave").length;
  const newHires = employees.filter((e) => {
    const hireDate = new Date(e.hireDate);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return hireDate > monthAgo;
  }).length;

  // Calculate detailed stats
  const fullTimeCount = employees.filter((e) => e.employmentType === "Full-time").length;
  const partTimeCount = employees.filter((e) => e.employmentType === "Part-time").length;
  const contractorCount = employees.filter((e) => e.employmentType === "Contractor").length;

  // Department distribution
  const departmentData = departments.map((dept) => ({
    name: dept.name,
    value: employees.filter((e) => e.department === dept.name).length,
    color: ["#2E3192", "#80D1E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][
      departments.indexOf(dept) % 6
    ],
  }));

  // Filter configuration
  const filterConfigs: FilterConfig[] = [
    {
      id: "department",
      label: "Department",
      type: "select",
      placeholder: "All Departments",
      options: departments.map((d) => ({
        value: d.name,
        label: d.name,
        count: employees.filter((e) => e.department === d.name).length,
      })),
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      placeholder: "All Statuses",
      options: [
        { value: "Active", label: "Active", count: activeEmployees },
        { value: "On Leave", label: "On Leave", count: onLeave },
        {
          value: "Inactive",
          label: "Inactive",
          count: employees.length - activeEmployees - onLeave,
        },
      ],
    },
    {
      id: "type",
      label: "Type",
      type: "select",
      placeholder: "All Types",
      options: [
        { value: "Full-time", label: "Full-time", count: fullTimeCount },
        { value: "Part-time", label: "Part-time", count: partTimeCount },
        { value: "Contractor", label: "Contractor", count: contractorCount },
      ],
    },
  ];

  const handleFilterChange = useCallback(
    (filterId: string, value: FilterValue) => {
      if (value === null) {
        setActiveFilters((prev) => prev.filter((f) => f.filterId !== filterId));
      } else {
        const config = filterConfigs.find((c) => c.id === filterId);
        const displayValue = Array.isArray(value)
          ? value.join(", ")
          : typeof value === "object"
            ? JSON.stringify(value)
            : String(value);
        const option = config?.options?.find((o) => o.value === displayValue);

        setActiveFilters((prev) => {
          const existing = prev.find((f) => f.filterId === filterId);
          if (existing) {
            return prev.map((f) =>
              f.filterId === filterId
                ? { ...f, value, label: option?.label || config?.label || filterId }
                : f
            );
          }
          return [
            ...prev,
            { filterId, value, label: option?.label || config?.label || filterId },
          ];
        });
      }
    },
    [filterConfigs]
  );

  const handleClearFilter = useCallback((filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.filterId !== filterId));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  const tabs = [
    { id: "team", label: "Team", badge: employees.length },
    { id: "org-chart", label: "Org Chart" },
    { id: "performance", label: "Performance", icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              isGlass || isDark ? "text-white" : "text-gray-800"
            )}
          >
            Employees
          </h1>
          <p
            className={cn(
              isGlass ? "text-white/60" : isDark ? "text-gray-400" : "text-gray-500"
            )}
          >
            Manage your organization's workforce
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
            Import
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>Add Employee</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <InteractiveStatCard
              title="Total Employees"
              value={employees.length}
              icon={<Users className="w-5 h-5" />}
              color="blue"
              trend={{ value: 5, isPositive: true, label: "vs last month" }}
              sparkline={[65, 68, 72, 70, 75, 78, 80]}
            />
            <InteractiveStatCard
              title="Active"
              value={activeEmployees}
              icon={<Activity className="w-5 h-5" />}
              color="green"
              trend={{
                value: Math.round((activeEmployees / employees.length) * 100),
                isPositive: true,
                label: "rate",
              }}
              sparkline={[60, 62, 65, 68, 70, 72, 75]}
            />
            <InteractiveStatCard
              title="New Hires"
              value={newHires}
              icon={<UserPlus className="w-5 h-5" />}
              color="purple"
              sparkline={[2, 3, 1, 4, 2, 3, 5]}
            />
            <InteractiveStatCard
              title="Departments"
              value={departments.length}
              icon={<Building2 className="w-5 h-5" />}
              color="amber"
            />
          </>
        )}
      </div>

      {/* HR Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EmployeeTypeCard
          fullTime={fullTimeCount}
          partTime={partTimeCount}
          contractors={contractorCount}
          interns={0}
        />
        <DemographicsCard
          maleCount={Math.round(employees.length * 0.65)}
          femaleCount={Math.round(employees.length * 0.35)}
          averageAge={32}
        />
        <TenureCard
          averageTenure={3.5}
          under1Year={15}
          oneToThreeYears={35}
          threeToFiveYears={25}
          overFiveYears={25}
        />
        <AttendanceRateCard rate={94} present={72} absent={3} late={5} />
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
        onClearAll={() => {
          handleClearAllFilters();
          setSearchQuery("");
        }}
        searchPlaceholder="Search employees..."
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="modern"
      />

      {/* Tab Panels */}
      <TabPanel id="team" activeTab={activeTab}>
        <TeamTab
          employees={employees}
          onEmployeeClick={handleEmployeeClick}
          statusFilter={getFilterValue("status")}
          departmentFilter={getFilterValue("department")}
          typeFilter={getFilterValue("type")}
          searchQuery={searchQuery}
        />
      </TabPanel>
      <TabPanel id="org-chart" activeTab={activeTab}>
        <OrgChartTab />
      </TabPanel>
      <TabPanel id="performance" activeTab={activeTab}>
        <PerformanceTab employees={employees} />
      </TabPanel>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          isOpen={showEmployeeModal}
          onClose={() => {
            setShowEmployeeModal(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onEdit={(emp) => console.log("Edit employee:", emp)}
        />
      )}

      {/* Data Export Modal */}
      {exportData && (
        <DataExportModal
          isOpen={showExportModal}
          onClose={() => {
            setShowExportModal(false);
            setExportData(null);
          }}
          data={exportData}
          onExport={(format, data) => {
            console.log("Exporting:", format, data);
          }}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
