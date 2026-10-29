/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { naturalizeJapaneseText } from '../utils/speech';
import {
  Trash2,
  Undo2,
  Wand2,
  Volume2,
  Square,
  CornerDownLeft
} from 'lucide-react';

interface EditorViewProps {
  text: string;
  onChangeText: (text: string) => void;
  rate: number;
  onOpenSampleModal: () => void;
  onSpeakNow: () => void;
  onStop: () => void;
  isPlaying: boolean;
}

// 5 Essential Quick Conversation Phrases
const QUICK_PHRASES = [
  'はい',
  'いいえ',
  '少し待ってください',
  'ありがとうございます',
  '大丈夫です'
];

export const EditorView: React.FC<EditorViewProps> = ({
  text,
  onChangeText,
  onOpenSampleModal,
  onSpeakNow,
  onStop,
  isPlaying,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [clearedTextBackup, setClearedTextBackup] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const [speakOnEnter, setSpeakOnEnter] = useState<boolean>(() => {
    return localStorage.getItem('koeyomi_speak_on_enter') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('koeyomi_speak_on_enter', String(speakOnEnter));
  }, [speakOnEnter]);

  const showBriefToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleImmediateClear = () => {
    if (!text) {
      textareaRef.current?.focus();
      return;
    }
    const previous = text;
    setClearedTextBackup(previous);
    onChangeText('');
    showBriefToast('消去しました');

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 10);
  };

  const handleUndoClear = () => {
    if (clearedTextBackup !== null) {
      onChangeText(clearedTextBackup);
      setClearedTextBackup(null);
      showBriefToast('元に戻しました');
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    }
  };

  const handleTriggerSpeak = () => {
    if (!text.trim()) {
      textareaRef.current?.focus();
      return;
    }
    onSpeakNow();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleTriggerSpeak();
      return;
    }

    if (speakOnEnter && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleTriggerSpeak();
    }
  };

  const handleQuickPhraseClick = (phrase: string) => {
    onChangeText(phrase);
    showBriefToast(`「${phrase}」`);
    setTimeout(() => {
      onSpeakNow();
      textareaRef.current?.focus();
    }, 30);
  };

  const handleNaturalize = () => {
    if (!text.trim()) return;
    const naturalized = naturalizeJapaneseText(text);
    onChangeText(naturalized);
    showBriefToast('自然な読みに整形しました');
    textareaRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative select-none min-h-0">
      {/* Ultra-compact Quick Phrase Strip */}
      <div className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {QUICK_PHRASES.map((phrase) => {
          let buttonStyle = 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-500';
          if (phrase === 'はい') {
            buttonStyle = 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-bold';
          } else if (phrase === 'いいえ') {
            buttonStyle = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-bold';
          }
          return (
            <button
              key={phrase}
              type="button"
              onClick={() => handleQuickPhraseClick(phrase)}
              className={`px-2.5 py-1 text-xs rounded-md border whitespace-nowrap shrink-0 transition-all shadow-2xs active:scale-95 ${buttonStyle}`}
            >
              {phrase}
            </button>
          );
        })}
      </div>

      {/* Floating Feedback Toast */}
      {showToast && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-slate-900/95 text-white text-xs font-medium rounded-full shadow-md pointer-events-none transition-all">
          {showToast}
        </div>
      )}

      {/* Spacious Input Area (Maximizes height even at 640x480) */}
      <div className="flex-1 min-h-0 relative p-3 sm:p-4 bg-white dark:bg-slate-900 flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="言いたいことを入力..."
          className="w-full flex-1 resize-none bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base sm:text-xl font-medium leading-relaxed focus:outline-hidden"
          spellCheck={false}
          autoFocus
        />

        {/* Minimal inline status line */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNaturalize}
              disabled={!text}
              className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30"
              title="読点を補正"
            >
              <Wand2 className="w-3 h-3" />
              <span>整形</span>
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onOpenSampleModal}
              className="hover:text-slate-700 dark:hover:text-slate-200"
            >
              サンプル文
            </button>
          </div>
          <span className="font-mono">{text.replace(/\s+/g, '').length}字</span>
        </div>
      </div>

      {/* Compact Action Bar (Minimal labels, space-saving) */}
      <div className="px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Main Speak button (Minimal, crisp label) */}
          {isPlaying ? (
            <button
              type="button"
              onClick={onStop}
              className="h-10 md:h-11 flex-1 flex items-center justify-center gap-2 px-4 rounded-lg font-bold text-sm text-white bg-slate-800 hover:bg-slate-900 active:scale-98 shadow-xs transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current text-red-400" />
              <span>停止</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTriggerSpeak}
              disabled={!text.trim()}
              className="h-10 md:h-11 flex-1 flex items-center justify-center gap-2 px-4 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-35 disabled:hover:bg-blue-600 shadow-xs transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 stroke-[2.4]" />
              <span>読み上げ</span>
            </button>
          )}

          {/* Quick Clear button */}
          <button
            type="button"
            onClick={handleImmediateClear}
            disabled={!text}
            className="h-10 md:h-11 px-3.5 flex items-center justify-center gap-1.5 rounded-lg font-medium text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 border border-red-200 dark:border-red-900/60 disabled:opacity-30 transition-all cursor-pointer shrink-0"
            title="消去"
          >
            <Trash2 className="w-4 h-4" />
            <span>消去</span>
          </button>

          {clearedTextBackup && (
            <button
              type="button"
              onClick={handleUndoClear}
              className="h-10 md:h-11 px-2.5 flex items-center justify-center rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 hover:bg-amber-100 transition-all shrink-0"
              title="元に戻す"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Enter key shortcut toggle */}
        <label className="flex items-center gap-1 cursor-pointer text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0 pr-1">
          <input
            type="checkbox"
            checked={speakOnEnter}
            onChange={(e) => setSpeakOnEnter(e.target.checked)}
            className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500"
          />
          <CornerDownLeft className="w-3 h-3 text-slate-400" />
          <span className="hidden sm:inline">Enterで発声</span>
        </label>
      </div>
    </div>
  );
};
