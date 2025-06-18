import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../services/api";
import axios from "axios";

type Department = {
  id: number;
  name: string;
  headId: number;
  createdAt: string;
  updatedAt: string;
  head?: {
    id: number;
    name: string;
    image?: string;
    role?: string;
  };
};

type User = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Qualification = {
  id?: number;
  standard: string;
  fromYear: number;
  toYear: number;
  percentage?: number;
};

type Employment = {
  employeeId?: number;
  employerName: string;
  positionHeld: string;
  location: string;
  workedFrom: string;
  workedTill: string;
  lastSalaryDrawn?: number;
  reasonForLeaving?: string;
  remarks?: string;
};

type Reference = {
  id?: number;
  name: string;
  positionHeld: string;
  organization: string;
  contact: string;
};

type Employee = {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  designation?: string;
  sex?: string;
  dob?: string;
  age?: number;
  placeOfBirth?: string;
  height?: number;
  weight?: number;
  bloodGroup?: string;
  nationality?: string;
  maritalStatus?: string;
  currentAddress?: string;
  permanentAddress?: string;
  departmentId?: number;
  coordinatorId?: number;
  coordinator?: User;
  department: Department;
  employeeCode?: string;
  dateOfJoining?: string;
  position?: string;
  salaryOnJoining?: number;
  reportingTo?: string;
  hiredBy?: string;
  replacementOf?: string;
  isRehire?: boolean;
  liabilitiesDetails?: string;
  familyBackground?: string;
  hasFamilyBusiness?: boolean;
  familyBusinessDetails?: string;
  isPhysicallyImpaired?: boolean;
  impairmentDetails?: string;
  qualifications?: Qualification[];
  employments?: Employment[];
  references?: Reference[];
};

type EmployeeState = {
  employees: Employee[];
  selectedEmployee: Employee | null;
  employments:Employment[] | [];
  loading: boolean;
  error: string | null;

  fetchEmployees: () => Promise<void>;
  getEmployeeById: (id: number) => Promise<void>;
  createEmployee: (data: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: number, data: Partial<Employee>) => Promise<void>;

  // Employeement
  addEmployment: (data: Employment) => Promise<void>;
  updateEmployment: (
    employeeId: number,
    empId: number,
    data: Employment
  ) => Promise<void>;
  deleteEmployment: (employeeId: number, empId: number) => Promise<void>;
  fetchEmployments: (employeeId: number) => Promise<void>;
};

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set) => ({
      employees: [],
      selectedEmployee: null,
      employments: [],
      loading: false,
      error: null,

      fetchEmployees: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get("/employee", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res.data, "jksdhfksdhfkasdhfkjsdhfkdjh");

          set({ employees: res.data.employees, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      getEmployeeById: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/employee/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ selectedEmployee: res.data.employee, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      createEmployee: async (data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.post("/employee", data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useEmployeeStore.getState().fetchEmployees();
        } catch (err) {
          handleError(err, set);
        }
      },

      updateEmployee: async (id, data) => {
        console.log(data, "da====================sdfs============");
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/employee/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useEmployeeStore.getState().fetchEmployees();
        } catch (err) {
          handleError(err, set);
        }
      },

      // Employment
      addEmployment: async (data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.post(`/employee/employment`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useEmployeeStore.getState().getEmployeeById(Number(data?.employeeId));
        } catch (err) {
          handleError(err, set);
        }
      },

      updateEmployment: async (employeeId, empId, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/employee/${employeeId}/employments/${empId}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useEmployeeStore.getState().getEmployeeById(employeeId);
        } catch (err) {
          handleError(err, set);
        }
      },

      deleteEmployment: async (employeeId, empId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.delete(`/employee/${employeeId}/employments/${empId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useEmployeeStore.getState().getEmployeeById(employeeId);
        } catch (err) {
          handleError(err, set);
        }
      },

      fetchEmployments: async (employeeId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/employee/employments/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ employments: res.data?.employments, loading: false });
        } catch (err) {
          if (axios.isAxiosError(err)) {
            set({
              error: err.response?.data?.message || "Failed to fetch",
              loading: false,
            });
          } else {
            set({ error: "Unknown error occurred", loading: false });
          }
        }
      },
    }),
    {
      name: "employee-storage",
    }
  )
);

// 🔧 Error Handler
function handleError(
  err: unknown,
  set: (partial: Partial<EmployeeState>) => void
) {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message || "Request failed";
    set({ error: message, loading: false });
  } else {
    set({ error: "An unexpected error occurred", loading: false });
  }
}
