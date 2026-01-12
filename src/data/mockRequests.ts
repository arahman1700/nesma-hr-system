import { Request, ApprovalStep } from "../types";
import { employees } from "./mockEmployees";

const requestTypes: Request["type"][] = [
  "Leave",
  "Overtime",
  "Document",
  "Equipment",
  "Transfer",
  "Training",
  "Advance",
  "Other",
];
const requestStatuses: Request["status"][] = [
  "Pending",
  "Approved",
  "Rejected",
  "In Progress",
  "Completed",
];
const priorities: Request["priority"][] = ["Low", "Medium", "High", "Urgent"];

const requestTitles: Record<Request["type"], string[]> = {
  Leave: [
    "Annual Leave Request",
    "Sick Leave Request",
    "Emergency Leave Request",
  ],
  Overtime: [
    "Weekend Overtime Request",
    "Weekday Overtime Request",
    "Holiday Work Request",
  ],
  Document: [
    "Salary Certificate Request",
    "Employment Certificate Request",
    "NOC Request",
    "Bank Letter Request",
  ],
  Equipment: [
    "Laptop Request",
    "Mobile Phone Request",
    "Office Supplies Request",
    "Software License Request",
  ],
  Transfer: [
    "Department Transfer Request",
    "Branch Transfer Request",
    "Position Change Request",
  ],
  Training: [
    "Technical Training Request",
    "Management Course Request",
    "Certification Request",
  ],
  Advance: ["Salary Advance Request", "Emergency Advance Request"],
  Other: [
    "Parking Space Request",
    "Access Card Request",
    "Travel Allowance Request",
  ],
};

const generateApprovalFlow = (status: Request["status"]): ApprovalStep[] => {
  const steps: ApprovalStep[] = [
    {
      step: 1,
      approverName: "Direct Manager",
      approverId: "emp-002",
      status: status === "Pending" ? "Pending" : "Approved",
      date:
        status !== "Pending"
          ? new Date(Date.now() - 86400000 * 2).toISOString()
          : undefined,
      comments: status !== "Pending" ? "Approved" : undefined,
    },
    {
      step: 2,
      approverName: "HR Department",
      approverId: "emp-003",
      status:
        status === "Approved" || status === "Completed"
          ? "Approved"
          : status === "Rejected"
            ? "Rejected"
            : "Pending",
      date:
        status === "Approved" || status === "Completed"
          ? new Date(Date.now() - 86400000).toISOString()
          : undefined,
      comments:
        status === "Rejected"
          ? "Request cannot be processed at this time"
          : status === "Approved"
            ? "Approved"
            : undefined,
    },
  ];

  if (
    requestTypes.includes("Equipment" as Request["type"]) ||
    requestTypes.includes("Transfer" as Request["type"])
  ) {
    steps.push({
      step: 3,
      approverName: "Finance Department",
      approverId: "emp-004",
      status: status === "Completed" ? "Approved" : "Pending",
      date: status === "Completed" ? new Date().toISOString() : undefined,
    });
  }

  return steps;
};

export const generateRequests = (count: number = 100): Request[] => {
  const requests: Request[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const emp = employees[Math.floor(Math.random() * employees.length)];
    const type = requestTypes[Math.floor(Math.random() * requestTypes.length)];
    const status =
      requestStatuses[Math.floor(Math.random() * requestStatuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const titles = requestTitles[type];
    const title = titles[Math.floor(Math.random() * titles.length)];

    const createdOffset = Math.floor(Math.random() * 60);
    const createdDate = new Date(today);
    createdDate.setDate(createdDate.getDate() - createdOffset);

    const request: Request = {
      id: `req-${(i + 1).toString().padStart(3, "0")}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      type,
      subType: title.replace(" Request", ""),
      title,
      description: `This is a ${type.toLowerCase()} request submitted by ${emp.fullName}. ${title.replace(" Request", "")} is needed for business purposes.`,
      date: createdDate.toISOString().split("T")[0],
      status,
      priority,
      approvalFlow: generateApprovalFlow(status),
      documents: Math.random() > 0.7 ? ["supporting_document.pdf"] : undefined,
      createdAt: createdDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    requests.push(request);
  }

  return requests.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const requests = generateRequests(100);

export const getPendingRequests = (): Request[] => {
  return requests.filter((r) => r.status === "Pending");
};

export const getRequestsByEmployee = (employeeId: string): Request[] => {
  return requests.filter((r) => r.employeeId === employeeId);
};

export const getRequestsByType = (type: Request["type"]): Request[] => {
  return requests.filter((r) => r.type === type);
};

export const getRequestStats = () => {
  return {
    total: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    rejected: requests.filter((r) => r.status === "Rejected").length,
    inProgress: requests.filter((r) => r.status === "In Progress").length,
    completed: requests.filter((r) => r.status === "Completed").length,
  };
};

export default requests;
