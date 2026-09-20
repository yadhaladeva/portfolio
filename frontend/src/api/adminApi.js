import apiClient from './apiClient';

export const adminApi = {
  // Header / Navigation CMS Management
  getHeader: async () => {
    const res = await apiClient.get('/admin/header');
    return res.data.data;
  },
  updateHeader: async (headerData) => {
    const res = await apiClient.put('/admin/header', headerData);
    return res.data.data || res.data;
  },
  resetHeader: async () => {
    const res = await apiClient.post('/admin/header/reset');
    return res.data.data || res.data;
  },

  // Hero CMS Management
  getHero: async () => {
    const res = await apiClient.get('/admin/hero');
    return res.data.data;
  },
  updateHero: async (heroData) => {
    const res = await apiClient.put('/admin/hero', heroData);
    return res.data.data || res.data;
  },
  resetHero: async () => {
    const res = await apiClient.post('/admin/hero/reset');
    return res.data.data || res.data;
  },

  // About CMS Management
  getAbout: async () => {
    const res = await apiClient.get('/admin/about');
    return res.data.data;
  },
  updateAbout: async (aboutData) => {
    const res = await apiClient.put('/admin/about', aboutData);
    return res.data.data || res.data;
  },
  resetAbout: async () => {
    const res = await apiClient.post('/admin/about/reset');
    return res.data.data || res.data;
  },

  // Stats
  getStats: async () => {
    const res = await apiClient.get('/admin/stats');
    return res.data.data;
  },

  // Projects CRUD
  getProjects: async () => {
    const res = await apiClient.get('/admin/projects');
    return res.data.data;
  },
  createProject: async (project) => {
    const res = await apiClient.post('/admin/projects', project);
    return res.data.data;
  },
  updateProject: async (id, project) => {
    const res = await apiClient.put(`/admin/projects/${id}`, project);
    return res.data.data;
  },
  deleteProject: async (id) => {
    const res = await apiClient.delete(`/admin/projects/${id}`);
    return res.data;
  },

  // Skills CRUD
  getSkills: async () => {
    const res = await apiClient.get('/admin/skills');
    return res.data.data;
  },
  createSkill: async (skill) => {
    const res = await apiClient.post('/admin/skills', skill);
    return res.data.data;
  },
  updateSkill: async (id, skill) => {
    const res = await apiClient.put(`/admin/skills/${id}`, skill);
    return res.data.data;
  },
  deleteSkill: async (id) => {
    const res = await apiClient.delete(`/admin/skills/${id}`);
    return res.data;
  },

  // Experience CRUD
  getExperience: async () => {
    const res = await apiClient.get('/admin/experience');
    return res.data.data;
  },
  createExperience: async (exp) => {
    const res = await apiClient.post('/admin/experience', exp);
    return res.data.data;
  },
  updateExperience: async (id, exp) => {
    const res = await apiClient.put(`/admin/experience/${id}`, exp);
    return res.data.data;
  },
  deleteExperience: async (id) => {
    const res = await apiClient.delete(`/admin/experience/${id}`);
    return res.data;
  },

  // Certifications CRUD
  getCertifications: async () => {
    const res = await apiClient.get('/admin/certifications');
    return res.data.data;
  },
  createCertification: async (certData) => {
    const isFormData = certData instanceof FormData;
    const res = await apiClient.post('/admin/certifications', certData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data.data;
  },
  updateCertification: async (id, certData) => {
    const isFormData = certData instanceof FormData;
    const res = await apiClient.put(`/admin/certifications/${id}`, certData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data.data;
  },
  deleteCertificate: async (id) => {
    const res = await apiClient.delete(`/admin/certifications/${id}/certificate`);
    return res.data.data || res.data;
  },
  deleteCertification: async (id) => {
    const res = await apiClient.delete(`/admin/certifications/${id}`);
    return res.data;
  },

  // Contact Messages
  getMessages: async () => {
    const res = await apiClient.get('/admin/messages');
    return res.data.data;
  },
  updateMessageStatus: async (id, status) => {
    const res = await apiClient.patch(`/admin/messages/${id}/status`, { status });
    return res.data.data;
  },
  deleteMessage: async (id) => {
    const res = await apiClient.delete(`/admin/messages/${id}`);
    return res.data;
  },

  // Available Technologies
  getTechnologies: async () => {
    const res = await apiClient.get('/technologies');
    return res.data.data;
  },

  // Resume Management
  getActiveResume: async () => {
    const res = await apiClient.get('/admin/resume');
    return res.data.data;
  },
  getAllResumes: async () => {
    const res = await apiClient.get('/admin/resume/all');
    return res.data.data;
  },
  uploadResume: async (formData) => {
    const res = await apiClient.post('/admin/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },
  deleteResume: async (id) => {
    const res = await apiClient.delete(`/admin/resume/${id}`);
    return res.data;
  },

  // Contact CMS Management
  getContactSettings: async () => {
    const res = await apiClient.get('/admin/contact');
    return res.data.data;
  },
  updateContactSettings: async (contactData) => {
    const res = await apiClient.put('/admin/contact', contactData);
    return res.data.data || res.data;
  },
  resetContactSettings: async () => {
    const res = await apiClient.post('/admin/contact/reset');
    return res.data.data || res.data;
  },

  // Section Header CMS Management (Skills, Experience, Projects, Certifications)
  getSectionHeader: async (sectionKey) => {
    const res = await apiClient.get(`/admin/section-header/${sectionKey}`);
    return res.data.data;
  },
  updateSectionHeader: async (sectionKey, headerData) => {
    const res = await apiClient.put(`/admin/section-header/${sectionKey}`, headerData);
    return res.data.data || res.data;
  },
  resetSectionHeader: async (sectionKey) => {
    const res = await apiClient.post(`/admin/section-header/${sectionKey}/reset`);
    return res.data.data || res.data;
  }
};
