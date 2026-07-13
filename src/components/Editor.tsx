import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, ArrowDownAZ, ArrowUpAZ, Copy, Check, Trash2, 
  RotateCcw, RotateCw, FileDown, Clipboard, Mic, MicOff,
  Volume2, VolumeX, Play, Pause, Square, Search, RefreshCw, 
  BookOpen, Eye, HelpCircle, AlertCircle, Settings2, Sparkles, ChevronDown
} from 'lucide-react';
import { 
  convertToUppercase, convertToLowercase, capitalizeEachWord, 
  capitalizeSentences, removeExtraSpaces, removeEmptyLines, 
  reverseText, sortLinesAlphabetically 
} from '../utils/textUtils';

interface EditorProps {
  text: string;
  setText: (t: string) => void;
  updateTextWithHistory: (t: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  historyIndex: number;
  historyLength: number;
  addToast: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onOpenShortcuts: () => void;
}

export default function Editor({
  text,
  setText,
  updateTextWithHistory,
  handleUndo,
  handleRedo,
  historyIndex,
  historyLength,
  addToast,
  onOpenShortcuts
}: EditorProps) {
  // Clipboard animation state
  const [copied, setCopied] = useState(false);

  // Find & Replace state
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);

  // Text-To-Speech (TTS) state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [showTTSControls, setShowTTSControls] = useState(false);

  // Speech-To-Text (STT) state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Live Reader Preview preferences
  const [previewFontFamily, setPreviewFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [previewFontSize, setPreviewFontSize] = useState<number>(15); // in pixels
  const [previewLineHeight, setPreviewLineHeight] = useState<'normal' | 'relaxed' | 'loose'>('relaxed');

  // Input ref to support keyboard shortcut focus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load available Speech Synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        // Sort voices alphabetically for cleaner choice
        const sortedVoices = [...availableVoices].sort((a, b) => a.name.localeCompare(b.name));
        setVoices(sortedVoices);
        
        // Default to a natural sounding English voice if possible, else the first available
        if (sortedVoices.length > 0) {
          const defaultVoice = sortedVoices.find(v => v.lang.includes('en') && v.name.includes('Google')) || 
                               sortedVoices.find(v => v.lang.includes('en')) || 
                               sortedVoices[0];
          setSelectedVoice(defaultVoice);
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Sync speak cancel on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Text utilities action handler wrapper
  const applyUtility = (fn: (t: string) => string, actionName: string) => {
    if (!text) {
      addToast('Workspace is empty! Enter some text first.', 'warning');
      return;
    }
    const result = fn(text);
    if (result === text) {
      addToast(`Text is already in requested format`, 'info');
      return;
    }
    updateTextWithHistory(result);
    addToast(`${actionName} applied successfully`, 'success');
  };

  // Clipboard Copier
  const handleCopy = async () => {
    if (!text) {
      addToast('No text available to copy', 'warning');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      addToast('Copied to Clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast('Unable to copy text automatically', 'error');
    }
  };

  // Clipboard Paste
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        updateTextWithHistory(text ? text + '\n' + clipboardText : clipboardText);
        addToast('Appended text from Clipboard', 'success');
      } else {
        addToast('Clipboard contains no text data', 'warning');
      }
    } catch (err) {
      addToast('Clipboard permissions denied. Try using keyboard shortcut.', 'error');
    }
  };

  // Download .txt
  const handleDownload = () => {
    if (!text) {
      addToast('No text available to download', 'warning');
      return;
    }
    try {
      const element = document.createElement('a');
      const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `text_utils_pro_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      addToast('Downloaded .txt file successfully', 'success');
    } catch (e) {
      addToast('Failed to trigger file download', 'error');
    }
  };

  // Clear workspace
  const handleClear = () => {
    if (!text) return;
    updateTextWithHistory('');
    addToast('Workspace cleared successfully', 'info');
  };

  // Find & Replace action
  const handleReplaceAll = () => {
    if (!findText) {
      addToast('Please enter a query search value in "Find"', 'warning');
      return;
    }

    // Escape regex characters to prevent pattern crashes
    const escaped = findText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    const matchesCount = (text.match(regex) || []).length;

    if (matchesCount === 0) {
      addToast(`No matches found for "${findText}"`, 'info');
      return;
    }

    const result = text.replace(regex, replaceText);
    updateTextWithHistory(result);
    addToast(`Successfully replaced ${matchesCount} occurrence(s)`, 'success');
    setFindText('');
    setReplaceText('');
    setShowFindReplace(false);
  };

  // Text-To-Speech (TTS) Handlers
  const handleStartSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      addToast('Speech Synthesis is not supported in this browser.', 'error');
      return;
    }

    if (!text) {
      addToast('No text to speak', 'warning');
      return;
    }

    window.speechSynthesis.cancel(); // Stop active voices

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsSpeechPaused(false);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.error('Speech synthesis error', e);
        setIsSpeaking(false);
        setIsSpeechPaused(false);
        addToast('Voice generation failed', 'error');
      }
    };

    setIsSpeaking(true);
    setIsSpeechPaused(false);
    window.speechSynthesis.speak(utterance);
    addToast('Speech vocalization started', 'info');
  };

  const handlePauseSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking && !isSpeechPaused) {
        window.speechSynthesis.pause();
        setIsSpeechPaused(true);
        addToast('Speech paused', 'info');
      } else if (isSpeaking && isSpeechPaused) {
        window.speechSynthesis.resume();
        setIsSpeechPaused(false);
        addToast('Speech resumed', 'info');
      }
    }
  };

  const handleStopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsSpeechPaused(false);
      addToast('Speech playback halted', 'info');
    }
  };

  // Speech-To-Text (STT) Dictation
  const handleToggleDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast('Speech Dictation is not supported by your current browser. Try Chrome/Edge.', 'error');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      addToast('Microphone live. Start dictating now...', 'success');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      if (transcript) {
        // Safe spacing append
        const appended = text ? (text.endsWith(' ') ? text + transcript : text + ' ' + transcript) : transcript;
        updateTextWithHistory(appended);
        addToast('Words transcribed', 'info');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Recognition error', event);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        addToast('Microphone access blocked. Enable permissions in your browser URL bar.', 'error');
      } else {
        addToast(`Dictation issue: ${event.error}`, 'error');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      addToast('Failed to connect microphone', 'error');
    }
  };

  // Interactive Live Reader typography classes
  const getPreviewFontClass = () => {
    switch (previewFontFamily) {
      case 'serif':
        return 'font-serif Georgia, ui-serif, serif';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  const getPreviewLineHeightClass = () => {
    switch (previewLineHeight) {
      case 'loose':
        return 'leading-loose';
      case 'normal':
        return 'leading-normal';
      case 'relaxed':
      default:
        return 'leading-relaxed';
    }
  };

  return (
    <section id="text-editor-section" className="space-y-8 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Workspace & Speech Interfaces (7 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl glass-panel overflow-hidden">
            
            {/* Editor Workspace Header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-950/20">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Live Work Surface
                </span>
                {historyLength > 1 && (
                  <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">
                    State {historyIndex + 1}/{historyLength}
                  </span>
                )}
              </div>
              
              {/* Core Workspace Actions */}
              <div className="flex items-center gap-1">
                {/* Undo */}
                <button
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  title="Undo (Ctrl+Z)"
                  id="editor-btn-undo"
                  aria-label="Undo last action"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {/* Redo */}
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= historyLength - 1}
                  className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  title="Redo (Ctrl+Y)"
                  id="editor-btn-redo"
                  aria-label="Redo action"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

                {/* Paste */}
                <button
                  onClick={handlePaste}
                  className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  title="Paste from clipboard"
                  id="editor-btn-paste"
                  aria-label="Paste text from clipboard"
                >
                  <Clipboard className="w-4 h-4" />
                </button>

                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    copied 
                      ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' 
                      : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title="Copy to clipboard"
                  id="editor-btn-copy"
                  aria-label="Copy entire text to clipboard"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  title="Download as .txt"
                  id="editor-btn-download"
                  aria-label="Download workspace content as plain text file"
                >
                  <FileDown className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

                {/* Clear */}
                <button
                  onClick={handleClear}
                  disabled={!text}
                  className="p-2 rounded-lg text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  title="Clear text"
                  id="editor-btn-clear"
                  aria-label="Clear all content from text area"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Core Textarea Workspace */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                id="main-text-area"
                className="w-full min-h-[380px] p-6 text-gray-800 dark:text-gray-100 bg-transparent border-0 outline-hidden focus:ring-0 font-sans text-base leading-relaxed resize-y placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Type or paste your text content here, then apply converted formatting or read analytics..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              
              {/* Floating Character & Line Gauge */}
              <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded bg-gray-100/80 dark:bg-gray-800/85 text-[10px] font-mono text-gray-500 dark:text-gray-400 select-none">
                {text.length.toLocaleString()} Chars
              </div>
            </div>
          </div>

          {/* Interactive Speech Services Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Speech Dictation (STT) Widget */}
            <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-indigo-500" />
                    Speech Dictation
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Transcribe your voice into high fidelity text.
                  </p>
                </div>

                {isListening && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              <div>
                <button
                  onClick={handleToggleDictation}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isListening 
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-300' 
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-300'
                  }`}
                  id="dictation-btn"
                  aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 animate-bounce" />
                      Dictate via Voice
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Vocalization Synthesis (TTS) Widget */}
            <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-violet-500" />
                    Text Vocalization
                  </h4>
                  
                  {/* TTS Settings Toggle */}
                  <button 
                    onClick={() => setShowTTSControls(!showTTSControls)}
                    className={`p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors ${showTTSControls ? 'text-indigo-500 bg-gray-100 dark:bg-gray-800' : ''}`}
                    title="Voice Configurations"
                    id="tts-settings-toggle"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  Convert typed paragraphs into natural sounding audio.
                </p>

                {/* Extensible TTS Controls Panel */}
                <AnimatePresence>
                  {showTTSControls && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 mb-4 pt-2 border-t border-gray-100 dark:border-gray-800/60 overflow-hidden"
                      id="tts-settings-panel"
                    >
                      {/* Voice Select */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Pronunciation Voice
                        </label>
                        {voices.length === 0 ? (
                          <span className="text-[10px] text-gray-400 italic block">No audio drivers loaded.</span>
                        ) : (
                          <div className="relative">
                            <select
                              value={selectedVoice?.name || ''}
                              onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value) || null)}
                              className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-hidden cursor-pointer appearance-none pr-8"
                              id="tts-voice-select"
                            >
                              {voices.map((v) => (
                                <option key={v.name} value={v.name}>
                                  {v.name} ({v.lang})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                          </div>
                        )}
                      </div>

                      {/* Speed & Pitch Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Speed</span>
                            <span className="text-[10px] text-indigo-500 font-mono font-bold">{speechRate}x</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="2" 
                            step="0.1" 
                            value={speechRate}
                            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                            className="w-full accent-indigo-600 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pitch</span>
                            <span className="text-[10px] text-violet-500 font-mono font-bold">{speechPitch}x</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="1.5" 
                            step="0.1" 
                            value={speechPitch}
                            onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                            className="w-full accent-violet-600 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TTS Triggers */}
              <div className="flex gap-2">
                {isSpeaking ? (
                  <>
                    <button
                      onClick={handlePauseSpeaking}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      id="tts-pause-btn"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      {isSpeechPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={handleStopSpeaking}
                      className="p-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-300 flex items-center justify-center cursor-pointer"
                      id="tts-stop-btn"
                    >
                      <Square className="w-3.5 h-3.5 fill-rose-600 dark:fill-rose-400" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartSpeaking}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/30 dark:text-violet-300 flex items-center justify-center gap-2 cursor-pointer"
                    id="tts-speak-btn"
                  >
                    <Play className="w-4 h-4 fill-violet-700 dark:fill-violet-300" />
                    Speak Paragraphs
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Formatting Utilities Box & Find/Replace (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl glass-panel">
            <h3 className="font-display font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 mb-1">
              <Type className="w-5 h-5 text-indigo-500" />
              Formatting Utilities
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
              Transform and filter text layers in single operations.
            </p>

            <div className="space-y-3" id="format-utilities-list">
              
              {/* Capitalization triggers */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyUtility(convertToUppercase, 'Uppercase')}
                  className="p-3 text-xs font-medium text-left rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                  id="util-uppercase"
                >
                  <span className="block font-bold text-indigo-600 dark:text-indigo-400">UPPERCASE</span>
                  <span className="text-[10px] text-gray-400 mt-1 block">CONVERT UPPER</span>
                </button>

                <button
                  onClick={() => applyUtility(convertToLowercase, 'Lowercase')}
                  className="p-3 text-xs font-medium text-left rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                  id="util-lowercase"
                >
                  <span className="block font-bold text-violet-600 dark:text-violet-400">lowercase</span>
                  <span className="text-[10px] text-gray-400 mt-1 block">convert lower</span>
                </button>
              </div>

              <button
                onClick={() => applyUtility(capitalizeEachWord, 'Capitalize Words')}
                className="w-full p-3 text-xs font-medium text-left rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer shadow-2xs hover:shadow-xs transition-all flex justify-between items-center"
                id="util-cap-words"
              >
                <div>
                  <span className="block font-bold text-gray-700 dark:text-gray-300">Capitalize Each Word</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Title Case Format</span>
                </div>
                <span className="text-xs text-indigo-500 font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg">Aa Bb</span>
              </button>

              <button
                onClick={() => applyUtility(capitalizeSentences, 'Capitalize Sentences')}
                className="w-full p-3 text-xs font-medium text-left rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer shadow-2xs hover:shadow-xs transition-all flex justify-between items-center"
                id="util-cap-sentences"
              >
                <div>
                  <span className="block font-bold text-gray-700 dark:text-gray-300">Capitalize Sentences</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Capitalize sentence starts</span>
                </div>
                <span className="text-xs text-violet-500 font-bold px-2 py-1 bg-violet-50 dark:bg-violet-950/40 rounded-lg">Aa. bb</span>
              </button>

              <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-2" />

              {/* Filtering / Cleaning Triggers */}
              <button
                onClick={() => applyUtility(removeExtraSpaces, 'Remove Extra Spaces')}
                className="w-full p-3 text-xs font-medium text-left rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                id="util-strip-spaces"
              >
                <span className="block font-bold text-gray-700 dark:text-gray-300">Collapse Extra Spaces</span>
                <span className="text-[10px] text-gray-400 mt-1 block">Merge whitespace gaps into single intervals</span>
              </button>

              <button
                onClick={() => applyUtility(removeEmptyLines, 'Remove Empty Lines')}
                className="w-full p-3 text-xs font-medium text-left rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                id="util-strip-lines"
              >
                <span className="block font-bold text-gray-700 dark:text-gray-300">Strip Empty Lines</span>
                <span className="text-[10px] text-gray-400 mt-1 block">Exclude spacing-only breaks from paragraph listing</span>
              </button>

              <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-2" />

              {/* Advanced sorting */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyUtility((t) => sortLinesAlphabetically(t, 'asc'), 'Sort Lines Ascending')}
                  className="p-3 text-xs font-medium text-left rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer shadow-2xs hover:shadow-xs transition-all flex items-center justify-between"
                  id="util-sort-asc"
                >
                  <div>
                    <span className="block font-bold text-gray-700 dark:text-gray-300">Sort Lines</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">Ascending</span>
                  </div>
                  <ArrowDownAZ className="w-4 h-4 text-indigo-500" />
                </button>

                <button
                  onClick={() => applyUtility((t) => sortLinesAlphabetically(t, 'desc'), 'Sort Lines Descending')}
                  className="p-3 text-xs font-medium text-left rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer shadow-2xs hover:shadow-xs transition-all flex items-center justify-between"
                  id="util-sort-desc"
                >
                  <div>
                    <span className="block font-bold text-gray-700 dark:text-gray-300">Sort Lines</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">Descending</span>
                  </div>
                  <ArrowUpAZ className="w-4 h-4 text-violet-500" />
                </button>
              </div>

              <button
                onClick={() => applyUtility(reverseText, 'Reverse Text')}
                className="w-full p-3 text-xs font-medium text-left rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                id="util-reverse"
              >
                <span className="block font-bold text-gray-700 dark:text-gray-300">Mirror Entire Copy</span>
                <span className="text-[10px] text-gray-400 mt-1 block">Flip entire character array backwards</span>
              </button>
            </div>
          </div>

          {/* Interactive Find & Replace Drawer */}
          <div className="p-6 rounded-2xl glass-panel">
            <button
              onClick={() => setShowFindReplace(!showFindReplace)}
              className="w-full flex items-center justify-between cursor-pointer"
              id="find-replace-toggle"
            >
              <h3 className="font-display font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-500" />
                Find & Replace
              </h3>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showFindReplace ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showFindReplace && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/60 overflow-hidden"
                  id="find-replace-panel"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                      Find word or phrase
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 focus:outline-hidden focus:border-indigo-500"
                      placeholder="Enter search query..."
                      value={findText}
                      onChange={(e) => setFindText(e.target.value)}
                      id="find-input-field"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                      Replace with
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 focus:outline-hidden focus:border-indigo-500"
                      placeholder="Enter replacement word..."
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      id="replace-input-field"
                    />
                  </div>

                  <button
                    onClick={handleReplaceAll}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-indigo-500/10 transition-colors"
                    id="replace-submit-btn"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Replace All Matches
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* COMPONENT: Live Premium Reader Preview */}
      <div id="live-preview-box" className="p-6 sm:p-8 rounded-2xl glass-panel">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800/60 pb-5 mb-5">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">
                Live Reader Preview
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                A customized typesetting surface designed for copyediting and readability checks.
              </p>
            </div>
          </div>

          {/* Typography configuration bar */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Font Family Selection */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-1">
              <button
                onClick={() => setPreviewFontFamily('sans')}
                className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${previewFontFamily === 'sans' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
                id="preview-font-sans"
              >
                SANS
              </button>
              <button
                onClick={() => setPreviewFontFamily('serif')}
                className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${previewFontFamily === 'serif' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
                id="preview-font-serif"
              >
                SERIF
              </button>
              <button
                onClick={() => setPreviewFontFamily('mono')}
                className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${previewFontFamily === 'mono' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
                id="preview-font-mono"
              >
                MONO
              </button>
            </div>

            {/* Font Sizing controls */}
            <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-1">
              <button
                onClick={() => setPreviewFontSize(Math.max(12, previewFontSize - 1))}
                className="px-2 py-1 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors"
                title="Decrease font size"
                id="preview-size-dec"
              >
                A-
              </button>
              <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 px-1">
                {previewFontSize}px
              </span>
              <button
                onClick={() => setPreviewFontSize(Math.min(24, previewFontSize + 1))}
                className="px-2 py-1 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors"
                title="Increase font size"
                id="preview-size-inc"
              >
                A+
              </button>
            </div>

            {/* Line Height Selector */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-1">
              <button
                onClick={() => setPreviewLineHeight('normal')}
                className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${previewLineHeight === 'normal' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
                id="preview-height-normal"
              >
                Tight
              </button>
              <button
                onClick={() => setPreviewLineHeight('relaxed')}
                className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${previewLineHeight === 'relaxed' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
                id="preview-height-relaxed"
              >
                Relaxed
              </button>
              <button
                onClick={() => setPreviewLineHeight('loose')}
                className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${previewLineHeight === 'loose' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
                id="preview-height-loose"
              >
                Loose
              </button>
            </div>

          </div>
        </div>

        {/* Content Preview Stage */}
        <div 
          className="rounded-xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 p-6 md:p-8 min-h-[140px] max-h-[420px] overflow-y-auto select-text scrollbar-thin"
          id="preview-content-box"
        >
          {text ? (
            <div 
              className={`${getPreviewFontClass()} ${getPreviewLineHeightClass()} text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words`}
              style={{ fontSize: `${previewFontSize}px` }}
            >
              {text}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-gray-300 dark:text-gray-700 animate-pulse" />
              <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[320px]">
                Preview panel is empty. Add text in the live workspace above to see it formatted beautifully for reading.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
