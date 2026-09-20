import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import {
  Sparkles,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Brain,
  Code2,
  Zap,
  Layers,
  Cpu,
  Database,
  BarChart3,
  FileText,
  Mail,
  Github,
  Linkedin,
  AlertCircle,
  CheckCircle2,
  Monitor,
  Smartphone,
  ExternalLink
} from 'lucide-react';

const SUPPORTED_ICONS = [
  { id: 'Brain', label: 'Brain', Icon: Brain },
  { id: 'Code2', label: 'Code2', Icon: Code2 },
  { id: 'Sparkles', label: 'Sparkles', Icon: Sparkles },
  { id: 'Zap', label: 'Zap', Icon: Zap },
  { id: 'Layers', label: 'Layers', Icon: Layers },
  { id: 'Cpu', label: 'Cpu', Icon: Cpu },
  { id: 'Database', label: 'Database', Icon: Database },
  { id: 'BarChart3', label: 'BarChart3', Icon: BarChart3 },
];

const SUPPORTED_ACCENTS = [
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', ring: 'ring-cyan-500' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', ring: 'ring-emerald-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', ring: 'ring-amber-500' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', ring: 'ring-purple-500' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', ring: 'ring-blue-500' },
];

const ICON_MAP = {
  Brain,
  Code2,
  Sparkles,
  Zap,
  Layers,
  Cpu,
  Database,
  BarChart3
};

const ACCENT_STYLES = {
  cyan: { icon: 'text-cyan-400', hoverText: 'hover:text-cyan-300', hoverBorder: 'hover:border-cyan-500/40' },
  emerald: { icon: 'text-emerald-400', hoverText: 'hover:text-emerald-300', hoverBorder: 'hover:border-emerald-500/40' },
  amber: { icon: 'text-amber-400', hoverText: 'hover:text-amber-300', hoverBorder: 'hover:border-amber-500/40' },
  purple: { icon: 'text-purple-400', hoverText: 'hover:text-purple-300', hoverBorder: 'hover:border-purple-500/40' },
  blue: { icon: 'text-blue-400', hoverText: 'hover:text-blue-300', hoverBorder: 'hover:border-blue-500/40' },
};

export const AdminHeroPage = () => {
  const [formData, setFormData] = useState({
    greeting: "Hi, I'm",
    name: "Deva Yadhala",
    role: "Software Developer",
    description: "Specializing in Java, Spring Boot, Python, SQL, and data analytics, with experience building REST APIs, database-driven applications, and data visualization solutions. I apply strong programming and analytical skills to develop scalable, maintainable software.",
    primaryButtonText: "View Resume",
    primaryButtonVisible: true,
    secondaryButtonText: "Contact Me",
    secondaryButtonVisible: true,
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    quote: "Think deeper. Build smarter. Solve better.",
    quoteVisible: true,
    stages: [
      { stageNumber: "STAGE 01", title: "Analytical Logic", icon: "Brain", accent: "cyan", visible: true, displayOrder: 1 },
      { stageNumber: "STAGE 02", title: "Clean Architecture", icon: "Code2", accent: "emerald", visible: true, displayOrder: 2 },
      { stageNumber: "STAGE 03", title: "Scalable Solutions", icon: "Sparkles", accent: "amber", visible: true, displayOrder: 3 }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getHero();
      if (data) {
        setFormData({
          greeting: data.greeting || "Hi, I'm",
          name: data.name || "Deva Yadhala",
          role: data.role || "Software Developer",
          description: data.description || "",
          primaryButtonText: data.primaryButtonText || "View Resume",
          primaryButtonVisible: data.primaryButtonVisible !== false,
          secondaryButtonText: data.secondaryButtonText || "Contact Me",
          secondaryButtonVisible: data.secondaryButtonVisible !== false,
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          quote: data.quote || "",
          quoteVisible: data.quoteVisible !== false,
          stages: data.stages && data.stages.length > 0 ? data.stages : [
            { stageNumber: "STAGE 01", title: "Analytical Logic", icon: "Brain", accent: "cyan", visible: true, displayOrder: 1 },
            { stageNumber: "STAGE 02", title: "Clean Architecture", icon: "Code2", accent: "emerald", visible: true, displayOrder: 2 },
            { stageNumber: "STAGE 03", title: "Scalable Solutions", icon: "Sparkles", accent: "amber", visible: true, displayOrder: 3 }
          ]
        });
      }
    } catch (err) {
      console.error("Failed to load hero content:", err);
      setStatusMessage({ type: 'error', text: 'Could not load existing Hero configuration from server.' });
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

  const handleStageChange = (index, field, value) => {
    setFormData(prev => {
      const updatedStages = [...prev.stages];
      updatedStages[index] = {
        ...updatedStages[index],
        [field]: value
      };
      return { ...prev, stages: updatedStages };
    });
  };

  const handleAddStage = () => {
    const nextIndex = formData.stages.length + 1;
    const stageNum = nextIndex < 10 ? `STAGE 0${nextIndex}` : `STAGE ${nextIndex}`;
    const newStage = {
      stageNumber: stageNum,
      title: 'New Value Metric',
      icon: 'Zap',
      accent: 'emerald',
      visible: true,
      displayOrder: nextIndex
    };
    setFormData(prev => ({
      ...prev,
      stages: [...prev.stages, newStage]
    }));
  };

  const handleRemoveStage = (index) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const handleMoveStage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formData.stages.length) return;

    setFormData(prev => {
      const stages = [...prev.stages];
      const temp = stages[index];
      stages[index] = stages[targetIndex];
      stages[targetIndex] = temp;
      return {
        ...prev,
        stages: stages.map((s, i) => ({ ...s, displayOrder: i + 1 }))
      };
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.greeting || !formData.greeting.trim()) {
      errors.greeting = 'Greeting is required (e.g. "Hi, I\'m")';
    }
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.role || !formData.role.trim()) {
      errors.role = 'Role title is required';
    }
    if (!formData.description || !formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (formData.githubUrl && formData.githubUrl.trim() !== '') {
      try {
        new URL(formData.githubUrl);
      } catch (_) {
        errors.githubUrl = 'Must be a valid URL (include https://)';
      }
    }

    if (formData.linkedinUrl && formData.linkedinUrl.trim() !== '') {
      try {
        new URL(formData.linkedinUrl);
      } catch (_) {
        errors.linkedinUrl = 'Must be a valid URL (include https://)';
      }
    }

    // Stages validation
    if (!formData.stages || formData.stages.length === 0) {
      errors.stages = 'At least 1 stage must be configured';
    } else {
      const hasVisible = formData.stages.some(s => s.visible !== false);
      if (!hasVisible) {
        errors.stages = 'At least 1 stage must be marked visible';
      }
      formData.stages.forEach((stage, idx) => {
        if (!stage.title || !stage.title.trim()) {
          errors[`stage_${idx}_title`] = 'Stage title is required';
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatusMessage({ type: 'error', text: 'Please resolve form validation errors before saving.' });
      return;
    }

    try {
      setSaving(true);
      setStatusMessage(null);
      const payload = {
        ...formData,
        stages: formData.stages.map((s, i) => ({
          ...s,
          displayOrder: i + 1
        }))
      };
      const response = await adminApi.updateHero(payload);
      if (response) {
        setFormData(prev => ({
          ...prev,
          ...response
        }));
      }
      setStatusMessage({ type: 'success', text: 'Hero content updated and published successfully!' });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error("Save hero failed:", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save hero content.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setResetting(true);
      setStatusMessage(null);
      const data = await adminApi.resetHero();
      if (data) {
        setFormData(data);
      }
      setShowResetModal(false);
      setStatusMessage({ type: 'success', text: 'Hero content successfully reset to canonical defaults.' });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error("Reset hero failed:", err);
      setStatusMessage({ type: 'error', text: 'Failed to reset Hero to defaults.' });
    } finally {
      setResetting(false);
    }
  };

  const visibleStages = (formData.stages || []).filter(s => s.visible !== false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-slate-400">Loading Hero Configuration...</p>
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
            <h1 className="text-2xl font-bold font-display text-white">Hero Section</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live CMS
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage your public introduction, headline, action buttons, social links, quote, and value badges with instant live preview.
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
        
        {/* Left Column: Form Controls (xl:col-span-6 or 7) */}
        <div className="xl:col-span-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Section 1: Main Introduction */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-mono font-bold">
                    01
                  </div>
                  <h2 className="text-base font-semibold text-white">Main Introduction</h2>
                </div>
                <span className="text-xs text-slate-500">Core Identity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Greeting Prefix <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.greeting}
                    onChange={(e) => handleFieldChange('greeting', e.target.value)}
                    placeholder="Hi, I'm"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  {validationErrors.greeting && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.greeting}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="Deva Yadhala"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-semibold"
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Professional Role / Headline <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                  placeholder="Software Developer"
                  className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                />
                {validationErrors.role && (
                  <p className="text-xs text-rose-400 mt-1">{validationErrors.role}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-slate-400">
                    Recruiter-Focused Summary <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formData.description.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Summarize your key skills, tech stack, and impact..."
                  className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
                {validationErrors.description && (
                  <p className="text-xs text-rose-400 mt-1">{validationErrors.description}</p>
                )}
              </div>
            </div>

            {/* Section 2: Action Buttons & Social Channels */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
                    02
                  </div>
                  <h2 className="text-base font-semibold text-white">Call to Actions & Social Links</h2>
                </div>
                <span className="text-xs text-slate-500">Buttons & Links</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primary Button */}
                <div className="p-3.5 rounded-xl bg-dark-900/70 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-slate-300">Primary Button (Resume)</span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('primaryButtonVisible', !formData.primaryButtonVisible)}
                      className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-mono transition-colors ${
                        formData.primaryButtonVisible
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {formData.primaryButtonVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{formData.primaryButtonVisible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.primaryButtonText}
                    onChange={(e) => handleFieldChange('primaryButtonText', e.target.value)}
                    placeholder="View Resume"
                    className="w-full bg-dark-850 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Secondary Button */}
                <div className="p-3.5 rounded-xl bg-dark-900/70 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-slate-300">Secondary Button (Contact)</span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('secondaryButtonVisible', !formData.secondaryButtonVisible)}
                      className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-mono transition-colors ${
                        formData.secondaryButtonVisible
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {formData.secondaryButtonVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{formData.secondaryButtonVisible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.secondaryButtonText}
                    onChange={(e) => handleFieldChange('secondaryButtonText', e.target.value)}
                    placeholder="Contact Me"
                    className="w-full bg-dark-850 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Social URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-slate-400" />
                    <span>GitHub URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => handleFieldChange('githubUrl', e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  {validationErrors.githubUrl && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.githubUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  {validationErrors.linkedinUrl && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.linkedinUrl}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Tagline Quote */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-mono font-bold">
                    03
                  </div>
                  <h2 className="text-base font-semibold text-white">Philosophy Quote</h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('quoteVisible', !formData.quoteVisible)}
                  className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors ${
                    formData.quoteVisible
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {formData.quoteVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{formData.quoteVisible ? 'Quote Visible' : 'Quote Hidden'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Quote Tagline Text
                </label>
                <input
                  type="text"
                  value={formData.quote}
                  onChange={(e) => handleFieldChange('quote', e.target.value)}
                  placeholder="Think deeper. Build smarter. Solve better."
                  className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-display italic"
                />
              </div>
            </div>

            {/* Section 4: Value Proposition Stages (Micro-Badges) */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-mono font-bold">
                    04
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Philosophy Micro-Badges</h2>
                    <p className="text-[11px] text-slate-400">Stages displayed under the quote</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Badge</span>
                </button>
              </div>

              {validationErrors.stages && (
                <p className="text-xs text-rose-400">{validationErrors.stages}</p>
              )}

              <div className="space-y-3">
                {formData.stages.map((stage, idx) => {
                  return (
                    <div
                      key={stage.id || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        stage.visible !== false
                          ? 'bg-dark-900/90 border-slate-800'
                          : 'bg-dark-900/40 border-slate-800/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={stage.stageNumber || `STAGE 0${idx + 1}`}
                            onChange={(e) => handleStageChange(idx, 'stageNumber', e.target.value)}
                            placeholder="STAGE 01"
                            className="bg-transparent border-b border-dashed border-slate-700 text-xs font-mono text-slate-400 focus:outline-none focus:border-emerald-500 w-24"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Move Up */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveStage(idx, -1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          {/* Move Down */}
                          <button
                            type="button"
                            disabled={idx === formData.stages.length - 1}
                            onClick={() => handleMoveStage(idx, 1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {/* Visibility Toggle */}
                          <button
                            type="button"
                            onClick={() => handleStageChange(idx, 'visible', stage.visible === false ? true : false)}
                            className={`p-1 transition-colors ${
                              stage.visible !== false ? 'text-emerald-400' : 'text-slate-600'
                            }`}
                            title="Toggle Visibility"
                          >
                            {stage.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleRemoveStage(idx)}
                            className="p-1 text-rose-500/70 hover:text-rose-400 transition-colors ml-1"
                            title="Remove Stage"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* Title */}
                        <div className="sm:col-span-6">
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">Badge Title</label>
                          <input
                            type="text"
                            value={stage.title}
                            onChange={(e) => handleStageChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Analytical Logic"
                            className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                          />
                          {validationErrors[`stage_${idx}_title`] && (
                            <p className="text-[11px] text-rose-400 mt-0.5">{validationErrors[`stage_${idx}_title`]}</p>
                          )}
                        </div>

                        {/* Icon Picker (Controlled List) */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">Icon</label>
                          <select
                            value={stage.icon || 'Brain'}
                            onChange={(e) => handleStageChange(idx, 'icon', e.target.value)}
                            className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                          >
                            {SUPPORTED_ICONS.map(ic => (
                              <option key={ic.id} value={ic.id}>
                                {ic.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Accent Color Picker (Controlled List) */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">Accent</label>
                          <select
                            value={stage.accent || 'cyan'}
                            onChange={(e) => handleStageChange(idx, 'accent', e.target.value)}
                            className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono capitalize"
                          >
                            {SUPPORTED_ACCENTS.map(acc => (
                              <option key={acc.id} value={acc.id}>
                                {acc.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Save Action */}
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
                <span>{saving ? 'Saving...' : 'Save & Publish Hero'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Instant Live Preview Panel (xl:col-span-6) */}
        <div className="xl:col-span-6">
          <div className="sticky top-24 space-y-4">
            
            {/* Live Preview Header Card */}
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

            {/* Live Preview Container Window */}
            <div className={`mx-auto transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
              <div className="bg-[#090d16] border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Hero Public UI Mock Render */}
                <div className="relative z-10 flex flex-col gap-6">
                  
                  {/* Top Intro + Profile Row */}
                  <div className={`flex ${previewMode === 'mobile' ? 'flex-col-reverse items-center text-center' : 'flex-col lg:flex-row items-center lg:items-center justify-between'} gap-6`}>
                    
                    {/* Text Column */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <span className="text-xs sm:text-sm font-semibold font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                          {formData.greeting || "Hi, I'm"}
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight leading-tight">
                          {formData.name || "Deva Yadhala"}
                        </h1>
                        <p className="text-sm sm:text-base font-semibold text-cyan-400 font-mono mt-1">
                          {formData.role || "Software Developer"}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-4">
                        {formData.description || "Your recruiter-focused introduction will appear here."}
                      </p>

                      {/* Action Buttons & Social Links */}
                      <div className="pt-2 flex flex-col items-start sm:items-start gap-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          {formData.primaryButtonVisible && (
                            <div className="px-4 py-1.5 rounded-full text-xs font-bold border border-slate-600 bg-dark-800/80 text-white flex items-center gap-1.5 shadow-sm">
                              <FileText className="w-3.5 h-3.5" />
                              <span>{formData.primaryButtonText || "View Resume"}</span>
                            </div>
                          )}

                          {formData.secondaryButtonVisible && (
                            <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1.5 shadow-sm">
                              <Mail className="w-3.5 h-3.5" />
                              <span>{formData.secondaryButtonText || "Contact Me"}</span>
                            </div>
                          )}
                        </div>

                        {/* Social Links */}
                        {(formData.githubUrl || formData.linkedinUrl) && (
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                            {formData.githubUrl && (
                              <span className="flex items-center gap-1 hover:text-emerald-400">
                                <Github className="w-3.5 h-3.5" />
                                <span>GitHub</span>
                              </span>
                            )}
                            {formData.githubUrl && formData.linkedinUrl && (
                              <span className="text-slate-600 font-bold">•</span>
                            )}
                            {formData.linkedinUrl && (
                              <span className="flex items-center gap-1 hover:text-cyan-400">
                                <Linkedin className="w-3.5 h-3.5" />
                                <span>LinkedIn</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Photo Representation */}
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/25 via-cyan-500/25 to-transparent rounded-full blur-lg opacity-70" />
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-emerald-500/30 via-slate-800 to-cyan-500/30 shadow-xl ring-2 ring-emerald-500/20 flex items-center justify-center overflow-hidden">
                          <span className="text-2xl font-extrabold font-display text-emerald-400 select-none">
                            DY
                          </span>
                          <img
                            src="/assets/profile.png"
                            alt={formData.name}
                            className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full object-cover object-[center_22%] scale-[1.08] origin-[center_22%] shadow-inner bg-dark-900"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tagline Quote & Badges */}
                  {formData.quoteVisible && formData.quote && (
                    <div className="pt-4 border-t border-slate-800/80 flex flex-col items-center justify-center text-center gap-2">
                      <p className="text-xs sm:text-sm font-medium text-slate-300 font-display italic">
                        &ldquo;{formData.quote}&rdquo;
                      </p>

                      {visibleStages.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          {visibleStages.map((stage, idx) => {
                            const IconComp = ICON_MAP[stage.icon] || Brain;
                            const accent = ACCENT_STYLES[stage.accent] || ACCENT_STYLES.cyan;

                            return (
                              <React.Fragment key={stage.id || idx}>
                                {idx > 0 && <span className="text-slate-700 text-xs select-none">•</span>}
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-800/70 border border-slate-700/60 text-slate-300 text-[11px] font-mono group cursor-default`}>
                                  <IconComp className={`w-3 h-3 ${accent.icon}`} />
                                  <span>{stage.title}</span>
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-dark-850/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <span>View full live portfolio with all sections:</span>
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
                <h3 className="text-base font-bold text-white">Reset Hero to Defaults?</h3>
                <p className="text-xs text-slate-400">This action will replace the current hero content.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-dark-900/60 p-3.5 rounded-xl border border-slate-800">
              This will reset greeting to <span className="text-emerald-400 font-mono font-semibold">&ldquo;Hi, I&apos;m&rdquo;</span>, name to <span className="text-emerald-400 font-mono font-semibold">Deva Yadhala</span>, role to <span className="text-emerald-400 font-mono font-semibold">Software Developer</span>, canonical description, quote, and the 3 value stages (Analytical Logic, Clean Architecture, Scalable Solutions).
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

export default AdminHeroPage;
