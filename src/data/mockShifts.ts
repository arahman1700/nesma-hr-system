import { Shift, ShiftAssignment } from "../types";
import { employees } from "./mockEmployees";

export const shifts: Shift[] = [
  {
    id: "shift-1",
    name: "Morning Shift",
    nameAr: "الشفت الصباحي",
    startTime: "07:00",
    endTime: "15:00",
    breakDuration: 60,
    workHours: 8,
    color: "#10B981",
    locationId: "loc-1",
    locationName: "Head Office - Riyadh",
    allowance: 0,
    description: "Standard morning shift",
    isDefault: false,
    employees: employees.slice(0, 10).map((e) => e.id),
  },
  {
    id: "shift-2",
    name: "Afternoon Shift",
    nameAr: "الشفت المسائي",
    startTime: "15:00",
    endTime: "23:00",
    breakDuration: 60,
    workHours: 8,
    color: "#F59E0B",
    locationId: "loc-1",
    locationName: "Head Office - Riyadh",
    allowance: 200,
    description: "Afternoon shift with evening allowance",
    isDefault: false,
    employees: employees.slice(10, 18).map((e) => e.id),
  },
  {
    id: "shift-3",
    name: "Night Shift",
    nameAr: "الشفت الليلي",
    startTime: "23:00",
    endTime: "07:00",
    breakDuration: 60,
    workHours: 8,
    color: "#6366F1",
    locationId: "loc-2",
    locationName: "NEOM Site",
    allowance: 500,
    description: "Night shift with special allowance",
    isDefault: false,
    employees: employees.slice(18, 25).map((e) => e.id),
  },
  {
    id: "shift-4",
    name: "Office Hours",
    nameAr: "ساعات المكتب",
    startTime: "08:00",
    endTime: "17:00",
    breakDuration: 60,
    workHours: 8,
    color: "#3B82F6",
    locationId: "loc-1",
    locationName: "Head Office - Riyadh",
    allowance: 0,
    description: "Standard office working hours (Sunday - Thursday)",
    isDefault: true,
    employees: employees.slice(25, 40).map((e) => e.id),
  },
  {
    id: "shift-5",
    name: "Flexible Hours",
    nameAr: "ساعات مرنة",
    startTime: "09:00",
    endTime: "18:00",
    breakDuration: 60,
    workHours: 8,
    color: "#8B5CF6",
    locationId: "loc-1",
    locationName: "Head Office - Riyadh",
    allowance: 0,
    description: "Flexible working hours for senior staff",
    isDefault: false,
    employees: employees.slice(40, 45).map((e) => e.id),
  },
  {
    id: "shift-6",
    name: "Site Rotation",
    nameAr: "التناوب الميداني",
    startTime: "06:00",
    endTime: "18:00",
    breakDuration: 90,
    workHours: 12,
    color: "#EF4444",
    locationId: "loc-2",
    locationName: "NEOM Site",
    allowance: 300,
    description: "12-hour site rotation shift",
    isDefault: false,
    employees: [],
  },
];

export const generateShiftAssignments = (
  days: number = 14,
): ShiftAssignment[] => {
  const assignments: ShiftAssignment[] = [];
  const today = new Date();

  for (let dayOffset = -7; dayOffset < days; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();

    // Skip Friday and Saturday (weekend in Saudi Arabia)
    if (dayOfWeek === 5 || dayOfWeek === 6) continue;

    shifts.forEach((shift) => {
      shift.employees.forEach((empId) => {
        const emp = employees.find((e) => e.id === empId);
        if (!emp || emp.status !== "Active") return;

        const isPast = dayOffset < 0;
        const status: ShiftAssignment["status"] = isPast
          ? Math.random() > 0.1
            ? "Completed"
            : "Missed"
          : "Scheduled";

        assignments.push({
          id: `assign-${dateStr}-${shift.id}-${empId}`,
          employeeId: empId,
          employeeName: emp.fullName,
          shiftId: shift.id,
          shiftName: shift.name,
          date: dateStr,
          status,
        });
      });
    });
  }

  return assignments.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
};

export const shiftAssignments = generateShiftAssignments(14);

export const getShiftById = (id: string): Shift | undefined => {
  return shifts.find((s) => s.id === id);
};

export const getShiftsByLocation = (locationId: string): Shift[] => {
  return shifts.filter((s) => s.locationId === locationId);
};

export const getAssignmentsByDate = (date: string): ShiftAssignment[] => {
  return shiftAssignments.filter((a) => a.date === date);
};

export const getAssignmentsByEmployee = (
  employeeId: string,
): ShiftAssignment[] => {
  return shiftAssignments.filter((a) => a.employeeId === employeeId);
};

export default shifts;
