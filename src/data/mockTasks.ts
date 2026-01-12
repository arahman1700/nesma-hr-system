import { Task, TaskComment } from "../types";
import { employees } from "./mockEmployees";

const taskTitles = [
  "Monthly Logistics Report",
  "Inventory Audit",
  "Supplier Review",
  "Safety Training Completion",
  "Budget Preparation",
  "Team Performance Review",
  "System Update Testing",
  "Document Archiving",
  "New Employee Onboarding",
  "Project Timeline Update",
  "Client Meeting Preparation",
  "Quarterly Report",
  "Policy Review",
  "Vendor Negotiation",
  "Equipment Maintenance",
  "Training Material Update",
  "Process Documentation",
  "Compliance Audit",
  "KPI Analysis",
  "Risk Assessment",
];

const taskCategories = [
  "Operations",
  "HR",
  "Finance",
  "IT",
  "Sales",
  "Admin",
  "Compliance",
  "Training",
];
const taskStatuses: Task["status"][] = [
  "To Do",
  "In Progress",
  "In Review",
  "Blocked",
  "Done",
  "Archived",
];
const taskPriorities: Task["priority"][] = ["Low", "Medium", "High", "Urgent"];

export const generateTasks = (count: number = 50): Task[] => {
  const tasks: Task[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const assignedTo = employees[Math.floor(Math.random() * employees.length)];
    const assignedBy = employees[Math.floor(Math.random() * 10)]; // First 10 employees as managers
    const title = taskTitles[Math.floor(Math.random() * taskTitles.length)];
    const category =
      taskCategories[Math.floor(Math.random() * taskCategories.length)];
    const status =
      taskStatuses[Math.floor(Math.random() * taskStatuses.length)];
    const priority =
      taskPriorities[Math.floor(Math.random() * taskPriorities.length)];

    // Generate dates
    const startOffset = Math.floor(Math.random() * 30) - 15;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + startOffset);

    const dueDateOffset = Math.floor(Math.random() * 14) + 1;
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + dueDateOffset);

    // Generate progress based on status
    let progress = 0;
    switch (status) {
      case "To Do":
        progress = 0;
        break;
      case "In Progress":
        progress = Math.floor(Math.random() * 60) + 20;
        break;
      case "In Review":
        progress = Math.floor(Math.random() * 20) + 70;
        break;
      case "Blocked":
        progress = Math.floor(Math.random() * 50) + 20;
        break;
      case "Done":
        progress = 100;
        break;
      case "Archived":
        progress = 100;
        break;
    }

    // Generate checklist
    const checklistItems = [
      "Review requirements",
      "Gather necessary data",
      "Create initial draft",
      "Review with team",
      "Finalize and submit",
    ];
    const checklist = checklistItems
      .slice(0, Math.floor(Math.random() * 5) + 2)
      .map((item, idx) => ({
        item,
        completed: idx < Math.floor(progress / 25),
      }));

    // Generate comments
    const comments: TaskComment[] =
      Math.random() > 0.5
        ? [
            {
              id: `comment-${i}-1`,
              userId: assignedBy.id,
              userName: assignedBy.fullName,
              content: "Please prioritize this task.",
              createdAt: new Date(startDate.getTime() + 86400000).toISOString(),
            },
          ]
        : [];

    if (Math.random() > 0.6) {
      comments.push({
        id: `comment-${i}-2`,
        userId: assignedTo.id,
        userName: assignedTo.fullName,
        content: "Working on it, will update soon.",
        createdAt: new Date(startDate.getTime() + 86400000 * 2).toISOString(),
      });
    }

    const task: Task = {
      id: `task-${(i + 1).toString().padStart(3, "0")}`,
      title,
      description: `${title} - This task involves ${category.toLowerCase()} activities and should be completed by the due date. Please ensure all requirements are met before marking as complete.`,
      assignedTo: assignedTo.id,
      assignedToName: assignedTo.fullName,
      assignedBy: assignedBy.id,
      assignedByName: assignedBy.fullName,
      dueDate: dueDate.toISOString().split("T")[0],
      startDate: startDate.toISOString().split("T")[0],
      priority,
      status,
      category,
      tags: [category, priority],
      progress,
      checklist,
      attachments: Math.random() > 0.7 ? ["task_document.pdf"] : undefined,
      comments,
      createdAt: new Date(startDate.getTime() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(task);
  }

  return tasks.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
};

export const tasks = generateTasks(50);

export const getTasksByEmployee = (employeeId: string): Task[] => {
  return tasks.filter((t) => t.assignedTo === employeeId);
};

export const getTasksByStatus = (status: Task["status"]): Task[] => {
  return tasks.filter((t) => t.status === status);
};

export const getOverdueTasks = (): Task[] => {
  const today = new Date().toISOString().split("T")[0];
  return tasks.filter(
    (t) => t.dueDate < today && t.status !== "Done" && t.status !== "Archived",
  );
};

export const getTaskStats = () => {
  return {
    total: tasks.length,
    toDo: tasks.filter((t) => t.status === "To Do").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    inReview: tasks.filter((t) => t.status === "In Review").length,
    blocked: tasks.filter((t) => t.status === "Blocked").length,
    done: tasks.filter((t) => t.status === "Done").length,
    archived: tasks.filter((t) => t.status === "Archived").length,
    overdue: getOverdueTasks().length,
  };
};

export default tasks;
