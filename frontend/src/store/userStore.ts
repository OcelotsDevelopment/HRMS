import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../services/api";
import axios from "axios";
import type { BankDetail, Payroll, Qualification } from "../types/userType";

type User = {
  id: number;
  userUniqueId: string;
  name: string;
  email: string;
  role: string;
  departmentId: number;
  createdAt: string;
  updatedAt: string;
  headOf?: {
    id: number;
    name: string;
  };
};

type UserState = {
  users: User[];
  findUsers: User[];
  selectedUser: User | null;

  qualifications: Qualification[];
  payrolls: Payroll[];
  bankDetails: BankDetail[];
  earningsSummary: unknown | null;

  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  addUser: (name: string, email: string, departmentId: number) => Promise<void>;
  updateUser: (
    id: number,
    data: { name: string; email: string; departmentId: number,role:string }
  ) => Promise<void>;
  getUserById: (id: number) => Promise<void>;

  // new methods
  fetchUserQualifications: (userId: number) => Promise<void>;
  addQualification: (data: Partial<Qualification>) => Promise<void>;
  updateQualification: (
    id: number,
    data: Partial<Qualification>
  ) => Promise<void>;
  deleteQualification: (id: number) => Promise<void>;

  fetchUserPayrolls: (userId: number) => Promise<void>;
  addPayroll: (data: Partial<Payroll>) => Promise<void>;
  updatePayroll: (id: number, data: Partial<Payroll>) => Promise<void>;
  deletePayroll: (id: number) => Promise<void>;

  fetchUserBankDetails: (userId: number) => Promise<void>;
  addBankDetail: (data: Partial<BankDetail>) => Promise<void>;
  updateBankDetail: (id: number, data: Partial<BankDetail>) => Promise<void>;
  deleteBankDetail: (id: number) => Promise<void>;

  fetchUserEarningsSummary: (userId: number) => Promise<void>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [],
      findUsers: [],
      selectedUser: null,

      qualifications: [],
      payrolls: [],
      bankDetails: [],
      earningsSummary: null,
      loading: false,
      error: null,

      fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get("/admin/user", {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ findUsers: res.data || [], loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      addUser: async (name, email, departmentId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.post(
            "/admin/user/add",
            { name, email, departmentId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          set({
            users: res.data,
            loading: false,
          });
        } catch (err) {
          handleError(err, set);
        }
      },

      updateUser: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.put(`/admin/user/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({
            users: res.data,
            loading: false,
            error: null,
          });
        } catch (err) {
          handleError(err, set);
        }
      },

      getUserById: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log(res.data, "asdfhakjsdhfkjasdhfkasjdh");

          set({
            selectedUser: res.data || null,
            loading: false,
          });
        } catch (err) {
          handleError(err, set);
        }
      },

      // Qualifications
      fetchUserQualifications: async (userId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/admin/user/${userId}/qualification`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ qualifications: res.data, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },
      addQualification: async (data) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.post(`/admin/qualification`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          handleError(err, set);
        }
      },
      updateQualification: async (id, data) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/admin/qualification/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          handleError(err, set);
        }
      },
      deleteQualification: async (id) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.delete(`/admin/qualification/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          handleError(err, set);
        }
      },

      // Payroll
      fetchUserPayrolls: async (userId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/admin/user/${userId}/payroll`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ payrolls: res.data, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },
      addPayroll: async (data) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.post(`/admin/payroll`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          handleError(err, set);
        }
      },
      updatePayroll: async (id, data) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/admin/payroll/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          handleError(err, set);
        }
      },
      deletePayroll: async (id) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.delete(`/admin/payroll/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          handleError(err, set);
        }
      },

      // Bank Details
      fetchUserBankDetails: async (userId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/admin/user/${userId}/bank`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ bankDetails: res.data, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },
      addBankDetail: async (data) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.post(`/admin/bank-detail`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          handleError(err, set);
        }
      },
      updateBankDetail: async (id, data) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/admin/bank-detail/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          handleError(err, set);
        }
      },
      deleteBankDetail: async (id) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.delete(`/admin/bank-detail/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          handleError(err, set);
        }
      },

      // Earnings Summary
      fetchUserEarningsSummary: async (userId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/admin/user/${userId}/earnings-summary`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ earningsSummary: res.data, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },
    }),
    {
      name: "user-storage",
    }
  )
);

// Helper error handler
function handleError(err: unknown, set: (partial: Partial<UserState>) => void) {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message || "Request failed";
    set({ error: message, loading: false });
  } else {
    set({ error: "An unexpected error occurred", loading: false });
  }
}
