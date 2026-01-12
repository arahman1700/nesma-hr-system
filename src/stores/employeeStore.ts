import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Employee } from "../types";
import { employees as initialEmployees } from "../data/mockEmployees";

interface EmployeeStore {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  selectEmployee: (employee: Employee | null) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  getEmployeesByDepartment: (department: string) => Employee[];
  getActiveEmployees: () => Employee[];
  searchEmployees: (query: string) => Employee[];
  resetToInitial: () => void;
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: initialEmployees,
      selectedEmployee: null,
      isLoading: false,
      error: null,

      setEmployees: (employees) => set({ employees }),

      addEmployee: (employee) => {
        const newEmployee: Employee = {
          ...employee,
          id: `emp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          employees: [...state.employees, newEmployee],
        }));
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id
              ? { ...emp, ...updates, updatedAt: new Date().toISOString() }
              : emp,
          ),
        }));
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
          selectedEmployee:
            state.selectedEmployee?.id === id ? null : state.selectedEmployee,
        }));
      },

      selectEmployee: (employee) => set({ selectedEmployee: employee }),

      getEmployeeById: (id) => {
        return get().employees.find((emp) => emp.id === id);
      },

      getEmployeesByDepartment: (department) => {
        return get().employees.filter((emp) => emp.department === department);
      },

      getActiveEmployees: () => {
        return get().employees.filter((emp) => emp.status === "Active");
      },

      searchEmployees: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().employees.filter(
          (emp) =>
            emp.fullName.toLowerCase().includes(lowerQuery) ||
            emp.email.toLowerCase().includes(lowerQuery) ||
            emp.employeeId.toLowerCase().includes(lowerQuery) ||
            emp.department.toLowerCase().includes(lowerQuery) ||
            emp.position.toLowerCase().includes(lowerQuery),
        );
      },

      resetToInitial: () => set({ employees: initialEmployees }),
    }),
    {
      name: "nesma-hr-employees",
      partialize: (state) => ({ employees: state.employees }),
    },
  ),
);

export default useEmployeeStore;
