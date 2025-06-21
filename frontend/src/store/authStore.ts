import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../services/api";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  role: "employee" | "admin" | "hr";
};

type AuthState = {
  token: string | null;
  userLoged: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userLoged: null,
      loading: false,
      error: null,

      setToken: (token: string) => {
        set({ token });
        // Optionally decode token or fetch user info here
      },

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          console.log("Attempting to login with:", email, password);
          const res = await api.post("/auth/login", { email, password });
          const { token, user } = res.data; // your backend response
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user", JSON.stringify(user));
          set({ token, userLoged:user, loading: false });
          // Save token in axios headers
          // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const errorMsg = err.response?.data?.error || "Login failed";
            set({ error: errorMsg, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },

      logout: () => {
        set({ token: null, userLoged: null, error: null });
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({ token: state.token, user: state.userLoged }), // only persist these
    }
  )
);
