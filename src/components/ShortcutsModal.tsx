import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard, Command, Sparkles } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  const categories = [
    {
      title: 'Formatting & Actions (Ctrl/Cmd + Alt + Key)',
      shortcuts: [
        { keys: ['Ctrl', 'Alt', 'U'], desc: 'Convert entire copy to UPPERCASE' },
        { keys: ['Ctrl', 'Alt', 'L'], desc: 'Convert entire copy to lowercase' },
        { keys: ['Ctrl', 'Alt', 'W'], desc: 'Capitalize Each Word (Title Case)' },
        { keys: ['Ctrl', 'Alt', 'S'], desc: 'Capitalize Sentences start letters' },
        { keys: ['Ctrl', 'Alt', 'X'], desc: 'Strip out duplicate/extra spaces' },
        { keys: ['Ctrl', 'Alt', 'R'], desc: 'Reverse entire copy characters backwards' },
      ],
    },
    {
      title: 'Workspace Management',
      shortcuts: [
        { keys: ['Ctrl', 'Z'], desc: 'Undo last text alteration' },
        { keys: ['Ctrl', 'Y'], desc: 'Redo text alteration' },
        { keys: ['Ctrl', 'Alt', 'D'], desc: 'Download current workspace as .txt' },
        { keys: ['Ctrl', 'Alt', 'K'], desc: 'Wipe/Clear entire workspace clean' },
      ],
    },
  ];

  const isMac = typeof window !== 'undefined' && navigator.userAgent.includes('Mac');

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="shortcuts-modal-overlay" 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-950/40 dark:bg-black/65 backdrop-blur-md"
            id="shortcuts-modal-backdrop"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl glass-panel shadow-2xl p-6 sm:p-8"
            id="shortcuts-modal-card"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-1.5">
                    Keyboard Shortcuts
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Speed up text manipulation with instant key binds.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                id="shortcuts-modal-close"
                aria-label="Close shortcuts dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1" id="shortcuts-modal-list">
              {categories.map((category) => (
                <div key={category.title} className="space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800/60 pb-2">
                    {category.title}
                  </h4>
                  
                  <div className="space-y-2.5">
                    {category.shortcuts.map((shortcut) => (
                      <div 
                        key={shortcut.desc} 
                        className="flex items-center justify-between text-xs sm:text-sm gap-4"
                      >
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {shortcut.desc}
                        </span>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {shortcut.keys.map((key) => {
                            let renderKey = key;
                            if (key === 'Ctrl' && isMac) {
                              renderKey = '⌘';
                            }
                            return (
                              <kbd 
                                key={key}
                                className="px-1.5 py-1 text-[10px] font-bold font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-2xs"
                              >
                                {renderKey}
                              </kbd>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer notice */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/60 text-[10px] text-gray-400 dark:text-gray-500 text-center">
              Make sure typing focus is outside the text area when running formatting shortcuts.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
