import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { ExperienceModal } from '../components/admin/ExperienceModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/common/Toast';
import {
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  Building2
} from 'lucide-react';

const DEFAULT_EXP_HEADER = {
  badgeText: 'EXPERIENCE',
  description: 'Practical software engineering and technical roles across enterprise and engineering organizations.'
};

export const AdminExperiencePage = () => {
  const [experience, setExperience] = useState([]);
  const [headerData, setHeaderData] = useState(DEFAULT_EXP_HEADER);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderSaving, setIsHeaderSaving] = useState(false);
  const [isHeaderResetting, setIsHeaderResetting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expToDelete, setExpToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const loadData = async () => {
    try {
      const [expData, headerRes] = await Promise.all([
        adminApi.getExperience(),
        adminApi.getSectionHeader('EXPERIENCE').catch(() => null)
      ]);
      setExperience(expData || []);
      if (headerRes) {
        setHeaderData({
          badgeText: headerRes.badgeText || DEFAULT_EXP_HEADER.badgeText,
          description: headerRes.description || DEFAULT_EXP_HEADER.description
        });
      }
    } catch (err) {
      console.error('Failed to load experience data', err);
      showToast('error', 'Failed to load experience records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    if (!headerData.badgeText.trim() || !headerData.description.trim()) {
      showToast('error', 'Badge text and description cannot be empty.');
      return;
    }
    setIsHeaderSaving(true);
    try {
      await adminApi.updateSectionHeader('EXPERIENCE', headerData);
      showToast('success', 'Experience section header updated successfully!');
    } catch (err) {
      console.error('Error saving experience header', err);
      showToast('error', err.response?.data?.message || 'Failed to save experience header.');
    } finally {
      setIsHeaderSaving(false);
    }
  };

  const handleResetHeader = async () => {
    setIsHeaderResetting(true);
    try {
      const res = await adminApi.resetSectionHeader('EXPERIENCE');
      if (res) {
        setHeaderData({
          badgeText: res.badgeText || DEFAULT_EXP_HEADER.badgeText,
          description: res.description || DEFAULT_EXP_HEADER.description
        });
      }
      showToast('success', 'Experience section header reset to canonical defaults.');
    } catch (err) {
      console.error('Error resetting experience header', err);
      showToast('error', 'Failed to reset experience header.');
    } finally {
      setIsHeaderResetting(false);
    }
  };

  const handleCreateOrUpdate = async (expData) => {
    setIsSaving(true);
    try {
      if (selectedExp?.id) {
        await adminApi.updateExperience(selectedExp.id, expData);
        showToast('success', `Experience at "${expData.organization}" updated.`);
      } else {
        await adminApi.createExperience(expData);
        showToast('success', `Experience at "${expData.organization}" created.`);
      }
      setModalOpen(false);
      setSelectedExp(null);
      await loadData();
    } catch (err) {
      console.error('Error saving experience', err);
      showToast('error', err.response?.data?.message || 'Failed to save experience.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!expToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteExperience(expToDelete.id);
      showToast('success', `Experience at "${expToDelete.organization}" deleted.`);
      setDeleteConfirmOpen(false);
      setExpToDelete(null);
      await loadData();
    } catch (err) {
      console.error('Error deleting experience', err);
      showToast('error', 'Failed to delete experience.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Experience CMS Management</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Experience & Header Settings</h1>
          <p className="text-sm text-slate-400">
            Configure section badge, subtitle copy, and career work history.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedExp(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Experience</span>
        </button>
      </div>

      {/* 1. Section Header Editor & Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-7 bg-dark-850 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Section Header</h2>
                <p className="text-xs text-slate-400">Badge pill and section subtitle</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetHeader}
                disabled={isHeaderSaving || isHeaderResetting}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-dark-800 hover:bg-dark-750 border border-slate-700 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Reset Header to Defaults"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleSaveHeader}
                disabled={isHeaderSaving}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
                <span>{isHeaderSaving ? 'Saving...' : 'Save Header'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Section Badge Text <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="badgeText"
                value={headerData.badgeText}
                onChange={handleHeaderChange}
                placeholder="e.g. EXPERIENCE"
                className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Introductory Subtitle / Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="description"
                rows={2}
                value={headerData.description}
                onChange={handleHeaderChange}
                placeholder="Describe engineering roles and career journey..."
                className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 bg-[#090d16] border border-slate-800 rounded-2xl p-6 flex flex-col justify-center text-center space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-800/80">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span>Header Live Preview</span>
            </span>
            <span className="text-[10px] font-mono">Updates live</span>
          </div>

          <div className="py-2 space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              {headerData.badgeText || 'EXPERIENCE'}
            </div>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              {headerData.description || 'Practical software engineering and technical roles across enterprise and engineering organizations.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Experience Cards List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>Work History Entries ({experience.length})</span>
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : experience.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No experience records</h3>
            <p className="text-xs text-slate-400">Click "Add New Experience" to add employment history.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-bold text-white font-display">{exp.role}</h3>
                    <span className="px-2.5 py-0.5 rounded-md bg-dark-800 text-emerald-400 border border-slate-700/60 font-medium text-xs">
                      {exp.organization}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                    <span className="text-slate-500">Order: {exp.displayOrder}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      setSelectedExp(exp);
                      setModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Edit Experience"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setExpToDelete(exp);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ExperienceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedExp(null);
        }}
        onSave={handleCreateOrUpdate}
        experience={selectedExp}
        isLoading={isSaving}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Experience"
        message={`Are you sure you want to delete experience at "${expToDelete?.organization}"?`}
        isLoading={isDeleting}
      />

      {/* Toast Feedback */}
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

export default AdminExperiencePage;
