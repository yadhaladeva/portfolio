import React from 'react';
import { Calendar, ExternalLink, ShieldCheck, FileText, Eye } from 'lucide-react';

/**
 * Shared Certification Card component used across:
 * 1. Public Portfolio Certifications Section
 * 2. Admin Live Portfolio Preview
 *
 * Strictly preserves the public glassmorphism styling, typography, colors, and responsive layout.
 */
export const CertificationCard = ({ certification, onViewCertificate, isPreview = false }) => {
  const cert = certification || {};
  const hasCert = Boolean(cert.hasCertificate || cert.certificateUrl || cert.previewUrl);
  const hasUrl = Boolean(cert.credentialUrl);

  return (
    <div className="glass-card p-6 rounded-2xl glass-card-hover border border-slate-800 flex flex-col justify-between h-full group">
      <div>
        {/* Shield Icon Badge */}
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-5 h-5" />
        </div>

        {/* Certification Title */}
        <h3 className="text-base font-bold text-white font-display mb-2 leading-snug">
          {cert.name || 'Certification Name'}
        </h3>

        {/* Issuer */}
        <p className="text-xs font-medium text-emerald-400 mb-4">
          {cert.issuer || 'Issuer Organization'}
        </p>
      </div>

      {/* Card Footer: Date + Certificate/Credential Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        {/* Issued Date */}
        <span className="flex items-center gap-1 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{cert.issuedDate || 'Verified'}</span>
        </span>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {hasCert && (
            <button
              type="button"
              onClick={() => onViewCertificate && onViewCertificate(cert)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all cursor-pointer shadow-sm"
              title="View verified certificate"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Certificate</span>
            </button>
          )}

          {hasUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors hover:underline"
              title="Verify credential online"
            >
              <span>Verify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationCard;
