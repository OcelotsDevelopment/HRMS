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

// Employee

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
  currentPinCode?: string;
  permanentAddress?: string;
  permanentPinCode?: string;
  departmentId?: number;
  coordinatorId?: number;
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
};
// Leave

export type Leave = {
  id: number;
  title: string;
  description?: string;
  leaveDate: string;
  isPaid: boolean;
  status: "Pending" | "Approved" | "Rejected";
  employeeId: number;
  appliedById: number;
  appliedByEmployeeId?: number | null;
  appliedByUserId?: number | null;
  employee?: Employee | null;
  createdAt: string;
  updatedAt: string;
};


// event
export type Event = {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  color?: string;
  regionId?: number | null;
  type?: string;
  createdAt: string;
  updatedAt: string;
};

type WorkspaceState = {
  holidays: Holiday[];
  selectedHoliday: Holiday | null;
  addSuccessHoliday: Holiday | null;
  loading: boolean;
  error: string | null;

  fetchHolidays: () => Promise<void>;
  getHolidayById: (id: number) => Promise<void>;
  addHoliday: (data: Partial<Holiday>) => Promise<void>;
  updateHoliday: (id: number, data: Partial<Holiday>) => Promise<void>;
  deleteHoliday: (id: number) => Promise<void>;

  // Leave
  leaves: Leave[];
  selectedLeave: Leave | null;

  fetchLeaves: () => Promise<void>;
  getLeaveById: (id: number) => Promise<void>;
  addLeave: (data: Partial<Leave>) => Promise<void>;
  updateLeave: (id: number, data: Partial<Leave>) => Promise<void>;
  deleteLeave: (id: number) => Promise<void>;

  // Events
  events: Event[];
  selectedEvent: Event | null;
  addSuccessEvent: Event | null;

  fetchEvents: () => Promise<void>;
  getEventById: (id: number) => Promise<void>;
  addEvent: (data: Partial<Event>) => Promise<void>;
  updateEvent: (id: number, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
};

export const useWorkforceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      holidays: [],
      selectedHoliday: null,
      addSuccessHoliday: null,
      loading: false,
      error: null,
      // leave
      leaves: [],
      selectedLeave: null,
      // events
      events: [],
      selectedEvent: null,
      addSuccessEvent: null,

      //   Holiday
      fetchHolidays: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get("/workforce/holiday", {
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
          const res = await api.get(`/workforce/holiday/${id}`, {
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
          const res = await api.post("/workforce/holiday", data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ addSuccessHoliday: res.data, loading: false });
          await useWorkforceStore.getState().fetchHolidays();
        } catch (error) {
          handleError(error, set);
        }
      },

      updateHoliday: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/workforce/holiday/${id}`, data, {
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
          await api.delete(`/workforce/holiday/${id}`, {
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

      // Leave

      fetchLeaves: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get("/workforce/leave", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ leaves: res.data.leaves ?? [], loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      getLeaveById: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/workforce/leave/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ selectedLeave: res.data.leave ?? null, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      addLeave: async (data) => {
        try {
          const token = localStorage.getItem("auth_token");
          await api.post("/workforce/leave", data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useWorkforceStore.getState().fetchLeaves();
        } catch (error) {
          handleError(error, set);
        }
      },

      updateLeave: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/workforce/leave/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useWorkforceStore.getState().fetchLeaves();
        } catch (err) {
          handleError(err, set);
        }
      },

      deleteLeave: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.delete(`/workforce/leave/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set((state) => ({
            leaves: state.leaves.filter((l) => l.id !== id),
            loading: false,
          }));
        } catch (err) {
          handleError(err, set);
        }
      },

      fetchEvents: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get("/workforce/event", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ events: res.data.events ?? [], loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      getEventById: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.get(`/workforce/event/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ selectedEvent: res.data.event ?? null, loading: false });
        } catch (err) {
          handleError(err, set);
        }
      },

      addEvent: async (data) => {
        try {
          const token = localStorage.getItem("auth_token");
          const res = await api.post("/workforce/event", data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ addSuccessEvent: res.data, loading: false });
          await useWorkforceStore.getState().fetchEvents();
        } catch (err) {
          handleError(err, set);
        }
      },

      updateEvent: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.put(`/workforce/event/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await useWorkforceStore.getState().fetchEvents();
        } catch (err) {
          handleError(err, set);
        }
      },

      deleteEvent: async (id) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem("auth_token");
          await api.delete(`/workforce/event/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set((state) => ({
            deleteEvents: state.events,
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
