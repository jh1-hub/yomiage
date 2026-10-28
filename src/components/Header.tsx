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
  Edit3,
  Sliders
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  voiceStyle: 'natural' | 'narration' | 'announcement' | 'speed' | 'custom';
  onChangeVoiceStyle: (style: 'natural' | 'narration' | 'announcement' | 'speed') => void;
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
  voiceStyle,
  onChangeVoiceStyle,
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
    <header className="flex items-center justify-between gap-4 md:gap-8 px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
          <Volume2 className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          KoeYomi <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">声読み</span>
        </span>
      </div>

      {/* Zone 2: Navigation & Voice Mode Controls */}
      <div className="flex items-center gap-3 md:gap-5 overflow-x-auto no-scrollbar">
        {/* Voice Mode Selector (Directly in Main Menu) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 pl-1.5 hidden lg:inline">
            音声モード:
          </span>
          <select
            value={voiceStyle}
            onChange={(e) => onChangeVoiceStyle(e.target.value as any)}
            className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 px-2 py-1 rounded shadow-2xs border border-slate-200/80 dark:border-slate-600 focus:outline-hidden cursor-pointer"
            title="音声モード（話し方・テンポ）の切り替え"
          >
            <option value="natural">🎙️ 自然な標準</option>
            <option value="narration">📖 落ち着いた朗読</option>
            <option value="announcement">📢 はきはきアナウンス</option>
            <option value="speed">⚡ 速聴・確認</option>
            {voiceStyle === 'custom' && <option value="custom">⚙️ カスタム調整</option>}
          </select>
        </div>

        {/* Navigation Links for larger screens */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={onOpenSampleModal}
            className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>名作サンプル</span>
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
            <span>保存一覧</span>
          </button>
        </nav>

        {/* View Mode Switcher (Desktop) */}
        <div className="hidden md:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg shrink-0">
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
            <span>2画面</span>
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
            <span>リーダー</span>
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
            <span>編集</span>
          </button>
        </div>

        {/* Font size picker (Desktop) */}
        <div className="hidden lg:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-mono shrink-0">
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
      </div>

      {/* Zone 3: Detailed settings, theme toggle, primary action */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Voice Details Modal Trigger */}
        <button
          type="button"
          onClick={onOpenVoiceSettings}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="音声の詳細設定（声の選択・ピッチ等）"
        >
          <Sliders className="w-4 h-4" />
        </button>

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
          className="px-3 md:px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isPlaying ? '一時停止' : '読み上げる'}</span>
        </button>
      </div>
    </header>
  );
};
