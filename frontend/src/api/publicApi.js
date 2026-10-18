import apiClient from './apiClient';
import { supabasePublicApi } from './supabasePublicApi';
import { isSupabaseConfigured } from './supabaseClient';

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
  // ==========================================================================
  // Consolidated Full Portfolio Bundle (Direct Supabase Reads with Render Fallback)
  // ==========================================================================
  getPublicPortfolio: async () => {
    if (isSupabaseConfigured()) {
      try {
        const bundle = await supabasePublicApi.getPublicPortfolio();
        return bundle;
      } catch (err) {
        console.warn('[Data Access] Supabase bundle read failed, falling back to backend API:', err);
      }
    }
    const res = await apiClient.get('/public/portfolio');
    return res.data.data;
  },

  // ==========================================================================
  // Header / Navigation Content
  // ==========================================================================
  getHeader: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getHeader();
      } catch (err) {
        console.warn('[Data Access] Supabase header read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/header');
    return res.data.data;
  },

  // ==========================================================================
  // Hero Content
  // ==========================================================================
  getHero: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getHero();
      } catch (err) {
        console.warn('[Data Access] Supabase hero read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/hero');
    return res.data.data;
  },

  // ==========================================================================
  // About Content
  // ==========================================================================
  getAbout: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getAbout();
      } catch (err) {
        console.warn('[Data Access] Supabase about read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/about');
    return res.data.data;
  },

  // ==========================================================================
  // Projects
  // ==========================================================================
  getProjectsHeader: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getSectionHeader('PROJECTS');
      } catch (err) {
        console.warn('[Data Access] Supabase projects header read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/projects/header');
    return res.data.data;
  },
  getProjects: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getProjects();
      } catch (err) {
        console.warn('[Data Access] Supabase projects read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/projects');
    return res.data.data;
  },
  getProjectById: async (id) => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getProjectById(id);
      } catch (err) {
        console.warn('[Data Access] Supabase project by id read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get(`/projects/${id}`);
    return res.data.data;
  },

  // ==========================================================================
  // Skills
  // ==========================================================================
  getSkillsHeader: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getSectionHeader('SKILLS');
      } catch (err) {
        console.warn('[Data Access] Supabase skills header read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/skills/header');
    return res.data.data;
  },
  getSkills: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getSkills();
      } catch (err) {
        console.warn('[Data Access] Supabase skills read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/skills');
    return res.data.data;
  },
  getGroupedSkills: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getGroupedSkills();
      } catch (err) {
        console.warn('[Data Access] Supabase grouped skills read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/skills/grouped');
    return res.data.data;
  },

  // ==========================================================================
  // Experience
  // ==========================================================================
  getExperienceHeader: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getSectionHeader('EXPERIENCE');
      } catch (err) {
        console.warn('[Data Access] Supabase experience header read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/experience/header');
    return res.data.data;
  },
  getExperience: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getExperience();
      } catch (err) {
        console.warn('[Data Access] Supabase experience read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/experience');
    return res.data.data;
  },

  // ==========================================================================
  // Certifications
  // ==========================================================================
  getCertificationsHeader: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getSectionHeader('CERTIFICATIONS');
      } catch (err) {
        console.warn('[Data Access] Supabase certs header read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/certifications/header');
    return res.data.data;
  },
  getCertifications: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getCertifications();
      } catch (err) {
        console.warn('[Data Access] Supabase certifications read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/certifications');
    return res.data.data;
  },
  getCertificateViewUrl: (id) => getFullApiUrl(`/api/certifications/${id}/certificate`),

  // ==========================================================================
  // Contact Section Settings & Inquiries
  // ==========================================================================
  getContactSettings: async () => {
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.getContactSettings();
      } catch (err) {
        console.warn('[Data Access] Supabase contact settings read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/contact');
    return res.data.data;
  },
  submitContact: async (data) => {
    // 1. Prioritize direct Supabase insertion for instant sub-second submission
    //    with ZERO reliance on Render cold-starts or backend sleep state.
    if (isSupabaseConfigured()) {
      try {
        return await supabasePublicApi.submitContact(data);
      } catch (err) {
        console.warn('[Data Access] Supabase direct contact submission failed, falling back to backend API:', err);
      }
    }

    // 2. Fallback to Spring Boot REST endpoint on Render
    const res = await apiClient.post('/contact', data);
    return res.data;
  },

  // ==========================================================================
  // Active Resume
  // ==========================================================================
  getActiveResume: async () => {
    if (isSupabaseConfigured()) {
      try {
        const resume = await supabasePublicApi.getActiveResume();
        if (resume) return resume;
      } catch (err) {
        console.warn('[Data Access] Supabase resume read failed, falling back to API:', err);
      }
    }
    const res = await apiClient.get('/resume');
    return res.data.data;
  },
  getResumeDownloadUrl: (activeResume) => {
    if (activeResume?.downloadUrl) return activeResume.downloadUrl;
    return getFullApiUrl('/api/resume/download');
  },
  getResumePreviewUrl: (activeResume) => {
    if (activeResume?.previewUrl) return activeResume.previewUrl;
    return getFullApiUrl('/api/resume/preview');
  },
  getFullUrl: (endpoint) => getFullApiUrl(endpoint),
};
