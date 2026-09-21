import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { ProjectModal } from '../components/admin/ProjectModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/common/Toast';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Star,
  FolderGit2,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  Layers,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_PROJECTS_HEADER = {
  badgeText: 'PROJECTS',
  description: 'Showcase of selected backend, full stack, and data visualization systems engineered with scalable architectures.'
};

export const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [headerData, setHeaderData] = useState(DEFAULT_PROJECTS_HEADER);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderSaving, setIsHeaderSaving] = useState(false);
  const [isHeaderResetting, setIsHeaderResetting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const loadData = async () => {
    try {
      const [projectsData, headerRes] = await Promise.all([
        adminApi.getProjects(),
        adminApi.getSectionHeader('PROJECTS').catch(() => null)
      ]);
      setProjects(projectsData || []);
      if (headerRes) {
        setHeaderData({
          badgeText: headerRes.badgeText || DEFAULT_PROJECTS_HEADER.badgeText,
          description: headerRes.description || DEFAULT_PROJECTS_HEADER.description
        });
      }
    } catch (err) {
      console.error('Failed to load projects data', err);
      showToast('error', 'Failed to load projects data.');
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
      await adminApi.updateSectionHeader('PROJECTS', headerData);
      showToast('success', 'Projects section header updated successfully!');
    } catch (err) {
      console.error('Error saving projects header', err);
      showToast('error', err.response?.data?.message || 'Failed to save projects header.');
    } finally {
      setIsHeaderSaving(false);
    }
  };

  const handleResetHeader = async () => {
    setIsHeaderResetting(true);
    try {
      const res = await adminApi.resetSectionHeader('PROJECTS');
      if (res) {
        setHeaderData({
          badgeText: res.badgeText || DEFAULT_PROJECTS_HEADER.badgeText,
          description: res.description || DEFAULT_PROJECTS_HEADER.description
        });
      }
      showToast('success', 'Projects section header reset to canonical defaults.');
    } catch (err) {
      console.error('Error resetting projects header', err);
      showToast('error', 'Failed to reset projects header.');
    } finally {
      setIsHeaderResetting(false);
    }
  };

  const handleCreateOrUpdate = async (projectData) => {
    setIsSaving(true);
    try {
      if (selectedProject?.id) {
        await adminApi.updateProject(selectedProject.id, projectData);
        showToast('success', `Project "${projectData.title}" updated successfully.`);
      } else {
        await adminApi.createProject(projectData);
        showToast('success', `Project "${projectData.title}" created successfully.`);
      }
      setModalOpen(false);
      setSelectedProject(null);
      await loadData();
    } catch (err) {
      console.error('Error saving project', err);
      showToast('error', err.response?.data?.message || 'Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteProject(projectToDelete.id);
      showToast('success', `Project "${projectToDelete.title}" deleted.`);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      await loadData();
    } catch (err) {
      console.error('Error deleting project', err);
      showToast('error', 'Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Projects CMS Management</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Projects & Header Settings</h1>
          <p className="text-sm text-slate-400">
            Configure section badge, subtitle copy, repositories, and featured portfolio projects.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProject(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
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
                placeholder="e.g. PROJECTS"
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
                placeholder="Describe selected engineering projects and systems..."
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
              {headerData.badgeText || 'PROJECTS'}
            </div>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              {headerData.description || 'Showcase of selected backend, full stack, and data visualization systems engineered with scalable architectures.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Projects Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Projects List ({projects.length})</span>
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No projects found</h3>
            <p className="text-xs text-slate-400">Click "Add New Project" above to create your first portfolio entry.</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-800/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Title & Details</th>
                    <th className="px-6 py-4">Technologies</th>
                    <th className="px-6 py-4 text-center">Featured</th>
                    <th className="px-6 py-4 text-center">Order</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 max-w-xs sm:max-w-sm">
                        <div className="font-bold text-white text-sm">{project.title}</div>
                        <p className="text-slate-400 line-clamp-2 mt-1 text-xs">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {project.tableauUrl && (
                            <span className="text-[11px] text-cyan-400 font-mono">
                              Tableau URL configured
                            </span>
                          )}
                          {project.features && project.features.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-mono">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{project.features.length} features</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {project.technologies?.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-slate-700/60 text-[11px]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                            <Star className="w-3 h-3 fill-emerald-400" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-slate-300">
                        {project.displayOrder}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProjectToDelete(project);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete Project"
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

      {/* Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleCreateOrUpdate}
        project={selectedProject}
        isLoading={isSaving}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This cannot be undone.`}
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

export default AdminProjectsPage;
