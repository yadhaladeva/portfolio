import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import {
  Compass,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Link as LinkIcon,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Monitor,
  Smartphone,
  Menu,
  Sparkles
} from 'lucide-react';

const DEFAULT_HEADER = {
  logoText: "DY",
  brandName: "Deva Yadhala",
  navItems: [
    { name: "About", sectionId: "about", href: "#about", displayOrder: 1, visible: true, isExternal: false },
    { name: "Skills", sectionId: "skills", href: "#skills", displayOrder: 2, visible: true, isExternal: false },
    { name: "Experience", sectionId: "experience", href: "#experience", displayOrder: 3, visible: true, isExternal: false },
    { name: "Projects", sectionId: "projects", href: "#projects", displayOrder: 4, visible: true, isExternal: false },
    { name: "Certifications", sectionId: "certifications", href: "#certifications", displayOrder: 5, visible: true, isExternal: false },
    { name: "Contact", sectionId: "contact", href: "#contact", displayOrder: 6, visible: true, isExternal: false },
  ]
};

export const AdminHeaderPage = () => {
  const [formData, setFormData] = useState(DEFAULT_HEADER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const [activePreviewTab, setActivePreviewTab] = useState('about');

  useEffect(() => {
    fetchHeaderData();
  }, []);

  const fetchHeaderData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getHeader();
      if (data) {
        setFormData({
          logoText: data.logoText || "DY",
          brandName: data.brandName || "Deva Yadhala",
          navItems: data.navItems && data.navItems.length > 0 ? data.navItems : DEFAULT_HEADER.navItems
        });
      }
    } catch (err) {
      console.error("Failed to load header content:", err);
      setStatusMessage({ type: 'error', text: 'Could not load existing Header configuration from server.' });
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

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const updatedItems = [...prev.navItems];
      const item = { ...updatedItems[index], [field]: value };

      // Auto sync href if sectionId changes for internal items
      if (field === 'sectionId' && !item.isExternal) {
        item.href = `#${value.trim().toLowerCase().replaceAll(/[^a-z0-9]/g, '')}`;
      }
      if (field === 'name' && !item.sectionId && !item.isExternal) {
        const autoId = value.trim().toLowerCase().replaceAll(/[^a-z0-9]/g, '');
        item.sectionId = autoId;
        item.href = `#${autoId}`;
      }

      updatedItems[index] = item;
      return { ...prev, navItems: updatedItems };
    });
  };

  const handleToggleExternal = (index) => {
    setFormData(prev => {
      const updatedItems = [...prev.navItems];
      const item = { ...updatedItems[index] };
      item.isExternal = !item.isExternal;
      if (item.isExternal) {
        if (!item.href || item.href.startsWith('#')) {
          item.href = 'https://';
        }
      } else {
        const secId = item.sectionId || item.name.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
        item.sectionId = secId;
        item.href = `#${secId}`;
      }
      updatedItems[index] = item;
      return { ...prev, navItems: updatedItems };
    });
  };

  const handleAddItem = () => {
    const nextIndex = formData.navItems.length + 1;
    const newItem = {
      name: 'Custom Link',
      sectionId: 'custom',
      href: '#custom',
      displayOrder: nextIndex,
      visible: true,
      isExternal: false
    };
    setFormData(prev => ({
      ...prev,
      navItems: [...prev.navItems, newItem]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      navItems: prev.navItems.filter((_, i) => i !== index)
    }));
  };

  const handleMoveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formData.navItems.length) return;

    setFormData(prev => {
      const items = [...prev.navItems];
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return {
        ...prev,
        navItems: items.map((item, i) => ({ ...item, displayOrder: i + 1 }))
      };
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.logoText || !formData.logoText.trim()) {
      errors.logoText = 'Logo text is required (e.g. "DY")';
    }
    if (!formData.brandName || !formData.brandName.trim()) {
      errors.brandName = 'Brand name is required (e.g. "Deva Yadhala")';
    }

    if (!formData.navItems || formData.navItems.length === 0) {
      errors.navItems = 'At least 1 navigation item must exist';
    } else {
      const hasVisible = formData.navItems.some(item => item.visible !== false);
      if (!hasVisible) {
        errors.navItems = 'At least 1 navigation item must be visible';
      }
      formData.navItems.forEach((item, idx) => {
        if (!item.name || !item.name.trim()) {
          errors[`item_${idx}_name`] = 'Item label is required';
        }
        if (item.isExternal) {
          if (!item.href || !item.href.trim() || item.href === 'https://') {
            errors[`item_${idx}_href`] = 'Valid URL required';
          }
        }
      });
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
        navItems: formData.navItems.map((item, i) => ({
          ...item,
          displayOrder: i + 1
        }))
      };
      const response = await adminApi.updateHeader(payload);
      if (response) {
        setFormData(prev => ({
          ...prev,
          ...response
        }));
      }
      setStatusMessage({ type: 'success', text: 'Header navigation updated and published successfully!' });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error("Save header failed:", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save header configuration.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setResetting(true);
      setStatusMessage(null);
      const data = await adminApi.resetHeader();
      if (data) {
        setFormData(data);
      }
      setShowResetModal(false);
      setStatusMessage({ type: 'success', text: 'Header navigation reset to canonical defaults.' });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error("Reset header failed:", err);
      setStatusMessage({ type: 'error', text: 'Failed to reset Header to defaults.' });
    } finally {
      setResetting(false);
    }
  };

  const visibleNavItems = (formData.navItems || [])
    .filter(item => item.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-slate-400">Loading Header Configuration...</p>
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
            <h1 className="text-2xl font-bold font-display text-white">Header & Navigation</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live CMS
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage your brand logo monogram, brand name, and ordered navigation items with instant zero-latency live preview.
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

            {/* Section 1: Brand & Logo Identity */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-mono font-bold">
                    01
                  </div>
                  <h2 className="text-base font-semibold text-white">Brand & Logo Monogram</h2>
                </div>
                <span className="text-xs text-slate-500">Identity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Logo Monogram <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm font-display shadow-md shrink-0">
                      {formData.logoText || "DY"}
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.logoText}
                      onChange={(e) => handleFieldChange('logoText', e.target.value.toUpperCase())}
                      placeholder="DY"
                      className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold uppercase focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  {validationErrors.logoText && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.logoText}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Brand Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => handleFieldChange('brandName', e.target.value)}
                    placeholder="Deva Yadhala"
                    className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-semibold"
                  />
                  {validationErrors.brandName && (
                    <p className="text-xs text-rose-400 mt-1">{validationErrors.brandName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Navigation Links Manager */}
            <div className="bg-dark-850 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
                    02
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Navigation Items</h2>
                    <p className="text-[11px] text-slate-400">Order, rename, or toggle visibility of navbar links</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>

              {validationErrors.navItems && (
                <p className="text-xs text-rose-400">{validationErrors.navItems}</p>
              )}

              <div className="space-y-3">
                {formData.navItems.map((item, idx) => {
                  return (
                    <div
                      key={item.id || idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        item.visible !== false
                          ? 'bg-dark-900/90 border-slate-800'
                          : 'bg-dark-900/40 border-slate-800/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-mono font-semibold text-slate-300">
                            {item.name || 'Untitled Link'}
                          </span>
                          {item.isExternal ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              External
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                              #{item.sectionId || 'section'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Move Up */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveItem(idx, -1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          {/* Move Down */}
                          <button
                            type="button"
                            disabled={idx === formData.navItems.length - 1}
                            onClick={() => handleMoveItem(idx, 1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {/* Visibility Toggle */}
                          <button
                            type="button"
                            onClick={() => handleItemChange(idx, 'visible', item.visible === false ? true : false)}
                            className={`p-1 transition-colors ${
                              item.visible !== false ? 'text-emerald-400' : 'text-slate-600'
                            }`}
                            title="Toggle Visibility"
                          >
                            {item.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          {/* Delete Item */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-rose-500/70 hover:text-rose-400 transition-colors ml-1"
                            title="Remove Link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* Label */}
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">Link Label</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                            placeholder="About"
                            className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                          />
                          {validationErrors[`item_${idx}_name`] && (
                            <p className="text-[11px] text-rose-400 mt-0.5">{validationErrors[`item_${idx}_name`]}</p>
                          )}
                        </div>

                        {/* Destination */}
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-mono text-slate-500 mb-1">
                            {item.isExternal ? 'External URL' : 'Section Anchor ID'}
                          </label>
                          {item.isExternal ? (
                            <input
                              type="url"
                              value={item.href || ''}
                              onChange={(e) => handleItemChange(idx, 'href', e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-dark-850 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          ) : (
                            <div className="flex items-center bg-dark-850 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 font-mono">
                              <span className="text-slate-500 mr-0.5">#</span>
                              <input
                                type="text"
                                value={item.sectionId || ''}
                                onChange={(e) => handleItemChange(idx, 'sectionId', e.target.value)}
                                placeholder="about"
                                className="bg-transparent text-white focus:outline-none w-full font-mono text-xs"
                              />
                            </div>
                          )}
                          {validationErrors[`item_${idx}_href`] && (
                            <p className="text-[11px] text-rose-400 mt-0.5">{validationErrors[`item_${idx}_href`]}</p>
                          )}
                        </div>

                        {/* Link Type Switcher */}
                        <div className="sm:col-span-2 flex items-end pb-0.5">
                          <button
                            type="button"
                            onClick={() => handleToggleExternal(idx)}
                            className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-mono border transition-all text-center ${
                              item.isExternal
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                                : 'bg-dark-800 border-slate-700 text-slate-400 hover:text-slate-200'
                            }`}
                            title={item.isExternal ? 'Switch to Section Anchor' : 'Switch to External URL'}
                          >
                            {item.isExternal ? 'External' : 'Section'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                <span>{saving ? 'Saving...' : 'Save & Publish Navbar'}</span>
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

            {/* Live Preview Simulated Browser Window */}
            <div className={`mx-auto transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
              <div className="bg-[#090d16] border-2 border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Simulated Glass Navbar */}
                <div className="relative z-10 w-full">
                  <div className="glass-nav rounded-2xl px-4 py-3 border border-slate-800/80 shadow-lg shadow-black/20 flex items-center justify-between">
                    {/* Brand Left */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-base font-display shadow-lg shadow-emerald-500/20 shrink-0">
                        {formData.logoText || "DY"}
                      </div>
                      <span className="text-base font-bold text-white font-display tracking-tight truncate">
                        {formData.brandName || "Deva Yadhala"}
                      </span>
                    </div>

                    {/* Desktop Navigation Links */}
                    {previewMode === 'desktop' ? (
                      <nav className="flex items-center gap-1 bg-dark-800/70 p-1 rounded-full border border-slate-700/60 backdrop-blur-md">
                        {visibleNavItems.map((link) => {
                          const isActive = activePreviewTab === (link.sectionId || link.name.toLowerCase());
                          return (
                            <button
                              type="button"
                              key={link.id || link.name}
                              onClick={() => setActivePreviewTab(link.sectionId || link.name.toLowerCase())}
                              className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                                isActive
                                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                                  : 'text-slate-300 font-medium hover:text-white hover:bg-slate-800/80'
                              }`}
                            >
                              {link.name}
                            </button>
                          );
                        })}
                      </nav>
                    ) : (
                      /* Mobile Hamburger Icon */
                      <div className="p-2 text-slate-400 rounded-lg bg-dark-800/80 border border-slate-700/50">
                        <Menu className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* If Mobile Preview, also show the open drawer mockup */}
                  {previewMode === 'mobile' && (
                    <div className="mt-3 glass-nav rounded-xl border border-slate-800/80 p-3 space-y-1.5 animate-fadeIn">
                      <p className="text-[10px] font-mono text-slate-500 px-2 uppercase tracking-wider">Mobile Drawer Menu</p>
                      {visibleNavItems.map((link) => {
                        const isActive = activePreviewTab === (link.sectionId || link.name.toLowerCase());
                        return (
                          <button
                            type="button"
                            key={link.id || link.name}
                            onClick={() => setActivePreviewTab(link.sectionId || link.name.toLowerCase())}
                            className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              isActive
                                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                                : 'text-slate-200 hover:bg-slate-800/50'
                            }`}
                          >
                            {link.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Simulated Content Area */}
                <div className="relative z-0 mt-8 p-4 rounded-xl bg-dark-900/40 border border-slate-800/40 text-center">
                  <p className="text-xs font-mono text-slate-400">
                    Active section target: <span className="text-emerald-400 font-bold">#{activePreviewTab}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click any link above in the live preview to test active states.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-dark-850/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <span>View full live portfolio with top navbar:</span>
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
                <h3 className="text-base font-bold text-white">Reset Header to Defaults?</h3>
                <p className="text-xs text-slate-400">This action will replace your current header configuration.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-dark-900/60 p-3.5 rounded-xl border border-slate-800">
              This will restore logo monogram to <span className="text-emerald-400 font-mono font-semibold">&ldquo;DY&rdquo;</span>, brand name to <span className="text-emerald-400 font-mono font-semibold">Deva Yadhala</span>, and the original 6 navigation links: <span className="text-slate-200">About, Skills, Experience, Projects, Certifications, Contact</span>.
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

export default AdminHeaderPage;
