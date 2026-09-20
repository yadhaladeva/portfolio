import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import {
  FolderGit2,
  Terminal,
  Briefcase,
  Award,
  Mail,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects ?? 0,
      icon: <FolderGit2 className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/20 bg-emerald-500/5',
      link: '/admin/projects',
    },
    {
      title: 'Total Skills',
      value: stats?.totalSkills ?? 0,
      icon: <Terminal className="w-6 h-6 text-cyan-400" />,
      color: 'border-cyan-500/20 bg-cyan-500/5',
      link: '/admin/skills',
    },
    {
      title: 'Experience Entries',
      value: stats?.totalExperience ?? 0,
      icon: <Briefcase className="w-6 h-6 text-indigo-400" />,
      color: 'border-indigo-500/20 bg-indigo-500/5',
      link: '/admin/experience',
    },
    {
      title: 'Certifications',
      value: stats?.totalCertifications ?? 0,
      icon: <Award className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/20 bg-amber-500/5',
      link: '/admin/certifications',
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadMessages ?? 0,
      icon: <Mail className="w-6 h-6 text-rose-400" />,
      color: 'border-rose-500/20 bg-rose-500/5',
      link: '/admin/messages',
      badge: stats?.unreadMessages > 0 ? `${stats.unreadMessages} New` : null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portfolio Content Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Welcome, Deva Yadhala
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update your portfolio live without redeploying frontend source code. All modifications save directly to PostgreSQL.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`glass-card p-5 rounded-2xl border ${card.color} glass-card-hover flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-dark-800/80 border border-slate-700/60">
                {card.icon}
              </div>
              {card.badge && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                  {card.badge}
                </span>
              )}
            </div>

            <div>
              <p className="text-2xl font-bold font-display text-white group-hover:text-emerald-400 transition-colors">
                {card.value}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{card.title}</p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-300">
              <span>Manage records</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Skills By Category Breakdown */}
      {stats?.skillsByCategory && (
        <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Skills Breakdown by Category</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.skillsByCategory).map(([category, count]) => (
              <div key={category} className="p-3.5 rounded-xl bg-dark-800/60 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-medium block truncate">{category}</span>
                <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
