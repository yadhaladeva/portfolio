import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full bg-dark-900/90 border-t border-slate-800/80 py-3 sm:py-3.5 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} Deva Yadhala · Software Engineer</p>
          
          <p className="text-slate-500">
            Designed & engineered with React, Tailwind CSS, Spring Boot & PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
};
