// stores/useDepartmentStore.ts
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

type DepartmentState = {
  departments: Department[];
  findDepartments: Department[];
  findUserDepartments:User[]
  selectedDepartment: Department | null;
  loading: boolean;
  error: string | null;

  fetchDepartments: () => Promise<void>;
  fetchUsersDepartment: (id: number) => Promise<void>;
  addDepartment: (name: string, headId: number) => Promise<void>;
  updateDepartment: (id: number, name: string, headId: number) => Promise<void>;
  getDepartmentById: (id: number) => Promise<void>;
};

export const useDepartmentStore = create<DepartmentState>()(
  persist(
    (set) => ({
      departments: [],
      findDepartments: [],
      findUserDepartments:[],
      selectedDepartment: null,
      loading: false,
      error: null,

      fetchDepartments: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get("/department", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ findDepartments: res.data?.departments, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

       fetchUsersDepartment: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/department/fetchUser/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ findUserDepartments: res.data?.users, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      addDepartment: async (name, headId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.post(
            "/department",
            { name, headId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          set({
            departments: res.data,
            loading: false,
          });
        } catch (err) {
          console.log(err, "addDepartment error");
          handleError(err, set);
        }
      },

      updateDepartment: async (id, name, headId) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.put(
            `/department/${id}`,
            { name, headId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          set({
            departments: res.data,
            loading: false,
            error: null,
          });
        } catch (err) {
          handleError(err, set);
        }
      },

      getDepartmentById: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/department/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            selectedDepartment: res.data?.department || null,
            loading: false,
          });
        } catch (err) {
          handleError(err, set);
        }
      },
    }),
    {
      name: "department-storage",
    }
  )
);

// Helper error handler
function handleError(
  err: unknown,
  set: (partial: Partial<DepartmentState>) => void
) {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message || "Request failed";
    set({ error: message, loading: false });
  } else {
    set({ error: "An unexpected error occurred", loading: false });
  }
}
