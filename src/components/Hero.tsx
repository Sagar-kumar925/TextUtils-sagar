import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, Shield, FileText } from 'lucide-react';

export default function Hero() {
  return (
    <header 
      id="hero-header"
      className="relative overflow-hidden pt-12 pb-16 sm:pb-24 lg:pt-16 lg:pb-28 bg-radial from-indigo-50/50 via-transparent to-transparent dark:from-indigo-950/15 dark:via-transparent dark:to-transparent"
    >
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Spotlight Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 tracking-wide uppercase mb-6 glass-card shadow-lg"
          id="hero-spotlight-badge"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Next-Gen Character Analysis Engine</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-[1.1] mb-6"
          id="hero-main-title"
        >
          Manipulate, Format, and Analyze <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            Your Text Like a Pro
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8"
          id="hero-subtitle"
        >
          A premium online workstation to clean, convert, analyze, and vocalize your copy. 
          Enjoy advanced analytics, speech synthesis, dictionary frequencies, and 
          lightning-fast keyboard operations completely offline.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          id="hero-actions-container"
        >
          <a
            href="#text-editor-section"
            className="group flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 cursor-pointer w-full sm:w-auto justify-center"
            id="hero-cta-primary"
          >
            Start Analyzing Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#features-section"
            className="flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/80 border border-gray-200 dark:border-gray-800 transition-all duration-200 cursor-pointer w-full sm:w-auto"
            id="hero-cta-secondary"
          >
            Explore Features
          </a>
        </motion.div>

        {/* Value Proposition Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          id="hero-features-preview"
        >
          <div className="flex items-center gap-4 p-4 rounded-xl text-left glass-card hover:border-indigo-500/30 transition-all duration-350 shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Lightning Fast</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time instant calculation and layout updates.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl text-left glass-card hover:border-indigo-500/30 transition-all duration-350 shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">100% Client-Side Secure</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your text never leaves your device. Total privacy.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl text-left glass-card hover:border-indigo-500/30 transition-all duration-350 shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Pro Utilities</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Convert, reverse, speech dictate, and sort lines.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
