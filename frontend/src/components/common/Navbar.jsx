import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const DEFAULT_HEADER = {
  logoText: "DY",
  brandName: "Deva Yadhala",
  navItems: [
    { name: "About", href: "#about", sectionId: "about", displayOrder: 1, visible: true, isExternal: false },
    { name: "Skills", href: "#skills", sectionId: "skills", displayOrder: 2, visible: true, isExternal: false },
    { name: "Experience", href: "#experience", sectionId: "experience", displayOrder: 3, visible: true, isExternal: false },
    { name: "Projects", href: "#projects", sectionId: "projects", displayOrder: 4, visible: true, isExternal: false },
    { name: "Certifications", href: "#certifications", sectionId: "certifications", displayOrder: 5, visible: true, isExternal: false },
    { name: "Contact", href: "#contact", sectionId: "contact", displayOrder: 6, visible: true, isExternal: false },
  ]
};

export const Navbar = ({ headerConfig }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  const data = headerConfig || DEFAULT_HEADER;
  const rawItems = (data.navItems && data.navItems.length > 0) ? data.navItems : DEFAULT_HEADER.navItems;
  const visibleNavItems = rawItems
    .filter(item => item.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const internalSectionIds = visibleNavItems
        .filter(item => !item.isExternal && item.sectionId)
        .map(item => item.sectionId);

      const sectionIds = internalSectionIds.length > 0
        ? internalSectionIds
        : ['about', 'skills', 'experience', 'projects', 'certifications', 'contact'];

      const scrollPosition = window.scrollY + 220;
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleNavItems]);

  const isHome = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'glass-nav py-3.5 shadow-lg shadow-black/20' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo (Left) */}
          {isHome ? (
            <a href="#hero" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-lg font-display shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                {data.logoText || "DY"}
              </div>
              <span className="text-lg font-bold text-white font-display tracking-tight group-hover:text-emerald-400 transition-colors">
                {data.brandName || "Deva Yadhala"}
              </span>
            </a>
          ) : (
            <Link to="/#hero" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-lg font-display shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                {data.logoText || "DY"}
              </div>
              <span className="text-lg font-bold text-white font-display tracking-tight group-hover:text-emerald-400 transition-colors">
                {data.brandName || "Deva Yadhala"}
              </span>
            </Link>
          )}

          {/* Desktop Navigation (Right Aligned) */}
          {isHome ? (
            <nav className="hidden md:flex items-center gap-1 bg-dark-800/70 p-1.5 rounded-full border border-slate-700/60 backdrop-blur-md shadow-inner">
              {visibleNavItems.map((link) => {
                const isActive = activeSection === (link.sectionId || link.id);
                const targetHref = link.href || `#${link.sectionId}`;

                return (
                  <a
                    key={link.id || link.name}
                    href={targetHref}
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                    onClick={() => {
                      if (!link.isExternal && link.sectionId) {
                        setActiveSection(link.sectionId);
                      }
                    }}
                    className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                      isActive && !link.isExternal
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25 scale-105'
                        : 'text-slate-300 font-medium hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </nav>
          ) : (
            <Link
              to="/"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              ← Back to Portfolio
            </Link>
          )}

          {/* Mobile Menu Button (Right Aligned) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-slate-800 px-4 pt-3 pb-4 space-y-2 mt-3 animate-fadeIn">
          {visibleNavItems.map((link) => {
            const isActive = activeSection === (link.sectionId || link.id);
            const targetHref = link.href || `#${link.sectionId}`;

            return (
              <a
                key={link.id || link.name}
                href={targetHref}
                target={link.isExternal ? '_blank' : undefined}
                rel={link.isExternal ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  if (!link.isExternal && link.sectionId) {
                    setActiveSection(link.sectionId);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                  isActive && !link.isExternal
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-200 hover:text-emerald-400 hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
