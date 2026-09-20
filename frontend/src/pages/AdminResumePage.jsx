import React, { useState, useEffect, useRef } from 'react';
import { adminApi } from '../api/adminApi';
import { publicApi } from '../api/publicApi';
import { Toast } from '../components/common/Toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  RefreshCw,
  FileCheck
} from 'lucide-react';

export const AdminResumePage = () => {
  const [activeResume, setActiveResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const loadResume = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getActiveResume();
      setActiveResume(data);
    } catch (err) {
      console.error('Failed to load active resume', err);
      showToast('error', 'Failed to load resume details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  const validateAndSetFile = (file) => {
    setUploadError(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError('Please upload a valid PDF file. Only .pdf documents are supported.');
      return;
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10 MB maximum limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a PDF file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const result = await adminApi.uploadResume(formData);
      showToast('success', `Resume "${result.fileName}" uploaded and activated successfully.`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await loadResume();
    } catch (err) {
      console.error('Failed to upload resume', err);
      const msg = err.response?.data?.message || 'Failed to upload resume. Please try again.';
      setUploadError(msg);
      showToast('error', msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeResume?.id) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteResume(activeResume.id);
      showToast('success', 'Resume deleted successfully.');
      setActiveResume(null);
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error('Failed to delete resume', err);
      showToast('error', err.response?.data?.message || 'Failed to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Resume Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload, preview, replace, or manage the active resume PDF for your public portfolio.
          </p>
        </div>
        <button
          onClick={loadResume}
          disabled={isLoading}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs font-medium bg-dark-800 hover:bg-dark-750 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Current Active Resume Card */}
      <div className="bg-dark-850 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Current Active Resume</h2>
              <p className="text-xs text-slate-400">The document currently served to visitors on the live portfolio.</p>
            </div>
          </div>
          {activeResume ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <span>No Resume Uploaded</span>
            </span>
          )}
        </div>

        {activeResume ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-dark-900/60 p-4 sm:p-5 rounded-xl border border-slate-800/80">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-mono">File Name</span>
                <p className="text-sm font-semibold text-white truncate" title={activeResume.fileName}>
                  {activeResume.fileName}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Upload Date
                </span>
                <p className="text-sm font-medium text-slate-200">
                  {formatDate(activeResume.uploadedAt)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5" /> File Size
                </span>
                <p className="text-sm font-medium text-slate-200">
                  {activeResume.formattedFileSize || formatFileSize(activeResume.fileSize)}
                </p>
              </div>
            </div>

            {/* Action Buttons for Active Resume */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={publicApi.getResumePreviewUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500/40 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>View / Preview</span>
              </a>

              <a
                href={publicApi.getResumeDownloadUrl()}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>

              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors flex items-center gap-2 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Resume</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No active resume is currently uploaded.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload a PDF resume below to make it immediately accessible on your portfolio.
            </p>
          </div>
        )}
      </div>

      {/* Upload New / Replace Resume Area */}
      <div className="bg-dark-850 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {activeResume ? 'Replace Active Resume' : 'Upload New Resume'}
            </h2>
            <p className="text-xs text-slate-400">
              Uploading a new PDF will automatically deactivate any previous version and update the live site.
            </p>
          </div>
        </div>

        {uploadError && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-slate-700/80 hover:border-emerald-500/50 hover:bg-dark-800/40 bg-dark-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
              <Upload className="w-6 h-6" />
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
                  <FileCheck className="w-4 h-4" />
                  <span>{selectedFile.name}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Size: {formatFileSize(selectedFile.size)} • Click to change file
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-white">
                  Drag & drop your PDF resume here, or <span className="text-emerald-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500">
                  Supports PDF files up to 10 MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* Upload Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {selectedFile && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setUploadError(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedFile && !isUploading
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>{activeResume ? 'Upload & Replace Active Resume' : 'Upload Resume'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Active Resume"
        message={`Are you sure you want to delete "${activeResume?.fileName}"? The public portfolio will no longer have an active PDF available for download until a new one is uploaded.`}
        confirmText="Delete Resume"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};
