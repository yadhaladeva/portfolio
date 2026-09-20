import React from 'react';
import { Modal } from '../common/Modal';
import { ExternalLink, Github, Layers, BarChart3, CheckCircle2, FileText } from 'lucide-react';

export const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  const getProjectFeatures = (proj) => {
    const title = (proj.title || '').toLowerCase();
    if (title.includes('user data management')) {
      return [
        'RESTful API architecture built with Java and Spring Boot',
        'Relational data persistence and schema management in PostgreSQL',
        'Dynamic user views rendered via server-side JSP',
        'Automated Excel spreadsheet generation using Apache POI',
        'Dynamic PDF document and report export utilizing OpenPDF'
      ];
    }
    if (title.includes('retail sales') || title.includes('data warehouse')) {
      return [
        'Automated data extraction, cleaning, and preprocessing with Pandas',
        'Structured relational data warehouse storage in SQLite',
        'Analytical SQL queries for aggregation, sales metrics, and performance tracking',
        'Visual sales distribution charts and trend reporting with Matplotlib'
      ];
    }
    if (title.includes('accounts receivable') || title.includes('receivable analytics')) {
      return [
        'Real-time financial KPI tracking and accounts receivable monitoring',
        'Invoice aging analysis and overdue payment tracking',
        'Payment collection trend forecasting and cash flow analysis',
        'Customer credit risk profiling and exposure segmentation',
        'Interactive visual dashboard and drill-down reporting via Tableau'
      ];
    }
    return null;
  };

  const features = getProjectFeatures(project);
  const hasLinks = Boolean(project.githubUrl || project.demoUrl || project.tableauUrl);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.title} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Overview Section */}
        <div>
          <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-400 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Overview</span>
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technologies & Tools */}
        {project.technologies && project.technologies.length > 0 && (
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Technologies & Tools</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-dark-800 text-slate-200 border border-slate-700/80 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Features & Architecture */}
        {features && features.length > 0 && (
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Features & Architecture</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tableau Highlight (if tableauUrl present) */}
        {project.tableauUrl && (
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
              <BarChart3 className="w-4 h-4" />
              <span>Interactive Tableau Dashboard</span>
            </div>
            <p className="text-xs text-slate-300">
              Explore the analytics dashboard for receivables, aging trends, and risk profiling.
            </p>
          </div>
        )}

        {/* Repository & Links */}
        {hasLinks && (
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
              Repository & Links
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>View GitHub Repository →</span>
                </a>
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-2 shadow-md shadow-emerald-400/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo →</span>
                </a>
              )}

              {project.tableauUrl && (
                <a
                  href={project.tableauUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 transition-colors flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Tableau View →</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
