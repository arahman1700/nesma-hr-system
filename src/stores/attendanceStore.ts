import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AttendanceRecord } from "../types";
import {
  attendanceRecords as initialRecords,
  getAttendanceStats,
} from "../data/mockAttendance";

interface AttendanceStore {
  records: AttendanceRecord[];
  selectedRecord: AttendanceRecord | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setRecords: (records: AttendanceRecord[]) => void;
  addRecord: (record: Omit<AttendanceRecord, "id">) => void;
  updateRecord: (id: string, updates: Partial<AttendanceRecord>) => void;
  deleteRecord: (id: string) => void;
  markAttendance: (
    employeeId: string,
    status: AttendanceRecord["status"],
    checkIn?: string,
    notes?: string,
  ) => void;
  checkOut: (id: string, checkOut: string) => void;
  selectRecord: (record: AttendanceRecord | null) => void;
  getRecordsByDate: (date: string) => AttendanceRecord[];
  getRecordsByEmployee: (employeeId: string) => AttendanceRecord[];
  getTodayRecords: () => AttendanceRecord[];
  getStats: (date: string) => ReturnType<typeof getAttendanceStats>;
  resetToInitial: () => void;
}

export const useAttendanceStore = create<AttendanceStore>()(
  persist(
    (set, get) => ({
      records: initialRecords,
      selectedRecord: null,
      isLoading: false,
      error: null,

      setRecords: (records) => set({ records }),

      addRecord: (recordData) => {
        const newRecord: AttendanceRecord = {
          ...recordData,
          id: `att-${Date.now()}`,
        };
        set((state) => ({
          records: [newRecord, ...state.records],
        }));
      },

      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id ? { ...record, ...updates } : record,
          ),
        }));
      },

      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
          selectedRecord:
            state.selectedRecord?.id === id ? null : state.selectedRecord,
        }));
      },

      markAttendance: (employeeId, status, checkIn, notes) => {
        const today = new Date().toISOString().split("T")[0];
        const existingRecord = get().records.find(
          (r) => r.employeeId === employeeId && r.date === today,
        );

        if (existingRecord) {
          // Update existing record
          get().updateRecord(existingRecord.id, {
            status,
            checkIn: checkIn || existingRecord.checkIn,
            notes: notes || existingRecord.notes,
          });
        } else {
          // Create new record
          const employee = get().records.find(
            (r) => r.employeeId === employeeId,
          );
          get().addRecord({
            employeeId,
            employeeName: employee?.employeeName || "Unknown",
            date: today,
            status,
            checkIn: checkIn || new Date().toTimeString().slice(0, 5),
            checkOut: null,
            lateMinutes: 0,
            earlyLeaveMinutes: 0,
            workHours: 0,
            overtimeHours: 0,
            breakMinutes: 60,
            locationId: "loc-001",
            locationName: "Riyadh HQ",
            shiftId: "shift-001",
            shiftName: "Morning Shift",
            notes: notes || "",
          });
        }
      },

      checkOut: (id, checkOut) => {
        const record = get().records.find((r) => r.id === id);
        if (record && record.checkIn) {
          const checkInTime = new Date(`2000-01-01 ${record.checkIn}`);
          const checkOutTime = new Date(`2000-01-01 ${checkOut}`);
          const diffMs = checkOutTime.getTime() - checkInTime.getTime();
          const workHours = Math.max(0, diffMs / (1000 * 60 * 60) - 1); // Minus 1 hour break

          get().updateRecord(id, {
            checkOut,
            workHours: Math.round(workHours * 10) / 10,
            overtimeHours: Math.max(0, workHours - 8),
          });
        }
      },

      selectRecord: (record) => set({ selectedRecord: record }),

      getRecordsByDate: (date) => {
        return get().records.filter((record) => record.date === date);
      },

      getRecordsByEmployee: (employeeId) => {
        return get().records.filter(
          (record) => record.employeeId === employeeId,
        );
      },

      getTodayRecords: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().getRecordsByDate(today);
      },

      getStats: (date) => {
        const records = get().getRecordsByDate(date);
        return {
          total: records.length,
          present: records.filter((r) => r.status === "Present").length,
          late: records.filter((r) => r.status === "Late").length,
          absent: records.filter((r) => r.status === "Absent").length,
          onLeave: records.filter((r) => r.status === "On Leave").length,
          remote: records.filter((r) => r.status === "Remote").length,
          weekend: records.filter((r) => r.status === "Weekend").length,
        };
      },

      resetToInitial: () => set({ records: initialRecords }),
    }),
    {
      name: "nesma-hr-attendance",
      partialize: (state) => ({ records: state.records }),
    },
  ),
);

export default useAttendanceStore;
