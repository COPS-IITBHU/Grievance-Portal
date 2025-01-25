import axios from "axios";
import { Grievance } from "../types/grievance";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const grievanceService = {
  getAll: async (): Promise<Grievance[]> => {
    const response = await api.get("/grievance");
    return response.data;
  },

  create: async (formData: FormData): Promise<Grievance> => {
    try {
      const response = await api.post("/grievance", formData);
      return response.data;
    } catch (error: any) {
      if (error.code === "ECONNABORTED") {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    }
  },
};

const authService = {
  loginWithGoogle: () => {
    window.location.href = `${baseURL}/auth/google`;
  },

  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },
  onboardUser: async (
    data: {
      gender: string;
      rollNumber: string;
      program: string;
      year: string;
      hostel: string;
      branch: string;
      name: string;
    },
    token: string
  ) => {
    try {
      const response = await axios.post(`${baseURL}/auth/onBoarding`, {
        token,
        ...data,
      });
      authService.setToken(token);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  },
};

const adminService = {
  getAllGrievances: async (): Promise<Grievance[]> => {
    const response = await api.get("/admin/grievances");
    return response.data;
  },

  verifyGrievance: async (
    id: string,
    isPending: boolean,
    tags?: string[]
  ): Promise<Grievance> => {
    const response = await api.put(`/admin/${id}/verify`, {
      isPending,
      tags: tags ? tags : undefined,
    });
    return response.data;
  },

  updateProgress: async (id: string, images: File[]): Promise<Grievance> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("progressImages", image);
    });
    const response = await api.put(`/admin/${id}/progress`, formData);
    return response.data;
  },
  rejectGrievance: async (id: string, tags?: string[]): Promise<Grievance> => {
    const response = await api.put(`/admin/${id}/reject`, {
      tags: tags ? tags : undefined,
      isRejected: true,
      isPending: false,
    });
    return response.data;
  },
};

export { grievanceService, authService, adminService };
