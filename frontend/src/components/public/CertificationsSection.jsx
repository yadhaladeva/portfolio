import React, { useState } from 'react';
import { CertificationCard } from '../common/CertificationCard';
import { CertificateViewerModal } from '../common/CertificateViewerModal';

export const CertificationsSection = ({ certifications = [], header }) => {
  const [selectedCert, setSelectedCert] = useState(null);

  const badgeText = header?.badgeText || 'CERTIFICATIONS';
  const description = header?.description || 'Professional certifications and assessments validating expertise in Java, Full Stack Development, Python, and SQL.';

  return (
    <section id="certifications" className="pt-24 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            {badgeText}
          </div>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <CertificationCard
              key={cert.id || cert.name}
              certification={cert}
              onViewCertificate={(item) => setSelectedCert(item)}
            />
          ))}
        </div>
      </div>

      {/* View-Only Certificate Modal */}
      <CertificateViewerModal
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
        certification={selectedCert}
      />
    </section>
  );
};

export default CertificationsSection;

