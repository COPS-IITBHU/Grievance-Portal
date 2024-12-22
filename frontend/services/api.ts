import axios from 'axios';
import { Grievance } from '../types/grievance';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: baseURL,
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
    const response = await api.post('/grievance', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
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

export { grievanceService as grievanceApi, authService };