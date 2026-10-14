import {
  supabase,
  isSupabaseConfigured,
  getSupabasePublicStorageUrl,
  parseSupabaseStorageUri,
} from './supabaseClient';

const formatBytes = (bytes) => {
  if (bytes == null || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const digitGroups = Math.min(Math.floor(Math.log10(bytes) / Math.log10(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, digitGroups)).toFixed(1)} ${units[digitGroups]}`;
};

/**
 * Resolves a storage path to a direct public storage URL or API fallback.
 */
export const resolveStorageFileUrl = (storagePath, fallbackApiEndpoint) => {
  if (!storagePath) return '';
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }
  const parsed = parseSupabaseStorageUri(storagePath);
  if (parsed) {
    return getSupabasePublicStorageUrl(parsed.bucket, parsed.path);
  }
  return fallbackApiEndpoint || '';
};

export const supabasePublicApi = {
  // --------------------------------------------------------------------------
  // Header / Navigation
  // --------------------------------------------------------------------------
  getHeader: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    const [{ data: config, error: configErr }, { data: navItems, error: navErr }] =
      await Promise.all([
        supabase
          .from('header_configs')
          .select('id, logo_text, brand_name, updated_at')
          .order('id', { ascending: true })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('header_nav_items')
          .select('id, header_config_id, name, section_id, href, display_order, visible, is_external')
          .order('display_order', { ascending: true }),
      ]);

    if (configErr) throw configErr;
    if (navErr) throw navErr;

    const visibleItems = (navItems || [])
      .filter((item) => item.visible !== false)
      .map((item) => ({
        id: item.id,
        name: item.name,
        sectionId: item.section_id,
        href: item.href,
        displayOrder: item.display_order,
        visible: item.visible,
        isExternal: item.is_external,
      }));

    return {
      id: config?.id || 1,
      logoText: config?.logo_text || 'DY',
      brandName: config?.brand_name || 'Deva Yadhala',
      navItems: visibleItems,
    };
  },

  // --------------------------------------------------------------------------
  // Hero Content
  // --------------------------------------------------------------------------
  getHero: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    const [{ data: hero, error: heroErr }, { data: stages, error: stagesErr }] =
      await Promise.all([
        supabase
          .from('hero_content')
          .select('*')
          .order('id', { ascending: true })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('hero_stages')
          .select('*')
          .order('display_order', { ascending: true }),
      ]);

    if (heroErr) throw heroErr;
    if (stagesErr) throw stagesErr;

    const stageResponses = (stages || [])
      .filter((s) => s.visible !== false)
      .map((s) => ({
        id: s.id,
        stageNumber: s.stage_number,
        title: s.title,
        icon: s.icon,
        accent: s.accent,
        displayOrder: s.display_order,
        visible: s.visible,
      }));

    return {
      id: hero?.id || 1,
      greeting: hero?.greeting || "Hi, I'm",
      name: hero?.name || 'Deva Yadhala',
      role: hero?.role || 'Software Developer',
      description: hero?.description || '',
      primaryButtonText: hero?.primary_button_text || 'View Resume',
      primaryButtonVisible: hero?.primary_button_visible ?? true,
      secondaryButtonText: hero?.secondary_button_text || 'Contact Me',
      secondaryButtonVisible: hero?.secondary_button_visible ?? true,
      githubUrl: hero?.github_url || 'https://github.com',
      linkedinUrl: hero?.linkedin_url || 'https://linkedin.com',
      quote: hero?.quote || 'Think deeper. Build smarter. Solve better.',
      quoteVisible: hero?.quote_visible ?? true,
      stages: stageResponses,
      updatedAt: hero?.updated_at,
    };
  },

  // --------------------------------------------------------------------------
  // About Content
  // --------------------------------------------------------------------------
  getAbout: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    const [
      { data: about, error: aboutErr },
      { data: capabilities, error: capErr },
      { data: education, error: eduErr },
      { data: roles, error: roleErr },
    ] = await Promise.all([
      supabase.from('about_contents').select('*').order('id', { ascending: true }).limit(1).maybeSingle(),
      supabase.from('about_capabilities').select('*').order('display_order', { ascending: true }),
      supabase.from('about_education').select('*').order('display_order', { ascending: true }),
      supabase.from('about_roles').select('*').order('id', { ascending: true }).limit(1),
    ]);

    if (aboutErr) throw aboutErr;
    if (capErr) throw capErr;
    if (eduErr) throw eduErr;
    if (roleErr) throw roleErr;

    const currentRole = roles && roles.length > 0 ? roles[0] : null;

    return {
      id: about?.id || 1,
      badge: about?.badge || 'ABOUT ME',
      title: about?.title || 'Career-Focused Summary',
      careerSummary: about?.career_summary || '',
      experienceSummary: about?.experience_summary || '',
      capabilities: (capabilities || [])
        .filter((c) => c.visible !== false)
        .map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          icon: c.icon,
          accent: c.accent,
          displayOrder: c.display_order,
          visible: c.visible,
        })),
      education: (education || [])
        .filter((e) => e.visible !== false)
        .map((e) => ({
          id: e.id,
          degree: e.degree,
          institution: e.institution,
          startYear: e.start_year,
          endYear: e.end_year,
          cgpa: e.cgpa,
          highlight: e.highlight,
          displayOrder: e.display_order,
          visible: e.visible,
        })),
      currentRole: currentRole
        ? {
            id: currentRole.id,
            roleTitle: currentRole.role_title,
            company: currentRole.company,
            location: currentRole.location,
            startDate: currentRole.start_date,
            endDate: currentRole.end_date,
            current: currentRole.current,
          }
        : null,
    };
  },

  // --------------------------------------------------------------------------
  // Section Headers
  // --------------------------------------------------------------------------
  getSectionHeaders: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    const { data, error } = await supabase.from('section_header_configs').select('*');
    if (error) throw error;

    const map = {};
    (data || []).forEach((row) => {
      const key = (row.section_key || '').toUpperCase();
      map[key] = {
        sectionKey: key,
        badgeText: row.badge_text,
        description: row.description,
        updatedAt: row.updated_at,
      };
    });
    return map;
  },

  getSectionHeader: async (sectionKey) => {
    const key = (sectionKey || 'SKILLS').toUpperCase();
    const headers = await supabasePublicApi.getSectionHeaders();
    return headers[key] || {
      sectionKey: key,
      badgeText: key,
      description: `Portfolio ${key} Content`,
    };
  },

  // --------------------------------------------------------------------------
  // Skills
  // --------------------------------------------------------------------------
  getSkills: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return (data || []).map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      displayOrder: s.display_order,
    }));
  },

  getGroupedSkills: async () => {
    const skills = await supabasePublicApi.getSkills();

    // Group by category preserving minimum displayOrder per category
    const groupedMap = new Map();
    skills.forEach((s) => {
      const cat = s.category || 'General';
      if (!groupedMap.has(cat)) {
        groupedMap.set(cat, []);
      }
      groupedMap.get(cat).push(s);
    });

    const groups = Array.from(groupedMap.entries()).map(([category, catSkills]) => ({
      category,
      skills: catSkills,
    }));

    // Sort groups by lowest display order among its skills
    groups.sort((a, b) => {
      const minA = Math.min(...a.skills.map((s) => s.displayOrder ?? 999));
      const minB = Math.min(...b.skills.map((s) => s.displayOrder ?? 999));
      return minA - minB;
    });

    return groups;
  },

  // --------------------------------------------------------------------------
  // Experience
  // --------------------------------------------------------------------------
  getExperience: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return (data || []).map((e) => ({
      id: e.id,
      organization: e.organization,
      role: e.role,
      location: e.location,
      startDate: e.start_date,
      endDate: e.end_date,
      description: e.description,
      displayOrder: e.display_order,
    }));
  },

  // --------------------------------------------------------------------------
  // Projects
  // --------------------------------------------------------------------------
  getProjects: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    // Query projects, normalized technologies, join table, and features in parallel
    const [
      { data: projects, error: pErr },
      { data: technologies, error: tErr },
      { data: projectTechs, error: ptErr },
      { data: features, error: fErr },
    ] = await Promise.all([
      supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false }),
      supabase.from('technologies').select('id, name'),
      supabase.from('project_technologies').select('project_id, technology_id'),
      supabase
        .from('project_features')
        .select('project_id, feature_text, feature_order')
        .order('feature_order', { ascending: true }),
    ]);

    if (pErr) throw pErr;

    // Technology lookup map
    const techNameById = new Map();
    (technologies || []).forEach((t) => techNameById.set(t.id, t.name));

    // Project -> tech names map
    const techNamesByProject = new Map();
    (projectTechs || []).forEach((pt) => {
      const name = techNameById.get(pt.technology_id);
      if (name) {
        if (!techNamesByProject.has(pt.project_id)) {
          techNamesByProject.set(pt.project_id, []);
        }
        techNamesByProject.get(pt.project_id).push(name);
      }
    });

    // Project -> features map
    const featuresByProject = new Map();
    (features || []).forEach((f) => {
      if (!featuresByProject.has(f.project_id)) {
        featuresByProject.set(f.project_id, []);
      }
      featuresByProject.get(f.project_id).push(f.feature_text);
    });

    return (projects || []).map((p) => {
      const techList = techNamesByProject.get(p.id) || [];
      techList.sort((a, b) => a.localeCompare(b));

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        technologies: techList,
        features: featuresByProject.get(p.id) || [],
        githubUrl: p.github_url,
        demoUrl: p.demo_url,
        imageUrl: p.image_url,
        tableauUrl: p.tableau_url,
        featured: p.featured,
        displayOrder: p.display_order,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    });
  },

  getProjectById: async (id) => {
    const projects = await supabasePublicApi.getProjects();
    const found = projects.find((p) => String(p.id) === String(id));
    if (!found) throw new Error(`Project with ID ${id} not found`);
    return found;
  },

  // --------------------------------------------------------------------------
  // Certifications & Direct Storage Streaming
  // --------------------------------------------------------------------------
  getCertifications: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return (data || []).map((c) => {
      const hasCert = Boolean(c.storage_path);
      const directStorageUrl = resolveStorageFileUrl(c.storage_path, `/api/certifications/${c.id}/certificate`);

      return {
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        issuedDate: c.issued_date,
        credentialUrl: c.credential_url,
        displayOrder: c.display_order,
        hasCertificate: hasCert,
        fileName: c.file_name,
        originalFileName: c.original_file_name,
        contentType: c.content_type,
        fileSize: c.file_size,
        formattedFileSize: hasCert && c.file_size ? formatBytes(c.file_size) : null,
        certificateUrl: directStorageUrl,
        uploadedAt: c.uploaded_at,
      };
    });
  },

  // --------------------------------------------------------------------------
  // Active Resume & Direct Storage Streaming
  // --------------------------------------------------------------------------
  getActiveResume: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('active', true)
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const directPdfUrl = resolveStorageFileUrl(data.storage_path, '/api/resume/preview');
    const directDownloadUrl = resolveStorageFileUrl(data.storage_path, '/api/resume/download');

    return {
      id: data.id,
      fileName: data.file_name,
      originalFileName: data.original_file_name,
      contentType: data.content_type || 'application/pdf',
      fileSize: data.file_size,
      formattedFileSize: formatBytes(data.file_size),
      active: data.active,
      uploadedAt: data.uploaded_at,
      updatedAt: data.updated_at,
      downloadUrl: directDownloadUrl,
      previewUrl: directPdfUrl,
    };
  },

  // --------------------------------------------------------------------------
  // Contact Settings
  // --------------------------------------------------------------------------
  getContactSettings: async () => {
    if (!isSupabaseConfigured()) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('contact_settings')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return {
      id: data?.id || 1,
      badgeText: data?.badge_text || 'GET IN TOUCH',
      introText: data?.intro_text || 'Open to software engineering, backend development, and technical collaboration opportunities.',
      location: data?.location || 'Chennai, India',
      email: data?.email || 'devayadhala.dev@gmail.com',
      phone: data?.phone || null,
      linkedinUrl: data?.linkedin_url || 'https://linkedin.com',
      githubUrl: data?.github_url || 'https://github.com',
      formTitle: data?.form_title || 'Send a Message',
      formDescription: data?.form_description || 'Fill in your contact details below to send an inquiry directly to my portfolio database.',
      namePlaceholder: data?.name_placeholder || 'e.g. John Doe',
      emailPlaceholder: data?.email_placeholder || 'e.g. john@company.com',
      subjectPlaceholder: data?.subject_placeholder || 'e.g. Job opportunity / Collaboration',
      messagePlaceholder: data?.message_placeholder || 'Write your message here...',
      submitButtonText: data?.submit_button_text || 'Send Message',
      updatedAt: data?.updated_at,
    };
  },

  // --------------------------------------------------------------------------
  // Consolidated Full Portfolio Bundle (High Performance Direct Read)
  // --------------------------------------------------------------------------
  getPublicPortfolio: async () => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client not configured (missing URL or publishable key)');
    }

    const [
      header,
      hero,
      about,
      sectionHeaders,
      skills,
      groupedSkills,
      experience,
      projects,
      certifications,
      contact,
    ] = await Promise.all([
      supabasePublicApi.getHeader().catch((e) => {
        console.warn('[Supabase] Failed to fetch header:', e);
        return null;
      }),
      supabasePublicApi.getHero().catch((e) => {
        console.warn('[Supabase] Failed to fetch hero:', e);
        return null;
      }),
      supabasePublicApi.getAbout().catch((e) => {
        console.warn('[Supabase] Failed to fetch about:', e);
        return null;
      }),
      supabasePublicApi.getSectionHeaders().catch((e) => {
        console.warn('[Supabase] Failed to fetch section headers:', e);
        return {};
      }),
      supabasePublicApi.getSkills().catch((e) => {
        console.warn('[Supabase] Failed to fetch skills:', e);
        return [];
      }),
      supabasePublicApi.getGroupedSkills().catch((e) => {
        console.warn('[Supabase] Failed to fetch grouped skills:', e);
        return [];
      }),
      supabasePublicApi.getExperience().catch((e) => {
        console.warn('[Supabase] Failed to fetch experience:', e);
        return [];
      }),
      supabasePublicApi.getProjects().catch((e) => {
        console.warn('[Supabase] Failed to fetch projects:', e);
        return [];
      }),
      supabasePublicApi.getCertifications().catch((e) => {
        console.warn('[Supabase] Failed to fetch certifications:', e);
        return [];
      }),
      supabasePublicApi.getContactSettings().catch((e) => {
        console.warn('[Supabase] Failed to fetch contact settings:', e);
        return null;
      }),
    ]);

    return {
      header,
      hero,
      about,
      skillsHeader: sectionHeaders['SKILLS'] || {
        sectionKey: 'SKILLS',
        badgeText: 'SKILLS',
        description: 'Categorized technical capabilities, frameworks, and engineering tools verified through projects and professional experience.',
      },
      skills,
      groupedSkills,
      experienceHeader: sectionHeaders['EXPERIENCE'] || {
        sectionKey: 'EXPERIENCE',
        badgeText: 'EXPERIENCE',
        description: 'Practical software engineering and technical roles across enterprise and engineering organizations.',
      },
      experience,
      projectsHeader: sectionHeaders['PROJECTS'] || {
        sectionKey: 'PROJECTS',
        badgeText: 'PROJECTS',
        description: 'Practical software projects showcasing Java & Spring Boot backend services, relational database schemas, document processing, and data analytics.',
      },
      projects,
      certificationsHeader: sectionHeaders['CERTIFICATIONS'] || {
        sectionKey: 'CERTIFICATIONS',
        badgeText: 'CERTIFICATIONS',
        description: 'Professional certifications and assessments validating expertise in Java, Full Stack Development, Python, and SQL.',
      },
      certifications,
      contact,
    };
  },
};
