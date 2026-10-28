/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SavedTextItem } from '../types';
import { X, Bookmark, Trash2, FolderOpen, Plus, Calendar, FileText } from 'lucide-react';

interface SavedTextsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTexts: SavedTextItem[];
  onLoadText: (item: SavedTextItem) => void;
  onSaveCurrentText: (title: string) => void;
  onDeleteText: (id: string) => void;
  currentText: string;
}

export const SavedTextsModal: React.FC<SavedTextsModalProps> = ({
  isOpen,
  onClose,
  savedTexts,
  onLoadText,
  onSaveCurrentText,
  onDeleteText,
  currentText,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText.trim()) return;

    const titleToUse = newTitle.trim() || currentText.trim().slice(0, 20) + '...';
    onSaveCurrentText(titleToUse);
    setNewTitle('');
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2000);
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              保存したテキスト一覧
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
          {/* Save current form */}
          {currentText.trim() && (
            <form onSubmit={handleSave} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
                現在のテキストを保存する
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="タイトル（未入力の場合は先頭20文字）"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>保存</span>
                </button>
              </div>
              {saveSuccessMsg && (
                <p className="text-[11px] text-green-600 mt-1">保存しました！</p>
              )}
            </form>
          )}

          {/* List of saved */}
          <div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              保存済みアイテム ({savedTexts.length}件)
            </div>

            {savedTexts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p>保存されたテキストはまだありません</p>
                <p className="text-[11px] mt-1 text-slate-400">よく読む文章や下書きを保存していつでも呼び出せます</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {savedTexts.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg hover:border-amber-400 dark:hover:border-amber-500 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {item.charCount}文字
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(item.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          onLoadText(item);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                        title="このテキストを読み込む"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>読込</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteText(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded"
                        title="削除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
