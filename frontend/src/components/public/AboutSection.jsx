import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Server,
  Database,
  Code2,
  Brain,
  Layers,
  Cpu,
  BarChart3,
  Cloud,
  Sparkles
} from 'lucide-react';

const ICON_MAP = {
  Server,
  Database,
  Code2,
  Brain,
  Layers,
  Cpu,
  BarChart3,
  Cloud,
  GraduationCap,
  Briefcase,
  Sparkles
};

const ACCENT_COLORS = {
  emerald: 'text-emerald-400',
  cyan: 'text-cyan-400',
  indigo: 'text-indigo-400',
  purple: 'text-purple-400',
  amber: 'text-amber-400',
  blue: 'text-blue-400'
};

const DEFAULT_ABOUT = {
  badge: "ABOUT ME",
  title: "Career-Focused Summary",
  careerSummary: "I am a dedicated Software Developer with a robust foundation in computer science and modern software design principles. My technical focus revolves around enterprise Java development, Spring Boot microservices, relational database modeling in PostgreSQL, and building performant end-to-end full-stack systems.",
  experienceSummary: "With experience spanning across HCLTech as a Graduate Engineer Trainee, BISAG-N as a Young Professional, and an internship at Infosys Limited, I have contributed to production-grade software lifecycles, backend APIs, data pipelines, and analytics tooling.",
  capabilities: [
    { id: 1, title: "Backend Systems", description: "Java, Spring Boot, REST APIs, Security", icon: "Server", accent: "emerald", visible: true },
    { id: 2, title: "Data Architecture", description: "PostgreSQL, SQL, Hibernate JPA", icon: "Database", accent: "cyan", visible: true },
    { id: 3, title: "Full-Stack Tech", description: "React, HTML, CSS, JavaScript", icon: "Code2", accent: "purple", visible: true }
  ],
  education: [
    {
      id: 1,
      degree: "B.Tech in Computer Science and Business Systems",
      institution: "Sagi Rama Krishnam Raju Engineering College",
      startYear: "2021",
      endYear: "2025",
      cgpa: "8.64",
      highlight: "Academic Distinction",
      visible: true
    }
  ],
  currentRole: {
    roleTitle: "Graduate Engineer Trainee",
    company: "HCLTech",
    location: "Chennai, India",
    startDate: "Jan 2026",
    endDate: "Present",
    current: true
  }
};

export const AboutSection = ({ about }) => {
  const data = about || DEFAULT_ABOUT;

  const visibleCapabilities = (data.capabilities && data.capabilities.length > 0
    ? data.capabilities
    : DEFAULT_ABOUT.capabilities
  ).filter(c => c.visible !== false);

  const visibleEducation = (data.education && data.education.length > 0
    ? data.education
    : DEFAULT_ABOUT.education
  ).filter(e => e.visible !== false);

  const currentRole = data.currentRole || DEFAULT_ABOUT.currentRole;

  return (
    <section id="about" className="pt-24 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            {data.badge || "ABOUT ME"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Card */}
          <div className="lg:col-span-7 glass-card p-8 rounded-2xl space-y-6">
            <h3 className="text-xl font-bold text-white font-display flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              {data.title || "Career-Focused Summary"}
            </h3>

            {data.careerSummary && (
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {data.careerSummary}
              </p>
            )}

            {data.experienceSummary && (
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {data.experienceSummary}
              </p>
            )}

            {/* Capability Cards */}
            {visibleCapabilities.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                {visibleCapabilities.map((cap, idx) => {
                  const IconComp = ICON_MAP[cap.icon] || Server;
                  const iconColor = ACCENT_COLORS[cap.accent] || ACCENT_COLORS.emerald;

                  return (
                    <div key={cap.id || idx} className="p-4 rounded-xl bg-dark-800/60 border border-slate-800">
                      <IconComp className={`w-5 h-5 ${iconColor} mb-2`} />
                      <h4 className="text-sm font-semibold text-white">{cap.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{cap.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Education & Highlights Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dynamic Education Cards (Supports Multiple Entries like B.Tech, M.Tech, etc.) */}
            {visibleEducation.map((edu, idx) => {
              const yearText = edu.startYear
                ? (edu.endYear ? `${edu.startYear} – ${edu.endYear}` : `${edu.startYear} – Present`)
                : (edu.endYear || '');

              return (
                <div
                  key={edu.id || idx}
                  className="glass-card p-6 sm:p-8 rounded-2xl border-l-4 border-l-emerald-500 space-y-4"
                >
                  <div className="flex items-center gap-3 text-emerald-400">
                    <GraduationCap className="w-6 h-6" />
                    <span className="text-xs uppercase font-bold tracking-wider">Education</span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white font-display">
                      {edu.degree}
                    </h4>
                    {edu.institution && (
                      <p className="text-sm text-slate-300 font-medium mt-0.5">{edu.institution}</p>
                    )}
                    {yearText && (
                      <p className="text-sm text-slate-400 mt-1">{yearText}</p>
                    )}
                  </div>

                  {(edu.cgpa || edu.highlight) && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {edu.cgpa && (
                        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm">
                          CGPA: {edu.cgpa}
                        </div>
                      )}
                      {edu.highlight && (
                        <span className="text-xs text-slate-400">{edu.highlight}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Current Position Badge Card */}
            {currentRole && currentRole.roleTitle && (
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-3 text-cyan-400">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-wider">Current Role</span>
                </div>
                <h4 className="text-base font-bold text-white">{currentRole.roleTitle}</h4>
                <p className="text-sm text-slate-300">
                  {currentRole.company}
                  {currentRole.location ? ` • ${currentRole.location}` : ''}
                </p>
                {(currentRole.startDate || currentRole.endDate) && (
                  <p className="text-xs text-slate-400">
                    {currentRole.startDate || ''}
                    {currentRole.startDate && currentRole.endDate ? ' – ' : ''}
                    {currentRole.endDate || (currentRole.current ? 'Present' : '')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
