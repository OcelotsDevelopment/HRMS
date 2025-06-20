import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { api } from "../services/api";

export type Holiday = {
  id: number;
  title: string;
  description?: string;
  date: string;
  isPaid: boolean;
  holidayTypeId: number;
  regionId?: number;
  createdAt: string;
  updatedAt: string;
};

type WorkspaceState = {
  holidays: Holiday[];
  selectedHoliday: Holiday | null;
  loading: boolean;
  error: string | null;

  fetchHolidays: () => Promise<void>;
  getHolidayById: (id: number) => Promise<void>;
  addHoliday: (data: Partial<Holiday>) => Promise<void>;
  updateHoliday: (id: number, data: Partial<Holiday>) => Promise<void>;
  deleteHoliday: (id: number) => Promise<void>;
};

export const useWorkforceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      holidays: [],
      selectedHoliday: null,
      loading: false,
      error: null,

      //   Holiday
      fetchHolidays: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get("/setting/workforce/holiday", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ holidays: res.data.holidays ?? [], loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      getHolidayById: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/setting/workforce/holiday/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ selectedHoliday: res.data.holiday ?? null, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      addHoliday: async (data) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.post("/setting/workforce/holiday", data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useWorkforceStore.getState().fetchHolidays();
        } catch (error) {
          handleError(error, set);
        }
      },

      updateHoliday: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/setting/workforce/holiday/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useWorkforceStore.getState().fetchHolidays();
        } catch (err) {
          handleError(err, set);
        }
      },

      deleteHoliday: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.delete(`/setting/workforce/holiday/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set((state) => ({
            holidays: state.holidays.filter((h) => h.id !== id),
            loading: false,
          }));
        } catch (err) {
          handleError(err, set);
        }
      },
    }),
    {
      name: "workspace-storage",
    }
  )
);

// Common error handler
function handleError(
  err: unknown,
  set: (partial: Partial<WorkspaceState>) => void
) {
  if (axios.isAxiosError(err)) {
    set({
      error: err.response?.data?.message || "Request failed",
      loading: false,
    });
  } else {
    set({ error: "Unexpected error occurred", loading: false });
  }
}
