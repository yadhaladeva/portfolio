import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { Toast } from '../components/common/Toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Mail,
  Send,
  MapPin,
  Linkedin,
  Github,
  Phone,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Layers,
  Globe
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  badgeText: 'GET IN TOUCH',
  introText: 'Open to software engineering, backend development, and technical collaboration opportunities.',
  location: 'Chennai, India',
  email: 'devayadhala.dev@gmail.com',
  phone: '',
  linkedinUrl: 'https://linkedin.com',
  githubUrl: 'https://github.com',
  formTitle: 'Send a Message',
  formDescription: 'Fill in your contact details below to send an inquiry directly to my portfolio database.',
  namePlaceholder: 'e.g. John Doe',
  emailPlaceholder: 'e.g. john@company.com',
  subjectPlaceholder: 'e.g. Job opportunity / Collaboration',
  messagePlaceholder: 'Write your message here...',
  submitButtonText: 'Send Message'
};

export const AdminContactPage = () => {
  const [formData, setFormData] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const loadSettings = async () => {
    try {
      const data = await adminApi.getContactSettings();
      if (data) {
        setFormData({
          badgeText: data.badgeText || DEFAULT_SETTINGS.badgeText,
          introText: data.introText || DEFAULT_SETTINGS.introText,
          location: data.location || DEFAULT_SETTINGS.location,
          email: data.email || DEFAULT_SETTINGS.email,
          phone: data.phone || '',
          linkedinUrl: data.linkedinUrl || DEFAULT_SETTINGS.linkedinUrl,
          githubUrl: data.githubUrl || DEFAULT_SETTINGS.githubUrl,
          formTitle: data.formTitle || DEFAULT_SETTINGS.formTitle,
          formDescription: data.formDescription || DEFAULT_SETTINGS.formDescription,
          namePlaceholder: data.namePlaceholder || DEFAULT_SETTINGS.namePlaceholder,
          emailPlaceholder: data.emailPlaceholder || DEFAULT_SETTINGS.emailPlaceholder,
          subjectPlaceholder: data.subjectPlaceholder || DEFAULT_SETTINGS.subjectPlaceholder,
          messagePlaceholder: data.messagePlaceholder || DEFAULT_SETTINGS.messagePlaceholder,
          submitButtonText: data.submitButtonText || DEFAULT_SETTINGS.submitButtonText
        });
      }
    } catch (err) {
      console.error('Failed to load contact settings:', err);
      showToast('error', 'Failed to load contact settings from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.badgeText.trim()) newErrors.badgeText = 'Badge text is required';
    if (!formData.introText.trim()) newErrors.introText = 'Introductory text is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.formTitle.trim()) newErrors.formTitle = 'Form title is required';
    if (!formData.formDescription.trim()) newErrors.formDescription = 'Form description is required';
    if (!formData.submitButtonText.trim()) newErrors.submitButtonText = 'Submit button text is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', 'Please resolve highlighted validation errors.');
      return;
    }

    setIsSaving(true);
    try {
      await adminApi.updateContactSettings({
        ...formData,
        phone: formData.phone.trim() ? formData.phone.trim() : null
      });
      showToast('success', 'Contact settings updated successfully!');
    } catch (err) {
      console.error('Failed to update contact settings:', err);
      const msg = err.response?.data?.message || 'Failed to save contact settings.';
      showToast('error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const data = await adminApi.resetContactSettings();
      if (data) {
        setFormData({
          badgeText: data.badgeText || DEFAULT_SETTINGS.badgeText,
          introText: data.introText || DEFAULT_SETTINGS.introText,
          location: data.location || DEFAULT_SETTINGS.location,
          email: data.email || DEFAULT_SETTINGS.email,
          phone: data.phone || '',
          linkedinUrl: data.linkedinUrl || DEFAULT_SETTINGS.linkedinUrl,
          githubUrl: data.githubUrl || DEFAULT_SETTINGS.githubUrl,
          formTitle: data.formTitle || DEFAULT_SETTINGS.formTitle,
          formDescription: data.formDescription || DEFAULT_SETTINGS.formDescription,
          namePlaceholder: data.namePlaceholder || DEFAULT_SETTINGS.namePlaceholder,
          emailPlaceholder: data.emailPlaceholder || DEFAULT_SETTINGS.emailPlaceholder,
          subjectPlaceholder: data.subjectPlaceholder || DEFAULT_SETTINGS.subjectPlaceholder,
          messagePlaceholder: data.messagePlaceholder || DEFAULT_SETTINGS.messagePlaceholder,
          submitButtonText: data.submitButtonText || DEFAULT_SETTINGS.submitButtonText
        });
      }
      setResetConfirmOpen(false);
      showToast('success', 'Contact settings restored to canonical defaults.');
    } catch (err) {
      console.error('Failed to reset contact settings:', err);
      showToast('error', 'Failed to reset settings.');
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading contact configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Mail className="w-4 h-4" />
            <span>Contact Section CMS</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Contact Settings</h1>
          <p className="text-sm text-slate-400">
            Configure public contact section badge, intro copy, contact channels, and message form placeholders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            disabled={isSaving || isResetting}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-dark-800 hover:bg-dark-750 border border-slate-700 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Header & Introductory Content */}
            <div className="bg-dark-850 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Section Header</h2>
                  <p className="text-xs text-slate-400">Badge pill and section headline text</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Section Badge Text <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="badgeText"
                    value={formData.badgeText}
                    onChange={handleChange}
                    placeholder="e.g. GET IN TOUCH"
                    className={`w-full px-3.5 py-2 text-sm bg-dark-800 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                      errors.badgeText ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700/80 focus:border-emerald-500'
                    }`}
                  />
                  {errors.badgeText && <p className="text-xs text-rose-400 mt-1">{errors.badgeText}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Introductory Subtitle <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    name="introText"
                    rows={3}
                    value={formData.introText}
                    onChange={handleChange}
                    placeholder="Describe collaboration opportunities..."
                    className={`w-full px-3.5 py-2 text-sm bg-dark-800 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-colors resize-none ${
                      errors.introText ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700/80 focus:border-emerald-500'
                    }`}
                  />
                  {errors.introText && <p className="text-xs text-rose-400 mt-1">{errors.introText}</p>}
                </div>
              </div>
            </div>

            {/* 2. Direct Contact Channels */}
            <div className="bg-dark-850 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Contact Information</h2>
                  <p className="text-xs text-slate-400">Direct location, email, optional phone, and social links</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Location <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Chennai, India"
                    className={`w-full px-3.5 py-2 text-sm bg-dark-800 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                      errors.location ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700/80 focus:border-emerald-500'
                    }`}
                  />
                  {errors.location && <p className="text-xs text-rose-400 mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Primary Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. devayadhala.dev@gmail.com"
                    className={`w-full px-3.5 py-2 text-sm bg-dark-800 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                      errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700/80 focus:border-emerald-500'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone Number <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 93926 58823 (leave empty to hide)"
                    className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <span className="text-[10px] text-slate-500">If filled, phone channel renders with tel: link</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 3. Contact Form & Field Placeholders */}
            <div className="bg-dark-850 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Contact Form Configuration</h2>
                  <p className="text-xs text-slate-400">Headings, descriptions, input placeholders, and button label</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Form Heading <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="formTitle"
                      value={formData.formTitle}
                      onChange={handleChange}
                      placeholder="e.g. Send a Message"
                      className={`w-full px-3.5 py-2 text-sm bg-dark-800 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                        errors.formTitle ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700/80 focus:border-emerald-500'
                      }`}
                    />
                    {errors.formTitle && <p className="text-xs text-rose-400 mt-1">{errors.formTitle}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Submit Button Text <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="submitButtonText"
                      value={formData.submitButtonText}
                      onChange={handleChange}
                      placeholder="e.g. Send Message"
                      className={`w-full px-3.5 py-2 text-sm bg-dark-800 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                        errors.submitButtonText ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700/80 focus:border-emerald-500'
                      }`}
                    />
                    {errors.submitButtonText && <p className="text-xs text-rose-400 mt-1">{errors.submitButtonText}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Form Description <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="formDescription"
                    value={formData.formDescription}
                    onChange={handleChange}
                    placeholder="e.g. Fill in your contact details below..."
                    className={`w-full px-3.5 py-2 text-sm bg-dark-800 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                      errors.formDescription ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700/80 focus:border-emerald-500'
                    }`}
                  />
                  {errors.formDescription && <p className="text-xs text-rose-400 mt-1">{errors.formDescription}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Name Input Placeholder
                    </label>
                    <input
                      type="text"
                      name="namePlaceholder"
                      value={formData.namePlaceholder}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Input Placeholder
                    </label>
                    <input
                      type="text"
                      name="emailPlaceholder"
                      value={formData.emailPlaceholder}
                      onChange={handleChange}
                      placeholder="e.g. john@company.com"
                      className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Subject Input Placeholder
                    </label>
                    <input
                      type="text"
                      name="subjectPlaceholder"
                      value={formData.subjectPlaceholder}
                      onChange={handleChange}
                      placeholder="e.g. Job opportunity / Collaboration"
                      className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Message Textarea Placeholder
                    </label>
                    <input
                      type="text"
                      name="messagePlaceholder"
                      value={formData.messagePlaceholder}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Live Public Portfolio Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Eye className="w-4 h-4" />
                <span>Live Portfolio Preview</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Updates as you type</span>
            </div>

            {/* Preview Box */}
            <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
              {/* Preview Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  {formData.badgeText || 'GET IN TOUCH'}
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 max-w-sm mx-auto">
                  {formData.introText || 'Open to software engineering, backend development, and technical collaboration opportunities.'}
                </p>
              </div>

              {/* Preview Cards Stack */}
              <div className="space-y-4">
                {/* Contact Info Card Preview */}
                <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-3.5">
                  <h4 className="text-sm font-bold text-white">Contact Information</h4>
                  <div className="space-y-2.5 text-xs">
                    {/* Location */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <MapPin className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-bold">Location</span>
                        <span className="text-slate-200">{formData.location || 'Chennai, India'}</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <Mail className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-bold">Email</span>
                        <span className="text-amber-400 underline">{formData.email || 'devayadhala.dev@gmail.com'}</span>
                      </div>
                    </div>

                    {/* Optional Phone */}
                    {formData.phone && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                          <Phone className="w-3 h-3" />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block font-bold">Phone</span>
                          <span className="text-cyan-400 font-mono">{formData.phone}</span>
                        </div>
                      </div>
                    )}

                    {/* LinkedIn */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <Linkedin className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-bold">LinkedIn</span>
                        <span className="text-blue-400">Connect on LinkedIn →</span>
                      </div>
                    </div>

                    {/* GitHub */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <Github className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-bold">GitHub</span>
                        <span className="text-purple-400">Explore Repositories →</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form Card Preview */}
                <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{formData.formTitle || 'Send a Message'}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{formData.formDescription || 'Fill in your contact details below...'}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="px-2.5 py-1.5 bg-dark-800 border border-slate-700/60 rounded-lg text-slate-500 text-[11px] truncate">
                        {formData.namePlaceholder || 'e.g. John Doe'}
                      </div>
                      <div className="px-2.5 py-1.5 bg-dark-800 border border-slate-700/60 rounded-lg text-slate-500 text-[11px] truncate">
                        {formData.emailPlaceholder || 'e.g. john@company.com'}
                      </div>
                    </div>
                    <div className="px-2.5 py-1.5 bg-dark-800 border border-slate-700/60 rounded-lg text-slate-500 text-[11px] truncate">
                      {formData.subjectPlaceholder || 'e.g. Job opportunity / Collaboration'}
                    </div>
                    <div className="px-2.5 py-2.5 bg-dark-800 border border-slate-700/60 rounded-lg text-slate-500 text-[11px] h-12">
                      {formData.messagePlaceholder || 'Write your message here...'}
                    </div>
                  </div>

                  <div className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 text-center flex items-center justify-center gap-1.5">
                    <Send className="w-3 h-3" />
                    <span>{formData.submitButtonText || 'Send Message'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        title="Reset Contact Configuration to Defaults?"
        message="This will restore canonical contact copy, email address (devayadhala.dev@gmail.com), location (Chennai, India), and standard form placeholders. Are you sure?"
        confirmText="Reset to Defaults"
        confirmVariant="danger"
        isLoading={isResetting}
        onConfirm={handleReset}
        onCancel={() => setResetConfirmOpen(false)}
      />

      {/* Floating Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminContactPage;
