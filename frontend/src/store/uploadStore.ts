import { create } from "zustand";
import { api } from "../services/api"; // your axios instance
import axios from "axios";

interface UploadState {
  uploading: boolean;
  uploadedUrl: string | null;
  error: string | null;
  uploadImage: (employeeId: number, file: File) => Promise<string | null>;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploading: false,
  uploadedUrl: null,
  error: null,

  uploadImage: async (employeeId, file) => {
    set({ uploading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("image", file); // Match the multer field name
      const token = localStorage.getItem("auth_token");
      const res = await api.post(
        `/employee/${employeeId}/upload-image`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = res.data?.url || null;
      set({ uploadedUrl: url, uploading: false });
      return url;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "Request failed";
        set({ error: message });
      } else {
        set({ error: "An unexpected error occurred" });
      }
    }
  },
}));
