/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SAMPLE_TEXTS, SampleText } from '../data/sampleTexts';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface SampleTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleText) => void;
}

export const SampleTextModal: React.FC<SampleTextModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', '名作文学', '発音・滑舌', '実務・ビジネス', 'ニュース・情報', '語学・学習'];

  const filteredSamples = selectedCategory === 'all'
    ? SAMPLE_TEXTS
    : SAMPLE_TEXTS.filter(s => s.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              プリセット・サンプル文章を選択
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Tab Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'all' ? 'すべて' : cat}
            </button>
          ))}
        </div>

        {/* List of Samples */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                    {sample.category}
                  </span>
                  {sample.author && (
                    <span className="text-[11px] text-slate-400">· {sample.author}</span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {sample.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {sample.description}
                </p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  文字数: {sample.text.replace(/\s+/g, '').length} 文字
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectSample(sample);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 self-end sm:self-center"
              >
                <span>この文を読み込む</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};
