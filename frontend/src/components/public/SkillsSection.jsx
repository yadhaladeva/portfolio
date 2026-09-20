import React, { useState } from 'react';
import { Terminal, Layout, Layers, Database, Wrench, Cpu, Sparkles } from 'lucide-react';

const DEFAULT_SKILL_GROUPS = [
  {
    category: 'Programming',
    skills: [
      { name: 'Java' },
      { name: 'Python' }
    ]
  },
  {
    category: 'Backend & Frameworks',
    skills: [
      { name: 'Spring' },
      { name: 'Spring Boot' },
      { name: 'Hibernate' },
      { name: 'JPA' },
      { name: 'REST APIs' }
    ]
  },
  {
    category: 'Frontend',
    skills: [
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'JavaScript' },
      { name: 'React' }
    ]
  },
  {
    category: 'Databases',
    skills: [
      { name: 'SQL' },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'SQLite' }
    ]
  },
  {
    category: 'Tools & Platforms',
    skills: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Postman' },
      { name: 'Docker' },
      { name: 'VS Code' },
      { name: 'Eclipse' },
      { name: 'IntelliJ IDEA' }
    ]
  },
  {
    category: 'Engineering Skills',
    skills: [
      { name: 'Object-Oriented Programming' },
      { name: 'REST API Development' },
      { name: 'Database Design' },
      { name: 'Debugging' },
      { name: 'Problem Solving' }
    ]
  }
];

export const SkillsSection = ({ groupedSkills = [], allSkills = [], header }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const badgeText = header?.badgeText || 'SKILLS';
  const description = header?.description || 'Categorized technical capabilities, frameworks, and engineering tools verified through projects and professional experience.';

  const categoryIcons = {
    'Programming': <Terminal className="w-4 h-4 text-emerald-400" />,
    'Backend & Frameworks': <Layers className="w-4 h-4 text-cyan-400" />,
    'Framework': <Layers className="w-4 h-4 text-cyan-400" />,
    'Frontend': <Layout className="w-4 h-4 text-indigo-400" />,
    'Web': <Layout className="w-4 h-4 text-indigo-400" />,
    'Databases': <Database className="w-4 h-4 text-amber-400" />,
    'Database': <Database className="w-4 h-4 text-amber-400" />,
    'Tools & Platforms': <Wrench className="w-4 h-4 text-rose-400" />,
    'Tools': <Wrench className="w-4 h-4 text-rose-400" />,
    'Engineering Skills': <Cpu className="w-4 h-4 text-emerald-400" />,
    'Soft skills': <Cpu className="w-4 h-4 text-purple-400" />,
  };

  const skillsData = groupedSkills && groupedSkills.length > 0 ? groupedSkills : DEFAULT_SKILL_GROUPS;

  const categories = ['ALL', ...skillsData.map((g) => g.category)];

  const displayedGroups = activeCategory === 'ALL'
    ? skillsData
    : skillsData.filter((g) => g.category === activeCategory);

  return (
    <section id="skills" className="pt-24 pb-20 relative bg-dark-850/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            {badgeText}
          </div>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                  : 'bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-750 border border-slate-700/60'
              }`}
            >
              {categoryIcons[cat] || <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Skills Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGroups.map((group) => (
            <div
              key={group.category}
              className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-dark-800 border border-slate-700">
                      {categoryIcons[group.category] || <Sparkles className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <h3 className="text-base font-bold text-white font-display">{group.category}</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{group.skills.length} skills</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <span
                        key={skill.id || skillName}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800/90 text-slate-200 border border-slate-700/60 hover:border-emerald-500/40 hover:bg-slate-800 transition-colors text-xs font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{skillName}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
