import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sun, Moon, Menu, X, FileText, Command, Keyboard } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenShortcuts: () => void;
}

export default function Navbar({ darkMode, toggleDarkMode, onOpenShortcuts }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Editor', href: '#text-editor-section' },
    { name: 'Analytics', href: '#analytics-section' },
    { name: 'Features', href: '#features-section' },
    { name: 'FAQ', href: '#faq-section' },
  ];

  return (
    <nav 
      id="main-navbar"
      className="sticky top-0 z-40 w-full border-b border-white/10 dark:border-white/10 bg-white/40 dark:bg-[#0c0e1a]/40 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none tracking-tight text-gray-900 dark:text-white">
                TextUtils<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mt-0.5">
                Workspace
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200"
                  id={`nav-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="h-5 w-px bg-gray-200 dark:bg-gray-800" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Keyboard Shortcuts Button */}
              <button
                onClick={onOpenShortcuts}
                className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors cursor-pointer"
                title="Keyboard Shortcuts"
                id="shortcuts-btn"
                aria-label="Keyboard Shortcuts"
              >
                <Keyboard className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors cursor-pointer relative overflow-hidden"
                id="theme-toggle-btn"
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ y: darkMode ? 30 : 0, opacity: darkMode ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ y: darkMode ? 0 : -30, opacity: darkMode ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <Moon className="w-5 h-5 text-indigo-400" />
                </motion.div>
              </button>

              {/* Launcher CTA */}
              <a
                href="#text-editor-section"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-lg shadow-sm shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer"
                id="navbar-cta"
              >
                Launch Editor
              </a>
            </div>
          </div>

          {/* Mobile Hamburguer button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle theme"
              id="theme-toggle-mobile"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 dark:border-white/10 bg-white/90 dark:bg-[#0c0e1a]/90 backdrop-blur-lg overflow-hidden"
            id="mobile-drawer"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  id={`nav-link-mobile-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-gray-100 dark:bg-gray-900 my-2" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenShortcuts();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer text-left"
                id="shortcuts-btn-mobile"
              >
                <Keyboard className="w-5 h-5 text-gray-500" />
                Keyboard Shortcuts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
