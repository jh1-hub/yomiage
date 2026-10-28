/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SentenceItem {
  id: number;
  text: string;
  startIndex: number;
  endIndex: number;
  paragraphIndex: number;
  isBreak?: boolean;
}

export interface VoiceSettings {
  voiceURI: string;
  rate: number;      // 0.5 - 3.0
  pitch: number;     // 0.5 - 1.5
  volume: number;    // 0.0 - 1.0
  pauseDurationMs: number; // 0 - 600ms (natural breath pause between sentences)
  voiceStyle: 'natural' | 'narration' | 'announcement' | 'speed' | 'custom';
  autoScroll: boolean;
  repeatMode: 'none' | 'sentence' | 'all';
  sleepTimerMinutes: number | null; // minutes or null
}

export interface PronunciationRule {
  id: string;
  pattern: string;
  replacement: string;
  enabled: boolean;
}

export interface SavedTextItem {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  charCount: number;
  lastSentenceIndex?: number;
}

export type ThemeMode = 'light' | 'dark' | 'sepia';
export type ViewMode = 'split' | 'reader' | 'editor';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
