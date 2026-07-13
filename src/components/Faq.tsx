import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // Open first by default

  const faqItems: FAQItem[] = [
    {
      question: 'Is TextUtils Pro safe to use with sensitive text?',
      answer: 'Absolutely. TextUtils Pro is engineered as a fully client-side application. Every single transformation, calculation, transcription, or voice rendering happens strictly inside your local browser sandbox. Your inputs are never relayed, stored, or processed on any external server, ensuring absolute privacy.',
    },
    {
      question: 'How is the Reading Level computed?',
      answer: 'We calculate reading levels dynamically using the Coleman-Liau Index (CLI), a recognized linguistic assessment heuristic. It compiles the ratios of alphabetic character weights to word counts, and word counts to total sentence boundaries. This yields a reliable grade-level metric representing content readability.',
    },
    {
      question: 'Why is Word Frequency showing only certain terms?',
      answer: 'Our dictionary frequency engine utilizes an intelligent "content-word" filter. It automatically suppresses common syntactic "stop words" (such as "the", "and", "a", "of", "to", "under", "which") as well as lone digits and single characters. This provides clean, meaningful keyword prominence metrics for SEO optimization.',
    },
    {
      question: 'Does Text-to-Speech support different voices and accents?',
      answer: 'Yes! The vocalization engine directly polls your operating system\'s native speech synthesizers via the Web Speech API. Clicking the configurations gear on the Vocalize widget displays a selector listing available accents and voice actors pre-installed on your current browser and device.',
    },
    {
      question: 'How do I use Keyboard Shortcuts?',
      answer: 'TextUtils Pro comes loaded with productivity shortcuts. You can view the complete list by clicking the keyboard icon in the upper navbar. Examples include Ctrl+Alt+U to instantly convert text to UPPERCASE, Ctrl+Alt+L for lowercase, and Ctrl+Z/Y for infinite state history undo/redo operations.',
    }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-12 border-t border-gray-100 dark:border-gray-900 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Intro */}
        <div className="lg:col-span-4 text-left space-y-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg w-fit">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Need clarity on privacy parameters, calculations, or features? Explore quick answers regarding how our client-side workbench operates.
          </p>
        </div>

        {/* Accordions */}
        <div className="lg:col-span-8 space-y-3" id="faq-accordions-container">
          {faqItems.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="rounded-xl glass-card overflow-hidden"
                id={`faq-item-${idx}`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-950/20 cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                  id={`faq-toggle-${idx}`}
                >
                  <span>{item.question}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/20 dark:bg-gray-950/10"
                      id={`faq-answer-wrapper-${idx}`}
                    >
                      <div className="p-5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed select-text">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
