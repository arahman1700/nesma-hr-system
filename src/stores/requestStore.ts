import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Request } from "../types";
import { requests as initialRequests } from "../data/mockRequests";

interface RequestStore {
  requests: Request[];
  selectedRequest: Request | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setRequests: (requests: Request[]) => void;
  addRequest: (
    request: Omit<Request, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateRequest: (id: string, updates: Partial<Request>) => void;
  deleteRequest: (id: string) => void;
  approveRequest: (id: string, approverName: string) => void;
  rejectRequest: (id: string, reason: string) => void;
  selectRequest: (request: Request | null) => void;
  getRequestsByEmployee: (employeeId: string) => Request[];
  getPendingRequests: () => Request[];
  getRequestsByType: (type: Request["type"]) => Request[];
  getRequestStats: () => {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    inProgress: number;
    completed: number;
  };
  resetToInitial: () => void;
}

export const useRequestStore = create<RequestStore>()(
  persist(
    (set, get) => ({
      requests: initialRequests,
      selectedRequest: null,
      isLoading: false,
      error: null,

      setRequests: (requests) => set({ requests }),

      addRequest: (requestData) => {
        const newRequest: Request = {
          ...requestData,
          id: `req-${Date.now()}`,
          status: "Pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Request;
        set((state) => ({
          requests: [newRequest, ...state.requests],
        }));
      },

      updateRequest: (id, updates) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? { ...request, ...updates, updatedAt: new Date().toISOString() }
              : request,
          ),
        }));
      },

      deleteRequest: (id) => {
        set((state) => ({
          requests: state.requests.filter((request) => request.id !== id),
          selectedRequest:
            state.selectedRequest?.id === id ? null : state.selectedRequest,
        }));
      },

      approveRequest: (id, approverName) => {
        set((state) => ({
          requests: state.requests.map((request) => {
            if (request.id === id) {
              const updatedFlow = request.approvalFlow?.map((step, index) => {
                if (index === 0 && step.status === "Pending") {
                  return {
                    ...step,
                    status: "Approved" as const,
                    date: new Date().toISOString(),
                    approverName,
                  };
                }
                return step;
              });

              const allApproved = updatedFlow?.every(
                (step) => step.status === "Approved",
              );

              return {
                ...request,
                status: allApproved
                  ? ("Approved" as const)
                  : ("In Progress" as const),
                approvalFlow: updatedFlow,
                updatedAt: new Date().toISOString(),
              };
            }
            return request;
          }),
        }));
      },

      rejectRequest: (id, reason) => {
        set((state) => ({
          requests: state.requests.map((request) => {
            if (request.id === id) {
              const updatedFlow = request.approvalFlow?.map((step, index) => {
                if (index === 0 && step.status === "Pending") {
                  return {
                    ...step,
                    status: "Rejected" as const,
                    date: new Date().toISOString(),
                    comments: reason,
                  };
                }
                return step;
              });

              return {
                ...request,
                status: "Rejected" as const,
                approvalFlow: updatedFlow,
                updatedAt: new Date().toISOString(),
              };
            }
            return request;
          }),
        }));
      },

      selectRequest: (request) => set({ selectedRequest: request }),

      getRequestsByEmployee: (employeeId) => {
        return get().requests.filter(
          (request) => request.employeeId === employeeId,
        );
      },

      getPendingRequests: () => {
        return get().requests.filter((request) => request.status === "Pending");
      },

      getRequestsByType: (type) => {
        return get().requests.filter((request) => request.type === type);
      },

      getRequestStats: () => {
        const requests = get().requests;
        return {
          total: requests.length,
          pending: requests.filter((r) => r.status === "Pending").length,
          approved: requests.filter((r) => r.status === "Approved").length,
          rejected: requests.filter((r) => r.status === "Rejected").length,
          inProgress: requests.filter((r) => r.status === "In Progress").length,
          completed: requests.filter((r) => r.status === "Completed").length,
        };
      },

      resetToInitial: () => set({ requests: initialRequests }),
    }),
    {
      name: "nesma-hr-requests",
      partialize: (state) => ({ requests: state.requests }),
    },
  ),
);

export default useRequestStore;
