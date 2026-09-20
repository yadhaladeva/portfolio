import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { SkillModal } from '../components/admin/SkillModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/common/Toast';
import {
  Plus,
  Edit2,
  Trash2,
  Terminal,
  Layers,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_SKILLS_HEADER = {
  badgeText: 'SKILLS',
  description: 'Categorized technical capabilities, frameworks, and engineering tools verified through projects and professional experience.'
};

export const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [headerData, setHeaderData] = useState(DEFAULT_SKILLS_HEADER);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderSaving, setIsHeaderSaving] = useState(false);
  const [isHeaderResetting, setIsHeaderResetting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const loadData = async () => {
    try {
      const [skillsData, headerRes] = await Promise.all([
        adminApi.getSkills(),
        adminApi.getSectionHeader('SKILLS').catch(() => null)
      ]);
      setSkills(skillsData || []);
      if (headerRes) {
        setHeaderData({
          badgeText: headerRes.badgeText || DEFAULT_SKILLS_HEADER.badgeText,
          description: headerRes.description || DEFAULT_SKILLS_HEADER.description
        });
      }
    } catch (err) {
      console.error('Failed to load skills data', err);
      showToast('error', 'Failed to load skills data.');
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
      await adminApi.updateSectionHeader('SKILLS', headerData);
      showToast('success', 'Skills section header updated successfully!');
    } catch (err) {
      console.error('Error saving skills header', err);
      showToast('error', err.response?.data?.message || 'Failed to save skills header.');
    } finally {
      setIsHeaderSaving(false);
    }
  };

  const handleResetHeader = async () => {
    setIsHeaderResetting(true);
    try {
      const res = await adminApi.resetSectionHeader('SKILLS');
      if (res) {
        setHeaderData({
          badgeText: res.badgeText || DEFAULT_SKILLS_HEADER.badgeText,
          description: res.description || DEFAULT_SKILLS_HEADER.description
        });
      }
      showToast('success', 'Skills section header reset to canonical defaults.');
    } catch (err) {
      console.error('Error resetting skills header', err);
      showToast('error', 'Failed to reset skills header.');
    } finally {
      setIsHeaderResetting(false);
    }
  };

  const handleCreateOrUpdate = async (skillData) => {
    setIsSaving(true);
    try {
      if (selectedSkill?.id) {
        await adminApi.updateSkill(selectedSkill.id, skillData);
        showToast('success', `Skill "${skillData.name}" updated.`);
      } else {
        await adminApi.createSkill(skillData);
        showToast('success', `Skill "${skillData.name}" created.`);
      }
      setModalOpen(false);
      setSelectedSkill(null);
      await loadData();
    } catch (err) {
      console.error('Error saving skill', err);
      showToast('error', err.response?.data?.message || 'Failed to save skill.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteSkill(skillToDelete.id);
      showToast('success', `Skill "${skillToDelete.name}" deleted.`);
      setDeleteConfirmOpen(false);
      setSkillToDelete(null);
      await loadData();
    } catch (err) {
      console.error('Error deleting skill', err);
      showToast('error', 'Failed to delete skill.');
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
            <Terminal className="w-4 h-4" />
            <span>Skills CMS Management</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Skills & Header Settings</h1>
          <p className="text-sm text-slate-400">
            Configure section badge, subtitle copy, categories, and technical proficiencies.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedSkill(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* 1. Section Header Editor & Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-7 bg-dark-850 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
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
                placeholder="e.g. SKILLS"
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
                placeholder="Describe skill categories and proficiencies..."
                className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 bg-[#090d16] border border-slate-800 rounded-2xl p-6 flex flex-col justify-center text-center space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-800/80">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span>Header Live Preview</span>
            </span>
            <span className="text-[10px] font-mono">Updates live</span>
          </div>

          <div className="py-2 space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              {headerData.badgeText || 'SKILLS'}
            </div>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              {headerData.description || 'Categorized technical capabilities, frameworks, and engineering tools verified through projects and professional experience.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Skills Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Technical Skills List ({skills.length})</span>
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : skills.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <Terminal className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No skills found</h3>
            <p className="text-xs text-slate-400">Click "Add New Skill" to add capabilities.</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-800/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Skill Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Proficiency</th>
                    <th className="px-6 py-4 text-center">Order</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {skills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-white text-sm">
                        {skill.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-dark-800 text-cyan-300 border border-slate-700/60 font-medium text-[11px]">
                          {skill.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-dark-900 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-emerald-400 rounded-full"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-400 text-[11px]">{skill.proficiency}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-slate-300">
                        {skill.displayOrder}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedSkill(skill);
                              setModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Skill"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSkillToDelete(skill);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete Skill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <SkillModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSkill(null);
        }}
        onSave={handleCreateOrUpdate}
        skill={selectedSkill}
        isLoading={isSaving}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Skill"
        message={`Are you sure you want to delete "${skillToDelete?.name}"?`}
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

export default AdminSkillsPage;
