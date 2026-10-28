/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VoiceSettings } from '../types';
import { rankAndSortVoices } from '../utils/speech';
import { X, Volume2, Play, RotateCcw, Sparkles, Wind } from 'lucide-react';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onUpdateSettings: (newSettings: Partial<VoiceSettings>) => void;
  voices: SpeechSynthesisVoice[];
  onTestVoice: (voiceURI: string, rate: number, pitch: number, volume: number) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  voices,
  onTestVoice,
}) => {
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const { naturalJapanese, standardJapanese, otherVoices } = rankAndSortVoices(voices);

  const handleTest = () => {
    setIsTesting(true);
    onTestVoice(settings.voiceURI, settings.rate, settings.pitch, settings.volume);
    setTimeout(() => setIsTesting(false), 2500);
  };

  const applyStylePreset = (style: 'natural' | 'narration' | 'announcement' | 'speed') => {
    switch (style) {
      case 'natural':
        onUpdateSettings({
          voiceStyle: 'natural',
          rate: 1.02,
          pitch: 1.0,
          pauseDurationMs: 280,
        });
        break;
      case 'narration':
        onUpdateSettings({
          voiceStyle: 'narration',
          rate: 0.92,
          pitch: 0.96,
          pauseDurationMs: 420,
        });
        break;
      case 'announcement':
        onUpdateSettings({
          voiceStyle: 'announcement',
          rate: 1.08,
          pitch: 1.04,
          pauseDurationMs: 200,
        });
        break;
      case 'speed':
        onUpdateSettings({
          voiceStyle: 'speed',
          rate: 1.35,
          pitch: 1.0,
          pauseDurationMs: 120,
        });
        break;
    }
  };

  const handleReset = () => {
    onUpdateSettings({
      rate: 1.02,
      pitch: 1.0,
      volume: 1.0,
      pauseDurationMs: 280,
      voiceStyle: 'natural',
      autoScroll: true,
      repeatMode: 'none',
      sleepTimerMinutes: null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              より自然な音声・再生の詳細設定
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Natural Voice Style Presets */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <label className="text-xs font-semibold text-slate-900 dark:text-white">
                自然な読み上げスタイルのプリセット
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyStylePreset('natural')}
                className={`p-2.5 text-left rounded-lg border transition-all ${
                  settings.voiceStyle === 'natural'
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold mb-0.5">🎙️ 自然な標準</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">日常会話のような自然な間</div>
              </button>

              <button
                type="button"
                onClick={() => applyStylePreset('narration')}
                className={`p-2.5 text-left rounded-lg border transition-all ${
                  settings.voiceStyle === 'narration'
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold mb-0.5">📖 落ち着いた朗読</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">文学・記事向けの深みのある間</div>
              </button>

              <button
                type="button"
                onClick={() => applyStylePreset('announcement')}
                className={`p-2.5 text-left rounded-lg border transition-all ${
                  settings.voiceStyle === 'announcement'
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold mb-0.5">📢 はきはきアナウンス</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">ニュース・案内に適した明瞭さ</div>
              </button>

              <button
                type="button"
                onClick={() => applyStylePreset('speed')}
                className={`p-2.5 text-left rounded-lg border transition-all ${
                  settings.voiceStyle === 'speed'
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold mb-0.5">⚡ 速聴・確認</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">要点を素早く倍速チェック</div>
              </button>
            </div>
          </div>

          {/* Voice Selector with Ranking */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                読み上げ音声（スピーカー）
              </label>
              <button
                onClick={handleTest}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isTesting ? '再生中...' : '音声テスト'}</span>
              </button>
            </div>
            <select
              value={settings.voiceURI}
              onChange={(e) => onUpdateSettings({ voiceURI: e.target.value, voiceStyle: 'custom' })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {naturalJapanese.length > 0 && (
                <optgroup label="✨ 高品質・自然音声 (推奨)">
                  {naturalJapanese.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      ★ {v.name} {v.default ? '（既定）' : ''}
                    </option>
                  ))}
                </optgroup>
              )}
              {standardJapanese.length > 0 && (
                <optgroup label="日本語システム音声">
                  {standardJapanese.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} {v.default ? '（既定）' : ''}
                    </option>
                  ))}
                </optgroup>
              )}
              {naturalJapanese.length === 0 && standardJapanese.length === 0 && (
                <option value="">標準システム音声</option>
              )}
              {otherVoices.length > 0 && (
                <optgroup label="その他言語の音声">
                  {otherVoices.slice(0, 15).map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              ※「Google 日本語」や「Natural / Neural」と表示される音声を選ぶと、より人間に近い自然なイントネーションになります。
            </p>
          </div>

          {/* Breath / Pause between sentences */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  文と文の間の息継ぎ（ポーズ間隔）
                </label>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {settings.pauseDurationMs}ms
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="600"
              step="20"
              value={settings.pauseDurationMs}
              onChange={(e) => onUpdateSettings({ pauseDurationMs: parseInt(e.target.value, 10), voiceStyle: 'custom' })}
              className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>間なし (0ms)</span>
              <span>自然な息継ぎ (280ms)</span>
              <span>ゆったり (500ms)</span>
            </div>
          </div>

          {/* Speed / Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                読み上げ速度 (再生レート)
              </label>
              <span className="text-xs font-mono tabular-nums text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {settings.rate.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={settings.rate}
              onChange={(e) => onUpdateSettings({ rate: parseFloat(e.target.value), voiceStyle: 'custom' })}
              className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
            />
          </div>

          {/* Pitch */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                声の高さ (ピッチ)
              </label>
              <span className="text-xs font-mono tabular-nums text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {settings.pitch.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.02"
              value={settings.pitch}
              onChange={(e) => onUpdateSettings({ pitch: parseFloat(e.target.value), voiceStyle: 'custom' })}
              className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
            />
          </div>

          {/* Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                読み上げ音量
              </label>
              <span className="text-xs font-mono tabular-nums text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
            />
          </div>

          {/* Behavior Toggles */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                自動スクロール（読み上げ中の文を追従）
              </span>
              <input
                type="checkbox"
                checked={settings.autoScroll}
                onChange={(e) => onUpdateSettings({ autoScroll: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>初期設定に戻す</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
};
