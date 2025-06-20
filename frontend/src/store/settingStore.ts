import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../services/api";
import axios from "axios";

export type Region = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

type RegionState = {
  regions: Region[];
  selectedRegion: Region | null;
  loading: boolean;
  error: string | null;

  fetchRegions: () => Promise<void>;
  getRegionById: (id: number) => Promise<void>;
  addRegion: (data: Partial<Region>) => Promise<void>;
  updateRegion: (id: number, data: Partial<Region>) => Promise<void>;
  deleteRegion: (id: number) => Promise<void>;

  // Holiday
  holidayTypes: HolidayType[];
  selectedHolidayType: HolidayType | null;
  fetchHolidayTypes: () => Promise<void>;
  getHolidayTypeById: (id: number) => Promise<void>;
  addHolidayType: (data: Partial<HolidayType>) => Promise<void>;
  updateHolidayType: (id: number, data: Partial<HolidayType>) => Promise<void>;
  deleteHolidayType: (id: number) => Promise<void>;
};

export type HolidayType = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const useSettingStore = create<RegionState>()(
  persist(
    (set) => ({
      regions: [],
      selectedRegion: null,
      holidayTypes: [],
      selectedHolidayType: null,
      loading: false,
      error: null,

      fetchRegions: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get("/setting/region", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ regions: res.data.regions?.regions, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      getRegionById: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/setting/region/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ selectedRegion: res.data.region?.region, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      addRegion: async (data: Partial<Region>) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.post("/setting/region", data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useSettingStore.getState().fetchRegions();
        } catch (error) {
          handleError(error, set);
        }
      },

      updateRegion: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/setting/region/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useSettingStore.getState().fetchRegions();
        } catch (err) {
          handleError(err, set);
        }
      },

      deleteRegion: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.delete(`/setting/region/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set((state) => ({
            regions: state.regions.filter((r) => r.id !== id),
            loading: false,
          }));
        } catch (err) {
          handleError(err, set);
        }
      },

      // Holiday Type

      fetchHolidayTypes: async () => {
        const token = localStorage.getItem("auth_token");
        const res = await api.get("/setting/holiday-type", {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ holidayTypes: res.data.holidayTypes?.holidayTypes });
      },

      getHolidayTypeById: async (id) => {
        const token = localStorage.getItem("auth_token");
        const res = await api.get(`/setting/holiday-type/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ selectedHolidayType: res.data.holidayType?.holidayType });
      },

      addHolidayType: async (data) => {
        const token = localStorage.getItem("auth_token");
        await api.post("/setting/holiday-type", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await useSettingStore.getState().fetchHolidayTypes();
      },

      updateHolidayType: async (id, data) => {
        const token = localStorage.getItem("auth_token");
        await api.put(`/setting/holiday-type/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await useSettingStore.getState().fetchHolidayTypes();
      },

      deleteHolidayType: async (id) => {
        const token = localStorage.getItem("auth_token");
        await api.delete(`/setting/holiday-type/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          holidayTypes: state.holidayTypes.filter((h) => h.id !== id),
        }));
      },
    }),
    { name: "setting-storage" }
  )
);

// Common error handler
function handleError(
  err: unknown,
  set: (partial: Partial<RegionState>) => void
) {
  if (axios.isAxiosError(err)) {
    console.log(err, "sdljfhsdkfjhaskdjfhaskdjfhaskdjfhdkh");

    set({
      error: err.response?.data?.message || "Request failed",
      loading: false,
    });
  } else {
    set({ error: "Unexpected error occurred", loading: false });
  }
}
