import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import {
  User,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Server,
  Database,
  Code2,
  Brain,
  Layers,
  Cpu,
  BarChart3,
  Cloud,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Monitor,
  Smartphone,
  ExternalLink
} from 'lucide-react';

const SUPPORTED_ICONS = [
  { id: 'Server', label: 'Server', Icon: Server },
  { id: 'Database', label: 'Database', Icon: Database },
  { id: 'Code2', label: 'Code2', Icon: Code2 },
  { id: 'Brain', label: 'Brain', Icon: Brain },
  { id: 'Layers', label: 'Layers', Icon: Layers },
  { id: 'Cpu', label: 'Cpu', Icon: Cpu },
  { id: 'BarChart3', label: 'BarChart3', Icon: BarChart3 },
  { id: 'Cloud', label: 'Cloud', Icon: Cloud },
];

const SUPPORTED_ACCENTS = [
  { id: 'emerald', label: 'Emerald', textColor: 'text-emerald-400' },
  { id: 'cyan', label: 'Cyan', textColor: 'text-cyan-400' },
  { id: 'indigo', label: 'Indigo', textColor: 'text-indigo-400' },
  { id: 'purple', label: 'Purple', textColor: 'text-purple-400' },
  { id: 'amber', label: 'Amber', textColor: 'text-amber-400' },
  { id: 'blue', label: 'Blue', textColor: 'text-blue-400' },
];

const ICON_MAP = {
  Server,
  Database,
  Code2,
  Brain,
  Layers,
  Cpu,
  BarChart3,
  Cloud,
  GraduationCap,
  Briefcase,
  Sparkles
};

const ACCENT_COLORS = {
  emerald: 'text-emerald-400',
  cyan: 'text-cyan-400',
  indigo: 'text-indigo-400',
  purple: 'text-purple-400',
  amber: 'text-amber-400',
  blue: 'text-blue-400'
};

const DEFAULT_ABOUT = {
  badge: "ABOUT ME",
  title: "Career-Focused Summary",
  careerSummary: "I am a dedicated Software Developer with a robust foundation in computer science and modern software design principles. My technical focus revolves around enterprise Java development, Spring Boot microservices, relational database modeling in PostgreSQL, and building performant end-to-end full-stack systems.",
  experienceSummary: "With experience spanning across HCLTech as a Graduate Engineer Trainee, BISAG-N as a Young Professional, and an internship at Infosys Limited, I have contributed to production-grade software lifecycles, backend APIs, data pipelines, and analytics tooling.",
  capabilities: [
    { title: "Backend Systems", description: "Java, Spring Boot, REST APIs, Security", icon: "Server", accent: "emerald", displayOrder: 1, visible: true },
    { title: "Data Architecture", description: "PostgreSQL, SQL, Hibernate JPA", icon: "Database", accent: "cyan", displayOrder: 2, visible: true },
    { title: "Full-Stack Tech", description: "React, HTML, CSS, JavaScript", icon: "Code2", accent: "purple", displayOrder: 3, visible: true }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science and Business Systems",
      institution: "Sagi Rama Krishnam Raju Engineering College",
      startYear: "2021",
      endYear: "2025",
      cgpa: "8.64",
      highlight: "Academic Distinction",
      displayOrder: 1,
      visible: true
    }
  ],
  currentRole: {
    roleTitle: "Graduate Engineer Trainee",
    company: "HCLTech",
    location: "Chennai, India",
    startDate: "Jan 2026",
    endDate: "Present",
    current: true
  }
};

export const AdminAboutPage = () => {
  const [formData, setFormData] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAbout();
      if (data) {
        setFormData({
          badge: data.badge || "ABOUT ME",
          title: data.title || "Career-Focused Summary",
          careerSummary: data.careerSummary || "",
          experienceSummary: data.experienceSummary || "",
          capabilities: data.capabilities && data.capabilities.length > 0 ? data.capabilities : DEFAULT_ABOUT.capabilities,
          education: data.education && data.education.length > 0 ? data.education : DEFAULT_ABOUT.education,
          currentRole: data.currentRole || DEFAULT_ABOUT.currentRole
        });
      }
    } catch (err) {
      console.error("Failed to load about content:", err);
      setStatusMessage({ type: 'error', text: 'Could not load existing About configuration from server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCurrentRoleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      currentRole: {
        ...prev.currentRole,
        [field]: value
      }
    }));
    if (validationErrors[`role_${field}`]) {
      setValidationErrors(prev => ({ ...prev, [`role_${field}`]: null }));
    }
  };

  // --- Capabilities Management ---
  const handleCapabilityChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.capabilities];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, capabilities: updated };
    });
  };

  const handleAddCapability = () => {
    const nextOrder = formData.capabilities.length + 1;
    const newCap = {
      title: 'Cloud Architecture',
      description: 'AWS, Docker, Microservices, CI/CD',
      icon: 'Cloud',
      accent: 'amber',
      displayOrder: nextOrder,
      visible: true
    };
    setFormData(prev => ({
      ...prev,
      capabilities: [...prev.capabilities, newCap]
    }));
  };

  const handleRemoveCapability = (index) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index)
    }));
  };

  const handleMoveCapability = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formData.capabilities.length) return;

    setFormData(prev => {
      const list = [...prev.capabilities];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        capabilities: list.map((item, i) => ({ ...item, displayOrder: i + 1 }))
      };
    });
  };

  // --- Education Management (Multiple Entries Supported) ---
  const handleEducationChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const handleAddEducation = () => {
    const nextOrder = formData.education.length + 1;
    const newEdu = {
      degree: 'M.Tech in Computer Science',
      institution: 'University / Institute Name',
      startYear: '2026',
      endYear: '',
      cgpa: '',
      highlight: '',
      displayOrder: nextOrder,
      visible: true
    };
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleMoveEducation = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formData.education.length) return;

    setFormData(prev => {
      const list = [...prev.education];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        education: list.map((item, i) => ({ ...item, displayOrder: i + 1 }))
      };
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.badge || !formData.badge.trim()) {
      errors.badge = 'Section badge is required (e.g. "ABOUT ME")';
    }
    if (!formData.title || !formData.title.trim()) {
      errors.title = 'Section title is required';
    }
    if (!formData.careerSummary || !formData.careerSummary.trim()) {
      errors.careerSummary = 'Career summary is required';
    }
    if (!formData.experienceSummary || !formData.experienceSummary.trim()) {
      errors.experienceSummary = 'Experience summary is required';
    }

    // Capability Validation
    if (!formData.capabilities || formData.capabilities.length === 0) {
      errors.capabilities = 'At least 1 capability card must exist';
    } else {
      const hasVisibleCap = formData.capabilities.some(c => c.visible !== false);
      if (!hasVisibleCap) {
        errors.capabilities = 'At least 1 capability card must be visible';
      }
      formData.capabilities.forEach((c, idx) => {
        if (!c.title || !c.title.trim()) errors[`cap_${idx}_title`] = 'Title is required';
        if (!c.description || !c.description.trim()) errors[`cap_${idx}_desc`] = 'Description is required';
      });
    }

    // Education Validation
    if (!formData.education || formData.education.length === 0) {
      errors.education = 'At least 1 education record must exist';
    } else {
      const hasVisibleEdu = formData.education.some(e => e.visible !== false);
      if (!hasVisibleEdu) {
        errors.education = 'At least 1 education record must be visible';
      }
      formData.education.forEach((e, idx) => {
        if (!e.degree || !e.degree.trim()) errors[`edu_${idx}_degree`] = 'Degree is required';
        if (!e.institution || !e.institution.trim()) errors[`edu_${idx}_inst`] = 'Institution is required';
        if (!e.startYear || !e.startYear.trim()) errors[`edu_${idx}_start`] = 'Start year is required';
      });
    }

    // Current Role Validation
    if (!formData.currentRole?.roleTitle || !formData.currentRole.roleTitle.trim()) {
      errors.role_title = 'Role title is required';
    }
    if (!formData.currentRole?.company || !formData.currentRole.company.trim()) {
      errors.role_company = 'Company is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      setStatusMessage({ type: 'error', text: 'Please resolve form validation errors before saving.' });
      return;
    }

    try {
      setSaving(true);
      setStatusMessage(null);
      const payload = {
        ...formData,
        capabilities: formData.capabilities.map((c, i) => ({ ...c, displayOrder: i + 1 })),
        education: formData.education.map((e, i) => ({ ...e, displayOrder: i + 1 }))
      };
      const response = await adminApi.updateAbout(payload);
      if (response) {
        setFormData(prev => ({ ...prev, ...response }));
      }
      setStatusMessage({ type: 'success', text: 'About section updated and published successfully!' });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error("Save about failed:", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save about content.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setResetting(true);
      setStatusMessage(null);
      const data = await adminApi.resetAbout();
      if (data) {
        setFormData(data);
      }
      setShowResetModal(false);
      setStatusMessage({ type: 'success', text: 'About section reset to canonical defaults.' });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error("Reset about failed:", err);
      setStatusMessage({ type: 'error', text: 'Failed to reset About section to defaults.' });
    } finally {
      setResetting(false);
    }
  };

  const visibleCapabilities = (formData.capabilities || [])
    .filter(c => c.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const visibleEducation = (formData.education || [])
    .filter(e => e.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-slate-400">Loading About Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-white">About Section</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live CMS
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage your career summary, experience paragraphs, capability cards, dynamic education records, and current role.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notifications Alert Banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span className="text-sm font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* 2-Column Split: Form Editor (Left) & Real-time Live Preview (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* Left Column: Form Controls */}
        <div className="xl:col-span-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Section 1: Section Header & Summaries */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
                    01
                  </div>
                  <h2 className="text-base font-semibold text-white">Header & Summaries</h2>
                </div>
                <span className="text-xs text-slate-500">Core Narrative</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Section Badge <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => handleFieldChange('badge', e.target.value)}
                    placeholder="ABOUT ME"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  {validationErrors.badge && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.badge}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Main Story Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="Career-Focused Summary"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                  />
                  {validationErrors.title && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.title}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Career-Focused Summary (Paragraph 1 - Core Tech Stack & Focus) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.careerSummary}
                  onChange={(e) => handleFieldChange('careerSummary', e.target.value)}
                  placeholder="I am a dedicated Software Developer..."
                  className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white leading-relaxed focus:outline-none focus:border-emerald-500"
                />
                {validationErrors.careerSummary && (
                  <p className="text-xs text-rose-400 mt-1">{validationErrors.careerSummary}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Experience Summary (Paragraph 2 - Companies & Contributions) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.experienceSummary}
                  onChange={(e) => handleFieldChange('experienceSummary', e.target.value)}
                  placeholder="With experience spanning across HCLTech..."
                  className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white leading-relaxed focus:outline-none focus:border-emerald-500"
                />
                {validationErrors.experienceSummary && (
                  <p className="text-xs text-rose-400 mt-1">{validationErrors.experienceSummary}</p>
                )}
              </div>
            </div>

            {/* Section 2: Capability Cards */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-mono font-bold">
                    02
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Capability Cards</h2>
                    <p className="text-[11px] text-slate-400">Highlight cards below the story paragraphs</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddCapability}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Card</span>
                </button>
              </div>

              {validationErrors.capabilities && (
                <p className="text-xs text-rose-400">{validationErrors.capabilities}</p>
              )}

              <div className="space-y-3">
                {formData.capabilities.map((cap, idx) => {
                  return (
                    <div
                      key={cap.id || idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        cap.visible !== false
                          ? 'bg-dark-900/90 border-slate-800'
                          : 'bg-dark-900/40 border-slate-800/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-mono font-semibold text-white">
                            {cap.title || 'Untitled Card'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveCapability(idx, -1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === formData.capabilities.length - 1}
                            onClick={() => handleMoveCapability(idx, 1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCapabilityChange(idx, 'visible', cap.visible === false ? true : false)}
                            className={`p-1 transition-colors ${
                              cap.visible !== false ? 'text-emerald-400' : 'text-slate-600'
                            }`}
                            title="Toggle Visibility"
                          >
                            {cap.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveCapability(idx)}
                            className="p-1 text-rose-500/70 hover:text-rose-400 transition-colors ml-1"
                            title="Remove Card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">Title</label>
                          <input
                            type="text"
                            value={cap.title}
                            onChange={(e) => handleCapabilityChange(idx, 'title', e.target.value)}
                            placeholder="Backend Systems"
                            className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">Description</label>
                          <input
                            type="text"
                            value={cap.description}
                            onChange={(e) => handleCapabilityChange(idx, 'description', e.target.value)}
                            placeholder="Java, Spring Boot, REST APIs"
                            className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">Icon</label>
                          <select
                            value={cap.icon || 'Server'}
                            onChange={(e) => handleCapabilityChange(idx, 'icon', e.target.value)}
                            className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                          >
                            {SUPPORTED_ICONS.map(ic => (
                              <option key={ic.id} value={ic.id}>{ic.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">Accent</label>
                          <select
                            value={cap.accent || 'emerald'}
                            onChange={(e) => handleCapabilityChange(idx, 'accent', e.target.value)}
                            className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono capitalize"
                          >
                            {SUPPORTED_ACCENTS.map(acc => (
                              <option key={acc.id} value={acc.id}>{acc.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Dynamic Education Records (Supports Multiple Entries) */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-mono font-bold">
                    03
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Education History</h2>
                    <p className="text-[11px] text-slate-400">Dynamic list (supports B.Tech, M.Tech, MBA, etc.)</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {validationErrors.education && (
                <p className="text-xs text-rose-400">{validationErrors.education}</p>
              )}

              <div className="space-y-3">
                {formData.education.map((edu, idx) => {
                  return (
                    <div
                      key={edu.id || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        edu.visible !== false
                          ? 'bg-dark-900/90 border-slate-800'
                          : 'bg-dark-900/40 border-slate-800/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white font-display">
                            {edu.degree || 'New Education Record'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveEducation(idx, -1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === formData.education.length - 1}
                            onClick={() => handleMoveEducation(idx, 1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEducationChange(idx, 'visible', edu.visible === false ? true : false)}
                            className={`p-1 transition-colors ${
                              edu.visible !== false ? 'text-emerald-400' : 'text-slate-600'
                            }`}
                            title="Toggle Visibility"
                          >
                            {edu.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(idx)}
                            className="p-1 text-rose-500/70 hover:text-rose-400 transition-colors ml-1"
                            title="Remove Education Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-500 mb-1">Degree Title</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                              placeholder="B.Tech in Computer Science and Business Systems"
                              className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                            />
                            {validationErrors[`edu_${idx}_degree`] && (
                              <p className="text-[11px] text-rose-400 mt-0.5">{validationErrors[`edu_${idx}_degree`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-500 mb-1">Institution / University</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                              placeholder="Sagi Rama Krishnam Raju Engineering College"
                              className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                            {validationErrors[`edu_${idx}_inst`] && (
                              <p className="text-[11px] text-rose-400 mt-0.5">{validationErrors[`edu_${idx}_inst`]}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-500 mb-1">Start Year</label>
                            <input
                              type="text"
                              value={edu.startYear}
                              onChange={(e) => handleEducationChange(idx, 'startYear', e.target.value)}
                              placeholder="2021"
                              className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-500 mb-1">End Year (Optional)</label>
                            <input
                              type="text"
                              value={edu.endYear || ''}
                              onChange={(e) => handleEducationChange(idx, 'endYear', e.target.value)}
                              placeholder="2025 or blank"
                              className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-500 mb-1">CGPA / Score</label>
                            <input
                              type="text"
                              value={edu.cgpa || ''}
                              onChange={(e) => handleEducationChange(idx, 'cgpa', e.target.value)}
                              placeholder="8.64"
                              className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-500 mb-1">Highlight Badge</label>
                            <input
                              type="text"
                              value={edu.highlight || ''}
                              onChange={(e) => handleEducationChange(idx, 'highlight', e.target.value)}
                              placeholder="Academic Distinction"
                              className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Current Role */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-mono font-bold">
                    04
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Current Role</h2>
                    <p className="text-[11px] text-slate-400">Position badge displayed below education</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Role Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.currentRole?.roleTitle || ''}
                    onChange={(e) => handleCurrentRoleChange('roleTitle', e.target.value)}
                    placeholder="Graduate Engineer Trainee"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                  />
                  {validationErrors.role_title && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.role_title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Company Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.currentRole?.company || ''}
                    onChange={(e) => handleCurrentRoleChange('company', e.target.value)}
                    placeholder="HCLTech"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                  {validationErrors.role_company && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.role_company}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={formData.currentRole?.location || ''}
                    onChange={(e) => handleCurrentRoleChange('location', e.target.value)}
                    placeholder="Chennai, India"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Start Date</label>
                  <input
                    type="text"
                    value={formData.currentRole?.startDate || ''}
                    onChange={(e) => handleCurrentRoleChange('startDate', e.target.value)}
                    placeholder="Jan 2026"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">End Date</label>
                  <input
                    type="text"
                    value={formData.currentRole?.endDate || ''}
                    onChange={(e) => handleCurrentRoleChange('endDate', e.target.value)}
                    placeholder="Present"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-dark-800 hover:bg-dark-750 border border-slate-700 transition-colors"
              >
                Reset to Defaults
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save & Publish About'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Instant Live Preview Panel */}
        <div className="xl:col-span-6">
          <div className="sticky top-24 space-y-4">

            {/* Preview Header Card */}
            <div className="flex items-center justify-between bg-dark-850 border border-slate-800 px-4 py-2.5 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                  Live Preview (Zero-Latency)
                </span>
              </div>

              {/* Viewport Width Switch */}
              <div className="flex items-center bg-dark-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                    previewMode === 'desktop'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                    previewMode === 'mobile'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Live Preview Simulated Container */}
            <div className={`mx-auto transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
              <div className="bg-[#090d16] border-2 border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-5">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Section Header */}
                <div className="text-center pt-1 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {formData.badge || "ABOUT ME"}
                  </div>
                </div>

                {/* Grid Layout */}
                <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'} gap-4 items-start`}>
                  
                  {/* Main Story Card */}
                  <div className={`${previewMode === 'mobile' ? '' : 'lg:col-span-7'} glass-card p-5 rounded-xl space-y-3`}>
                    <h3 className="text-sm sm:text-base font-bold text-white font-display flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {formData.title || "Career-Focused Summary"}
                    </h3>

                    {formData.careerSummary && (
                      <p className="text-slate-300 leading-relaxed text-xs whitespace-pre-line">
                        {formData.careerSummary}
                      </p>
                    )}

                    {formData.experienceSummary && (
                      <p className="text-slate-300 leading-relaxed text-xs whitespace-pre-line">
                        {formData.experienceSummary}
                      </p>
                    )}

                    {/* Capability Cards */}
                    {visibleCapabilities.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-800">
                        {visibleCapabilities.map((cap, idx) => {
                          const IconComp = ICON_MAP[cap.icon] || Server;
                          const iconColor = ACCENT_COLORS[cap.accent] || ACCENT_COLORS.emerald;

                          return (
                            <div key={cap.id || idx} className="p-2.5 rounded-lg bg-dark-800/60 border border-slate-800">
                              <IconComp className={`w-4 h-4 ${iconColor} mb-1`} />
                              <h4 className="text-xs font-semibold text-white truncate">{cap.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{cap.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Education & Role Sidebar */}
                  <div className={`${previewMode === 'mobile' ? '' : 'lg:col-span-5'} space-y-4`}>
                    {/* Dynamic Education Cards */}
                    {visibleEducation.map((edu, idx) => {
                      const yearText = edu.startYear
                        ? (edu.endYear ? `${edu.startYear} – ${edu.endYear}` : `${edu.startYear} – Present`)
                        : (edu.endYear || '');

                      return (
                        <div
                          key={edu.id || idx}
                          className="glass-card p-4 rounded-xl border-l-4 border-l-emerald-500 space-y-2.5"
                        >
                          <div className="flex items-center gap-2 text-emerald-400">
                            <GraduationCap className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Education</span>
                          </div>

                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                              {edu.degree}
                            </h4>
                            {edu.institution && (
                              <p className="text-[11px] text-slate-300 font-medium mt-0.5">{edu.institution}</p>
                            )}
                            {yearText && (
                              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{yearText}</p>
                            )}
                          </div>

                          {(edu.cgpa || edu.highlight) && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {edu.cgpa && (
                                <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[11px]">
                                  CGPA: {edu.cgpa}
                                </div>
                              )}
                              {edu.highlight && (
                                <span className="text-[10px] text-slate-400">{edu.highlight}</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Current Position Badge Card */}
                    {formData.currentRole && formData.currentRole.roleTitle && (
                      <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <Briefcase className="w-4 h-4" />
                          <span className="text-[10px] uppercase font-bold tracking-wider">Current Role</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{formData.currentRole.roleTitle}</h4>
                        <p className="text-xs text-slate-300">
                          {formData.currentRole.company}
                          {formData.currentRole.location ? ` • ${formData.currentRole.location}` : ''}
                        </p>
                        {(formData.currentRole.startDate || formData.currentRole.endDate) && (
                          <p className="text-[10px] text-slate-400 font-mono">
                            {formData.currentRole.startDate || ''}
                            {formData.currentRole.startDate && formData.currentRole.endDate ? ' – ' : ''}
                            {formData.currentRole.endDate || (formData.currentRole.current ? 'Present' : '')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-dark-850/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <span>View full live portfolio with about section:</span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>Open Public Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-dark-850 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset About Content?</h3>
                <p className="text-xs text-slate-400">This action will replace your current About configuration.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-dark-900/60 p-3.5 rounded-xl border border-slate-800">
              This will restore the original About badge, title, canonical career & experience paragraphs, the 3 default capability cards, original B.Tech education, and Graduate Engineer Trainee role.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={resetting}
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-dark-800 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetting}
                onClick={handleResetToDefaults}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                {resetting ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5" />
                )}
                <span>{resetting ? 'Resetting...' : 'Yes, Reset Defaults'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAboutPage;
