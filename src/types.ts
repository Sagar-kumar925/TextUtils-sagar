export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

export interface WordFrequency {
  word: string;
  count: number;
}

export interface TextStats {
  wordCount: number;
  charCountWithSpaces: number;
  charCountWithoutSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  readingLevel: string;
  wordFrequencies: WordFrequency[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
