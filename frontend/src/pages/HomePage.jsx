import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/common/Navbar';
import { HeroSection } from '../components/public/HeroSection';
import { AboutSection } from '../components/public/AboutSection';
import { SkillsSection } from '../components/public/SkillsSection';
import { ExperienceSection } from '../components/public/ExperienceSection';
import { ProjectsSection } from '../components/public/ProjectsSection';
import { CertificationsSection } from '../components/public/CertificationsSection';
import { ContactSection } from '../components/public/ContactSection';
import { ResumeModal } from '../components/public/ResumeModal';
import { Toast } from '../components/common/Toast';
import { publicApi } from '../api/publicApi';

export const HomePage = () => {
  const [headerConfig, setHeaderConfig] = useState(null);
  const [hero, setHero] = useState(null);
  const [about, setAbout] = useState(null);
  const [skillsHeader, setSkillsHeader] = useState(null);
  const [groupedSkills, setGroupedSkills] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experienceHeader, setExperienceHeader] = useState(null);
  const [experience, setExperience] = useState([]);
  const [projectsHeader, setProjectsHeader] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certificationsHeader, setCertificationsHeader] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [contactSettings, setContactSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  useEffect(() => {
    // Show cold start notice if backend takes more than 2.5s
    const slowTimer = setTimeout(() => {
      setIsSlowLoading(true);
    }, 2500);

    const fetchPortfolioData = async () => {
      try {
        // Single consolidated API request replaces 13 individual calls
        const bundle = await publicApi.getPublicPortfolio();

        if (bundle) {
          if (bundle.header) setHeaderConfig(bundle.header);
          if (bundle.hero) setHero(bundle.hero);
          if (bundle.about) setAbout(bundle.about);
          if (bundle.skillsHeader) setSkillsHeader(bundle.skillsHeader);
          setGroupedSkills(bundle.groupedSkills || []);
          setSkills(bundle.skills || []);
          if (bundle.experienceHeader) setExperienceHeader(bundle.experienceHeader);
          setExperience(bundle.experience || []);
          if (bundle.projectsHeader) setProjectsHeader(bundle.projectsHeader);
          setProjects(bundle.projects || []);
          if (bundle.certificationsHeader) setCertificationsHeader(bundle.certificationsHeader);
          setCertifications(bundle.certifications || []);
          if (bundle.contact) setContactSettings(bundle.contact);
        }
      } catch (err) {
        console.warn('Consolidated bundle fetch failed, attempting fallback...', err);
        // Resilient fallback to individual endpoints if bundle endpoint is unavailable
        try {
          const [
            headerData,
            heroData,
            aboutData,
            skillsHeaderData,
            groupedSkillsData,
            skillsData,
            expHeaderData,
            experienceData,
            projectsHeaderData,
            projectsData,
            certsHeaderData,
            certificationsData,
            contactData
          ] = await Promise.all([
            publicApi.getHeader().catch(() => null),
            publicApi.getHero().catch(() => null),
            publicApi.getAbout().catch(() => null),
            publicApi.getSkillsHeader().catch(() => null),
            publicApi.getGroupedSkills().catch(() => []),
            publicApi.getSkills().catch(() => []),
            publicApi.getExperienceHeader().catch(() => null),
            publicApi.getExperience().catch(() => []),
            publicApi.getProjectsHeader().catch(() => null),
            publicApi.getProjects().catch(() => []),
            publicApi.getCertificationsHeader().catch(() => null),
            publicApi.getCertifications().catch(() => []),
            publicApi.getContactSettings().catch(() => null)
          ]);

          if (headerData) setHeaderConfig(headerData);
          if (heroData) setHero(heroData);
          if (aboutData) setAbout(aboutData);
          if (skillsHeaderData) setSkillsHeader(skillsHeaderData);
          setGroupedSkills(groupedSkillsData || []);
          setSkills(skillsData || []);
          if (expHeaderData) setExperienceHeader(expHeaderData);
          setExperience(experienceData || []);
          if (projectsHeaderData) setProjectsHeader(projectsHeaderData);
          setProjects(projectsData || []);
          if (certsHeaderData) setCertificationsHeader(certsHeaderData);
          setCertifications(certificationsData || []);
          if (contactData) setContactSettings(contactData);
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr);
        }
      } finally {
        clearTimeout(slowTimer);
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
    return () => clearTimeout(slowTimer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-100 px-4">
        <div className="relative flex flex-col items-center max-w-sm text-center">
          {/* Glowing Brand Pulse Icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-pulse">
              <span className="text-xl font-bold font-mono tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                DY
              </span>
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-xl -z-10 animate-pulse" />
          </div>

          {/* Spinner and Status Indicator */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            <span className="text-sm font-medium text-slate-300">Loading Portfolio...</span>
          </div>

          {/* Cold-start notification if backend is waking up */}
          {isSlowLoading ? (
            <p className="text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3.5 py-2 mt-2 animate-fade-in leading-relaxed">
              Waking up cloud server (free tier spin-up may take up to 30s)...
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Fetching portfolio data
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 animate-fade-in">
      {/* Top Fixed Header */}
      <Navbar headerConfig={headerConfig} />

      {/* Main Content Sections */}
      <main>
        <HeroSection hero={hero} onOpenResume={() => setResumeOpen(true)} />
        <AboutSection about={about} />
        <SkillsSection
          header={skillsHeader}
          groupedSkills={groupedSkills}
          allSkills={skills}
        />
        <ExperienceSection
          header={experienceHeader}
          experience={experience}
        />
        <ProjectsSection
          header={projectsHeader}
          projects={projects}
        />
        <CertificationsSection
          header={certificationsHeader}
          certifications={certifications}
        />
        <ContactSection
          contactSettings={contactSettings}
          onShowToast={showToast}
        />
      </main>

      {/* Interactive Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />

      {/* Floating Notifications */}
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

