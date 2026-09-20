import React, { useState } from 'react';
import { Modal } from './Modal';
import { ShieldCheck, Calendar, Building2, FileText, Loader2, AlertCircle, X } from 'lucide-react';
import { publicApi } from '../../api/publicApi';

/**
 * View-Only Certificate Viewer Modal.
 *
 * Requirements:
 * - PDF: Rendered inline via embedded viewer.
 * - Image (JPG, JPEG, PNG, WebP): Rendered cleanly with aspect-ratio containment.
 * - View-only: Strictly NO download button, NO download links, NO "Open in New Tab" button.
 */
export const CertificateViewerModal = ({ isOpen, onClose, certification }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!certification) return null;

  // Determine the certificate URL: either local preview (Blob / Object URL) or public API endpoint
  const certUrl = certification.previewUrl
    ? certification.previewUrl
    : (certification.certificateUrl || (certification.id ? publicApi.getCertificateViewUrl(certification.id) : ''));

  const fileName = certification.fileName || certification.originalFileName || '';
  const isPdf = certification.contentType?.includes('pdf') ||
    fileName.toLowerCase().endsWith('.pdf') ||
    (certification.previewType === 'pdf');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certification.name || 'Verified Certificate'}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Certificate Subtitle Info Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>{certification.issuer || 'Verified Organization'}</span>
            </span>

            {certification.issuedDate && (
              <span className="flex items-center gap-1.5 text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{certification.issuedDate}</span>
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Credential</span>
          </div>
        </div>

        {/* Certificate Display Area (View-Only) */}
        {!certUrl ? (
          <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-slate-800 bg-dark-900/40 p-6 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-400" />
            <p className="text-sm font-semibold text-white">No certificate file attached</p>
            <p className="text-xs text-slate-400">This certification record has not uploaded an image or PDF document.</p>
          </div>
        ) : isPdf ? (
          /* Embedded PDF Viewer (View-Only) */
          <div className="relative w-full h-[68vh] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <iframe
              src={`${certUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              title={certification.name || 'Certificate PDF'}
              className="w-full h-full rounded-xl bg-white border-0"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          </div>
        ) : (
          /* High-Definition Image Viewer (View-Only) */
          <div className="relative flex items-center justify-center p-3 rounded-xl bg-slate-950/80 border border-slate-800 min-h-[45vh] max-h-[68vh] overflow-auto shadow-2xl">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-900/60 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            )}
            <img
              src={certUrl}
              alt={certification.name || 'Certificate'}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className="max-h-[64vh] w-auto max-w-full rounded-lg object-contain select-none shadow-xl transition-opacity duration-300 pointer-events-auto"
            />
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Could not load the certificate document. Please verify the file format or try again.</span>
          </div>
        )}

        {/* Footer with view-only Close action */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CertificateViewerModal;
