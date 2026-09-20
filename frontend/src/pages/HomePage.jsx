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
  const [resumeOpen, setResumeOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  useEffect(() => {
    const fetchPortfolioData = async () => {
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
      } catch (err) {
        console.error('Error loading portfolio data from backend:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
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

