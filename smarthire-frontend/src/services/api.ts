import axios from 'axios';

const API_BASE_URL = 'http://localhost:5276/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data: any) => api.post('/Auth/register', data),
  login: (data: any) => api.post('/Auth/login', data),
};

export const jobService = {
  getAllJobs: () => api.get('/Jobs'),
  getActiveJobs: () => api.get('/Jobs/active'),
  getMyJobs: () => api.get('/Jobs/my-jobs'),
  getJobById: (id: number) => api.get(`/Jobs/${id}`),
  createJob: (data: any) => api.post('/Jobs', data),
  updateJob: (id: number, data: any) => api.put(`/Jobs/${id}`, data),
  deleteJob: (id: number) => api.delete(`/Jobs/${id}`),
};

export const applicationService = {
  getAllApplications: () => api.get('/Applications'),
  getApplicationsByJob: (jobId: number) => api.get(`/Applications/job/${jobId}`),
  getApplicationsByCandidate: (candidateId: number) => api.get(`/Applications/candidate/${candidateId}`),
  createApplication: (formData: FormData) => api.post('/Applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateApplicationStatus: (id: number, data: any) => api.put(`/Applications/${id}/status`, data),
};

export const dashboardService = {
  getStats: () => api.get('/Dashboard/stats'),
  getAnalytics: () => api.get('/Dashboard/analytics'),
};

export const profileService = {
  getMyProfile: () => api.get('/Profile'),
  getProfileByUserId: (userId: number) => api.get(`/Profile/${userId}`),
  updateProfile: (data: any) => api.put('/Profile', data),
  addWorkExperience: (data: any) => api.post('/Profile/experience', data),
  updateWorkExperience: (id: number, data: any) => api.put(`/Profile/experience/${id}`, data),
  deleteWorkExperience: (id: number) => api.delete(`/Profile/experience/${id}`),
  addEducation: (data: any) => api.post('/Profile/education', data),
  updateEducation: (id: number, data: any) => api.put(`/Profile/education/${id}`, data),
  deleteEducation: (id: number) => api.delete(`/Profile/education/${id}`),
  addSkill: (data: any) => api.post('/Profile/skill', data),
  updateSkill: (id: number, data: any) => api.put(`/Profile/skill/${id}`, data),
  deleteSkill: (id: number) => api.delete(`/Profile/skill/${id}`),
  addProject: (data: any) => api.post('/Profile/project', data),
  updateProject: (id: number, data: any) => api.put(`/Profile/project/${id}`, data),
  deleteProject: (id: number) => api.delete(`/Profile/project/${id}`),
};

export const interviewService = {
  getAll: () => api.get('/Interviews'),
  getById: (id: number) => api.get(`/Interviews/${id}`),
  getByApplication: (applicationId: number) => api.get(`/Interviews/application/${applicationId}`),
  getMyInterviews: () => api.get('/Interviews/candidate/my-interviews'),
  getUpcoming: () => api.get('/Interviews/upcoming'),
  schedule: (data: any) => api.post('/Interviews', data),
  update: (id: number, data: any) => api.put(`/Interviews/${id}`, data),
  cancel: (id: number) => api.delete(`/Interviews/${id}`),
};

export default api;
