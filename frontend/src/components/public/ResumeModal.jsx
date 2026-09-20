import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Download, ExternalLink, AlertCircle, FileText, Loader2, Mail } from 'lucide-react';
import { publicApi } from '../../api/publicApi';

export const ResumeModal = ({ isOpen, onClose }) => {
  const [activeResume, setActiveResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadResumeInfo();
    }
  }, [isOpen]);

  const loadResumeInfo = async () => {
    setIsLoading(true);
    setDownloadError(null);
    try {
      const data = await publicApi.getActiveResume();
      setActiveResume(data);
    } catch (err) {
      // Graceful fallback if no resume endpoint or error
      setActiveResume(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!activeResume) {
      setDownloadError('Resume is currently unavailable. Please check back later.');
      return;
    }
    // Direct browser download of active PDF
    const downloadUrl = publicApi.getResumeDownloadUrl();
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', activeResume.fileName || 'Deva_Yadhala_Resume.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deva Yadhala — Resume" maxWidth="max-w-5xl">
      <div className="space-y-4">
        {/* Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-slate-400 font-mono">Recruiter Document View</span>
            <p className="text-sm font-semibold text-white">
              {activeResume?.fileName ? (
                <span className="text-emerald-400 font-mono text-xs truncate max-w-xs inline-block align-bottom" title={activeResume.fileName}>
                  {activeResume.fileName}
                </span>
              ) : (
                'Full-Stack Software Developer'
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {activeResume && (
              <>
                <a
                  href={publicApi.getResumePreviewUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500/40 transition-colors flex items-center gap-1.5"
                  title="Open PDF in a new browser tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Open in New Tab</span>
                  <span className="sm:hidden">New Tab</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20 group cursor-pointer"
                  title={activeResume ? `Download ${activeResume.fileName}` : 'Download Resume'}
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download Resume</span>
                </button>
              </>
            )}

            <a
              href="#contact"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500/40 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact Candidate</span>
            </a>
          </div>
        </div>

        {/* Error Alert */}
        {downloadError && (
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{downloadError}</span>
          </div>
        )}

        {/* Dynamic Resume Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[65vh] rounded-xl border border-slate-800/80 bg-dark-900/40 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-xs text-slate-400 font-mono">Loading active resume...</p>
          </div>
        ) : activeResume ? (
          <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <iframe
              src={`${publicApi.getResumePreviewUrl()}#toolbar=1&navpanes=0`}
              title="Deva Yadhala Resume"
              className="w-full h-[72vh] rounded-xl bg-white border-0"
            >
              <div className="p-8 text-center text-slate-300 space-y-3">
                <p className="text-sm">Your browser does not support embedded PDF viewing.</p>
                <a
                  href={publicApi.getResumeDownloadUrl()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Resume
                </a>
              </div>
            </iframe>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 rounded-xl border border-slate-800 bg-dark-900/40 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Resume Currently Unavailable</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                The resume PDF is currently being updated. In the meantime, feel free to explore the experience and projects sections or reach out directly.
              </p>
            </div>
            <a
              href="#contact"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-500/20"
            >
              Contact Candidate
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
};
