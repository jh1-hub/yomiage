/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { estimateReadingTime, naturalizeJapaneseText } from '../utils/speech';
import {
  Clipboard,
  Trash2,
  Upload,
  Sparkles,
  AlignLeft,
  Clock,
  Type,
  FileCheck,
  Undo2,
  Wand2
} from 'lucide-react';

interface EditorViewProps {
  text: string;
  onChangeText: (text: string) => void;
  rate: number;
  onOpenSampleModal: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  text,
  onChangeText,
  rate,
  onOpenSampleModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Undo memory when cleared
  const [clearedTextBackup, setClearedTextBackup] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const charCount = text.replace(/\s+/g, '').length;
  const lineCount = text ? text.split(/\r?\n/).length : 0;
  const { formatted: estimatedTime } = estimateReadingTime(text, rate);

  const showBriefToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        onChangeText(clipboardText);
        showBriefToast('貼り付けました');
        textareaRef.current?.focus();
      }
    } catch {
      // Fallback
    }
  };

  /**
   * Immediate 1-click Clear handler without blocking prompts.
   * Immediately clears text, focuses textarea, and offers brief undo.
   */
  const handleImmediateClear = () => {
    if (!text) {
      textareaRef.current?.focus();
      return;
    }
    const previous = text;
    setClearedTextBackup(previous);
    onChangeText('');
    showBriefToast('消去しました（次の文をすぐ入力できます）');

    // Immediately focus the textarea so the user can type right away
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

  const handleNaturalize = () => {
    if (!text.trim()) return;
    const naturalized = naturalizeJapaneseText(text);
    onChangeText(naturalized);
    showBriefToast('自然な読み上げ文（読点・息継ぎ）に整形しました');
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChangeText(content);
        showBriefToast(`${file.name} を読み込みました`);
        textareaRef.current?.focus();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative">
      {/* Editor Toolbar */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onOpenSampleModal}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
            title="サンプル文章を読み込む"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>サンプル文章</span>
          </button>

          {/* Naturalize Button */}
          <button
            type="button"
            onClick={handleNaturalize}
            disabled={!text}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-md transition-colors disabled:opacity-40"
            title="読点の追加や息継ぎを整えて、より自然な発音に最適化します"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>自然な読みに整形</span>
          </button>

          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="クリップボードから貼り付け"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-500" />
            <span>貼り付け</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="テキストファイル（.txt, .md）を読み込む"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>ファイル読込</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleCleanWhitespace}
            disabled={!text}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors disabled:opacity-40"
            title="空行や余分な空白を整理"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">余白整理</span>
          </button>
        </div>

        {/* Clear and Undo Controls */}
        <div className="flex items-center gap-1.5">
          {clearedTextBackup && (
            <button
              type="button"
              onClick={handleUndoClear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-md transition-colors"
              title="直前に消去したテキストを復元"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>元に戻す</span>
            </button>
          )}

          {/* Immediate Clear button - zero delays, instant reaction */}
          <button
            type="button"
            onClick={handleImmediateClear}
            disabled={!text}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-md transition-colors disabled:opacity-30 cursor-pointer"
            title="1クリックですぐ消去して次の文を入力（確認なしで即座に消去）"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>消去</span>
          </button>
        </div>
      </div>

      {/* Brief Floating Feedback Toast */}
      {showToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-slate-900/90 text-white text-xs rounded-full shadow-lg pointer-events-none transition-all">
          {showToast}
        </div>
      )}

      {/* Textarea Area with Auto-Focus Ref */}
      <div className="flex-1 relative p-4">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="読み上げたい文字・文章をここに入力または貼り付けしてください...&#10;&#10;・消去ボタンを押すと一瞬で消去され、すぐ次の文を入力できます。&#10;・「自然な読みに整形」を押すと、読点や息継ぎを補正して滑らかに読み上げます。"
          className="w-full h-full resize-none bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm md:text-base leading-relaxed focus:outline-hidden"
          spellCheck={false}
          autoFocus
        />
      </div>

      {/* Editor Status Bar */}
      <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Type className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">{charCount.toLocaleString()}</span>
            <span>文字</span>
          </div>
          <div className="flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">{lineCount}</span>
            <span>行</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5" />
          <span>想定所要時間:</span>
          <span className="font-mono tabular-nums font-medium text-blue-600 dark:text-blue-400">
            {estimatedTime}
          </span>
        </div>
      </div>
    </div>
  );
};
