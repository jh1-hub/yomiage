/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PronunciationRule } from '../types';
import { DEFAULT_PRONUNCIATION_RULES } from '../data/sampleTexts';
import { X, BookOpen, Plus, Trash2, RotateCcw, Check, Sparkles } from 'lucide-react';

interface PronunciationDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: PronunciationRule[];
  onUpdateRules: (newRules: PronunciationRule[]) => void;
}

export const PronunciationDictionaryModal: React.FC<PronunciationDictionaryModalProps> = ({
  isOpen,
  onClose,
  rules,
  onUpdateRules,
}) => {
  const [patternInput, setPatternInput] = useState('');
  const [replacementInput, setReplacementInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patternInput.trim()) {
      setErrorMsg('置換前の単語を入力してください');
      return;
    }
    if (!replacementInput.trim()) {
      setErrorMsg('置換後の読みを入力してください');
      return;
    }

    const newRule: PronunciationRule = {
      id: Date.now().toString(),
      pattern: patternInput.trim(),
      replacement: replacementInput.trim(),
      enabled: true,
    };

    onUpdateRules([...rules, newRule]);
    setPatternInput('');
    setReplacementInput('');
    setErrorMsg('');
  };

  const handleToggleRule = (id: string) => {
    onUpdateRules(
      rules.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    onUpdateRules(rules.filter(r => r.id !== id));
  };

  const handleResetDefaults = () => {
    onUpdateRules(DEFAULT_PRONUNCIATION_RULES);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              読み替え辞書（カスタム発音ルール）
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            略語（AI, PDFなど）や特殊な読み方をする熟語・日付を登録しておくと、読み上げ時に自動で置換して自然に発音させることができます。
          </p>

          {/* Add Form */}
          <form onSubmit={handleAddRule} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold text-slate-900 dark:text-white">新しい単語を追加</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  置換前の単語・表記
                </label>
                <input
                  type="text"
                  placeholder="例: IoT, 1日"
                  value={patternInput}
                  onChange={(e) => {
                    setPatternInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  置換後の読み（カナ推奨）
                </label>
                <input
                  type="text"
                  placeholder="例: アイオーティー, ついたち"
                  value={replacementInput}
                  onChange={(e) => {
                    setReplacementInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-[11px] text-red-600 dark:text-red-400">{errorMsg}</p>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>辞書に登録する</span>
              </button>
            </div>
          </form>

          {/* List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                登録済みルール ({rules.length}件)
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>初期ルールに戻す</span>
              </button>
            </div>

            {rules.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                登録されている読み替えルールはありません
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleRule(rule.id)}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          rule.enabled
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                        aria-label="ルールの有効/無効切り替え"
                      >
                        {rule.enabled && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <div className="flex items-center gap-2 text-xs min-w-0 truncate">
                        <span className="font-medium text-slate-900 dark:text-white truncate">
                          {rule.pattern}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="text-indigo-600 dark:text-indigo-400 truncate">
                          {rule.replacement}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
