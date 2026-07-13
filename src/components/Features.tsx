import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Shield, HelpCircle, FileText, Mic, 
  Settings, KeyRound, Award, RefreshCw 
} from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: 'Real-Time Parsing',
      desc: 'Count words, characters, paragraph indices, reading levels, and speaking estimations in real-time as you type, without delays.',
      bgClass: 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
      title: 'Formatting Engines',
      desc: 'Instantly convert case structures, capitalize sentences, strip repetitive spacing, sorting arrays alphabetically, or mirror entire copies.',
      bgClass: 'bg-violet-50/50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300',
    },
    {
      icon: <Mic className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Speech Integration',
      desc: 'Unleash direct transcription via your microphone (Speech-to-Text) and vocalize paragraphs natively using adjustable browser voices (Text-to-Speech).',
      bgClass: 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
    },
    {
      icon: <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      title: 'Absolute Privacy',
      desc: '100% client-side computing. Your sensitive documents, passwords, or journals are never uploaded, stored, or processed on any remote server.',
      bgClass: 'bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300',
    },
    {
      icon: <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      title: 'Reading Assessments',
      desc: 'Stay informed on the linguistic complexity of your text with our automated grade index rating heuristic (Coleman-Liau calculation).',
      bgClass: 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
    },
    {
      icon: <KeyRound className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      title: 'Shortcuts & History',
      desc: 'Fully loaded keyboard shortcuts and a layered undo/redo history state buffer allow fast, safe editing iterations.',
      bgClass: 'bg-sky-50/50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300',
    }
  ];

  return (
    <section id="features-section" className="py-12 border-t border-gray-100 dark:border-gray-900 scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Why Content Authors Choose TextUtils Pro
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          Unlock a comprehensive, responsive workstation equipped with robust capabilities 
          designed to refine, measure, and verbalize your articles, codes, or scripts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((feat, idx) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="p-6 rounded-2xl glass-card hover:border-indigo-500/40 transition-all duration-300 group text-left"
            id={`feature-card-${idx}`}
          >
            <div className={`p-3 rounded-xl w-fit mb-5 transition-transform duration-300 group-hover:scale-110 ${feat.bgClass}`}>
              {feat.icon}
            </div>
            <h3 className="font-display font-bold text-base text-gray-900 dark:text-white mb-2">
              {feat.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {feat.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
