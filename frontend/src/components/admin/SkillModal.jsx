import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const SkillModal = ({ isOpen, onClose, onSave, skill = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    proficiency: 85,
    displayOrder: 0,
  });

  const standardCategories = [
    'Frontend',
    'Backend & Frameworks',
    'Programming',
    'Databases',
    'Tools & Platforms',
    'Engineering Skills',
    'Framework',
    'Web',
    'Database',
    'Tools',
    'Soft skills',
  ];

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  useEffect(() => {
    if (skill) {
      const cat = skill.category || 'Frontend';
      const isKnown = standardCategories.includes(cat);
      setFormData({
        name: skill.name || '',
        category: cat,
        proficiency: skill.proficiency || 85,
        displayOrder: skill.displayOrder || 0,
      });
      setIsCustomCategory(!isKnown);
      setCustomCategoryName(!isKnown ? cat : '');
    } else {
      setFormData({
        name: '',
        category: 'Frontend',
        proficiency: 85,
        displayOrder: 0,
      });
      setIsCustomCategory(false);
      setCustomCategoryName('');
    }
  }, [skill, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categorySelect') {
      if (value === '__CUSTOM__') {
        setIsCustomCategory(true);
        setFormData((prev) => ({ ...prev, category: customCategoryName || '' }));
      } else {
        setIsCustomCategory(false);
        setFormData((prev) => ({ ...prev, category: value }));
      }
    } else if (name === 'customCategory') {
      setCustomCategoryName(value);
      setFormData((prev) => ({ ...prev, category: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = isCustomCategory ? customCategoryName.trim() : formData.category;
    if (!finalCategory) {
      return;
    }
    onSave({
      ...formData,
      category: finalCategory,
      proficiency: parseInt(formData.proficiency, 10) || 85,
      displayOrder: parseInt(formData.displayOrder, 10) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={skill ? 'Edit Skill' : 'Add New Skill'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Skill Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. React, JavaScript, HTML, CSS, Tailwind CSS"
            className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Category <span className="text-rose-400">*</span>
          </label>
          <select
            name="categorySelect"
            value={isCustomCategory ? '__CUSTOM__' : formData.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          >
            {standardCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__CUSTOM__">+ Custom Category...</option>
          </select>

          {isCustomCategory && (
            <input
              type="text"
              name="customCategory"
              required
              value={customCategoryName}
              onChange={handleChange}
              placeholder="Enter custom category name (e.g. Cloud, Mobile)"
              className="w-full mt-2 px-3.5 py-2 text-sm bg-dark-800 border border-emerald-500/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-300">
              Proficiency Level
            </label>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {formData.proficiency}%
            </span>
          </div>
          <input
            type="range"
            name="proficiency"
            min="10"
            max="100"
            value={formData.proficiency}
            onChange={handleChange}
            className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Display Order
          </label>
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
            {isLoading ? 'Saving...' : skill ? 'Update Skill' : 'Create Skill'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
