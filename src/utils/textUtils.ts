import { TextStats, WordFrequency } from '../types';

// Stop words to filter out from the "Most Frequent Words" analytic to make it smart and premium
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'is', 'are', 'was', 'were', 'be', 'been', 'am', 'it', 'its', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'they', 'we', 'us', 'him', 'her', 'them', 'my', 'your', 'his', 'their',
  'our', 'as', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
  'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

/**
 * Convert text to UPPERCASE
 */
export const convertToUppercase = (text: string): string => {
  return text.toUpperCase();
};

/**
 * Convert text to lowercase
 */
export const convertToLowercase = (text: string): string => {
  return text.toLowerCase();
};

/**
 * Capitalize each word in the text
 */
export const capitalizeEachWord = (text: string): string => {
  return text
    .split(/(\s+)/)
    .map((part) => {
      if (/^\s+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
};

/**
 * Capitalize sentences in the text
 */
export const capitalizeSentences = (text: string): string => {
  if (!text) return '';
  
  // Split by sentence boundary markers (period, question mark, exclamation, followed by spaces or end)
  // We keep the delimiters in the split array by wrapping in parenthesis
  const parts = text.split(/([.!?]\s+)/);
  
  let isNewSentence = true;
  
  return parts.map((part) => {
    if (!part) return '';
    // If it is a boundary punctuation, the next part starts a new sentence
    if (/[.!?]\s+/.test(part)) {
      isNewSentence = true;
      return part;
    }
    
    // Find the first non-whitespace letter and capitalize it
    if (isNewSentence) {
      const trimmed = part.trimStart();
      if (trimmed.length > 0) {
        const leadSpaces = part.length - trimmed.length;
        const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        isNewSentence = false;
        return part.slice(0, leadSpaces) + capitalized;
      }
    }
    
    return part;
  }).join('');
};

/**
 * Remove extra spaces (collapse multiple spaces/tabs into a single space, trim)
 */
export const removeExtraSpaces = (text: string): string => {
  return text.replace(/[ \t]+/g, ' ').trim();
};

/**
 * Remove empty lines (removes lines containing only spaces or tabs)
 */
export const removeEmptyLines = (text: string): string => {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .join('\n');
};

/**
 * Reverse the entire text characters
 */
export const reverseText = (text: string): string => {
  return [...text].reverse().join('');
};

/**
 * Sort lines alphabetically (ascending or descending)
 */
export const sortLinesAlphabetically = (text: string, order: 'asc' | 'desc' = 'asc'): string => {
  if (!text) return '';
  const lines = text.split(/\r?\n/);
  lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  if (order === 'desc') {
    lines.reverse();
  }
  return lines.join('\n');
};

/**
 * Extract word frequency counts, excluding standard stop words
 */
export const getWordFrequencies = (text: string, limit: number = 8): WordFrequency[] => {
  if (!text) return [];
  
  // Extract words (sequence of letters and single quotes)
  const words = text
    .toLowerCase()
    .match(/[a-z0-9']+/g) || [];
    
  const freqMap: Record<string, number> = {};
  
  words.forEach((word) => {
    // Filter out words that are purely numbers or very short or common stop words
    if (word.length > 1 && !STOP_WORDS.has(word) && !/^\d+$/.test(word)) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }
  });
  
  return Object.entries(freqMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit);
};

/**
 * Calculate reading grade level using the Coleman-Liau Index
 * CLI = 0.0588 * L - 0.296 * S - 15.8
 * L is the average number of letters per 100 words.
 * S is the average number of sentences per 100 words.
 */
export const calculateReadingLevel = (
  letterCount: number,
  wordCount: number,
  sentenceCount: number
): string => {
  if (wordCount === 0) return 'N/A';
  
  const L = (letterCount / wordCount) * 100;
  const S = (sentenceCount / wordCount) * 100;
  const cli = 0.0588 * L - 0.296 * S - 15.8;
  const grade = Math.round(cli);
  
  if (grade < 1) return 'Kindergarten';
  if (grade === 1) return '1st Grade (Very Easy)';
  if (grade === 2) return '2nd Grade (Very Easy)';
  if (grade === 3) return '3rd Grade (Easy)';
  if (grade === 4) return '4th Grade (Easy)';
  if (grade === 5) return '5th Grade (Easy)';
  if (grade === 6) return '6th Grade (Moderate)';
  if (grade === 7) return '7th Grade (Moderate)';
  if (grade === 8) return '8th Grade (Standard)';
  if (grade === 9) return '9th Grade (Standard)';
  if (grade === 10) return '10th Grade (Standard)';
  if (grade === 11) return '11th Grade (Advanced)';
  if (grade === 12) return '12th Grade (Advanced)';
  if (grade === 13 || grade === 14) return 'College Level (Complex)';
  return 'Graduate Level (Professional)';
};

/**
 * Compute comprehensive analytics on a text block
 */
export const calculateTextStats = (text: string): TextStats => {
  const charCountWithSpaces = text.length;
  const charCountWithoutSpaces = text.replace(/\s/g, '').length;
  
  // Match letters and digits for Coleman-Liau Index
  const lettersCount = (text.match(/[a-zA-Z0-9]/g) || []).length;
  
  // Extract words
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  // Extract sentences: split by punctuation marks followed by space or end
  const sentences = text
    .trim()
    .split(/[.!?]+(?:\s+|$)/)
    .filter(Boolean);
  const sentenceCount = sentences.length;
  
  // Extract paragraphs: split by newlines, filtering out empty segments
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const paragraphCount = paragraphs.length;
  
  // Average reading speed: 200 words per minute
  const readingTimeMinutes = wordCount / 200;
  
  // Average speaking speed: 130 words per minute
  const speakingTimeMinutes = wordCount / 130;
  
  // Reading Level
  const readingLevel = calculateReadingLevel(lettersCount, wordCount, sentenceCount);
  
  // Word Frequency
  const wordFrequencies = getWordFrequencies(text);
  
  return {
    wordCount,
    charCountWithSpaces,
    charCountWithoutSpaces,
    sentenceCount,
    paragraphCount,
    readingTimeMinutes,
    speakingTimeMinutes,
    readingLevel,
    wordFrequencies,
  };
};
