import { Leave, LeaveBalance } from "../types";
import { employees } from "./mockEmployees";

const leaveTypes: Leave["type"][] = [
  "Annual",
  "Sick",
  "Emergency",
  "Maternity",
  "Paternity",
  "Study",
  "Unpaid",
  "Hajj",
];
const leaveStatuses: Leave["status"][] = [
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
];

const leaveReasons: Record<Leave["type"], string[]> = {
  Annual: [
    "Family vacation",
    "Personal time off",
    "Travel abroad",
    "Home renovation",
    "Wedding ceremony",
  ],
  Sick: [
    "Medical appointment",
    "Flu symptoms",
    "Back pain",
    "Dental surgery",
    "Medical procedure",
  ],
  Emergency: [
    "Family emergency",
    "Urgent personal matter",
    "Accident",
    "Death in family",
  ],
  Maternity: ["Maternity leave"],
  Paternity: ["Paternity leave"],
  Study: ["Exam preparation", "Course completion", "Thesis defense"],
  Unpaid: ["Extended travel", "Personal reasons", "Family care"],
  Hajj: ["Hajj pilgrimage"],
};

export const generateLeaves = (count: number = 80): Leave[] => {
  const leaves: Leave[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const emp = employees[Math.floor(Math.random() * employees.length)];
    const type = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
    const status =
      leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)];

    // Generate start date (random date within last 3 months or next 2 months)
    const startOffset = Math.floor(Math.random() * 150) - 90; // -90 to +60 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + startOffset);

    // Generate end date (1-14 days after start)
    const days = Math.floor(Math.random() * 14) + 1;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days - 1);

    const reasons = leaveReasons[type];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];

    const leave: Leave = {
      id: `leave-${(i + 1).toString().padStart(3, "0")}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      type,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      days,
      status,
      reason,
      approvedBy: status === "Approved" ? "Mohammed Al-Rashid" : undefined,
      approvedDate:
        status === "Approved"
          ? new Date(startDate.getTime() - 86400000 * 2)
              .toISOString()
              .split("T")[0]
          : undefined,
      rejectionReason:
        status === "Rejected" ? "Insufficient leave balance" : undefined,
      documents:
        type === "Sick" && Math.random() > 0.5
          ? ["medical_report.pdf"]
          : undefined,
      createdAt: new Date(startDate.getTime() - 86400000 * 5).toISOString(),
    };

    leaves.push(leave);
  }

  return leaves.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const generateLeaveBalances = (): LeaveBalance[] => {
  return employees
    .map((emp) => ({
      employeeId: emp.id,
      employeeName: emp.fullName,
      annual: {
        total: 30,
        used: Math.floor(Math.random() * 15),
        remaining: 0,
      },
      sick: {
        total: 15,
        used: Math.floor(Math.random() * 5),
        remaining: 0,
      },
      emergency: {
        total: 5,
        used: Math.floor(Math.random() * 2),
        remaining: 0,
      },
      unpaid: {
        total: 0,
        used: Math.floor(Math.random() * 5),
        remaining: 0,
      },
    }))
    .map((balance) => ({
      ...balance,
      annual: {
        ...balance.annual,
        remaining: balance.annual.total - balance.annual.used,
      },
      sick: {
        ...balance.sick,
        remaining: balance.sick.total - balance.sick.used,
      },
      emergency: {
        ...balance.emergency,
        remaining: balance.emergency.total - balance.emergency.used,
      },
      unpaid: { ...balance.unpaid, remaining: -balance.unpaid.used },
    }));
};

export const leaves = generateLeaves(80);
export const leaveBalances = generateLeaveBalances();

export const getPendingLeaves = (): Leave[] => {
  return leaves.filter((l) => l.status === "Pending");
};

export const getLeavesByEmployee = (employeeId: string): Leave[] => {
  return leaves.filter((l) => l.employeeId === employeeId);
};

export const getLeaveBalanceByEmployee = (
  employeeId: string,
): LeaveBalance | undefined => {
  return leaveBalances.find((lb) => lb.employeeId === employeeId);
};

export const getUpcomingLeaves = (days: number = 30): Leave[] => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + days);

  return leaves.filter((l) => {
    const startDate = new Date(l.startDate);
    return (
      l.status === "Approved" && startDate >= today && startDate <= futureDate
    );
  });
};

export default leaves;
