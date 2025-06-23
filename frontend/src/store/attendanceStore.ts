import { create } from "zustand";
import { api } from "../services/api";
import axios from "axios";

type AttendanceLog = {
  id?: string;
  timestamp: string;
  punchType: string | "IN" | "OUT";
  source: string | "BIOMETRIC" | "MANUAL";
  employeeId: number;
  employee?: {
    name: string;
  };
};

type DailyAttendance = {
  id?: string;
  employeeId: number;
  date: string; // ISO date
  checkIn?: string;
  checkOut?: string;
  totalHours?: number;
  otHours?: number;
  status: string | "PRESENT" | "ABSENT" | "HALF_DAY" | "LATE";
  source: "BIOMETRIC" | "MANUAL";
};

interface DailyAttendanceEntry {
  id: string;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number | null;
  otHours: number | null;
  status: string;
  source: string;
  employee: {
    id: number;
    name: string;
    email: string;
    employeeCode: string;
    department: {
      name: string;
    };
  };
}

type AttendanceState = {
  logs: AttendanceLog[];
  daily: DailyAttendance[];
  loading: boolean;
  error: string | null;
  selectedLog: AttendanceLog | null;
  dailyAttendance: DailyAttendanceEntry[];
  selectedDaily: DailyAttendanceEntry | null;

  fetchDailyAttendance: () => Promise<void>;

  fetchLogs: () => Promise<void>;
  addLog: (data: AttendanceLog) => Promise<void>;

  fetchDaily: (employeeId: number) => Promise<void>;
  addDaily: (data: DailyAttendance) => Promise<void>;
  updateDaily: (id: string, data: Partial<DailyAttendance>) => Promise<void>;

  getLogById: (id: string) => Promise<void>;
  updateLog: (id: string, data: Partial<AttendanceLog>) => Promise<void>;

  getDailyById: (id: string) => Promise<void>;
};

export const useAttendanceStore = create<AttendanceState>((set) => ({
  logs: [],
  daily: [],
  selectedLog: null,
  dailyAttendance: [],
  selectedDaily: null,
  loading: false,
  error: null,

  fetchLogs: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.get(`/attendance/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ logs: res.data.logs, loading: false });
    } catch (err) {
      handleError(err, set);
    }
  },

  fetchDailyAttendance: async () => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.get("/attendance/daily", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ dailyAttendance: res.data.data, loading: false });
    } catch (err) {
      handleError(err, set);
    }
  },

  addLog: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      await api.post(`/attendance/manual`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      handleError(err, set);
    } finally {
      set({ loading: false });
    }
  },

  fetchDaily: async (employeeId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.get(`/attendance/daily/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ daily: res.data.daily, loading: false });
    } catch (err) {
      handleError(err, set);
    }
  },

  addDaily: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      await api.post(`/attendance/manual`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      handleError(err, set);
    } finally {
      set({ loading: false });
    }
  },

  updateDaily: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      await api.put(`/attendance/daily/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      handleError(err, set);
    } finally {
      set({ loading: false });
    }
  },

  getLogById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.get(`/attendance/logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ selectedLog: res.data.log, loading: false });
    } catch (err) {
      handleError(err, set);
    }
  },

  updateLog: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      await api.put(`/attendance/logs/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optional: refresh logs
      await useAttendanceStore.getState().fetchLogs();
    } catch (err) {
      handleError(err, set);
    }
  },

  getDailyById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.get(`/attendance/daily/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ selectedDaily: res.data.daily, loading: false });
    } catch (err) {
      handleError(err, set);
    }
  },

  //  getDailyById: async (id) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const token = localStorage.getItem("auth_token");
  //     const res = await api.get(`/attendance/daily/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     set({ selectedDaily: res.data.daily, loading: false });
  //   } catch (err) {
  //     handleError(err, set);
  //   }
  // },
}));

function handleError(
  err: unknown,
  set: (partial: Partial<AttendanceState>) => void
) {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message || "Request failed";
    set({ error: message, loading: false });
  } else {
    set({ error: "An unexpected error occurred", loading: false });
  }
}
