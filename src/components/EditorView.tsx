/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { estimateReadingTime, naturalizeJapaneseText } from '../utils/speech';
import {
  Trash2,
  Sparkles,
  AlignLeft,
  Undo2,
  Wand2,
  Volume2,
  Square,
  CornerDownLeft,
  MessageSquare
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

// Emergency / daily throat-pain conversation quick phrases
const QUICK_PHRASES = [
  '喉が痛くて声が出ません',
  'お水をもらえますか？',
  'はい',
  'いいえ',
  'ありがとうございます',
  '少し待ってください',
  '痛みます',
  '薬を飲みたいです',
  '大丈夫です',
  '筆談でお願いします'
];

export const EditorView: React.FC<EditorViewProps> = ({
  text,
  onChangeText,
  rate,
  onOpenSampleModal,
  onSpeakNow,
  onStop,
  isPlaying,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Undo memory when cleared
  const [clearedTextBackup, setClearedTextBackup] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Instant conversation preferences (stored locally)
  const [speakOnEnter, setSpeakOnEnter] = useState<boolean>(() => {
    return localStorage.getItem('koeyomi_speak_on_enter') === 'true';
  });
  const [autoClearAfterSpeak, setAutoClearAfterSpeak] = useState<boolean>(() => {
    return localStorage.getItem('koeyomi_auto_clear') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('koeyomi_speak_on_enter', String(speakOnEnter));
  }, [speakOnEnter]);

  useEffect(() => {
    localStorage.setItem('koeyomi_auto_clear', String(autoClearAfterSpeak));
  }, [autoClearAfterSpeak]);

  const showBriefToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  /**
   * Immediate 1-click Clear handler. Clears instantly and focuses cursor.
   */
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

    if (autoClearAfterSpeak) {
      setTimeout(() => {
        onChangeText('');
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Ctrl+Enter or Cmd+Enter: always trigger instant speak
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleTriggerSpeak();
      return;
    }

    // If Speak-on-Enter is active and not shifting: trigger speech
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
    }, 50);
  };

  const handleNaturalize = () => {
    if (!text.trim()) return;
    const naturalized = naturalizeJapaneseText(text);
    onChangeText(naturalized);
    showBriefToast('自然な読みに整形しました');
    textareaRef.current?.focus();
  };

  const handleCleanWhitespace = () => {
    if (!text) return;
    const cleaned = text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
      .join('\n');
    onChangeText(cleaned);
    showBriefToast('余白を整理しました');
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative select-none">
      {/* Quick Phrase Strip (Especially useful for throat pain / cannot speak) */}
      <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>喉が痛い時のワンタップ発声（タップで即読み上げ）:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {QUICK_PHRASES.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => handleQuickPhraseClick(phrase)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 whitespace-nowrap shrink-0 transition-all shadow-2xs active:scale-95"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Feedback Toast */}
      {showToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-slate-900/95 text-white text-xs font-medium rounded-full shadow-lg pointer-events-none transition-all animate-in fade-in">
          {showToast}
        </div>
      )}

      {/* Large Input Area (Optimized for quick typing and instant reading) */}
      <div className="flex-1 min-h-0 relative p-4 md:p-6 bg-white dark:bg-slate-900 flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="言いたいことをここに入力してください...&#10;&#10;・下の特大「読み上げる」ボタンまたは [Enter] キーで即座に声が出ます。&#10;・消去ボタンで一瞬で消して次の返答を打てます。"
          className="w-full flex-1 resize-none bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-lg md:text-2xl font-medium leading-relaxed focus:outline-hidden"
          spellCheck={false}
          autoFocus
        />

        {/* Text Utility Mini-Toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNaturalize}
              disabled={!text}
              className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30"
              title="読点などを整えてより自然に"
            >
              <Wand2 className="w-3 h-3" />
              <span>自然な読みに整形</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              type="button"
              onClick={handleCleanWhitespace}
              disabled={!text}
              className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
            >
              <AlignLeft className="w-3 h-3" />
              <span>余白整理</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              type="button"
              onClick={onOpenSampleModal}
              className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <Sparkles className="w-3 h-3" />
              <span>名作サンプル</span>
            </button>
          </div>

          <div className="text-[11px] font-mono">
            {text.replace(/\s+/g, '').length} 文字
          </div>
        </div>
      </div>

      {/* Massive Speak & Immediate Action Deck */}
      <div className="p-3.5 md:p-4 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2.5">
        {/* Toggle options for ultra-fast conversation */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1 flex-wrap gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={speakOnEnter}
              onChange={(e) => setSpeakOnEnter(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="flex items-center gap-1 font-medium">
              <CornerDownLeft className="w-3 h-3" />
              <span>Enterキーで即座に読み上げ</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={autoClearAfterSpeak}
              onChange={(e) => setAutoClearAfterSpeak(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span>読み上げたら自動で消去（次の文へ）</span>
          </label>
        </div>

        {/* HUGE Buttons Grid */}
        <div className="flex items-stretch gap-2.5">
          {/* Prominent Large Speak Button */}
          {isPlaying ? (
            <button
              type="button"
              onClick={onStop}
              className="flex-1 h-14 md:h-16 flex items-center justify-center gap-2.5 px-6 rounded-xl font-bold text-base md:text-lg text-white bg-slate-800 hover:bg-slate-900 active:scale-98 shadow-md transition-all cursor-pointer"
            >
              <Square className="w-6 h-6 fill-current text-red-400" />
              <span>停止する</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTriggerSpeak}
              disabled={!text.trim()}
              className="flex-1 h-14 md:h-16 flex items-center justify-center gap-3 px-6 rounded-xl font-bold text-lg md:text-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-40 disabled:hover:bg-blue-600 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Volume2 className="w-7 h-7 stroke-[2.2]" />
              <span>声で伝える（読み上げ）</span>
            </button>
          )}

          {/* Large Clear Button */}
          <button
            type="button"
            onClick={handleImmediateClear}
            disabled={!text}
            className="h-14 md:h-16 px-5 md:px-7 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm md:text-base text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/60 disabled:opacity-30 transition-all cursor-pointer shrink-0"
            title="1クリックで即座に消去して次の文字を打つ"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">消去</span>
          </button>

          {/* Quick Undo if cleared */}
          {clearedTextBackup && (
            <button
              type="button"
              onClick={handleUndoClear}
              className="h-14 md:h-16 px-4 flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer shrink-0"
              title="消去したテキストを戻す"
            >
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">復元</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
