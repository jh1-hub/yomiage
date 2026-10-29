/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VoiceSettings, ThemeMode } from '../types';
import { AudioVisualizer } from './AudioVisualizer';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Repeat,
  Repeat1,
  Timer
} from 'lucide-react';

interface ControlsBarProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  settings: VoiceSettings;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onPrevSentence: () => void;
  onNextSentence: () => void;
  onRepeatCurrentSentence: () => void;
  onSeekSentence: (index: number) => void;
  onUpdateSettings: (newSettings: Partial<VoiceSettings>) => void;
  onOpenVoiceSettings: () => void;
  theme: ThemeMode;
  sleepTimerRemaining: number | null; // seconds
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  isPlaying,
  isPaused,
  currentSentenceIndex,
  totalSentences,
  settings,
  onPlay,
  onPause,
  onResume,
  onStop,
  onPrevSentence,
  onNextSentence,
  onRepeatCurrentSentence,
  onSeekSentence,
  onUpdateSettings,
  onOpenVoiceSettings,
  theme,
  sleepTimerRemaining,
}) => {
  const isMuted = settings.volume === 0;

  const toggleMute = () => {
    if (isMuted) {
      onUpdateSettings({ volume: 1.0 });
    } else {
      onUpdateSettings({ volume: 0 });
    }
  };

  const cycleRepeatMode = () => {
    const nextMode =
      settings.repeatMode === 'none'
        ? 'sentence'
        : settings.repeatMode === 'sentence'
        ? 'all'
        : 'none';
    onUpdateSettings({ repeatMode: nextMode });
  };

  const handleSleepTimerCycle = () => {
    const sequence = [null, 5, 15, 30, 60];
    const currIdx = sequence.indexOf(settings.sleepTimerMinutes);
    const next = sequence[(currIdx + 1) % sequence.length];
    onUpdateSettings({ sleepTimerMinutes: next });
  };

  // Format sleep timer
  const formatSleepTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const hasContent = totalSentences > 0;

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 select-none shadow-lg">
      {/* Audio Visualizer Strip (Hidden on small vertical heights to maximize typing area) */}
      <div className="hidden sm:block">
        <AudioVisualizer
          isPlaying={isPlaying && !isPaused}
          rate={settings.rate}
          pitch={settings.pitch}
          theme={theme}
        />
      </div>

      {/* Progress Scrubber Bar */}
      <div className="px-3 md:px-6 pt-1 pb-1">
        <div className="flex items-center justify-between text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 mb-0.5 font-mono tabular-nums">
          <span>
            {hasContent
              ? `第 ${currentSentenceIndex + 1} / ${totalSentences} 文`
              : '文章未入力'}
          </span>
          <span>
            {hasContent
              ? `${Math.round(((currentSentenceIndex + 1) / totalSentences) * 100)}%`
              : '0%'}
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSentences - 1)}
            value={currentSentenceIndex}
            onChange={(e) => onSeekSentence(parseInt(e.target.value, 10))}
            disabled={!hasContent}
            className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400 disabled:opacity-40"
          />
        </div>
      </div>

      {/* Primary Control Buttons Strip */}
      <div className="px-3 md:px-6 pb-2 pt-0.5 flex flex-wrap items-center justify-between gap-2 md:gap-4">
        {/* Left Side: Repeat mode, Sleep timer */}
        <div className="flex items-center gap-2">
          {/* Repeat Mode */}
          <button
            type="button"
            onClick={cycleRepeatMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              settings.repeatMode !== 'none'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={`リピート設定: ${
              settings.repeatMode === 'none'
                ? 'オフ'
                : settings.repeatMode === 'sentence'
                ? 'この文をリピート'
                : '全体をリピート'
            }`}
          >
            {settings.repeatMode === 'sentence' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {settings.repeatMode === 'none'
                ? 'リピート切'
                : settings.repeatMode === 'sentence'
                ? '1文'
                : '全体'}
            </span>
          </button>

          {/* Sleep Timer */}
          <button
            type="button"
            onClick={handleSleepTimerCycle}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              settings.sleepTimerMinutes
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="おやすみタイマー（クリックで5分/15分/30分/60分/オフに切替）"
          >
            <Timer className="w-4 h-4" />
            <span className="text-[11px] font-mono tabular-nums">
              {sleepTimerRemaining !== null && sleepTimerRemaining > 0
                ? formatSleepTimer(sleepTimerRemaining)
                : settings.sleepTimerMinutes
                ? `${settings.sleepTimerMinutes}分`
                : 'タイマー'}
            </span>
          </button>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-3">
          {/* Previous Sentence */}
          <button
            type="button"
            onClick={onPrevSentence}
            disabled={!hasContent || currentSentenceIndex <= 0}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            title="前の文へ"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Replay Current Sentence */}
          <button
            type="button"
            onClick={onRepeatCurrentSentence}
            disabled={!hasContent}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            title="この文を最初から再生"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Main Play / Pause Button */}
          {isPlaying && !isPaused ? (
            <button
              type="button"
              onClick={onPause}
              className="p-2.5 md:p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
              title="一時停止"
            >
              <Pause className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={isPaused ? onResume : onPlay}
              disabled={!hasContent}
              className="p-2.5 md:p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600"
              title={isPaused ? '再開' : '読み上げ開始'}
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          )}

          {/* Stop Button */}
          <button
            type="button"
            onClick={onStop}
            disabled={!isPlaying && !isPaused}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            title="停止"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          {/* Next Sentence */}
          <button
            type="button"
            onClick={onNextSentence}
            disabled={!hasContent || currentSentenceIndex >= totalSentences - 1}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            title="次の文へ"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side: Speed Quick-Toggles & Volume & Settings Modal Trigger */}
        <div className="flex items-center gap-3">
          {/* Quick Rate Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
            {[0.8, 1.0, 1.25, 1.5, 2.0].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onUpdateSettings({ rate: r })}
                className={`px-2 py-1 text-xs font-mono tabular-nums rounded transition-colors ${
                  settings.rate === r
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r.toFixed(r % 1 === 0 ? 1 : 2)}x
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title={isMuted ? 'ミュート解除' : 'ミュート'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-500" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
              className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-blue-600"
              title={`音量: ${Math.round(settings.volume * 100)}%`}
            />
          </div>

          {/* Detail Settings Trigger */}
          <button
            type="button"
            onClick={onOpenVoiceSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="音声の詳細設定（声の選択・ピッチ等）"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">音声設定</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
