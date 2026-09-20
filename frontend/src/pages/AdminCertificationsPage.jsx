import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { CertificationModal } from '../components/admin/CertificationModal';
import { CertificationCard } from '../components/common/CertificationCard';
import { CertificateViewerModal } from '../components/common/CertificateViewerModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/common/Toast';
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  ExternalLink,
  FileText,
  Eye,
  Sparkles,
  ShieldCheck,
  XCircle,
  Save,
  RotateCcw
} from 'lucide-react';

const DEFAULT_CERTS_HEADER = {
  badgeText: 'CERTIFICATIONS',
  description: 'Professional credentials and technical specializations validated through recognized industry programs.'
};

export const AdminCertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [headerData, setHeaderData] = useState(DEFAULT_CERTS_HEADER);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderSaving, setIsHeaderSaving] = useState(false);
  const [isHeaderResetting, setIsHeaderResetting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Live preview card selection
  const [previewCertIndex, setPreviewCertIndex] = useState(0);

  // Certificate view-only viewer modal
  const [viewCertModalOpen, setViewCertModalOpen] = useState(false);
  const [certToView, setCertToView] = useState(null);

  // Delete certification confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Remove certificate file only confirmation
  const [removeFileConfirmOpen, setRemoveFileConfirmOpen] = useState(false);
  const [certToRemoveFile, setCertToRemoveFile] = useState(null);
  const [isRemovingFile, setIsRemovingFile] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const loadData = async () => {
    try {
      const [certsData, headerRes] = await Promise.all([
        adminApi.getCertifications(),
        adminApi.getSectionHeader('CERTIFICATIONS').catch(() => null)
      ]);
      setCertifications(certsData || []);
      if (headerRes) {
        setHeaderData({
          badgeText: headerRes.badgeText || DEFAULT_CERTS_HEADER.badgeText,
          description: headerRes.description || DEFAULT_CERTS_HEADER.description
        });
      }
    } catch (err) {
      console.error('Failed to load certifications data', err);
      showToast('error', 'Failed to load certifications list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    if (!headerData.badgeText.trim() || !headerData.description.trim()) {
      showToast('error', 'Badge text and description cannot be empty.');
      return;
    }
    setIsHeaderSaving(true);
    try {
      await adminApi.updateSectionHeader('CERTIFICATIONS', headerData);
      showToast('success', 'Certifications section header updated successfully!');
    } catch (err) {
      console.error('Error saving certifications header', err);
      showToast('error', err.response?.data?.message || 'Failed to save certifications header.');
    } finally {
      setIsHeaderSaving(false);
    }
  };

  const handleResetHeader = async () => {
    setIsHeaderResetting(true);
    try {
      const res = await adminApi.resetSectionHeader('CERTIFICATIONS');
      if (res) {
        setHeaderData({
          badgeText: res.badgeText || DEFAULT_CERTS_HEADER.badgeText,
          description: res.description || DEFAULT_CERTS_HEADER.description
        });
      }
      showToast('success', 'Certifications section header reset to canonical defaults.');
    } catch (err) {
      console.error('Error resetting certifications header', err);
      showToast('error', 'Failed to reset certifications header.');
    } finally {
      setIsHeaderResetting(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setIsSaving(true);
    try {
      const certName = formData.get('name') || 'Certification';
      if (selectedCert?.id) {
        await adminApi.updateCertification(selectedCert.id, formData);
        showToast('success', `Certification "${certName}" updated successfully.`);
      } else {
        await adminApi.createCertification(formData);
        showToast('success', `Certification "${certName}" created successfully.`);
      }
      setModalOpen(false);
      setSelectedCert(null);
      await loadCertifications();
    } catch (err) {
      console.error('Error saving certification', err);
      showToast('error', err.response?.data?.message || 'Failed to save certification.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCertification = async () => {
    if (!certToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteCertification(certToDelete.id);
      showToast('success', `Certification "${certToDelete.name}" deleted.`);
      setDeleteConfirmOpen(false);
      setCertToDelete(null);
      await loadData();
    } catch (err) {
      console.error('Error deleting certification', err);
      showToast('error', 'Failed to delete certification.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveCertificateFile = async () => {
    if (!certToRemoveFile) return;
    setIsRemovingFile(true);
    try {
      await adminApi.deleteCertificate(certToRemoveFile.id);
      showToast('success', `Certificate file removed from "${certToRemoveFile.name}".`);
      setRemoveFileConfirmOpen(false);
      setCertToRemoveFile(null);
      await loadData();
    } catch (err) {
      console.error('Error removing certificate file', err);
      showToast('error', 'Failed to remove certificate file.');
    } finally {
      setIsRemovingFile(false);
    }
  };

  const activePreviewCert = certifications.length > 0
    ? (certifications[previewCertIndex] || certifications[0])
    : null;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Certifications CMS Management</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span>Certifications & Header Settings</span>
          </h1>
          <p className="text-sm text-slate-400">
            Configure section badge, subtitle copy, verified credentials, and view-only certificate files.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCert(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Certification</span>
        </button>
      </div>

      {/* 1. Section Header Editor & Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-7 bg-dark-850 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Section Header</h2>
                <p className="text-xs text-slate-400">Badge pill and section subtitle</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetHeader}
                disabled={isHeaderSaving || isHeaderResetting}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-dark-800 hover:bg-dark-750 border border-slate-700 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Reset Header to Defaults"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleSaveHeader}
                disabled={isHeaderSaving}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
                <span>{isHeaderSaving ? 'Saving...' : 'Save Header'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Section Badge Text <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="badgeText"
                value={headerData.badgeText}
                onChange={handleHeaderChange}
                placeholder="e.g. CERTIFICATIONS"
                className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Introductory Subtitle / Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="description"
                rows={2}
                value={headerData.description}
                onChange={handleHeaderChange}
                placeholder="Describe verified certifications and credentials..."
                className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 bg-[#090d16] border border-slate-800 rounded-2xl p-6 flex flex-col justify-center text-center space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-800/80">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span>Header Live Preview</span>
            </span>
            <span className="text-[10px] font-mono">Updates live</span>
          </div>

          <div className="py-2 space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              {headerData.badgeText || 'CERTIFICATIONS'}
            </div>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              {headerData.description || 'Professional credentials and technical specializations validated through recognized industry programs.'}
            </p>
          </div>
        </div>
      </div>

      {/* Live Portfolio Card Preview Panel */}
      {certifications.length > 0 && (
        <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Live Public Portfolio Card Preview</span>
              <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-dark-800 border border-slate-700">
                100% Identical Shared Component
              </span>
            </div>

            {/* Quick Card Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Previewing:</span>
              <select
                value={previewCertIndex}
                onChange={(e) => setPreviewCertIndex(Number(e.target.value))}
                className="px-3 py-1 text-xs bg-dark-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                {certifications.map((c, idx) => (
                  <option key={c.id || idx} value={idx}>
                    {c.name} ({c.issuer})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Render Active Preview Card */}
          <div className="max-w-md mx-auto sm:mx-0">
            {activePreviewCert && (
              <CertificationCard
                certification={activePreviewCert}
                onViewCertificate={(item) => {
                  setCertToView(item);
                  setViewCertModalOpen(true);
                }}
                isPreview={true}
              />
            )}
          </div>
        </div>
      )}

      {/* Certifications Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : certifications.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <Award className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No certifications found</h3>
          <p className="text-xs text-slate-400">Click "Add New Certification" to create an entry with optional certificate upload.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-800/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Certification Name</th>
                  <th className="px-6 py-4">Issuer Organization</th>
                  <th className="px-6 py-4">Issued Year</th>
                  <th className="px-6 py-4">Certificate File</th>
                  <th className="px-6 py-4 text-center">Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {certifications.map((cert, idx) => (
                  <tr
                    key={cert.id}
                    onClick={() => setPreviewCertIndex(idx)}
                    className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      previewCertIndex === idx ? 'bg-indigo-500/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-white text-sm">
                      {cert.name}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">
                      {cert.issuer}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {cert.issuedDate || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {cert.hasCertificate ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[11px] truncate max-w-[180px]" title={cert.originalFileName || cert.fileName}>
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{cert.originalFileName || cert.fileName || 'Uploaded'}</span>
                          </span>
                          {cert.formattedFileSize && (
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">
                              ({cert.formattedFileSize})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">Not uploaded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-300">
                      {cert.displayOrder}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Certificate Action */}
                        {cert.hasCertificate && (
                          <button
                            onClick={() => {
                              setCertToView(cert);
                              setViewCertModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Preview Certificate Document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Verify Credential URL Action */}
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Open Credential URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {/* Edit Certification */}
                        <button
                          onClick={() => {
                            setSelectedCert(cert);
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Certification"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Remove Certificate File Only */}
                        {cert.hasCertificate && (
                          <button
                            onClick={() => {
                              setCertToRemoveFile(cert);
                              setRemoveFileConfirmOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Remove Certificate File Only"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Certification Record */}
                        <button
                          onClick={() => {
                            setCertToDelete(cert);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete Certification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Certification Modal */}
      <CertificationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCert(null);
        }}
        onSave={handleCreateOrUpdate}
        certification={selectedCert}
        isLoading={isSaving}
      />

      {/* View-Only Certificate Viewer Modal */}
      <CertificateViewerModal
        isOpen={viewCertModalOpen}
        onClose={() => {
          setViewCertModalOpen(false);
          setCertToView(null);
        }}
        certification={certToView}
      />

      {/* Remove Certificate File Only Confirmation */}
      <ConfirmDialog
        isOpen={removeFileConfirmOpen}
        onClose={() => setRemoveFileConfirmOpen(false)}
        onConfirm={handleRemoveCertificateFile}
        title="Remove Certificate File?"
        message={`Are you sure you want to remove the uploaded certificate document from "${certToRemoveFile?.name}"? The certification record will be kept.`}
        isLoading={isRemovingFile}
      />

      {/* Delete Entire Certification Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteCertification}
        title="Delete Certification?"
        message={`Are you sure you want to delete "${certToDelete?.name}"? This will permanently remove the certification and its certificate file.`}
        isLoading={isDeleting}
      />

      {/* Toast Feedback */}
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

export default AdminCertificationsPage;

