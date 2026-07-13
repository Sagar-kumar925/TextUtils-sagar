import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { Toast } from '../types';

interface ToasterProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export default function Toaster({ toasts, removeToast }: ToasterProps) {
  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-500" />;
    }
  };

  const getBgClass = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50/90 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/30';
      case 'error':
        return 'bg-rose-50/90 border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/30';
      case 'warning':
        return 'bg-amber-50/90 border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/30';
      case 'info':
      default:
        return 'bg-sky-50/90 border-sky-100 dark:bg-sky-950/40 dark:border-sky-900/30';
    }
  };

  return (
    <div 
      id="toast-container" 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-colors ${getBgClass(toast.type)}`}
            id={`toast-${toast.id}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>
            
            <div className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              id={`toast-close-${toast.id}`}
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
