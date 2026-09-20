import React from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderGit2,
  Terminal,
  Briefcase,
  Award,
  Mail,
  MessageSquare,
  FileText,
  LogOut,
  ExternalLink,
  Shield,
  UserCheck,
  Sparkles,
  Compass,
  User
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Hero', path: '/admin/hero', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Header / Nav', path: '/admin/header', icon: <Compass className="w-4 h-4" /> },
    { name: 'About', path: '/admin/about', icon: <User className="w-4 h-4" /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { name: 'Skills', path: '/admin/skills', icon: <Terminal className="w-4 h-4" /> },
    { name: 'Experience', path: '/admin/experience', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Certifications', path: '/admin/certifications', icon: <Award className="w-4 h-4" /> },
    { name: 'Resume', path: '/admin/resume', icon: <FileText className="w-4 h-4" /> },
    { name: 'Contact', path: '/admin/contact', icon: <Mail className="w-4 h-4" /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-dark-850 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold font-display text-white">Portfolio Admin Portal</h1>
                <p className="text-[11px] text-slate-400 font-mono">Deva Yadhala CMS</p>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-dark-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors"
              >
                <span>Live Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </Link>

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 border border-slate-800 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-slate-300">{user?.username || 'Admin'}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
                title="Logout from Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Bar / Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
