import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  confirmVariant = 'danger', // 'danger' | 'primary' | 'success'
  isLoading = false
}) => {
  const variantStyles = {
    danger: {
      btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
      icon: <Trash2 className="w-6 h-6 text-rose-600" />,
      iconBg: 'bg-rose-50'
    },
    primary: {
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
      icon: <AlertTriangle className="w-6 h-6 text-indigo-600" />,
      iconBg: 'bg-indigo-50'
    },
    success: {
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50'
    }
  };

  const currentVariant = variantStyles[confirmVariant] || variantStyles.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${currentVariant.iconBg}`}>
          {currentVariant.icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50 ${currentVariant.btn}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
