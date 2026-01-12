import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Leave, LeaveBalance } from "../types";
import {
  leaves as initialLeaves,
  leaveBalances as initialBalances,
} from "../data/mockLeaves";

interface LeaveStore {
  leaves: Leave[];
  leaveBalances: LeaveBalance[];
  selectedLeave: Leave | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setLeaves: (leaves: Leave[]) => void;
  addLeave: (leave: Omit<Leave, "id" | "createdAt">) => void;
  updateLeave: (id: string, updates: Partial<Leave>) => void;
  deleteLeave: (id: string) => void;
  approveLeave: (id: string, approvedBy: string) => void;
  rejectLeave: (id: string, reason: string) => void;
  cancelLeave: (id: string) => void;
  selectLeave: (leave: Leave | null) => void;
  getLeavesByEmployee: (employeeId: string) => Leave[];
  getPendingLeaves: () => Leave[];
  getApprovedLeaves: () => Leave[];
  getLeaveBalance: (employeeId: string) => LeaveBalance | undefined;
  updateLeaveBalance: (
    employeeId: string,
    leaveType: string,
    days: number,
  ) => void;
  resetToInitial: () => void;
}

export const useLeaveStore = create<LeaveStore>()(
  persist(
    (set, get) => ({
      leaves: initialLeaves,
      leaveBalances: initialBalances,
      selectedLeave: null,
      isLoading: false,
      error: null,

      setLeaves: (leaves) => set({ leaves }),

      addLeave: (leaveData) => {
        const newLeave: Leave = {
          ...leaveData,
          id: `leave-${Date.now()}`,
          status: "Pending",
          createdAt: new Date().toISOString(),
        } as Leave;
        set((state) => ({
          leaves: [newLeave, ...state.leaves],
        }));
      },

      updateLeave: (id, updates) => {
        set((state) => ({
          leaves: state.leaves.map((leave) =>
            leave.id === id ? { ...leave, ...updates } : leave,
          ),
        }));
      },

      deleteLeave: (id) => {
        set((state) => ({
          leaves: state.leaves.filter((leave) => leave.id !== id),
          selectedLeave:
            state.selectedLeave?.id === id ? null : state.selectedLeave,
        }));
      },

      approveLeave: (id, approvedBy) => {
        const leave = get().leaves.find((l) => l.id === id);
        if (leave) {
          // Update leave status
          set((state) => ({
            leaves: state.leaves.map((l) =>
              l.id === id
                ? {
                    ...l,
                    status: "Approved" as const,
                    approvedBy,
                    approvedDate: new Date().toISOString(),
                  }
                : l,
            ),
          }));
          // Deduct from balance
          get().updateLeaveBalance(leave.employeeId, leave.type, leave.days);
        }
      },

      rejectLeave: (id, reason) => {
        set((state) => ({
          leaves: state.leaves.map((leave) =>
            leave.id === id
              ? {
                  ...leave,
                  status: "Rejected" as const,
                  rejectionReason: reason,
                }
              : leave,
          ),
        }));
      },

      cancelLeave: (id) => {
        const leave = get().leaves.find((l) => l.id === id);
        if (leave && leave.status === "Approved") {
          // Return days to balance
          const balance = get().getLeaveBalance(leave.employeeId);
          if (balance) {
            const leaveType = leave.type.toLowerCase() as keyof LeaveBalance;
            if (balance[leaveType] && typeof balance[leaveType] === "object") {
              const typeBalance = balance[leaveType] as {
                total: number;
                used: number;
                remaining: number;
              };
              set((state) => ({
                leaveBalances: state.leaveBalances.map((b) =>
                  b.employeeId === leave.employeeId
                    ? {
                        ...b,
                        [leaveType]: {
                          ...typeBalance,
                          used: typeBalance.used - leave.days,
                          remaining: typeBalance.remaining + leave.days,
                        },
                      }
                    : b,
                ),
              }));
            }
          }
        }
        set((state) => ({
          leaves: state.leaves.map((leave) =>
            leave.id === id
              ? { ...leave, status: "Cancelled" as const }
              : leave,
          ),
        }));
      },

      selectLeave: (leave) => set({ selectedLeave: leave }),

      getLeavesByEmployee: (employeeId) => {
        return get().leaves.filter((leave) => leave.employeeId === employeeId);
      },

      getPendingLeaves: () => {
        return get().leaves.filter((leave) => leave.status === "Pending");
      },

      getApprovedLeaves: () => {
        return get().leaves.filter((leave) => leave.status === "Approved");
      },

      getLeaveBalance: (employeeId) => {
        return get().leaveBalances.find((b) => b.employeeId === employeeId);
      },

      updateLeaveBalance: (employeeId, leaveType, days) => {
        const type = leaveType.toLowerCase() as keyof LeaveBalance;
        set((state) => ({
          leaveBalances: state.leaveBalances.map((balance) => {
            if (
              balance.employeeId === employeeId &&
              balance[type] &&
              typeof balance[type] === "object"
            ) {
              const typeBalance = balance[type] as {
                total: number;
                used: number;
                remaining: number;
              };
              return {
                ...balance,
                [type]: {
                  ...typeBalance,
                  used: typeBalance.used + days,
                  remaining: typeBalance.remaining - days,
                },
              };
            }
            return balance;
          }),
        }));
      },

      resetToInitial: () =>
        set({ leaves: initialLeaves, leaveBalances: initialBalances }),
    }),
    {
      name: "nesma-hr-leaves",
      partialize: (state) => ({
        leaves: state.leaves,
        leaveBalances: state.leaveBalances,
      }),
    },
  ),
);

export default useLeaveStore;
