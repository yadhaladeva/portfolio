import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const ExperienceModal = ({ isOpen, onClose, onSave, experience = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    organization: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    displayOrder: 0,
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        organization: experience.organization || '',
        role: experience.role || '',
        location: experience.location || '',
        startDate: experience.startDate || '',
        endDate: experience.endDate || '',
        description: experience.description || '',
        displayOrder: experience.displayOrder || 0,
      });
    } else {
      setFormData({
        organization: '',
        role: '',
        location: '',
        startDate: '',
        endDate: 'Present',
        description: '',
        displayOrder: 0,
      });
    }
  }, [experience, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      title={experience ? 'Edit Experience' : 'Add New Experience'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Organization / Company <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="organization"
              required
              value={formData.organization}
              onChange={handleChange}
              placeholder="e.g. HCLTech"
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Role / Designation <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Graduate Engineer Trainee"
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Chennai, India"
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Start Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              placeholder="e.g. Jan 2026"
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
            <input
              type="text"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="e.g. Present or Dec 2025"
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Description / Responsibilities <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Key responsibilities and contributions in this role..."
            className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

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
            {isLoading ? 'Saving...' : experience ? 'Update Experience' : 'Create Experience'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
