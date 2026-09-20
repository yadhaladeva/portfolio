import React from 'react';
import {
  FileText,
  Mail,
  Github,
  Linkedin,
  Brain,
  Code2,
  Sparkles,
  Zap,
  Layers,
  Cpu,
  Database,
  BarChart3
} from 'lucide-react';

const ICON_MAP = {
  Brain,
  Code2,
  Sparkles,
  Zap,
  Layers,
  Cpu,
  Database,
  BarChart3
};

const ACCENT_STYLES = {
  cyan: {
    icon: 'text-cyan-400',
    hoverText: 'group-hover:text-cyan-300',
    hoverBorder: 'hover:border-cyan-500/40'
  },
  emerald: {
    icon: 'text-emerald-400',
    hoverText: 'group-hover:text-emerald-300',
    hoverBorder: 'hover:border-emerald-500/40'
  },
  amber: {
    icon: 'text-amber-400',
    hoverText: 'group-hover:text-amber-300',
    hoverBorder: 'hover:border-amber-500/40'
  },
  purple: {
    icon: 'text-purple-400',
    hoverText: 'group-hover:text-purple-300',
    hoverBorder: 'hover:border-purple-500/40'
  },
  blue: {
    icon: 'text-blue-400',
    hoverText: 'group-hover:text-blue-300',
    hoverBorder: 'hover:border-blue-500/40'
  }
};

const DEFAULT_HERO = {
  greeting: "Hi, I'm",
  name: "Deva Yadhala",
  role: "Software Developer",
  description: "Specializing in Java, Spring Boot, Python, SQL, and data analytics, with experience building REST APIs, database-driven applications, and data visualization solutions. I apply strong programming and analytical skills to develop scalable, maintainable software.",
  primaryButtonText: "View Resume",
  primaryButtonVisible: true,
  secondaryButtonText: "Contact Me",
  secondaryButtonVisible: true,
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  quote: "Think deeper. Build smarter. Solve better.",
  quoteVisible: true,
  stages: [
    { id: 1, stageNumber: "STAGE 01", title: "Analytical Logic", icon: "Brain", accent: "cyan", visible: true },
    { id: 2, stageNumber: "STAGE 02", title: "Clean Architecture", icon: "Code2", accent: "emerald", visible: true },
    { id: 3, stageNumber: "STAGE 03", title: "Scalable Solutions", icon: "Sparkles", accent: "amber", visible: true }
  ]
};

export const HeroSection = ({ hero, onOpenResume }) => {
  const data = { ...DEFAULT_HERO, ...hero };
  const visibleStages = (data.stages && data.stages.length > 0)
    ? data.stages.filter(s => s.visible !== false)
    : DEFAULT_HERO.stages;

  return (
    <section id="hero" className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-center pt-24 sm:pt-28 pb-6 sm:pb-8 overflow-hidden">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-5 sm:right-10 w-[240px] sm:w-[300px] h-[240px] sm:h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center flex-1 py-4 sm:py-6">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-14">
          {/* Left Column: Hero Content */}
          <div className="flex-1 text-center lg:text-left max-w-xl">
            {/* Greeting */}
            <p className="text-base sm:text-lg lg:text-xl font-medium text-slate-300 font-display mb-1">
              {data.greeting || "Hi, I'm"}
            </p>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-gradient-emerald mb-2">
              {data.name || "Deva Yadhala"}
            </h1>

            {/* Subtitle / Role */}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-mono text-emerald-400 font-semibold mb-4 sm:mb-5">
              {data.role || "Software Developer"}
            </h2>

            {/* Recruiter-Focused Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed mb-6 sm:mb-8">
              {data.description || DEFAULT_HERO.description}
            </p>

            {/* Action Buttons & Centered Social Links Wrapper */}
            <div className="w-full sm:w-fit flex flex-col items-center mx-auto lg:mx-0 gap-4 sm:gap-5">
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
                {data.primaryButtonVisible !== false && (
                  <button
                    type="button"
                    onClick={onOpenResume}
                    className="w-full sm:w-auto px-7 py-3 rounded-full font-bold text-sm border-2 border-slate-600 hover:border-emerald-400 bg-dark-800/80 hover:bg-dark-750 text-white hover:text-emerald-400 transition-all shadow-md shadow-black/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{data.primaryButtonText || "View Resume"}</span>
                  </button>
                )}

                {data.secondaryButtonVisible !== false && (
                  <a
                    href="#contact"
                    className="w-full sm:w-auto px-7 py-3 rounded-full font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{data.secondaryButtonText || "Contact Me"}</span>
                  </a>
                )}
              </div>

              {/* Social Links (Centered under the buttons) */}
              <div className="flex items-center justify-center gap-3 text-slate-400">
                {data.githubUrl && (
                  <a
                    href={data.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="flex items-center gap-1.5 text-sm hover:text-emerald-400 transition-colors group"
                  >
                    <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>GitHub</span>
                  </a>
                )}
                {data.githubUrl && data.linkedinUrl && (
                  <span className="text-slate-600 font-bold">•</span>
                )}
                {data.linkedinUrl && (
                  <a
                    href={data.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="flex items-center gap-1.5 text-sm hover:text-cyan-400 transition-colors group"
                  >
                    <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Refined Profile Photo (Shifted rightward & size refined) */}
          <div className="shrink-0 flex items-center justify-center lg:justify-end lg:translate-x-4">
            <div className="relative group">
              {/* Subtle Ambient Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/25 via-cyan-500/25 to-transparent rounded-full blur-xl opacity-60 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />

              {/* Photo Frame Container */}
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[395px] lg:h-[395px] xl:w-[410px] xl:h-[410px] rounded-full p-1 bg-gradient-to-tr from-emerald-500/30 via-slate-800 to-cyan-500/30 shadow-2xl shadow-black/60 ring-2 ring-emerald-500/20 flex items-center justify-center overflow-hidden">
                <span className="text-4xl sm:text-5xl font-extrabold font-display text-emerald-400 select-none pointer-events-none">
                  DY
                </span>
                <img
                  src="/assets/profile.png"
                  alt={data.name || "Deva Yadhala"}
                  className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full object-cover object-[center_22%] scale-[1.08] origin-[center_22%] shadow-inner bg-dark-900 transition-transform duration-500 group-hover:scale-[1.12]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Center Tagline Quote & Subtle Philosophy Micro-Badges */}
        {data.quoteVisible !== false && data.quote && (
          <div className="pt-10 sm:pt-14 pb-2 flex flex-col items-center justify-center text-center w-full px-4 gap-3">
            <p className="text-lg sm:text-xl font-medium text-slate-300/85 font-display tracking-[0.3px]">
              &ldquo;{data.quote}&rdquo;
            </p>

            {/* Minimalist Value Proposition Micro-Pills */}
            {visibleStages.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-0.5">
                {visibleStages.map((stage, idx) => {
                  const IconComponent = ICON_MAP[stage.icon] || Brain;
                  const accent = ACCENT_STYLES[stage.accent] || ACCENT_STYLES.cyan;

                  return (
                    <React.Fragment key={stage.id || idx}>
                      {idx > 0 && <span className="text-slate-700 select-none">•</span>}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-800/70 border border-slate-700/60 text-slate-400 ${accent.hoverText} ${accent.hoverBorder} hover:bg-dark-750 transition-all text-xs font-mono group cursor-default`}>
                        <IconComponent className={`w-3.5 h-3.5 ${accent.icon} group-hover:scale-110 transition-transform`} />
                        <span>{stage.title}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
