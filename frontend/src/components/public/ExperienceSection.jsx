import React from 'react';
import { Briefcase, Calendar, MapPin, Building2, CheckCircle } from 'lucide-react';

const parseBulletPoints = (text) => {
  if (!text) return [];

  // Check if text contains bullet characters (•, \u2022)
  if (text.includes('•')) {
    return text
      .split('•')
      .map(point => point.trim())
      .filter(point => point.length > 0);
  }

  // If text contains newlines
  if (text.includes('\n')) {
    return text
      .split('\n')
      .map(line => line.replace(/^[\s\-*•]+/, '').trim())
      .filter(line => line.length > 0);
  }

  // Fallback: single item
  return [text.trim()];
};

export const ExperienceSection = ({ experience = [], header }) => {
  const badgeText = header?.badgeText || 'EXPERIENCE';
  const description = header?.description || 'Practical software engineering and technical roles across enterprise and engineering organizations.';

  return (
    <section id="experience" className="pt-24 pb-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            {badgeText}
          </div>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-7 sm:pl-10 space-y-8 sm:space-y-10">
          {/* Subtle Continuous 2px Timeline Line centered behind markers */}
          <div
            className="absolute left-[7px] sm:left-[15px] top-[38px] bottom-[38px] w-[2px] bg-slate-800/90 pointer-events-none"
            aria-hidden="true"
          />

          {experience.map((item, index) => {
            const isCurrent = Boolean(
              (item.endDate && (item.endDate.toLowerCase().includes('present') || item.endDate.toLowerCase().includes('current'))) ||
              item.current ||
              index === 0
            );

            return (
              <div key={item.id || index} className="relative group">
                {/* Timeline Marker Dot (Centered with Card Header Title) */}
                <div
                  className={`absolute left-[-28px] sm:left-[-32px] top-[30px] sm:top-[34px] w-4 h-4 rounded-full bg-dark-950 flex items-center justify-center transition-all duration-300 z-10 ${
                    isCurrent
                      ? 'border-2 border-emerald-400 ring-4 ring-emerald-500/15 shadow-sm shadow-emerald-500/20'
                      : 'border-2 border-slate-700 group-hover:border-emerald-400/80'
                  }`}
                  aria-hidden="true"
                >
                  <span
                    className={`rounded-full transition-colors ${
                      isCurrent
                        ? 'w-1.5 h-1.5 bg-emerald-400'
                        : 'w-1.5 h-1.5 bg-slate-500 group-hover:bg-emerald-400'
                    }`}
                  />
                </div>

                {/* Experience Card */}
                <div className="glass-card p-6 sm:p-7 rounded-2xl glass-card-hover border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
                        <span>{item.role}</span>
                      </h3>
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mt-1">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span>{item.organization}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-800 border border-slate-700/60">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{item.startDate} – {item.endDate || 'Present'}</span>
                      </div>
                      {item.location && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-800 border border-slate-700/60">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bullet Points List */}
                  <ul className="space-y-2.5 text-sm text-slate-300 leading-relaxed">
                    {parseBulletPoints(item.description).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none mt-0.5 leading-none">•</span>
                        <span className="flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
