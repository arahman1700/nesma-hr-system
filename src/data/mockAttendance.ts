import { AttendanceRecord } from "../types";
import { employees } from "./mockEmployees";

const statuses: AttendanceRecord["status"][] = [
  "Present",
  "Absent",
  "Late",
  "On Leave",
  "Holiday",
  "Weekend",
  "Remote",
];
const shifts = [
  { id: "shift-1", name: "Morning Shift", start: "08:00", end: "17:00" },
  { id: "shift-2", name: "Afternoon Shift", start: "14:00", end: "23:00" },
  { id: "shift-3", name: "Night Shift", start: "22:00", end: "07:00" },
  { id: "shift-4", name: "Flexible", start: "09:00", end: "18:00" },
];

const generateTimeVariation = (
  baseTime: string,
  maxMinutes: number,
): string => {
  const [hours, mins] = baseTime.split(":").map(Number);
  const variation = Math.floor(Math.random() * maxMinutes) - maxMinutes / 2;
  const totalMinutes = hours * 60 + mins + variation;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`;
};

export const generateAttendanceRecords = (
  days: number = 30,
): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();

    employees.forEach((emp, empIndex) => {
      if (emp.status !== "Active") return;

      const shift = shifts[empIndex % shifts.length];
      let status: AttendanceRecord["status"];
      let checkIn: string | null = null;
      let checkOut: string | null = null;
      let lateMinutes = 0;
      let workHours = 0;

      // Weekends (Friday = 5, Saturday = 6 in this example)
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        status = "Weekend";
      } else {
        // Random status distribution
        const rand = Math.random();
        if (rand < 0.75) {
          // 75% Present on time
          status = "Present";
          checkIn = generateTimeVariation(shift.start, 15);
          checkOut = generateTimeVariation(shift.end, 30);
          workHours = 8 + Math.random() * 2;
        } else if (rand < 0.85) {
          // 10% Late
          status = "Late";
          const lateOffset = Math.floor(Math.random() * 45) + 15;
          const [h, m] = shift.start.split(":").map(Number);
          const totalMins = h * 60 + m + lateOffset;
          checkIn = `${Math.floor(totalMins / 60)
            .toString()
            .padStart(2, "0")}:${(totalMins % 60).toString().padStart(2, "0")}`;
          checkOut = generateTimeVariation(shift.end, 30);
          lateMinutes = lateOffset;
          workHours = 8 - lateOffset / 60;
        } else if (rand < 0.92) {
          // 7% On Leave
          status = "On Leave";
        } else if (rand < 0.96) {
          // 4% Remote
          status = "Remote";
          checkIn = generateTimeVariation(shift.start, 20);
          checkOut = generateTimeVariation(shift.end, 40);
          workHours = 7.5 + Math.random() * 1.5;
        } else {
          // 4% Absent
          status = "Absent";
        }
      }

      const record: AttendanceRecord = {
        id: `att-${dateStr}-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        date: dateStr,
        checkIn,
        checkOut,
        status,
        lateMinutes,
        earlyLeaveMinutes: 0,
        workHours: Math.round(workHours * 100) / 100,
        overtimeHours:
          workHours > 8 ? Math.round((workHours - 8) * 100) / 100 : 0,
        breakMinutes:
          status === "Present" || status === "Late" || status === "Remote"
            ? 60
            : 0,
        locationId: emp.locationId,
        locationName: emp.locationName,
        shiftId: shift.id,
        shiftName: shift.name,
        notes:
          status === "Late"
            ? "Traffic delay"
            : status === "On Leave"
              ? "Annual leave"
              : undefined,
      };

      records.push(record);
    });
  }

  return records.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

export const attendanceRecords = generateAttendanceRecords(30);

export const getAttendanceByDate = (date: string): AttendanceRecord[] => {
  return attendanceRecords.filter((r) => r.date === date);
};

export const getAttendanceByEmployee = (
  employeeId: string,
): AttendanceRecord[] => {
  return attendanceRecords.filter((r) => r.employeeId === employeeId);
};

export const getTodayAttendance = (): AttendanceRecord[] => {
  const today = new Date().toISOString().split("T")[0];
  return getAttendanceByDate(today);
};

export const getAttendanceStats = (date: string) => {
  const records = getAttendanceByDate(date);
  return {
    total: records.length,
    present: records.filter((r) => r.status === "Present").length,
    late: records.filter((r) => r.status === "Late").length,
    absent: records.filter((r) => r.status === "Absent").length,
    onLeave: records.filter((r) => r.status === "On Leave").length,
    remote: records.filter((r) => r.status === "Remote").length,
    weekend: records.filter((r) => r.status === "Weekend").length,
  };
};

export default attendanceRecords;
