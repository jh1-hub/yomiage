/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SentenceItem, PronunciationRule } from '../types';

/**
 * Splits Japanese & multilingual text into natural sentence units while preserving paragraph structure.
 */
export function segmentText(rawText: string): SentenceItem[] {
  if (!rawText.trim()) return [];

  const sentences: SentenceItem[] = [];
  const paragraphs = rawText.split(/\r?\n/);
  let globalCharIndex = 0;
  let sentenceId = 0;

  paragraphs.forEach((paragraph, pIndex) => {
    const trimmedParagraph = paragraph.trim();

    if (trimmedParagraph === '') {
      // Empty paragraph / line break
      globalCharIndex += paragraph.length + 1; // +1 for the newline
      return;
    }

    // Split within paragraph by Japanese/Western sentence delimiters: 。 ！？ ! ?
    // Keeping delimiters attached to sentence
    const regex = /([^。！？!?]+[。！？!?]*)/g;
    let match: RegExpExecArray | null;

    let paragraphHandled = false;

    while ((match = regex.exec(paragraph)) !== null) {
      const segment = match[0].trim();
      if (segment) {
        paragraphHandled = true;
        const startIndex = globalCharIndex + match.index;
        const endIndex = startIndex + match[0].length;
        sentences.push({
          id: sentenceId++,
          text: segment,
          startIndex,
          endIndex,
          paragraphIndex: pIndex,
        });
      }
    }

    // Fallback if regex didn't capture (e.g. no punctuation or odd symbols)
    if (!paragraphHandled && trimmedParagraph) {
      sentences.push({
        id: sentenceId++,
        text: trimmedParagraph,
        startIndex: globalCharIndex,
        endIndex: globalCharIndex + paragraph.length,
        paragraphIndex: pIndex,
      });
    }

    globalCharIndex += paragraph.length + 1;
  });

  return sentences;
}

/**
 * Applies custom pronunciation rules to text before synthesis.
 */
export function applyPronunciationRules(text: string, rules: PronunciationRule[]): string {
  let result = text;
  for (const rule of rules) {
    if (!rule.enabled || !rule.pattern.trim()) continue;
    try {
      const escaped = rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp(escaped, 'gi');
      result = result.replace(reg, rule.replacement);
    } catch {
      // Skip invalid regex
    }
  }
  return result;
}

/**
 * Transforms text to make it sound far more natural in Japanese Speech Synthesis.
 * - Adds breathing commas after key conjunctions
 * - Converts half-width katakana to full-width so TTS pronounces correctly
 * - Normalizes URLs, brackets, and noisy symbols
 */
export function naturalizeJapaneseText(text: string): string {
  if (!text) return '';

  let t = text;

  // Convert half-width katakana to full-width katakana
  const halfToFullMap: Record<string, string> = {
    'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
    'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
    'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
    'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
    'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
    'ｳﾞ': 'ヴ',
    'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
    'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
    'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
    'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
    'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
    'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
    'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
    'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
    'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
    'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
    'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
    'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
    'ｰ': 'ー', '｡': '。', '｢': '「', '｣': '」', '､': '、'
  };

  // Replace combined dakuten first
  for (const [half, full] of Object.entries(halfToFullMap)) {
    t = t.split(half).join(full);
  }

  // Replace raw URLs with "ウェブサイト" so TTS doesn't read http/slash/slash
  t = t.replace(/https?:\/\/[^\s]+/g, 'ウェブサイト');

  // Replace multiple punctuation marks like ！？！？ or 。。。 with single clean mark
  t = t.replace(/[！？!?]{2,}/g, '！');
  t = t.replace(/[。\.]{2,}/g, '。');
  t = t.replace(/[、,]{2,}/g, '、');

  // Insert natural breathing pause (comma) after common Japanese conjunctions if omitted
  const conjunctions = [
    'しかし', 'また', 'そして', 'さらに', 'その結果', 'そのため',
    '一方で', '一方', '例えば', 'なお', 'ただし', 'つまり', 'したがって'
  ];
  conjunctions.forEach((conj) => {
    // Match conjunction at start of line or after punctuation when not followed by a comma
    const regex = new RegExp(`(^|[。！？\n])(${conj})(?![、，,])`, 'g');
    t = t.replace(regex, '$1$2、');
  });

  return t;
}

/**
 * Classifies and ranks voices to ensure neural / high-quality natural voices are prioritized.
 */
export function rankAndSortVoices(voices: SpeechSynthesisVoice[]): {
  naturalJapanese: SpeechSynthesisVoice[];
  standardJapanese: SpeechSynthesisVoice[];
  otherVoices: SpeechSynthesisVoice[];
} {
  const isJp = (v: SpeechSynthesisVoice) =>
    v.lang.startsWith('ja') || v.lang.startsWith('JP') || v.name.includes('Japan') || v.name.includes('日本語');

  const isNatural = (v: SpeechSynthesisVoice) => {
    const n = v.name.toLowerCase();
    return (
      n.includes('natural') ||
      n.includes('neural') ||
      n.includes('online') ||
      n.includes('google') ||
      n.includes('enhanced') ||
      n.includes('kyoko') ||
      n.includes('otoya') ||
      n.includes('nanami') ||
      n.includes('keiko') ||
      n.includes('daichi') ||
      n.includes('shiori') ||
      n.includes('siri')
    );
  };

  const naturalJapanese: SpeechSynthesisVoice[] = [];
  const standardJapanese: SpeechSynthesisVoice[] = [];
  const otherVoices: SpeechSynthesisVoice[] = [];

  voices.forEach((v) => {
    if (isJp(v)) {
      if (isNatural(v)) {
        naturalJapanese.push(v);
      } else {
        standardJapanese.push(v);
      }
    } else {
      otherVoices.push(v);
    }
  });

  return { naturalJapanese, standardJapanese, otherVoices };
}

/**
 * Estimate reading duration in minutes and seconds based on character count and rate.
 * Average Japanese speech speed is ~350 characters per minute at 1.0x rate.
 */
export function estimateReadingTime(text: string, rate: number): { minutes: number; seconds: number; formatted: string } {
  const chars = text.replace(/\s+/g, '').length;
  if (chars === 0) return { minutes: 0, seconds: 0, formatted: '0秒' };

  const effectiveSpeed = Math.max(0.5, rate) * 350; // chars per minute
  const totalSeconds = Math.round((chars / effectiveSpeed) * 60);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let formatted = '';
  if (minutes > 0) {
    formatted = `${minutes}分${seconds}秒`;
  } else {
    formatted = `${seconds}秒`;
  }

  return { minutes, seconds, formatted };
}
