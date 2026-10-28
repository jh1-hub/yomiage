/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ViewMode, ThemeMode, FontSize } from '../types';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Bookmark,
  Sun,
  Moon,
  Columns,
  Maximize2,
  Edit3
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  fontSize: FontSize;
  onChangeFontSize: (size: FontSize) => void;
  onOpenSampleModal: () => void;
  onOpenDictionaryModal: () => void;
  onOpenSavedModal: () => void;
  onOpenVoiceSettings: () => void;
  isPlaying: boolean;
  onPlayStopToggle: () => void;
  hasContent: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  theme,
  onToggleTheme,
  fontSize,
  onChangeFontSize,
  onOpenSampleModal,
  onOpenDictionaryModal,
  onOpenSavedModal,
  onOpenVoiceSettings,
  isPlaying,
  onPlayStopToggle,
  hasContent,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
          <Volume2 className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          KoeYomi <span className="text-sm font-medium text-slate-500 dark:text-slate-400">声読み</span>
        </span>
      </div>

      {/* Zone 2: Navigation Links (single-line, clean text with hover underline) */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
        <button
          type="button"
          onClick={onOpenSampleModal}
          className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>名作・サンプル文</span>
        </button>

        <button
          type="button"
          onClick={onOpenDictionaryModal}
          className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>読み替え辞書</span>
        </button>

        <button
          type="button"
          onClick={onOpenSavedModal}
          className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>保存済み一覧</span>
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => onChangeViewMode('split')}
            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
              viewMode === 'split'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="分割表示（入力と閲覧）"
          >
            <Columns className="w-3 h-3" />
            <span className="hidden lg:inline">2画面</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('reader')}
            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
              viewMode === 'reader'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="リーダー画面（読書に集中）"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden lg:inline">リーダー</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('editor')}
            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
              viewMode === 'editor'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="入力画面（編集のみ）"
          >
            <Edit3 className="w-3 h-3" />
            <span className="hidden lg:inline">編集</span>
          </button>
        </div>

        {/* Font size picker */}
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-mono">
          {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => onChangeFontSize(sz)}
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                fontSize === sz
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sz.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* Zone 3: 1 Primary Action + theme toggle */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Dark/Light mode toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={theme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Primary CTA Action */}
        <button
          type="button"
          onClick={onPlayStopToggle}
          disabled={!hasContent}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isPlaying ? '一時停止' : '読み上げる'}</span>
        </button>
      </div>
    </header>
  );
};
