/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { SentenceItem, FontSize, ThemeMode } from '../types';
import { Play, Volume2, RotateCcw, BookOpen, Sparkles } from 'lucide-react';

interface ReaderViewProps {
  sentences: SentenceItem[];
  currentSentenceIndex: number;
  isPlaying: boolean;
  onJumpToSentence: (index: number) => void;
  onRepeatSentence: () => void;
  autoScroll: boolean;
  fontSize: FontSize;
  theme: ThemeMode;
  onOpenSampleModal: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  sentences,
  currentSentenceIndex,
  isPlaying,
  onJumpToSentence,
  onRepeatSentence,
  autoScroll,
  fontSize,
  theme,
  onOpenSampleModal,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeSentenceRef = useRef<HTMLSpanElement | null>(null);

  // Auto-scroll to active sentence
  useEffect(() => {
    if (autoScroll && activeSentenceRef.current && isPlaying) {
      activeSentenceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentSentenceIndex, autoScroll, isPlaying]);

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-loose',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  }[fontSize];

  if (sentences.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 shadow-xs">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
          読み上げるテキストがありません
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          左側の入力欄にテキストを入力するか、厳選された名作や早口言葉などのサンプル文章を読み込んでみましょう。
        </p>
        <button
          type="button"
          onClick={onOpenSampleModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>サンプル文章を試す</span>
        </button>
      </div>
    );
  }

  // Group sentences by paragraph index for natural book/article typesetting
  const paragraphs: SentenceItem[][] = [];
  sentences.forEach((sentence) => {
    if (!paragraphs[sentence.paragraphIndex]) {
      paragraphs[sentence.paragraphIndex] = [];
    }
    paragraphs[sentence.paragraphIndex].push(sentence);
  });

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-y-auto p-6 md:p-8 space-y-6 ${fontSizeClass}`}
    >
      {paragraphs.map((paraSentences, pIdx) => {
        if (!paraSentences || paraSentences.length === 0) return null;

        return (
          <p key={pIdx} className="tracking-wide text-slate-800 dark:text-slate-200">
            {paraSentences.map((sentence) => {
              const isActive = sentence.id === currentSentenceIndex;
              const isPast = sentence.id < currentSentenceIndex;

              let highlightStyles = '';
              if (isActive) {
                if (theme === 'dark') {
                  highlightStyles = 'bg-blue-950/90 text-blue-200 border border-blue-500/60 shadow-sm rounded-md px-1.5 py-0.5 sentence-active-pulse';
                } else if (theme === 'sepia') {
                  highlightStyles = 'bg-amber-200/80 text-amber-950 border border-amber-400/80 shadow-xs rounded-md px-1.5 py-0.5';
                } else {
                  highlightStyles = 'bg-blue-100 text-blue-950 border border-blue-300 shadow-xs rounded-md px-1.5 py-0.5 sentence-active-pulse';
                }
              } else if (isPast) {
                highlightStyles = 'opacity-75 hover:opacity-100';
              }

              return (
                <span
                  key={sentence.id}
                  ref={isActive ? activeSentenceRef : null}
                  onClick={() => onJumpToSentence(sentence.id)}
                  title="クリックしてここから読み上げ"
                  className={`relative inline cursor-pointer transition-all duration-150 group rounded mx-0.5 my-0.5 ${highlightStyles} hover:underline decoration-blue-400/50 underline-offset-4`}
                >
                  {/* Subtle hover play hint icon */}
                  <span className="hidden group-hover:inline-block mr-1 align-middle text-blue-500">
                    <Play className="w-3 h-3 inline fill-current" />
                  </span>

                  {isActive && isPlaying && (
                    <span className="inline-block mr-1 align-middle text-blue-600 dark:text-blue-400">
                      <Volume2 className="w-3.5 h-3.5 inline animate-pulse" />
                    </span>
                  )}

                  <span>{sentence.text}</span>
                  {sentence.text.endsWith('。') || sentence.text.endsWith('！') || sentence.text.endsWith('？') ? ' ' : ''}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};
