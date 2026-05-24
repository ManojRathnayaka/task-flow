import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-semibold">
            <AlertTriangle size={18} />
            <h2>{title || 'Confirm Action'}</h2>
          </div>
          <button 
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 text-slate-600 dark:text-slate-400 text-sm">
          <p>{message || 'Are you sure you want to proceed?'}</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-neutral-800/50 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-neutral-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
