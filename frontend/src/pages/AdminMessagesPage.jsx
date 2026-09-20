import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/common/Toast';
import {
  Mail,
  MailOpen,
  Trash2,
  Calendar,
  User,
  Clock,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Reply,
  Send,
  AtSign
} from 'lucide-react';

export const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [msgToDelete, setMsgToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const loadMessages = async () => {
    try {
      const data = await adminApi.getMessages();
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to load messages', err);
      showToast('error', 'Failed to load messages inbox.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleStatus = async (msg) => {
    const nextStatus = msg.status === 'READ' ? 'UNREAD' : 'READ';
    try {
      await adminApi.updateMessageStatus(msg.id, nextStatus);
      showToast('success', `Message marked as ${nextStatus.toLowerCase()}.`);
      await loadMessages();
    } catch (err) {
      console.error('Failed to update status', err);
      showToast('error', 'Failed to update message status.');
    }
  };

  const handleDelete = async () => {
    if (!msgToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteMessage(msgToDelete.id);
      showToast('success', 'Message deleted successfully.');
      setDeleteConfirmOpen(false);
      setMsgToDelete(null);
      if (selectedMessage?.id === msgToDelete.id) {
        setSelectedMessage(null);
      }
      await loadMessages();
    } catch (err) {
      console.error('Error deleting message', err);
      showToast('error', 'Failed to delete message.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    showToast('success', `Copied "${email}" to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const getQuotedReplyBody = (msg) => {
    const dateStr = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '';
    return `\n\n\n----------------------------------------\nFrom: ${msg.name} <${msg.email}>\nDate: ${dateStr}\nSubject: ${msg.subject || 'Inquiry'}\n\n${msg.message || ''}`;
  };

  const handleReplyGmail = (msg) => {
    if (!msg?.email) return;
    const subject = `Re: ${msg.subject || 'Portfolio Inquiry'}`;
    const body = getQuotedReplyBody(msg);
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleReplyOutlook = (msg) => {
    if (!msg?.email) return;
    const subject = `Re: ${msg.subject || 'Portfolio Inquiry'}`;
    const body = getQuotedReplyBody(msg);
    const url = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(msg.email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleReplyDefaultMail = (msg) => {
    if (!msg?.email) return;
    const subject = `Re: ${msg.subject || 'Portfolio Inquiry'}`;
    const body = getQuotedReplyBody(msg);
    const mailtoUrl = `mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Contact Messages Inbox</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review inquiries, interview invitations, and feedback submitted through the public contact form.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <Mail className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No messages yet</h3>
          <p className="text-xs text-slate-400">Inquiries submitted via the public contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Messages List Column */}
          <div className="lg:col-span-5 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'UNREAD') {
                    handleToggleStatus(msg);
                  }
                }}
                className={`glass-card p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedMessage?.id === msg.id
                    ? 'border-emerald-500/60 bg-slate-800/80 shadow-lg'
                    : msg.status === 'UNREAD'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {msg.status === 'UNREAD' ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                    )}
                    <span className="font-bold text-white text-xs truncate max-w-[160px]">
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-300 truncate mb-1">
                  {msg.subject || 'General Inquiry'}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Message Detail View Column */}
          <div className="lg:col-span-7">
            {selectedMessage ? (
              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      {selectedMessage.subject || 'General Inquiry'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1.5 text-slate-200">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <strong>{selectedMessage.name}</strong>
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400 font-mono">
                          {selectedMessage.email}
                        </span>
                        <button
                          onClick={() => handleCopyEmail(selectedMessage.email)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Copy email address"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(selectedMessage)}
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title={selectedMessage.status === 'READ' ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {selectedMessage.status === 'READ' ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <MailOpen className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setMsgToDelete(selectedMessage);
                        setDeleteConfirmOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-dark-900 p-5 rounded-xl border border-slate-800/80">
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Quick Reply & Email Actions */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Reply className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Reply to {selectedMessage.name}</span>
                    </span>
                    <button
                      onClick={() => handleCopyEmail(selectedMessage.email)}
                      className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy email to clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Email Address'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Gmail Web Compose (Direct redirect in new tab that ALWAYS works) */}
                    <button
                      onClick={() => handleReplyGmail(selectedMessage)}
                      className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-400/20 flex items-center gap-2 cursor-pointer"
                      title="Open compose window directly in Gmail Web"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Reply via Gmail</span>
                    </button>

                    {/* Default Desktop Mail Client */}
                    <button
                      onClick={() => handleReplyDefaultMail(selectedMessage)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-dark-800 hover:bg-dark-750 border border-slate-700 hover:border-slate-600 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                      title="Open default email application (mailto:)"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Default Mail App</span>
                    </button>

                    {/* Outlook Web Compose */}
                    <button
                      onClick={() => handleReplyOutlook(selectedMessage)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-dark-800 hover:bg-dark-750 border border-slate-700 hover:border-slate-600 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                      title="Open compose window directly in Outlook Web"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Outlook Web</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
                Select a message on the left to read details and reply.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Message"
        message={`Are you sure you want to delete the message from ${msgToDelete?.name}?`}
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

export default AdminMessagesPage;

