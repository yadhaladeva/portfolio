import React, { useState } from 'react';
import { ExternalLink, Github, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { ProjectDetailModal } from './ProjectDetailModal';

export const ProjectsSection = ({ projects = [], header }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  const badgeText = header?.badgeText || 'PROJECTS';
  const description = header?.description || 'Practical software projects showcasing Java & Spring Boot backend services, relational database schemas, document processing, and data analytics.';

  return (
    <section id="projects" className="pt-24 pb-20 relative bg-dark-850/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            {badgeText}
          </div>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between glass-card-hover border border-slate-800 group"
            >
              <div>
                {/* Header Tags */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-dark-800 border border-slate-700/80 text-emerald-400 group-hover:scale-110 transition-transform">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  {project.featured && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Featured
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3
                  onClick={() => setSelectedProject(project)}
                  className="text-lg font-bold text-white font-display hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-between gap-2 mb-3"
                >
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 shrink-0" />
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-4 leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              {/* Bottom Technology Badges & Action */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies?.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-dark-800 text-slate-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies && project.technologies.length > 4 && (
                    <span className="px-2 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/5 rounded-md border border-emerald-500/20">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    View Details →
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
