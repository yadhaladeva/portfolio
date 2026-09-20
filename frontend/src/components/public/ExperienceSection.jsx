import React from 'react';
import { Briefcase, Calendar, MapPin, Building2, CheckCircle } from 'lucide-react';

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
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 space-y-12">
          {experience.map((item, index) => (
            <div key={item.id || index} className="relative pl-8 sm:pl-10 group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-dark-900 border-2 border-emerald-400 flex items-center justify-center group-hover:scale-125 group-hover:border-cyan-400 transition-all shadow-md shadow-emerald-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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

                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
