import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-500/30 bg-dark-850/95 text-slate-100',
    error: 'border-rose-500/30 bg-dark-850/95 text-slate-100',
    info: 'border-cyan-500/30 bg-dark-850/95 text-slate-100',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl ${borderStyles[type] || borderStyles.info}`}>
        {icons[type] || icons.info}
        <div className="flex-1 text-sm font-medium pr-2">{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
