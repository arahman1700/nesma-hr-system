// Employee Types
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string;
  lastNameAr?: string;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  nationality: string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";

  // Employment Details
  position: string;
  positionId: string;
  department: string;
  departmentId: string;
  hireDate: string;
  employmentType: "Full-time" | "Part-time" | "Contractor" | "Intern";
  contractType: "Permanent" | "Temporary" | "Fixed-term";
  status: "Active" | "Inactive" | "On Leave" | "Terminated";
  probationEndDate?: string;

  // Compensation
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  totalSalary: number;

  // Banking
  bankName: string;
  iban: string;
  accountName: string;

  // Documents
  passportNumber?: string;
  passportExpiry?: string;
  iqamaNumber?: string;
  iqamaExpiry?: string;

  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;

  // Manager
  managerId?: string;
  managerName?: string;

  // Location
  locationId: string;
  locationName: string;

  // Photo
  photo?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status:
    | "Present"
    | "Absent"
    | "Late"
    | "On Leave"
    | "Holiday"
    | "Weekend"
    | "Remote";
  lateMinutes: number;
  earlyLeaveMinutes: number;
  workHours: number;
  overtimeHours: number;
  breakMinutes: number;
  locationId: string;
  locationName: string;
  shiftId?: string;
  shiftName?: string;
  notes?: string;
  checkInLocation?: { lat: number; lng: number };
  checkOutLocation?: { lat: number; lng: number };
}

// Shift Types
export interface Shift {
  id: string;
  name: string;
  nameAr?: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  workHours: number;
  color: string;
  locationId?: string;
  locationName?: string;
  allowance: number;
  description?: string;
  isDefault: boolean;
  employees: string[];
}

export interface ShiftAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  shiftId: string;
  shiftName: string;
  date: string;
  status: "Scheduled" | "Completed" | "Missed";
}

// Leave Types
export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type:
    | "Annual"
    | "Sick"
    | "Emergency"
    | "Maternity"
    | "Paternity"
    | "Study"
    | "Unpaid"
    | "Hajj";
  startDate: string;
  endDate: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  reason: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  documents?: string[];
  createdAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  annual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  emergency: { total: number; used: number; remaining: number };
  unpaid: { total: number; used: number; remaining: number };
}

// Request Types
export interface Request {
  id: string;
  employeeId: string;
  employeeName: string;
  type:
    | "Leave"
    | "Overtime"
    | "Document"
    | "Equipment"
    | "Transfer"
    | "Training"
    | "Advance"
    | "Other";
  subType?: string;
  title: string;
  description: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  approvalFlow: ApprovalStep[];
  documents?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStep {
  step: number;
  approverName: string;
  approverId: string;
  status: "Pending" | "Approved" | "Rejected";
  date?: string;
  comments?: string;
}

// Payroll Types
export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;

  // Earnings
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  overtime: number;
  bonus: number;
  commission: number;

  // Deductions
  gosiEmployee: number;
  gosiCompany: number;
  absenceDeduction: number;
  loanDeduction: number;
  advanceDeduction: number;
  otherDeductions: number;

  // Totals
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;

  // Status
  status: "Draft" | "Pending" | "Approved" | "Paid";
  paidDate?: string;
  paymentMethod: "Bank Transfer" | "Cash" | "Check";
  createdAt: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  assignedBy: string;
  assignedByName: string;
  dueDate: string;
  startDate?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status:
    | "To Do"
    | "In Progress"
    | "In Review"
    | "Blocked"
    | "Done"
    | "Archived";
  category?: string;
  tags?: string[];
  progress: number;
  checklist?: { item: string; completed: boolean }[];
  attachments?: string[];
  comments?: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// Position Types
export interface Position {
  id: string;
  name: string;
  nameAr?: string;
  departmentId: string;
  departmentName: string;
  reportsTo?: string;
  reportsToName?: string;
  permissionGroup: string;
  color: string;
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  employeeCount: number;
  isVacant: boolean;
  salaryRange?: { min: number; max: number };
}

// Department Types
export interface Department {
  id: string;
  name: string;
  nameAr?: string;
  code: string;
  managerId?: string;
  managerName?: string;
  parentId?: string;
  employeeCount: number;
  description?: string;
  color: string;
}

// Location Types
export interface Location {
  id: string;
  name: string;
  nameAr?: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  radius: number;
  timezone: string;
  employeeCount: number;
  isHeadquarters: boolean;
  contactPhone?: string;
  contactEmail?: string;
}

// Letter Types
export interface Letter {
  id: string;
  type:
    | "Salary Certificate"
    | "Employment Certificate"
    | "Experience Letter"
    | "NOC"
    | "Offer Letter"
    | "Termination Letter"
    | "Warning Letter"
    | "Promotion Letter"
    | "Custom";
  subject: string;
  employeeId: string;
  employeeName: string;
  content: string;
  status: "Draft" | "Generated" | "Sent";
  createdBy: string;
  createdAt: string;
  sentTo?: string;
  sentAt?: string;
  language: "English" | "Arabic" | "Both";
}

// Calendar Event Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type:
    | "Holiday"
    | "Meeting"
    | "Training"
    | "Birthday"
    | "Anniversary"
    | "Event"
    | "Reminder";
  startDate: string;
  endDate: string;
  allDay: boolean;
  color: string;
  attendees?: string[];
  location?: string;
  recurring?: "None" | "Daily" | "Weekly" | "Monthly" | "Yearly";
  createdBy: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: string;
  category:
    | "Personal"
    | "Employment"
    | "Medical"
    | "Educational"
    | "Legal"
    | "Company";
  employeeId?: string;
  employeeName?: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
  tags?: string[];
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  type: "Employee" | "Company";
  documentCount: number;
  createdAt: string;
}

// GOSI Types
export interface GosiRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  iqamaNumber: string;
  wage: number;
  employeeContribution: number;
  companyContribution: number;
  totalContribution: number;
  month: string;
  year: number;
  status: "Active" | "Inactive";
}

// Tameeni Types
export interface TameeniMember {
  id: string;
  employeeId: string;
  employeeName: string;
  policyNumber: string;
  insuranceClass: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: "Active" | "Expired" | "Cancelled";
  dependents?: { name: string; relation: string; dob: string }[];
}

// Muqeem Types
export interface MuqeemService {
  id: string;
  employeeId: string;
  employeeName: string;
  serviceType:
    | "Issue Iqama"
    | "Renew Iqama"
    | "Transfer Iqama"
    | "Exit Re-entry"
    | "Final Exit"
    | "Work Visa";
  requestDate: string;
  status: "Pending" | "In Progress" | "Completed" | "Rejected";
  currentIqamaNumber?: string;
  newIqamaNumber?: string;
  expiryDate?: string;
  fee?: number;
  notes?: string;
}

// Company Settings Types
export interface CompanySettings {
  id: string;
  name: string;
  nameAr?: string;
  logo?: string;
  crNumber: string;
  moiNumber?: string;
  vatNumber?: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  workingDays: string[];
  workingHours: { start: string; end: string };
  timezone: string;
  currency: string;
  fiscalYearStart: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: "Info" | "Warning" | "Error" | "Success";
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role:
    | "Owner"
    | "Admin"
    | "HR Manager"
    | "Manager"
    | "Supervisor"
    | "Employee";
  avatar?: string;
  employeeId?: string;
  permissions: string[];
  lastLogin: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingRequests: number;
  pendingApprovals: number;
  upcomingBirthdays: number;
  expiringDocuments: number;
  attendanceRate: number;
  leaveRequests: number;
}

// Pagination
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Export Types
export type ExportFormat = "pdf" | "excel" | "word" | "image" | "powerpoint";
export type ExportOrientation = "portrait" | "landscape";

export interface ExportOptions {
  format: ExportFormat;
  fileName: string;
  title?: string;
  orientation?: ExportOrientation;
  includeHeader?: boolean;
  includeFooter?: boolean;
  includeLogo?: boolean;
  dateRange?: { start: string; end: string };
}
