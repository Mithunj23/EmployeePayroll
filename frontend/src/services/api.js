import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for global error handling (e.g., token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Detect token expiry and force logout or redirect
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors globally if needed
      localStorage.removeItem('token');
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Employee APIs
export const employeeAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getOne: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Payroll APIs
export const payrollAPI = {
  getAll: (params) => api.get('/payroll', { params }),
  getOne: (id) => api.get(`/payroll/${id}`),
  generate: (data) => api.post('/payroll/generate', data),
  updateStatus: (id, data) => api.put(`/payroll/${id}/status`, data),
  getEmployeePayslips: (employeeId) => api.get(`/payroll/employee/${employeeId}/payslips`),
  downloadPayslip: (id) =>
    api.get(`/payroll/${id}/download`, { responseType: 'blob' }),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: () => api.get('/attendance'), // Admin only: get all attendance records
  getAttendanceByEmployee: () => api.get('/attendance/employee'), // Employee or admin: get attendance for specific employee
  markAttendance: (data) => api.post('/attendance/mark', data), // Mark attendance (admin or employee self)
};

// Report APIs
export const reportAPI = {
  getDepartmentWise: (params) => api.get('/reports/department-wise', { params }),
  getMonthlySummary: (params) => api.get('/reports/monthly-summary', { params }),
  getYearlyComparison: () => api.get('/reports/yearly-comparison'),
};

export default api;
