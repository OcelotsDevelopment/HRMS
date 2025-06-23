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
  employeeId?: number;
  id?: number;
  standard: string;
  fromYear: number;
  toYear: number;
  percentage?: number;
};

type Employment = {
  id?: number;
  employeeId: number;
  employerName: string;
  positionHeld: string;
  location: string;
  workedFrom: string;
  workedTill: string;
  lastSalaryDrawn?: number | undefined;
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

type Payroll = {
  id?: number;
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  hra: number;
  otherAllowances?: number;
  grossSalary?: number; // computed at backend
  epf?: number;
  esi?: number;
  taxDeduction?: number;
  totalDeductions?: number; // computed at backend
  netPay?: number; // computed at backend
  paymentDate?: string; // ISO format string
  isPaid?: boolean;
  remarks?: string;
};
type Employee = {
  id: number;
  employeeUniqueId:string;
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
  currentPinCode?: string;          
  permanentAddress?: string;
  permanentPinCode?: string;        
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
  selectedEmployment?: Employment;
  selectedEmployee: Employee | null;
  references?: Reference[];
  payrolls?: Payroll[];
};


type EmployeeState = {
  employees: Employee[];
  selectedEmployee: Employee | null;
  selectedEmployment?: Employment | null;
  employments: Employment[] | [];
  loading: boolean;
  error: string | null;

  fetchEmployees: () => Promise<void>;
  getEmployeeById: (id: number) => Promise<void>;
  createEmployee: (data: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: number, data: Partial<Employee>) => Promise<void>;

  // Employeement
  addEmployment: (data: Employment) => Promise<void>;
  updateEmployment: (
    // employeeId: number,
    empId: number,
    data: Employment
  ) => Promise<void>;
  deleteEmployment: (employeeId: number, empId: number) => Promise<void>;
  fetchEmployments: (employeeId: number) => Promise<void>;
  getEmploymentById: (employeeId: number) => Promise<void>;

  // Qualification
  qualifications: Qualification[];
  selectedQualification: Qualification | null;
  Addqualification: Qualification | null;
  Updatequalification: Qualification | null;

  fetchQualifications: (employeeId: number) => Promise<void>;
  getQualificationById: (id: number) => Promise<void>;
  addQualification: (data: Qualification) => Promise<void>;
  updateQualification: (id: number, data: Qualification) => Promise<void>;

  payrolls: Payroll[];
  selectedPayroll: Payroll | null;
  fetchPayrolls: (employeeId: number) => Promise<void>;
  getPayrollById: (id: number) => Promise<void>;
  addPayroll: (data: Payroll) => Promise<void>;
  updatePayroll: (id: number, data: Payroll) => Promise<void>;
  deletePayroll: (id: number) => Promise<void>;
};

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set) => ({
      employees: [],
      selectedEmployee: null,
      employments: [],
      selectedEmployment: null,
      // qualification
      qualifications: [],
      selectedQualification: null,
      Addqualification: null,
      Updatequalification: null,
      // payroll
      payrolls: [],
      selectedPayroll: null,

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
          await useEmployeeStore
            .getState()
            .getEmployeeById(Number(data?.employeeId));
        } catch (err) {
          handleError(err, set);
        }
      },

      updateEmployment: async (empId, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/employee/employment/${empId}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useEmployeeStore
            .getState()
            .getEmployeeById(Number(data?.employeeId));
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

      getEmploymentById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/employee/employment/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ selectedEmployment: res?.data?.employment, loading: false });
          // set((state) => ({
          //   selectedEmployment: state.selectedEmployee
          //     ? {
          //         ...state.selectedEmployee,
          //         employments: [res.data.employment],
          //       }
          //     : null,
          //   loading: false,
          // }));
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

      // Qualification Store

      fetchQualifications: async (employeeId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/employee/qualifications/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ qualifications: res.data.qualifications, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      getQualificationById: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/employee/qualification/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({
            selectedQualification: res.data.qualification,
            loading: false,
          });
        } catch (err) {
          handleError(err, set);
        }
      },

      addQualification: async (data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.post(`/employee/qualification`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // if (data.employeeId) {
          //   await useEmployeeStore
          //     .getState()
          //     .fetchQualifications(Number(data.employeeId));
          // }
          set({ Addqualification: res.data.qualifications, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      updateQualification: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.put(`/employee/qualification/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // if (data.employeeId) {
          //   await useEmployeeStore
          //     .getState()
          //     .fetchQualifications(Number(data.employeeId));
          // }

          set({ Updatequalification: res.data, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      // Payroll

      fetchPayrolls: async (employeeId) => {
        // alert()
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/employee/payrolls/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          set({ payrolls: res.data.payrolls, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      getPayrollById: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/employee/payroll/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ selectedPayroll: res.data.payroll, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      addPayroll: async (data: Payroll) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");

          await api.post("/employee/payroll", data, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Refresh payroll list after adding (optional)
          await useEmployeeStore.getState().fetchPayrolls(data.employeeId);
        } catch (err) {
          handleError(err, set);
        }
      },

      updatePayroll: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/employee/payroll/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useEmployeeStore.getState().fetchPayrolls(data.employeeId);
        } catch (err) {
          handleError(err, set);
        }
      },

      deletePayroll: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.delete(`/employee/payroll/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set((state) => ({
            payrolls: state.payrolls.filter((p) => p.id !== id),
            loading: false,
          }));
        } catch (err) {
          handleError(err, set);
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