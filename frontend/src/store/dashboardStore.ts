import { create } from "zustand";
import { api } from "../services/api";
import axios from "axios";

type OverviewData = {
  overview: {
    totalEmployees: number;
    totalDepartments: number;
    todayAttendanceCount: number;
    changes: {
      employeeChange: number;
      departmentChange: number;
      attendanceChange: number;
    };
  };
  demographics: { nationality: string; count: number }[];
  birthdaysToday: {
    id: number;
    name: string;
    dob: string;
    email: string;
  }[];
  upcomingEvents: {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    regionId: number | null;
    type: string;
    description?: string;
  }[];
  holidaysToday: {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    region?: {
      id: number;
      name: string;
    };
  }[];
};

type DashboardState = {
  data: OverviewData | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      const response = await api.get("/dashboard/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ data: response.data?.data, loading: false });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        set({
          error:
            err.response?.data?.message || "Failed to fetch dashboard data",
          loading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", loading: false });
      }
    }
  },
}));
