import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Hash, AlignLeft, BookOpen, Volume2, 
  Award, TrendingUp, Sparkles, Scale, Columns 
} from 'lucide-react';
import { TextStats } from '../types';

interface StatsProps {
  stats: TextStats;
}

export default function Stats({ stats }: StatsProps) {
  // Format estimated durations elegantly
  const formatTime = (minutes: number) => {
    if (minutes === 0) return '0s';
    const totalSeconds = Math.round(minutes * 60);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  const metricCards = [
    {
      id: 'stat-words',
      label: 'Words',
      value: stats.wordCount.toLocaleString(),
      icon: <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      colorClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
    },
    {
      id: 'stat-chars-spaces',
      label: 'Characters (with spaces)',
      value: stats.charCountWithSpaces.toLocaleString(),
      icon: <Hash className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
      colorClass: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300',
    },
    {
      id: 'stat-chars-nospaces',
      label: 'Characters (no spaces)',
      value: stats.charCountWithoutSpaces.toLocaleString(),
      icon: <AlignLeft className="w-5 h-5 text-pink-600 dark:text-pink-400" />,
      colorClass: 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300',
    },
    {
      id: 'stat-sentences',
      label: 'Sentences',
      value: stats.sentenceCount.toLocaleString(),
      icon: <Columns className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      colorClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    },
    {
      id: 'stat-paragraphs',
      label: 'Paragraphs',
      value: stats.paragraphCount.toLocaleString(),
      icon: <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      colorClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300',
    },
  ];

  // Maximum count for frequency percentage bar sizing
  const maxFreqCount = stats.wordFrequencies.length > 0 ? stats.wordFrequencies[0].count : 1;

  return (
    <section id="analytics-section" className="space-y-8 scroll-mt-20">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          Real-Time Analytics Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Instant syntactic measurements and detailed copy assessments.
        </p>
      </div>

      {/* Grid of Key Numerical Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((card, idx) => (
          <motion.div
            key={card.id}
            id={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="p-5 rounded-2xl glass-card hover:border-indigo-500/35 transition-all duration-250 group flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${card.colorClass}`}>
                {card.icon}
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
                {card.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Speed & Complexity Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Estimated Pace */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-6 rounded-2xl glass-card flex flex-col justify-between"
          id="stat-reading-speaking"
        >
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <BookOpen className="w-4 h-4" />
              Speech & Reading Pace
            </h3>
            
            <div className="space-y-5">
              {/* Reading Time */}
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading Time</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {formatTime(stats.readingTimeMinutes)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, stats.wordCount / 5)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">Based on 200 WPM average.</span>
                </div>
              </div>

              {/* Speaking Time */}
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400 flex-shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Speaking Time</span>
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400 font-mono">
                      {formatTime(stats.speakingTimeMinutes)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-violet-600 dark:bg-violet-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, stats.wordCount / 3.25)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">Based on 130 WPM average.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Readability Score */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="p-6 rounded-2xl glass-card flex flex-col justify-between"
          id="stat-reading-level"
        >
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Award className="w-4 h-4" />
              Estimated Reading Level
            </h3>

            <div className="text-center py-4">
              <span className="text-xl sm:text-2xl font-bold font-display text-gray-800 dark:text-gray-100 block mb-2">
                {stats.readingLevel}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 px-4 max-w-[280px] mx-auto leading-relaxed">
                Calculated dynamically via the <span className="font-semibold text-indigo-500">Coleman-Liau grade rating index</span> based on average characters and sentence intervals.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>Accuracy Heuristic</span>
            <span className="font-semibold text-emerald-500">Optimized</span>
          </div>
        </motion.div>

        {/* Word Frequencies */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="p-6 rounded-2xl glass-panel-gradient flex flex-col justify-between"
          id="stat-word-frequencies"
        >
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Scale className="w-4 h-4" />
              Most Frequent Words
            </h3>

            {stats.wordFrequencies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Type or paste content to visualize keyword weights and occurrence distribution.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.wordFrequencies.map((freq, idx) => {
                  const percentage = Math.round((freq.count / maxFreqCount) * 100);
                  return (
                    <div key={freq.word} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                          {idx + 1}. {freq.word}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-sm bg-indigo-50 dark:bg-indigo-950/50 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          {freq.count}x
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1 overflow-hidden">
                        <div 
                          className="bg-indigo-500 dark:bg-indigo-400 h-1 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
