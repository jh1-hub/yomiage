/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SentenceItem,
  VoiceSettings,
  PronunciationRule,
  SavedTextItem,
  ThemeMode,
  ViewMode,
  FontSize
} from './types';
import { segmentText, applyPronunciationRules, rankAndSortVoices } from './utils/speech';
import { SAMPLE_TEXTS, DEFAULT_PRONUNCIATION_RULES, SampleText } from './data/sampleTexts';
import { Header } from './components/Header';
import { ControlsBar } from './components/ControlsBar';
import { EditorView } from './components/EditorView';
import { ReaderView } from './components/ReaderView';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { PronunciationDictionaryModal } from './components/PronunciationDictionaryModal';
import { SavedTextsModal } from './components/SavedTextsModal';
import { SampleTextModal } from './components/SampleTextModal';
import { Edit3, BookOpen } from 'lucide-react';

const DEFAULT_SETTINGS: VoiceSettings = {
  voiceURI: '',
  rate: 1.02,
  pitch: 1.0,
  volume: 1.0,
  pauseDurationMs: 280,
  voiceStyle: 'natural',
  autoScroll: true,
  repeatMode: 'none',
  sleepTimerMinutes: null,
};

export default function App() {
  // --- Persistent & Core States ---
  const [text, setText] = useState<string>(() => {
    const saved = localStorage.getItem('koeyomi_current_text');
    return saved !== null ? saved : SAMPLE_TEXTS[0].text;
  });

  const [settings, setSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem('koeyomi_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [rules, setRules] = useState<PronunciationRule[]>(() => {
    try {
      const saved = localStorage.getItem('koeyomi_rules');
      return saved ? JSON.parse(saved) : DEFAULT_PRONUNCIATION_RULES;
    } catch {
      return DEFAULT_PRONUNCIATION_RULES;
    }
  });

  const [savedTexts, setSavedTexts] = useState<SavedTextItem[]>(() => {
    try {
      const saved = localStorage.getItem('koeyomi_saved_texts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('koeyomi_theme') as ThemeMode) || 'light';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [mobileTab, setMobileTab] = useState<'editor' | 'reader'>('editor');
  const [fontSize, setFontSize] = useState<FontSize>('md');

  // --- Modal Visibility ---
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isDictModalOpen, setIsDictModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  // --- Voices from Browser ---
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // --- Playback State ---
  const [sentences, setSentences] = useState<SentenceItem[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // --- Sleep Timer Countdown ---
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  // --- Refs for Speech Execution ---
  const isPlayingRef = useRef<boolean>(false);
  const currentSentenceIndexRef = useRef<number>(0);
  const sentencesRef = useRef<SentenceItem[]>([]);
  const settingsRef = useRef<VoiceSettings>(settings);
  const rulesRef = useRef<PronunciationRule[]>(rules);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);

  // Keep refs synchronized
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentSentenceIndexRef.current = currentSentenceIndex;
  }, [currentSentenceIndex]);

  useEffect(() => {
    sentencesRef.current = sentences;
  }, [sentences]);

  useEffect(() => {
    settingsRef.current = settings;
    try {
      localStorage.setItem('koeyomi_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    rulesRef.current = rules;
    try {
      localStorage.setItem('koeyomi_rules', JSON.stringify(rules));
    } catch {}
  }, [rules]);

  useEffect(() => {
    try {
      localStorage.setItem('koeyomi_saved_texts', JSON.stringify(savedTexts));
    } catch {}
  }, [savedTexts]);

  useEffect(() => {
    try {
      localStorage.setItem('koeyomi_current_text', text);
    } catch {}
  }, [text]);

  useEffect(() => {
    try {
      localStorage.setItem('koeyomi_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // --- Segment Text on Change ---
  useEffect(() => {
    const segmented = segmentText(text);
    setSentences(segmented);
    sentencesRef.current = segmented;
    if (currentSentenceIndex >= segmented.length) {
      setCurrentSentenceIndex(0);
      currentSentenceIndexRef.current = 0;
    }
  }, [text]);

  // --- Load Voices & Auto-Select Highest Quality Natural Voice ---
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      voicesRef.current = available;

      if (available.length > 0) {
        setSettings((prev) => {
          const hasCurrent = available.some(v => v.voiceURI === prev.voiceURI);
          if (hasCurrent && prev.voiceURI) return prev;

          // Rank voices to prioritize natural neural speech
          const { naturalJapanese, standardJapanese } = rankAndSortVoices(available);
          const bestJpVoice = naturalJapanese[0] || standardJapanese[0] || available[0];

          return {
            ...prev,
            voiceURI: bestJpVoice ? bestJpVoice.voiceURI : '',
          };
        });
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // --- Sleep Timer Countdown Effect ---
  useEffect(() => {
    if (!settings.sleepTimerMinutes) {
      setSleepTimerRemaining(null);
      return;
    }

    let remainingSeconds = settings.sleepTimerMinutes * 60;
    setSleepTimerRemaining(remainingSeconds);

    const intervalId = setInterval(() => {
      remainingSeconds -= 1;
      setSleepTimerRemaining(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(intervalId);
        handleStop();
        setSettings(prev => ({ ...prev, sleepTimerMinutes: null }));
        setSleepTimerRemaining(null);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [settings.sleepTimerMinutes]);

  // --- Speech Playback Core Engine with Natural Breath Pauses ---
  const speakSentence = useCallback((index: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    const allSentences = sentencesRef.current;
    if (index < 0 || index >= allSentences.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();

    const currentSentence = allSentences[index];
    setCurrentSentenceIndex(index);
    currentSentenceIndexRef.current = index;

    // Apply custom pronunciation replacement rules
    const spokenText = applyPronunciationRules(currentSentence.text, rulesRef.current);
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utteranceRef.current = utterance;

    // Explicitly enforce Japanese language tag so it never falls back to English TTS
    utterance.lang = 'ja-JP';

    const currentSettings = settingsRef.current;
    utterance.rate = currentSettings.rate;
    utterance.pitch = currentSettings.pitch;
    utterance.volume = currentSettings.volume;

    // Select chosen voice
    if (currentSettings.voiceURI) {
      const matched = voicesRef.current.find(v => v.voiceURI === currentSettings.voiceURI);
      if (matched) {
        utterance.voice = matched;
        utterance.lang = matched.lang || 'ja-JP';
      }
    }

    utterance.onend = () => {
      if (!isPlayingRef.current) return;

      const latestSettings = settingsRef.current;
      const latestSentences = sentencesRef.current;
      const currentIdx = currentSentenceIndexRef.current;

      // Repeat single sentence mode
      if (latestSettings.repeatMode === 'sentence') {
        pauseTimeoutRef.current = window.setTimeout(() => {
          if (isPlayingRef.current) {
            speakSentence(currentIdx);
          }
        }, 150);
        return;
      }

      // Check if finished entire text
      if (currentIdx >= latestSentences.length - 1) {
        if (latestSettings.repeatMode === 'all') {
          pauseTimeoutRef.current = window.setTimeout(() => {
            if (isPlayingRef.current) {
              speakSentence(0);
            }
          }, latestSettings.pauseDurationMs ?? 280);
        } else {
          setIsPlaying(false);
          isPlayingRef.current = false;
          setIsPaused(false);
        }
        return;
      }

      // Natural breath pause between sentences
      const pauseMs = latestSettings.pauseDurationMs ?? 280;
      if (pauseMs > 0) {
        pauseTimeoutRef.current = window.setTimeout(() => {
          if (isPlayingRef.current) {
            speakSentence(currentIdx + 1);
          }
        }, pauseMs);
      } else {
        speakSentence(currentIdx + 1);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('SpeechSynthesis error:', e.error);
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsPaused(false);
      }
    };

    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsPaused(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // --- Control Handlers ---
  const handlePlay = () => {
    if (sentences.length === 0) return;
    // On mobile, auto-switch to reader view so the user can see karaoke highlighting
    setMobileTab('reader');
    speakSentence(currentSentenceIndex);
  };

  const handlePause = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        speakSentence(currentSentenceIndex);
      }
    }
  };

  const handleStop = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsPaused(false);
  };

  const handlePrevSentence = () => {
    if (currentSentenceIndex > 0) {
      const newIdx = currentSentenceIndex - 1;
      if (isPlaying) {
        speakSentence(newIdx);
      } else {
        setCurrentSentenceIndex(newIdx);
      }
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      const newIdx = currentSentenceIndex + 1;
      if (isPlaying) {
        speakSentence(newIdx);
      } else {
        setCurrentSentenceIndex(newIdx);
      }
    }
  };

  const handleRepeatCurrentSentence = () => {
    speakSentence(currentSentenceIndex);
  };

  const handleSeekSentence = (index: number) => {
    if (index >= 0 && index < sentences.length) {
      if (isPlaying) {
        speakSentence(index);
      } else {
        setCurrentSentenceIndex(index);
      }
    }
  };

  const handleJumpToSentence = (index: number) => {
    speakSentence(index);
  };

  const handleUpdateSettings = (newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleTestVoice = (voiceURI: string, rate: number, pitch: number, volume: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    window.speechSynthesis.cancel();
    const testUtterance = new SpeechSynthesisUtterance('こんにちは。自然な読み上げのテスト中です。いかがでしょうか。');
    testUtterance.lang = 'ja-JP';
    testUtterance.rate = rate;
    testUtterance.pitch = pitch;
    testUtterance.volume = volume;
    if (voiceURI) {
      const matched = voices.find(v => v.voiceURI === voiceURI);
      if (matched) {
        testUtterance.voice = matched;
        testUtterance.lang = matched.lang || 'ja-JP';
      }
    }
    window.speechSynthesis.speak(testUtterance);
  };

  // --- Saved Texts Handlers ---
  const handleSaveCurrentText = (title: string) => {
    if (!text.trim()) return;
    const newItem: SavedTextItem = {
      id: Date.now().toString(),
      title,
      content: text,
      updatedAt: Date.now(),
      charCount: text.replace(/\s+/g, '').length,
      lastSentenceIndex: currentSentenceIndex,
    };
    setSavedTexts(prev => [newItem, ...prev]);
  };

  const handleLoadSavedText = (item: SavedTextItem) => {
    handleStop();
    setText(item.content);
    setCurrentSentenceIndex(item.lastSentenceIndex || 0);
  };

  const handleDeleteSavedText = (id: string) => {
    setSavedTexts(prev => prev.filter(t => t.id !== id));
  };

  const handleSelectSample = (sample: SampleText) => {
    handleStop();
    setText(sample.text);
    setCurrentSentenceIndex(0);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handlePlayStopToggle = () => {
    if (isPlaying && !isPaused) {
      handlePause();
    } else if (isPaused) {
      handleResume();
    } else {
      handlePlay();
    }
  };

  return (
    <div className={`h-[100dvh] h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} antialiased font-sans overflow-hidden`}>
      {/* Top Bar Contract (1 row, 3 zones) */}
      <Header
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        theme={theme}
        onToggleTheme={toggleTheme}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        onOpenDictionaryModal={() => setIsDictModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
        isPlaying={isPlaying && !isPaused}
        onPlayStopToggle={handlePlayStopToggle}
        hasContent={sentences.length > 0}
      />

      {/* Mobile Screen Segmented Tab Switcher (< md) */}
      <div className="md:hidden flex items-center justify-center p-1.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1 w-full max-w-sm bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'editor'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>テキスト編集</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('reader')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'reader'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>読み上げリーダー</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Canvas with Isolated Viewport Scrolling */}
      <main className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Editor Pane */}
        {((viewMode === 'split' && mobileTab === 'editor') ||
          (viewMode === 'split' && typeof window !== 'undefined' && window.innerWidth >= 768) ||
          viewMode === 'editor' ||
          (viewMode === 'split' /* desktop fallback */)) && (
          <div
            className={`
              ${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'}
              ${viewMode === 'split' && mobileTab !== 'editor' ? 'hidden md:flex' : 'flex'}
              h-full flex-col min-h-0
            `}
          >
            <EditorView
              text={text}
              onChangeText={(newText) => {
                setText(newText);
                handleStop();
                if (!newText.trim()) {
                  setCurrentSentenceIndex(0);
                }
              }}
              rate={settings.rate}
              onOpenSampleModal={() => setIsSampleModalOpen(true)}
            />
          </div>
        )}

        {/* Reader Pane */}
        {((viewMode === 'split' && mobileTab === 'reader') ||
          (viewMode === 'split' && typeof window !== 'undefined' && window.innerWidth >= 768) ||
          viewMode === 'reader') && (
          <div
            className={`
              ${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'}
              ${viewMode === 'split' && mobileTab !== 'reader' ? 'hidden md:flex' : 'flex'}
              h-full flex-col min-h-0 bg-white dark:bg-slate-900/60
            `}
          >
            <ReaderView
              sentences={sentences}
              currentSentenceIndex={currentSentenceIndex}
              isPlaying={isPlaying && !isPaused}
              onJumpToSentence={handleJumpToSentence}
              onRepeatSentence={handleRepeatCurrentSentence}
              autoScroll={settings.autoScroll}
              fontSize={fontSize}
              theme={theme}
              onOpenSampleModal={() => setIsSampleModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Primary Playback Deck (Docked at bottom) */}
      <ControlsBar
        isPlaying={isPlaying}
        isPaused={isPaused}
        currentSentenceIndex={currentSentenceIndex}
        totalSentences={sentences.length}
        settings={settings}
        onPlay={handlePlay}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
        onPrevSentence={handlePrevSentence}
        onNextSentence={handleNextSentence}
        onRepeatCurrentSentence={handleRepeatCurrentSentence}
        onSeekSentence={handleSeekSentence}
        onUpdateSettings={handleUpdateSettings}
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
        theme={theme}
        sleepTimerRemaining={sleepTimerRemaining}
      />

      {/* Modals */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        voices={voices}
        onTestVoice={handleTestVoice}
      />

      <PronunciationDictionaryModal
        isOpen={isDictModalOpen}
        onClose={() => setIsDictModalOpen(false)}
        rules={rules}
        onUpdateRules={setRules}
      />

      <SavedTextsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedTexts={savedTexts}
        onLoadText={handleLoadSavedText}
        onSaveCurrentText={handleSaveCurrentText}
        onDeleteText={handleDeleteSavedText}
        currentText={text}
      />

      <SampleTextModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
}
