import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Upload, FileText, Image as ImageIcon, X, Trash2, Eye, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CertificateViewerModal } from '../common/CertificateViewerModal';

const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const CertificationModal = ({ isOpen, onClose, onSave, certification = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issuedDate: '',
    credentialUrl: '',
    displayOrder: 0,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [filePreviewType, setFilePreviewType] = useState(null);
  const [removeCertificate, setRemoveCertificate] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // State for previewing current/selected certificate
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewCertData, setPreviewCertData] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name || '',
        issuer: certification.issuer || '',
        issuedDate: certification.issuedDate || '',
        credentialUrl: certification.credentialUrl || '',
        displayOrder: certification.displayOrder || 0,
      });
      setRemoveCertificate(false);
      setIsReplacing(false);
    } else {
      setFormData({
        name: '',
        issuer: '',
        issuedDate: new Date().getFullYear().toString(),
        credentialUrl: '',
        displayOrder: 0,
      });
      setRemoveCertificate(false);
      setIsReplacing(false);
    }

    // Reset uploaded file state
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setFilePreviewType(null);
    setUploadError(null);
  }, [certification, isOpen]);

  // Clean up Object URLs when unmounting or changing files
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateAndSetFile = (file) => {
    setUploadError(null);
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size exceeds maximum permitted limit of 10 MB.');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setUploadError(`Unsupported file format (.${extension}). Please upload PDF, JPG, JPEG, PNG, or WebP.`);
      return;
    }

    // Clean up previous preview URL if any
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreviewUrl(objectUrl);
    setFilePreviewType(extension === 'pdf' ? 'pdf' : 'image');
    setRemoveCertificate(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleClearSelectedFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setFilePreviewType(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePreviewCurrent = () => {
    if (!certification) return;
    setPreviewCertData({
      ...certification,
      previewUrl: certification.certificateUrl,
    });
    setPreviewModalOpen(true);
  };

  const handlePreviewSelected = () => {
    if (!selectedFile || !filePreviewUrl) return;
    setPreviewCertData({
      name: formData.name || selectedFile.name,
      issuer: formData.issuer || 'Preview',
      issuedDate: formData.issuedDate || '',
      previewUrl: filePreviewUrl,
      previewType: filePreviewType,
      fileName: selectedFile.name,
      contentType: selectedFile.type,
    });
    setPreviewModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('issuer', formData.issuer.trim());
    if (formData.issuedDate) data.append('issuedDate', formData.issuedDate.trim());
    if (formData.credentialUrl) data.append('credentialUrl', formData.credentialUrl.trim());
    data.append('displayOrder', parseInt(formData.displayOrder, 10) || 0);

    if (selectedFile) {
      data.append('file', selectedFile);
    } else if (removeCertificate) {
      data.append('removeCertificate', 'true');
    }

    onSave(data);
  };

  const hasExistingCert = Boolean(certification?.hasCertificate && !removeCertificate);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={certification ? 'Edit Certification' : 'Add New Certification'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Certification Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Java Full Stack Development"
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Issuer Organization <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="issuer"
              required
              value={formData.issuer}
              onChange={handleChange}
              placeholder="e.g. Wipro TalentNext / Infosys Springboard"
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issued Date / Year</label>
              <input
                type="text"
                name="issuedDate"
                value={formData.issuedDate}
                onChange={handleChange}
                placeholder="e.g. 2024"
                className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Credential URL (Optional)</label>
            <input
              type="url"
              name="credentialUrl"
              value={formData.credentialUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Certificate File Section */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Certificate Document (Optional)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                PDF, JPG, PNG, WebP — Max 10 MB
              </span>
            </div>

            {/* If has existing certificate on server and not currently uploading a replacement */}
            {hasExistingCert && !selectedFile && !isReplacing ? (
              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Current Certificate</span>
                    <p className="text-xs font-medium text-white truncate max-w-xs" title={certification.originalFileName || certification.fileName}>
                      {certification.originalFileName || certification.fileName || 'certificate.pdf'}
                    </p>
                    {certification.formattedFileSize && (
                      <span className="text-[11px] text-slate-400 font-mono">{certification.formattedFileSize}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handlePreviewCurrent}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-dark-750 hover:bg-dark-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReplacing(true)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-dark-750 hover:bg-dark-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemoveCertificate(true)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : removeCertificate ? (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Certificate will be removed upon saving.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRemoveCertificate(false)}
                  className="px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-700 font-semibold text-xs"
                >
                  Undo
                </button>
              </div>
            ) : selectedFile ? (
              /* Selected New File Preview Box */
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      {filePreviewType === 'pdf' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">New Certificate Selected</span>
                      <p className="text-xs font-semibold text-white truncate max-w-xs" title={selectedFile.name}>
                        {selectedFile.name}
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePreviewSelected}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearSelectedFile}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-dark-800 transition-colors"
                      title="Clear file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instant Inline Preview */}
                <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 flex items-center justify-center max-h-48">
                  {filePreviewType === 'pdf' ? (
                    <iframe
                      src={`${filePreviewUrl}#toolbar=0&navpanes=0`}
                      title="PDF Preview"
                      className="w-full h-44 rounded border-0 bg-white"
                    />
                  ) : (
                    <img
                      src={filePreviewUrl}
                      alt="Certificate Preview"
                      className="max-h-44 w-auto object-contain rounded"
                    />
                  )}
                </div>
              </div>
            ) : (
              /* Drag & Drop Upload Zone */
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cert-file-input"
                />

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    dragActive
                      ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                      : 'border-slate-700 hover:border-slate-600 bg-dark-800/50 hover:bg-dark-800'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        Drag & Drop Certificate file here, or <span className="text-emerald-400 underline">Browse</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 font-mono">
                        Supports PDF, JPG, JPEG, PNG, WebP up to 10 MB
                      </p>
                    </div>
                  </div>
                </div>

                {isReplacing && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setIsReplacing(false)}
                      className="text-xs text-slate-400 hover:text-white underline"
                    >
                      Cancel Replacement
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-md shadow-emerald-400/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Saving...' : certification ? 'Update Certification' : 'Create Certification'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Embedded View-Only Preview Modal */}
      <CertificateViewerModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setPreviewCertData(null);
        }}
        certification={previewCertData}
      />
    </>
  );
};

export default CertificationModal;

