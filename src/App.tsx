import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Editor from './components/Editor';
import Stats from './components/Stats';
import Features from './components/Features';
import Faq from './components/Faq';
import Footer from './components/Footer';
import Toaster from './components/Toaster';
import ShortcutsModal from './components/ShortcutsModal';
import { Toast, TextStats } from './types';
import { calculateTextStats } from './utils/textUtils';
import { 
  convertToUppercase, convertToLowercase, capitalizeEachWord, 
  capitalizeSentences, removeExtraSpaces, reverseText 
} from './utils/textUtils';

// Starting sample text that looks high-fidelity and professional on initial render
const INITIAL_TEXT = `Welcome to TextUtils Pro workspace!

This is a premium online sandbox environment constructed to help writers, developers, and content creators analyze, clean, and format text copy instantly.

Try editing these paragraphs or paste your own documents to explore our real-time capabilities. Enjoy offline-first privacy where your characters never leave your machine!`;

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('textutils_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Modal & Notification states
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Text state & undo/redo history buffer
  const [text, setText] = useState<string>(INITIAL_TEXT);
  const [history, setHistory] = useState<string[]>([INITIAL_TEXT]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Manage refs for stable event-listeners binding
  const textRef = useRef(text);
  const historyRef = useRef({ index: historyIndex, stack: history });

  // Sync references with active states
  useEffect(() => {
    textRef.current = text;
    historyRef.current = { index: historyIndex, stack: history };
  }, [text, historyIndex, history]);

  // Sync dark mode class with DOM element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('textutils_dark_mode', String(darkMode));
  }, [darkMode]);

  // Toast notifier helper
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Update text with history accumulation (debouncing automatic inputs is handled by state logic)
  const updateTextWithHistory = useCallback((newText: string) => {
    if (newText === textRef.current) return;

    const currentStack = historyRef.current.stack;
    const currentIndex = historyRef.current.index;

    // Prune the redo-stack forward if we make a new direct modification
    const prunedHistory = currentStack.slice(0, currentIndex + 1);
    const updatedHistory = [...prunedHistory, newText];

    // Throttle history size to avoid bloating memory (limit to 100 history frames)
    if (updatedHistory.length > 100) {
      updatedHistory.shift();
    }

    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setText(newText);
  }, []);

  // Sync typing updates - we update text state live, but debounce history push
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTypingText = useCallback((newValue: string) => {
    setText(newValue);

    // Clear active typing timers
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    // Debounce history recording: Wait 900ms after user stops typing to record history frame
    // Exception: push immediately if user types space or newline to preserve word landmarks
    const isLandmark = newValue.endsWith(' ') || newValue.endsWith('\n') || newValue.length === 0;
    
    if (isLandmark) {
      updateTextWithHistory(newValue);
    } else {
      typingTimerRef.current = setTimeout(() => {
        updateTextWithHistory(newValue);
      }, 900);
    }
  }, [updateTextWithHistory]);

  // Undo trigger
  const handleUndo = useCallback(() => {
    const currentIndex = historyRef.current.index;
    const currentStack = historyRef.current.stack;

    if (currentIndex > 0) {
      const nextIndex = currentIndex - 1;
      setHistoryIndex(nextIndex);
      setText(currentStack[nextIndex]);
      addToast('Undone successfully', 'info');
    } else {
      addToast('No prior actions in history log to undo', 'warning');
    }
  }, [addToast]);

  // Redo trigger
  const handleRedo = useCallback(() => {
    const currentIndex = historyRef.current.index;
    const currentStack = historyRef.current.stack;

    if (currentIndex < currentStack.length - 1) {
      const nextIndex = currentIndex + 1;
      setHistoryIndex(nextIndex);
      setText(currentStack[nextIndex]);
      addToast('Redone successfully', 'info');
    } else {
      addToast('You are at the latest action state', 'warning');
    }
  }, [addToast]);

  // Global Keyboard Shortcuts bindings
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const isAlt = e.altKey;
      const isShift = e.shiftKey;
      
      const target = e.target as HTMLElement;
      const isFieldActive = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // 1. Undo Shortcut (Ctrl+Z)
      if (isCmdOrCtrl && e.key.toLowerCase() === 'z' && !isShift) {
        // Prevent default browser undo inside textareas only if we manage our own history stack
        e.preventDefault();
        handleUndo();
        return;
      }

      // 2. Redo Shortcut (Ctrl+Y)
      if (isCmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      // 3. Alt Actions: format utility bindings (only active when typing fields are not focused to avoid interference)
      if (isCmdOrCtrl && isAlt) {
        const key = e.key.toLowerCase();
        
        switch (key) {
          case 'u': // Uppercase
            e.preventDefault();
            const upper = convertToUppercase(textRef.current);
            if (upper !== textRef.current) {
              updateTextWithHistory(upper);
              addToast('Converted to UPPERCASE', 'success');
            }
            break;
          case 'l': // Lowercase
            e.preventDefault();
            const lower = convertToLowercase(textRef.current);
            if (lower !== textRef.current) {
              updateTextWithHistory(lower);
              addToast('Converted to lowercase', 'success');
            }
            break;
          case 'w': // Capitalize Words
            e.preventDefault();
            const capWords = capitalizeEachWord(textRef.current);
            if (capWords !== textRef.current) {
              updateTextWithHistory(capWords);
              addToast('Capitalized each word', 'success');
            }
            break;
          case 's': // Capitalize Sentences
            e.preventDefault();
            const capSents = capitalizeSentences(textRef.current);
            if (capSents !== textRef.current) {
              updateTextWithHistory(capSents);
              addToast('Capitalized sentences', 'success');
            }
            break;
          case 'x': // Strip Spaces
            e.preventDefault();
            const stripped = removeExtraSpaces(textRef.current);
            if (stripped !== textRef.current) {
              updateTextWithHistory(stripped);
              addToast('Merged extra spaces', 'success');
            }
            break;
          case 'r': // Reverse text
            e.preventDefault();
            const reversed = reverseText(textRef.current);
            if (reversed !== textRef.current) {
              updateTextWithHistory(reversed);
              addToast('Reversed copy', 'success');
            }
            break;
          case 'd': // Download txt
            e.preventDefault();
            const element = document.createElement('a');
            const file = new Blob([textRef.current], { type: 'text/plain;charset=utf-8' });
            element.href = URL.createObjectURL(file);
            element.download = `text_utils_pro_${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            addToast('Downloaded .txt file', 'success');
            break;
          case 'k': // Clear
            e.preventDefault();
            if (textRef.current) {
              updateTextWithHistory('');
              addToast('Cleared workspace', 'info');
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [handleUndo, handleRedo, updateTextWithHistory, addToast]);

  // Compute stats live
  const textStats: TextStats = calculateTextStats(text);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 text-gray-800 dark:bg-[#0c0e1a] dark:text-slate-200 transition-colors duration-300">
      
      {/* Dynamic Animated Mesh Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/25 blur-[130px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-rose-500/8 dark:bg-rose-600/15 blur-[130px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/8 dark:bg-blue-500/15 blur-[110px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Premium Navbar */}
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={() => setDarkMode(!darkMode)} 
          onOpenShortcuts={() => setShortcutsOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 w-full flex-1">
          {/* Dynamic Hero Area */}
          <Hero />

          {/* Text Statistics Dashboard */}
          <Stats stats={textStats} />

          {/* Interactive Workspace (Editor, Tools, Audio & Preview) */}
          <Editor 
            text={text}
            setText={handleTypingText}
            updateTextWithHistory={updateTextWithHistory}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            historyIndex={historyIndex}
            historyLength={history.length}
            addToast={addToast}
            onOpenShortcuts={() => setShortcutsOpen(true)}
          />

          {/* Modern Bento Feature Grid */}
          <Features />

          {/* Interactive Accordion FAQs */}
          <Faq />
        </main>

        {/* Styled Footer */}
        <Footer />
      </div>

      {/* Modal overlays */}
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {/* Toast Alert stack */}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
