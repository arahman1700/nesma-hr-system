import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Award,
  Briefcase,
  User,
  Edit,
  Download,
  Share2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Star,
  Target,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";
import { Employee } from "../../types";
import { format, differenceInDays, differenceInYears } from "date-fns";
import { ProgressRing } from "./AdvancedCharts";
import { Badge, StatusBadge } from "./Badge";
import { Avatar } from "./Avatar";

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onEdit?: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate tenure
  const hireDate = new Date(employee.hireDate);
  const tenure = differenceInYears(new Date(), hireDate);
  const tenureMonths = Math.floor(
    (differenceInDays(new Date(), hireDate) % 365) / 30
  );

  // Calculate document expiry days
  const iqamaExpiryDays = employee.iqamaExpiry
    ? differenceInDays(new Date(employee.iqamaExpiry), new Date())
    : 999;
  const passportExpiryDays = employee.passportExpiry
    ? differenceInDays(new Date(employee.passportExpiry), new Date())
    : 999;

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
    {
      id: "employment",
      label: "Employment",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "financial",
      label: "Financial",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: "documents",
      label: "Documents",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "performance",
      label: "Performance",
      icon: <Target className="w-4 h-4" />,
    },
  ];

  // Mock performance data
  const performanceData = {
    rating: 4.2,
    attendance: 96,
    tasksCompleted: 42,
    goals: [
      { name: "Q1 Objectives", progress: 85, status: "on-track" },
      { name: "Training Completion", progress: 100, status: "completed" },
      { name: "Project Deliverables", progress: 60, status: "at-risk" },
    ],
  };

  // Mock attendance history
  const attendanceHistory = [
    { month: "Jan", present: 22, absent: 1, late: 2 },
    { month: "Feb", present: 20, absent: 0, late: 1 },
    { month: "Mar", present: 21, absent: 2, late: 0 },
    { month: "Apr", present: 22, absent: 0, late: 1 },
    { month: "May", present: 20, absent: 1, late: 2 },
    { month: "Jun", present: 21, absent: 0, late: 0 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed right-0 top-0 bottom-0 w-full max-w-3xl z-50 overflow-hidden",
              isGlass
                ? "bg-gray-900/95 backdrop-blur-2xl"
                : isDark
                  ? "bg-gray-900"
                  : "bg-white"
            )}
          >
            {/* Header with photo */}
            <div className="relative h-48 bg-gradient-to-r from-[#2E3192] via-[#203366] to-[#0E2841]">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#80D1E9] rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Close and actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => onEdit?.(employee)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Employee info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-6">
                <div className="relative">
                  <img
                    src={employee.photo}
                    alt={employee.fullName}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover"
                  />
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white",
                      employee.status === "Active"
                        ? "bg-emerald-500"
                        : employee.status === "On Leave"
                          ? "bg-amber-500"
                          : "bg-gray-400"
                    )}
                  />
                </div>
                <div className="flex-1 text-white mb-2">
                  <h2 className="text-2xl font-bold">{employee.fullName}</h2>
                  <p className="text-white/80">{employee.position}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {employee.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {employee.locationName}
                    </span>
                  </div>
                </div>
                <StatusBadge status={employee.status} size="md" />
              </div>
            </div>

            {/* Tabs */}
            <div
              className={cn(
                "flex border-b",
                isGlass
                  ? "border-white/10"
                  : isDark
                    ? "border-gray-700"
                    : "border-gray-200"
              )}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative",
                    activeTab === tab.id
                      ? isGlass || isDark
                        ? "text-[#80D1E9]"
                        : "text-[#2E3192]"
                      : isGlass
                        ? "text-white/60 hover:text-white/80"
                        : isDark
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className={cn(
                        "absolute bottom-0 left-0 right-0 h-0.5",
                        "bg-gradient-to-r from-[#2E3192] to-[#80D1E9]"
                      )}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto h-[calc(100%-12rem-3rem)]">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={cn(
                          "p-4 rounded-xl text-center",
                          isGlass
                            ? "bg-white/5"
                            : isDark
                              ? "bg-gray-800"
                              : "bg-gray-50"
                        )}
                      >
                        <p
                          className={cn(
                            "text-3xl font-bold",
                            "text-[#2E3192]"
                          )}
                        >
                          {tenure}y {tenureMonths}m
                        </p>
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
                          Tenure
                        </p>
                      </div>
                      <div
                        className={cn(
                          "p-4 rounded-xl text-center",
                          isGlass
                            ? "bg-white/5"
                            : isDark
                              ? "bg-gray-800"
                              : "bg-gray-50"
                        )}
                      >
                        <p className="text-3xl font-bold text-emerald-500">
                          {performanceData.attendance}%
                        </p>
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
                          Attendance
                        </p>
                      </div>
                      <div
                        className={cn(
                          "p-4 rounded-xl text-center",
                          isGlass
                            ? "bg-white/5"
                            : isDark
                              ? "bg-gray-800"
                              : "bg-gray-50"
                        )}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <p className="text-3xl font-bold text-amber-500">
                            {performanceData.rating}
                          </p>
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
                          Rating
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h3
                        className={cn(
                          "text-lg font-semibold mb-4",
                          isGlass || isDark ? "text-white" : "text-gray-800"
                        )}
                      >
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl",
                            isGlass
                              ? "bg-white/5"
                              : isDark
                                ? "bg-gray-800"
                                : "bg-gray-50"
                          )}
                        >
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <Mail className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-xs",
                                isGlass
                                  ? "text-white/50"
                                  : isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              )}
                            >
                              Email
                            </p>
                            <p
                              className={cn(
                                "text-sm font-medium",
                                isGlass || isDark ? "text-white" : "text-gray-800"
                              )}
                            >
                              {employee.email}
                            </p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl",
                            isGlass
                              ? "bg-white/5"
                              : isDark
                                ? "bg-gray-800"
                                : "bg-gray-50"
                          )}
                        >
                          <div className="p-2 rounded-lg bg-emerald-500/10">
                            <Phone className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-xs",
                                isGlass
                                  ? "text-white/50"
                                  : isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              )}
                            >
                              Phone
                            </p>
                            <p
                              className={cn(
                                "text-sm font-medium",
                                isGlass || isDark ? "text-white" : "text-gray-800"
                              )}
                            >
                              {employee.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div>
                      <h3
                        className={cn(
                          "text-lg font-semibold mb-4",
                          isGlass || isDark ? "text-white" : "text-gray-800"
                        )}
                      >
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "National ID", value: employee.nationalId },
                          { label: "Date of Birth", value: employee.dateOfBirth },
                          { label: "Nationality", value: employee.nationality },
                          { label: "Gender", value: employee.gender },
                          { label: "Marital Status", value: employee.maritalStatus },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className={cn(
                              "p-3 rounded-lg",
                              isGlass
                                ? "bg-white/5"
                                : isDark
                                  ? "bg-gray-800"
                                  : "bg-gray-50"
                            )}
                          >
                            <p
                              className={cn(
                                "text-xs",
                                isGlass
                                  ? "text-white/50"
                                  : isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              )}
                            >
                              {item.label}
                            </p>
                            <p
                              className={cn(
                                "text-sm font-medium mt-1",
                                isGlass || isDark ? "text-white" : "text-gray-800"
                              )}
                            >
                              {item.value || "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "employment" && (
                  <motion.div
                    key="employment"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Employee ID", value: employee.employeeId },
                        { label: "Position", value: employee.position },
                        { label: "Department", value: employee.department },
                        { label: "Location", value: employee.locationName },
                        { label: "Employment Type", value: employee.employmentType },
                        { label: "Contract Type", value: employee.contractType },
                        {
                          label: "Hire Date",
                          value: format(new Date(employee.hireDate), "MMM dd, yyyy"),
                        },
                        { label: "Manager", value: employee.managerName || "N/A" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={cn(
                            "p-4 rounded-xl",
                            isGlass
                              ? "bg-white/5"
                              : isDark
                                ? "bg-gray-800"
                                : "bg-gray-50"
                          )}
                        >
                          <p
                            className={cn(
                              "text-xs mb-1",
                              isGlass
                                ? "text-white/50"
                                : isDark
                                  ? "text-gray-500"
                                  : "text-gray-400"
                            )}
                          >
                            {item.label}
                          </p>
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              isGlass || isDark ? "text-white" : "text-gray-800"
                            )}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "financial" && (
                  <motion.div
                    key="financial"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Salary Breakdown */}
                    <div>
                      <h3
                        className={cn(
                          "text-lg font-semibold mb-4",
                          isGlass || isDark ? "text-white" : "text-gray-800"
                        )}
                      >
                        Salary Breakdown
                      </h3>
                      <div
                        className={cn(
                          "p-5 rounded-xl",
                          isGlass
                            ? "bg-white/5"
                            : isDark
                              ? "bg-gray-800"
                              : "bg-gray-50"
                        )}
                      >
                        <div className="space-y-4">
                          {[
                            {
                              label: "Basic Salary",
                              value: employee.basicSalary,
                              percent: 60,
                            },
                            {
                              label: "Housing Allowance",
                              value: employee.housingAllowance,
                              percent: 25,
                            },
                            {
                              label: "Transport Allowance",
                              value: employee.transportAllowance,
                              percent: 8,
                            },
                            {
                              label: "Other Allowances",
                              value: employee.otherAllowances,
                              percent: 7,
                            },
                          ].map((item, index) => (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span
                                  className={cn(
                                    "text-sm",
                                    isGlass
                                      ? "text-white/70"
                                      : isDark
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                  )}
                                >
                                  {item.label}
                                </span>
                                <span
                                  className={cn(
                                    "text-sm font-medium",
                                    isGlass || isDark ? "text-white" : "text-gray-800"
                                  )}
                                >
                                  {item.value?.toLocaleString()} SAR
                                </span>
                              </div>
                              <div
                                className={cn(
                                  "h-2 rounded-full overflow-hidden",
                                  isGlass
                                    ? "bg-white/10"
                                    : isDark
                                      ? "bg-gray-700"
                                      : "bg-gray-200"
                                )}
                              >
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.percent}%` }}
                                  transition={{ duration: 0.8, delay: index * 0.1 }}
                                  className="h-full bg-gradient-to-r from-[#2E3192] to-[#80D1E9]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div
                          className={cn(
                            "mt-6 pt-4 border-t flex justify-between",
                            isGlass
                              ? "border-white/10"
                              : isDark
                                ? "border-gray-700"
                                : "border-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "font-semibold",
                              isGlass || isDark ? "text-white" : "text-gray-800"
                            )}
                          >
                            Total Salary
                          </span>
                          <span className="text-xl font-bold text-[#2E3192]">
                            {employee.totalSalary?.toLocaleString()} SAR
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bank Info */}
                    <div>
                      <h3
                        className={cn(
                          "text-lg font-semibold mb-4",
                          isGlass || isDark ? "text-white" : "text-gray-800"
                        )}
                      >
                        Bank Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={cn(
                            "p-4 rounded-xl",
                            isGlass
                              ? "bg-white/5"
                              : isDark
                                ? "bg-gray-800"
                                : "bg-gray-50"
                          )}
                        >
                          <p
                            className={cn(
                              "text-xs",
                              isGlass
                                ? "text-white/50"
                                : isDark
                                  ? "text-gray-500"
                                  : "text-gray-400"
                            )}
                          >
                            Bank Name
                          </p>
                          <p
                            className={cn(
                              "text-sm font-semibold mt-1",
                              isGlass || isDark ? "text-white" : "text-gray-800"
                            )}
                          >
                            {employee.bankName}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "p-4 rounded-xl",
                            isGlass
                              ? "bg-white/5"
                              : isDark
                                ? "bg-gray-800"
                                : "bg-gray-50"
                          )}
                        >
                          <p
                            className={cn(
                              "text-xs",
                              isGlass
                                ? "text-white/50"
                                : isDark
                                  ? "text-gray-500"
                                  : "text-gray-400"
                            )}
                          >
                            IBAN
                          </p>
                          <p
                            className={cn(
                              "text-sm font-semibold mt-1 font-mono",
                              isGlass || isDark ? "text-white" : "text-gray-800"
                            )}
                          >
                            {employee.iban}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "documents" && (
                  <motion.div
                    key="documents"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Document Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Iqama Card */}
                      <div
                        className={cn(
                          "p-5 rounded-xl border",
                          iqamaExpiryDays < 30
                            ? "border-rose-500/50 bg-rose-500/5"
                            : iqamaExpiryDays < 90
                              ? "border-amber-500/50 bg-amber-500/5"
                              : isGlass
                                ? "border-white/10 bg-white/5"
                                : isDark
                                  ? "border-gray-700 bg-gray-800"
                                  : "border-gray-200 bg-gray-50"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p
                              className={cn(
                                "text-sm font-medium",
                                isGlass || isDark ? "text-white/70" : "text-gray-500"
                              )}
                            >
                              Iqama
                            </p>
                            <p
                              className={cn(
                                "text-lg font-bold mt-1 font-mono",
                                isGlass || isDark ? "text-white" : "text-gray-800"
                              )}
                            >
                              {employee.iqamaNumber}
                            </p>
                          </div>
                          {iqamaExpiryDays < 90 ? (
                            <AlertCircle
                              className={cn(
                                "w-6 h-6",
                                iqamaExpiryDays < 30
                                  ? "text-rose-500"
                                  : "text-amber-500"
                              )}
                            />
                          ) : (
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "mt-4 pt-3 border-t",
                            isGlass
                              ? "border-white/10"
                              : isDark
                                ? "border-gray-700"
                                : "border-gray-200"
                          )}
                        >
                          <p
                            className={cn(
                              "text-xs",
                              isGlass
                                ? "text-white/50"
                                : isDark
                                  ? "text-gray-500"
                                  : "text-gray-400"
                            )}
                          >
                            Expires
                          </p>
                          <p
                            className={cn(
                              "text-sm font-medium",
                              iqamaExpiryDays < 30
                                ? "text-rose-500"
                                : iqamaExpiryDays < 90
                                  ? "text-amber-500"
                                  : isGlass || isDark
                                    ? "text-white"
                                    : "text-gray-800"
                            )}
                          >
                            {employee.iqamaExpiry
                              ? format(new Date(employee.iqamaExpiry), "MMM dd, yyyy")
                              : "N/A"}
                            {iqamaExpiryDays < 90 && (
                              <span className="ml-2 text-xs">
                                ({iqamaExpiryDays} days)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Passport Card */}
                      <div
                        className={cn(
                          "p-5 rounded-xl border",
                          passportExpiryDays < 30
                            ? "border-rose-500/50 bg-rose-500/5"
                            : passportExpiryDays < 90
                              ? "border-amber-500/50 bg-amber-500/5"
                              : isGlass
                                ? "border-white/10 bg-white/5"
                                : isDark
                                  ? "border-gray-700 bg-gray-800"
                                  : "border-gray-200 bg-gray-50"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p
                              className={cn(
                                "text-sm font-medium",
                                isGlass || isDark ? "text-white/70" : "text-gray-500"
                              )}
                            >
                              Passport
                            </p>
                            <p
                              className={cn(
                                "text-lg font-bold mt-1 font-mono",
                                isGlass || isDark ? "text-white" : "text-gray-800"
                              )}
                            >
                              {employee.passportNumber}
                            </p>
                          </div>
                          {passportExpiryDays < 90 ? (
                            <AlertCircle
                              className={cn(
                                "w-6 h-6",
                                passportExpiryDays < 30
                                  ? "text-rose-500"
                                  : "text-amber-500"
                              )}
                            />
                          ) : (
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "mt-4 pt-3 border-t",
                            isGlass
                              ? "border-white/10"
                              : isDark
                                ? "border-gray-700"
                                : "border-gray-200"
                          )}
                        >
                          <p
                            className={cn(
                              "text-xs",
                              isGlass
                                ? "text-white/50"
                                : isDark
                                  ? "text-gray-500"
                                  : "text-gray-400"
                            )}
                          >
                            Expires
                          </p>
                          <p
                            className={cn(
                              "text-sm font-medium",
                              passportExpiryDays < 30
                                ? "text-rose-500"
                                : passportExpiryDays < 90
                                  ? "text-amber-500"
                                  : isGlass || isDark
                                    ? "text-white"
                                    : "text-gray-800"
                            )}
                          >
                            {employee.passportExpiry
                              ? format(
                                  new Date(employee.passportExpiry),
                                  "MMM dd, yyyy"
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "performance" && (
                  <motion.div
                    key="performance"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Performance Overview */}
                    <div className="flex justify-center gap-8">
                      <ProgressRing
                        value={performanceData.rating * 20}
                        size={100}
                        color="#F59E0B"
                        label="Rating"
                      />
                      <ProgressRing
                        value={performanceData.attendance}
                        size={100}
                        color="#10B981"
                        label="Attendance"
                      />
                      <ProgressRing
                        value={(performanceData.tasksCompleted / 50) * 100}
                        size={100}
                        color="#2E3192"
                        label="Tasks"
                      />
                    </div>

                    {/* Goals */}
                    <div>
                      <h3
                        className={cn(
                          "text-lg font-semibold mb-4",
                          isGlass || isDark ? "text-white" : "text-gray-800"
                        )}
                      >
                        Goals & Objectives
                      </h3>
                      <div className="space-y-3">
                        {performanceData.goals.map((goal, index) => (
                          <div
                            key={index}
                            className={cn(
                              "p-4 rounded-xl",
                              isGlass
                                ? "bg-white/5"
                                : isDark
                                  ? "bg-gray-800"
                                  : "bg-gray-50"
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={cn(
                                  "font-medium",
                                  isGlass || isDark ? "text-white" : "text-gray-800"
                                )}
                              >
                                {goal.name}
                              </span>
                              <Badge
                                variant={
                                  goal.status === "completed"
                                    ? "success"
                                    : goal.status === "on-track"
                                      ? "primary"
                                      : "warning"
                                }
                                size="sm"
                              >
                                {goal.status}
                              </Badge>
                            </div>
                            <div
                              className={cn(
                                "h-2 rounded-full overflow-hidden",
                                isGlass
                                  ? "bg-white/10"
                                  : isDark
                                    ? "bg-gray-700"
                                    : "bg-gray-200"
                              )}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className={cn(
                                  "h-full",
                                  goal.status === "completed"
                                    ? "bg-emerald-500"
                                    : goal.status === "on-track"
                                      ? "bg-[#2E3192]"
                                      : "bg-amber-500"
                                )}
                              />
                            </div>
                            <p
                              className={cn(
                                "text-xs mt-2",
                                isGlass
                                  ? "text-white/50"
                                  : isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              )}
                            >
                              {goal.progress}% complete
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmployeeDetailModal;
