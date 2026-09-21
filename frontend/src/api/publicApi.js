import apiClient from './apiClient';

export const getFullApiUrl = (endpoint) => {
  const base = import.meta.env.VITE_API_BASE_URL || '/api';
  if (!endpoint) return base;

  // If base is a full URL (e.g. 'https://backend.onrender.com/api' or 'http://localhost:8080/api')
  if (base.startsWith('http://') || base.startsWith('https://')) {
    const cleanBase = base.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (cleanBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
      return cleanBase + cleanEndpoint.substring(4);
    }
    return cleanBase + cleanEndpoint;
  }

  // If base is relative ('/api')
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return cleanEndpoint;
};

export const publicApi = {
  // Consolidated Full Portfolio Bundle (High Performance)
  getPublicPortfolio: async () => {
    const res = await apiClient.get('/public/portfolio');
    return res.data.data;
  },

  // Header / Navigation Content
  getHeader: async () => {
    const res = await apiClient.get('/header');
    return res.data.data;
  },

  // Hero Content
  getHero: async () => {
    const res = await apiClient.get('/hero');
    return res.data.data;
  },

  // About Content
  getAbout: async () => {
    const res = await apiClient.get('/about');
    return res.data.data;
  },

  // Projects
  getProjectsHeader: async () => {
    const res = await apiClient.get('/projects/header');
    return res.data.data;
  },
  getProjects: async () => {
    const res = await apiClient.get('/projects');
    return res.data.data;
  },
  getProjectById: async (id) => {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data.data;
  },

  // Skills
  getSkillsHeader: async () => {
    const res = await apiClient.get('/skills/header');
    return res.data.data;
  },
  getSkills: async () => {
    const res = await apiClient.get('/skills');
    return res.data.data;
  },
  getGroupedSkills: async () => {
    const res = await apiClient.get('/skills/grouped');
    return res.data.data;
  },

  // Experience
  getExperienceHeader: async () => {
    const res = await apiClient.get('/experience/header');
    return res.data.data;
  },
  getExperience: async () => {
    const res = await apiClient.get('/experience');
    return res.data.data;
  },

  // Certifications
  getCertificationsHeader: async () => {
    const res = await apiClient.get('/certifications/header');
    return res.data.data;
  },
  getCertifications: async () => {
    const res = await apiClient.get('/certifications');
    return res.data.data;
  },
  getCertificateViewUrl: (id) => getFullApiUrl(`/api/certifications/${id}/certificate`),

  // Contact Section Settings & Inquiries
  getContactSettings: async () => {
    const res = await apiClient.get('/contact');
    return res.data.data;
  },
  submitContact: async (data) => {
    const res = await apiClient.post('/contact', data);
    return res.data;
  },

  // Active Resume
  getActiveResume: async () => {
    const res = await apiClient.get('/resume');
    return res.data.data;
  },
  getResumeDownloadUrl: () => getFullApiUrl('/api/resume/download'),
  getResumePreviewUrl: () => getFullApiUrl('/api/resume/preview'),
  getFullUrl: (endpoint) => getFullApiUrl(endpoint)
};
