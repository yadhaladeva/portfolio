import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Plus, X, Tag } from 'lucide-react';

export const ProjectModal = ({ isOpen, onClose, onSave, project = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    githubUrl: '',
    demoUrl: '',
    tableauUrl: '',
    featured: false,
    displayOrder: 0,
  });

  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        technologies: project.technologies ? [...project.technologies] : [],
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        tableauUrl: project.tableauUrl || '',
        featured: !!project.featured,
        displayOrder: project.displayOrder || 0,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        technologies: [],
        githubUrl: '',
        demoUrl: '',
        tableauUrl: '',
        featured: false,
        displayOrder: 0,
      });
    }
    setTechInput('');
  }, [project, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTech = (e) => {
    e?.preventDefault();
    if (!techInput.trim()) return;
    const cleanTag = techInput.trim();
    if (!formData.technologies.includes(cleanTag)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, cleanTag],
      }));
    }
    setTechInput('');
  };

  const handleRemoveTech = (techToRemove) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== techToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      displayOrder: parseInt(formData.displayOrder, 10) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Add New Project'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Project Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. User Data Management System"
            className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the project, architecture, and features..."
            className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Technologies Tag Manager */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Technologies (Normalized Relational Tags)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
              placeholder="e.g. Spring Boot, PostgreSQL, Java (Press Enter or Add)"
              className="flex-1 px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tag</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-dark-900 rounded-xl border border-slate-800">
            {formData.technologies.length === 0 ? (
              <span className="text-xs text-slate-500 italic p-1">No technology tags added yet.</span>
            ) : (
              formData.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                >
                  <Tag className="w-3 h-3 text-emerald-400" />
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Demo URL</label>
            <input
              type="url"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Tableau Dashboard URL <span className="text-slate-500 font-normal">(Optional — for Accounts Receivable project)</span>
          </label>
          <input
            type="url"
            name="tableauUrl"
            value={formData.tableauUrl}
            onChange={handleChange}
            placeholder="https://public.tableau.com/..."
            className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
            <input
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-emerald-500 bg-dark-800 border-slate-700 focus:ring-emerald-500"
            />
            <label htmlFor="featured" className="text-xs font-semibold text-slate-200 cursor-pointer">
              Mark as Featured Project
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-md shadow-emerald-400/20 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
