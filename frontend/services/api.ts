import axios from 'axios';
import { Grievance } from '../types/grievance';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
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
    const response = await api.get('/grievance');
    return response.data;
  },

  create: async (formData: FormData): Promise<Grievance> => {
    try {
      const response = await api.post('/grievance', formData);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  },
  Like: async (id: string): Promise<Grievance[]> => {
    const response = await api.put(`/grievance/${id}/upvote`);
    return response.data;
  },
  Unike: async (id: string): Promise<Grievance[]> => {
    const response = await api.put(`/grievance/${id}/downvote`);
    return response.data;
  },

};

const authService = {
  loginWithGoogle: () => {
    window.location.href = `${baseURL}/auth/google`;
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  }
};

const adminService = {
  getAllGrievances: async (): Promise<Grievance[]> => {
    const response = await api.get('/admin/grievances');
    return response.data;
  },

  verifyGrievance: async (id: string, isPending: boolean, tags?: string[]): Promise<Grievance> => {
    const response = await api.put(`/admin/${id}/verify`, { 
      isPending,
      tags: tags ? tags : undefined
    });
    return response.data;
  },

  updateProgress: async (id: string, images: File[]): Promise<Grievance> => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('progressImages', image);
    });
    const response = await api.put(`/admin/${id}/progress`, formData);
    return response.data;
  }
};

export { grievanceService, authService, adminService };