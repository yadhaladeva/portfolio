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
  LayoutGrid,
  Table as TableIcon,
  Tag,
  ArrowUpDown,
  Check,
  Zap,
  Code2,
  Database,
  Wrench,
  Cpu,
  Layout
} from 'lucide-react';

const DEFAULT_SKILLS_HEADER = {
  badgeText: 'SKILLS',
  description: 'Categorized technical capabilities, frameworks, and engineering tools verified through projects and professional experience.'
};

const STANDARD_CATEGORIES = [
  'Frontend',
  'Backend & Frameworks',
  'Programming',
  'Databases',
  'Tools & Platforms',
  'Engineering Skills',
  'Soft skills'
];

export const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [headerData, setHeaderData] = useState(DEFAULT_SKILLS_HEADER);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderSaving, setIsHeaderSaving] = useState(false);
  const [isHeaderResetting, setIsHeaderResetting] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Quick Add Bar state
  const [quickCategory, setQuickCategory] = useState('Frontend');
  const [isQuickCustomCategory, setIsQuickCustomCategory] = useState(false);
  const [quickCustomCategoryName, setQuickCustomCategoryName] = useState('');
  const [quickSkillInput, setQuickSkillInput] = useState('');
  const [quickOrder, setQuickOrder] = useState(1);
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  // Card-specific inline quick adds: { [categoryName]: string }
  const [inlineInputs, setInlineInputs] = useState({});

  // Modal State for edit
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
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

  // Quick Multi / Single Add
  const handleQuickAdd = async (e) => {
    e?.preventDefault();
    const finalCategory = isQuickCustomCategory ? quickCustomCategoryName.trim() : quickCategory.trim();
    if (!finalCategory) {
      showToast('error', 'Please enter or select a skill category.');
      return;
    }
    if (!quickSkillInput.trim()) {
      showToast('error', 'Please enter at least one skill name.');
      return;
    }

    // Split by comma for bulk add
    const skillNames = quickSkillInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillNames.length === 0) return;

    setIsQuickAdding(true);
    try {
      for (let i = 0; i < skillNames.length; i++) {
        await adminApi.createSkill({
          name: skillNames[i],
          category: finalCategory,
          proficiency: 85,
          displayOrder: parseInt(quickOrder, 10) + i,
        });
      }
      showToast('success', `Added ${skillNames.length} skill(s) to "${finalCategory}"!`);
      setQuickSkillInput('');
      await loadData();
    } catch (err) {
      console.error('Error creating skills', err);
      showToast('error', err.response?.data?.message || 'Failed to add skills.');
    } finally {
      setIsQuickAdding(false);
    }
  };

  // Inline Quick Add directly in a category card
  const handleInlineCardAdd = async (category, minOrder = 1) => {
    const inputVal = inlineInputs[category] || '';
    if (!inputVal.trim()) return;

    const skillNames = inputVal
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillNames.length === 0) return;

    try {
      for (let i = 0; i < skillNames.length; i++) {
        await adminApi.createSkill({
          name: skillNames[i],
          category: category,
          proficiency: 85,
          displayOrder: minOrder + i,
        });
      }
      showToast('success', `Added ${skillNames.length} skill(s) to "${category}"!`);
      setInlineInputs((prev) => ({ ...prev, [category]: '' }));
      await loadData();
    } catch (err) {
      console.error('Error in inline add', err);
      showToast('error', err.response?.data?.message || 'Failed to add skill.');
    }
  };

  // Quick Category Reorder: updates the displayOrder of all skills in this category
  const handleUpdateCategoryOrder = async (category, newOrder) => {
    const parsedOrder = parseInt(newOrder, 10);
    if (isNaN(parsedOrder)) return;

    const categorySkills = skills.filter((s) => s.category === category);
    try {
      for (let i = 0; i < categorySkills.length; i++) {
        await adminApi.updateSkill(categorySkills[i].id, {
          name: categorySkills[i].name,
          category: category,
          proficiency: 85,
          displayOrder: parsedOrder + i,
        });
      }
      showToast('success', `Set "${category}" display sequence to #${parsedOrder}.`);
      await loadData();
    } catch (err) {
      console.error('Error reordering category', err);
      showToast('error', 'Failed to update category order.');
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

  // Group skills by category for Category Cards view
  const categoryGroups = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(skill);
    return acc;
  }, {});

  // Sort categories by their minimum skill displayOrder
  const sortedCategories = Object.keys(categoryGroups).sort((a, b) => {
    const minA = Math.min(...categoryGroups[a].map((s) => s.displayOrder ?? 999));
    const minB = Math.min(...categoryGroups[b].map((s) => s.displayOrder ?? 999));
    return minA - minB;
  });

  const getCategoryIcon = (category) => {
    const map = {
      'Frontend': <Layout className="w-4 h-4 text-indigo-400" />,
      'Backend & Frameworks': <Layers className="w-4 h-4 text-cyan-400" />,
      'Programming': <Terminal className="w-4 h-4 text-emerald-400" />,
      'Databases': <Database className="w-4 h-4 text-amber-400" />,
      'Tools & Platforms': <Wrench className="w-4 h-4 text-rose-400" />,
      'Engineering Skills': <Cpu className="w-4 h-4 text-emerald-400" />,
      'Soft skills': <Cpu className="w-4 h-4 text-purple-400" />,
    };
    return map[category] || <Tag className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4" />
            <span>Skills CMS Management</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Skills & Categories</h1>
          <p className="text-sm text-slate-400">
            Easily add, organize, and reorder your skill sets and technical tags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-dark-850 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'cards'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Category Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedSkill(null);
              setModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Modal Add</span>
          </button>
        </div>
      </div>

      {/* 🚀 QUICK FAST ADD BAR (Bulk & Single) */}
      <div className="bg-dark-850 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-3">
          <Zap className="w-4 h-4" />
          <span>Quick Fast Add (Type one or comma-separated skills)</span>
        </div>

        <form onSubmit={handleQuickAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Category
            </label>
            <select
              value={isQuickCustomCategory ? '__CUSTOM__' : quickCategory}
              onChange={(e) => {
                if (e.target.value === '__CUSTOM__') {
                  setIsQuickCustomCategory(true);
                } else {
                  setIsQuickCustomCategory(false);
                  setQuickCategory(e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-xs bg-dark-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            >
              {STANDARD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__CUSTOM__">+ Custom Category...</option>
            </select>
            {isQuickCustomCategory && (
              <input
                type="text"
                required
                value={quickCustomCategoryName}
                onChange={(e) => setQuickCustomCategoryName(e.target.value)}
                placeholder="Category name (e.g. Cloud)"
                className="w-full mt-1.5 px-3 py-1.5 text-xs bg-dark-800 border border-emerald-500/50 rounded-lg text-white focus:outline-none"
              />
            )}
          </div>

          {/* Skill Names Input (Supports comma separation) */}
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Skill Names (e.g. <span className="text-slate-300">React, TypeScript, Next.js, Redux</span>)
            </label>
            <input
              type="text"
              required
              value={quickSkillInput}
              onChange={(e) => setQuickSkillInput(e.target.value)}
              placeholder="e.g. React, Next.js, Tailwind CSS (or single skill)"
              className="w-full px-3.5 py-2 text-xs bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Display Order */}
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-medium text-slate-400 mb-1" title="Order number">
              Order #
            </label>
            <input
              type="number"
              value={quickOrder}
              onChange={(e) => setQuickOrder(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-dark-800 border border-slate-700 rounded-xl text-white text-center focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Add Button */}
          <div className="sm:col-span-2 pt-5">
            <button
              type="submit"
              disabled={isQuickAdding}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isQuickAdding ? 'Adding...' : 'Add Skills'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 1. CATEGORY CARDS VIEW (Interactive, Grouped, Clean) */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Skill Sets by Category ({sortedCategories.length} categories · {skills.length} skills)</span>
            </h2>
            <p className="text-xs text-slate-400">
              💡 Categories with lower Order # display 1st, 2nd, 3rd on the portfolio.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sortedCategories.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
              <Terminal className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-white">No skills added yet</h3>
              <p className="text-xs text-slate-400">Use the Quick Add bar above to add your first skills!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCategories.map((category, index) => {
                const categorySkills = categoryGroups[category];
                const minOrder = Math.min(...categorySkills.map((s) => s.displayOrder ?? 999));

                return (
                  <div
                    key={category}
                    className="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                  >
                    <div>
                      {/* Card Top: Category Title & Reorder Input */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-dark-800 border border-slate-700">
                            {getCategoryIcon(category)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white font-display">
                              {category}
                            </h3>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Order Number pill */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-medium">Order:</span>
                          <input
                            type="number"
                            defaultValue={minOrder === 999 ? index + 1 : minOrder}
                            onBlur={(e) => handleUpdateCategoryOrder(category, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateCategoryOrder(category, e.target.value);
                              }
                            }}
                            title="Category display order rank (Press Enter to save)"
                            className="w-12 px-1.5 py-0.5 text-xs bg-dark-900 border border-slate-700 rounded text-center text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Skills Tags List */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {categorySkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800/90 text-slate-200 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800 transition-all text-xs font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{skill.name}</span>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-slate-700/60">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSkill(skill);
                                  setModalOpen(true);
                                }}
                                className="p-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSkillToDelete(skill);
                                  setDeleteConfirmOpen(true);
                                }}
                                className="p-0.5 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Inline Quick Add inside Card */}
                    <div className="pt-3 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={inlineInputs[category] || ''}
                          onChange={(e) =>
                            setInlineInputs((prev) => ({
                              ...prev,
                              [category]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleInlineCardAdd(category, minOrder);
                            }
                          }}
                          placeholder={`+ Add skill to ${category}...`}
                          className="w-full px-3 py-1.5 text-xs bg-dark-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleInlineCardAdd(category, minOrder)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded-lg transition-all shrink-0 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. TABLE VIEW (Clean without proficiency) */}
      {viewMode === 'table' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>All Skills ({skills.length})</span>
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-dark-800/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Skill Name</th>
                      <th className="px-6 py-4">Category</th>
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
      )}

      {/* 3. Section Header Editor & Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-800">
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
                placeholder="Describe skill categories..."
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
              {headerData.description || 'Categorized technical capabilities, frameworks, and engineering tools.'}
            </p>
          </div>
        </div>
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
