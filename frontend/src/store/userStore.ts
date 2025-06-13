import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../services/api";
import axios from "axios";

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

type UserState = {
  users: User[];
  findUsers: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  addUser: (name: string, email: string, departmentId: number) => Promise<void>;
  updateUser: (
    id: number,
    data: { name: string; email: string; departmentId: number }
  ) => Promise<void>;
  getUserById: (id: number) => Promise<void>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [],
      findUsers: [],
      selectedUser: null,
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

          console.log(res.data,"asdfhakjsdhfkjasdhfkasjdh");
          
          set({
            selectedUser: res.data || null,
            loading: false,
          });
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
