/**
 * Natural French Speech Synthesis Engine for CP Learners (Petite Alouette)
 * 
 * Features:
 * - Prioritizes high-fidelity, natural neural French voices (Google français, Microsoft Natural, Apple Siri/Enhanced)
 * - Gentle, articulate reading pace adapted for young CP learners
 * - Sentence-by-sentence queue with distinct, natural pauses and stops at sentence boundaries (., !, ?, :, \n)
 * - Robust cancellation and state management to prevent audio stutter or overlap
 */

export type SpeechMode = 'slow' | 'normal';

export const SPEED_PRESETS = {
  slow: 0.78,
  normal: 0.95,
} as const;

export const getSpeechModeFromSpeed = (speed: number): SpeechMode => {
  return speed <= 0.85 ? 'slow' : 'normal';
};

export interface SpeakOptions {
  rate?: number;
  mode?: SpeechMode;
  pitch?: number;
  pauseBetweenSentencesMs?: number;
  onStart?: () => void;
  onSentenceStart?: (index: number, sentence: string) => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

let cachedFrenchVoice: SpeechSynthesisVoice | null = null;
let activeTimeoutId: ReturnType<typeof setTimeout> | null = null;
let isPlaybackActive = false;
let playbackSessionId = 0;
let voicesInitialized = false;

/**
 * Searches and selects the highest quality, most natural sounding French voice available in the browser.
 */
export const findBestNaturalFrenchVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return cachedFrenchVoice;
  }

  // Filter for all French voices
  const frenchVoices = voices.filter(
    (v) => v.lang && (v.lang.toLowerCase().startsWith('fr-') || v.lang.toLowerCase() === 'fr')
  );

  if (frenchVoices.length === 0) {
    // If no explicit French voice, check if any voice has "french" in its name
    const namedFrench = voices.find((v) => v.name.toLowerCase().includes('french') || v.name.toLowerCase().includes('français'));
    if (namedFrench) {
      cachedFrenchVoice = namedFrench;
      return namedFrench;
    }
    return null;
  }

  // Prioritize premium natural / neural / online human voices
  const naturalKeywords = [
    'natural',
    'neural',
    'online',
    'google français',
    'thomas',
    'audrey',
    'aurelie',
    'aurélie',
    'denise',
    'henri',
    'siri',
    'premium',
    'enhanced',
    'celine',
    'céline',
    'mathieu',
    'julie',
  ];

  // 1. Check for premium/natural voices in fr-FR
  for (const kw of naturalKeywords) {
    const match = frenchVoices.find(
      (v) =>
        v.lang.toLowerCase().includes('fr-fr') &&
        v.name.toLowerCase().includes(kw)
    );
    if (match) {
      cachedFrenchVoice = match;
      return match;
    }
  }

  // 2. Check for any natural/neural French voice (including Canada/Belgium/Switzerland)
  for (const kw of naturalKeywords) {
    const match = frenchVoices.find((v) =>
      v.name.toLowerCase().includes(kw)
    );
    if (match) {
      cachedFrenchVoice = match;
      return match;
    }
  }

  // 3. Prefer fr-FR standard voices
  const standardFrFR = frenchVoices.find(
    (v) => v.lang.toLowerCase() === 'fr-fr' || v.lang.toLowerCase().startsWith('fr-fr')
  );
  if (standardFrFR) {
    cachedFrenchVoice = standardFrFR;
    return standardFrFR;
  }

  // 4. Default to first available French voice
  cachedFrenchVoice = frenchVoices[0];
  return frenchVoices[0];
};

/**
 * Initializes browser speech synthesis and warms up voice cache.
 */
export const initAudioVoices = (): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  if (voicesInitialized) return;
  voicesInitialized = true;

  // Initial lookup
  findBestNaturalFrenchVoice();

  // Listen for voiceschanged event (populated asynchronously in modern browsers)
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      findBestNaturalFrenchVoice();
    };
  }
};

/**
 * Cancels any active speech, stops timeouts, and resets playback state.
 */
export const stopSpeech = (): void => {
  playbackSessionId++;
  isPlaybackActive = false;

  if (activeTimeoutId) {
    clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('speechSynthesis.cancel error:', e);
    }
  }
};

/**
 * Splits text into natural sentence segments with punctuation-aware pause durations.
 * Specifically configured for French CP learning: distinct pause/stop at the end of every sentence.
 */
export const splitIntoSentences = (
  text: string,
  mode: SpeechMode = 'slow'
): { text: string; pauseAfterMs: number }[] => {
  const cleaned = text
    .replace(/\[\.\.\.\]/g, '')
    .replace(/[«»]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return [];

  // Match sentence segments terminating with . ! ? : or newline
  // Keep the punctuation attached to the sentence
  const rawSegments = cleaned.split(/(?<=[.!?:\n])\s+/);
  const results: { text: string; pauseAfterMs: number }[] = [];

  const isSlow = mode === 'slow';

  for (const segment of rawSegments) {
    const trimmed = segment.trim();
    if (!trimmed) continue;

    // Tailored pause duration based on mode and terminal punctuation:
    // Slow mode: noticeable pause (850ms - 950ms) for CP learners to absorb sentence meaning
    // Normal mode: brief pause (450ms - 500ms) to ensure sentences do not run together
    let pauseMs = isSlow ? 850 : 450;

    if (trimmed.endsWith('?') || trimmed.endsWith('!')) {
      pauseMs = isSlow ? 950 : 500;
    } else if (trimmed.endsWith(':') || trimmed.endsWith(';')) {
      pauseMs = isSlow ? 700 : 380;
    } else if (trimmed.endsWith('.')) {
      pauseMs = isSlow ? 850 : 450;
    } else {
      pauseMs = isSlow ? 600 : 320;
    }

    results.push({
      text: trimmed,
      pauseAfterMs: pauseMs,
    });
  }

  return results.length > 0
    ? results
    : [{ text: cleaned, pauseAfterMs: isSlow ? 800 : 400 }];
};

/**
 * Speaks French text with natural language voice selection, gentle CP pacing,
 * and a clear pause/stop at the end of each sentence.
 */
export const speakFrench = (
  text: string,
  options: SpeakOptions = {}
): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    options.onError?.(new Error('Audio not supported in this environment'));
    return false;
  }

  // Cancel any active speech or pending queue
  stopSpeech();

  // Determine effective mode and speed
  const effectiveMode: SpeechMode =
    options.mode || (options.rate ? getSpeechModeFromSpeed(options.rate) : 'slow');

  // Rate: CP learners require a gentle, articulate pace
  const targetRate =
    options.rate ?? (effectiveMode === 'slow' ? SPEED_PRESETS.slow : SPEED_PRESETS.normal);

  const sentences = splitIntoSentences(text, effectiveMode);
  if (sentences.length === 0) return false;

  const voice = cachedFrenchVoice || findBestNaturalFrenchVoice();

  const thisSessionId = ++playbackSessionId;
  isPlaybackActive = true;

  const targetPitch = options.pitch ?? 1.0;
  const userPauseMs = options.pauseBetweenSentencesMs;

  let currentIndex = 0;

  const playNextSentence = () => {
    // If playback was cancelled or replaced by another session, stop immediately
    if (!isPlaybackActive || playbackSessionId !== thisSessionId) {
      return;
    }

    if (currentIndex >= sentences.length) {
      isPlaybackActive = false;
      options.onEnd?.();
      return;
    }

    const currentItem = sentences[currentIndex];
    const utterance = new SpeechSynthesisUtterance(currentItem.text);
    utterance.lang = 'fr-FR';
    utterance.rate = targetRate;
    utterance.pitch = targetPitch;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      if (playbackSessionId !== thisSessionId) return;
      if (currentIndex === 0) {
        options.onStart?.();
      }
      options.onSentenceStart?.(currentIndex, currentItem.text);
    };

    utterance.onend = () => {
      if (playbackSessionId !== thisSessionId) return;

      currentIndex++;

      if (currentIndex < sentences.length) {
        // NATURAL STOP AT THE END OF THE SENTENCE
        // Insert silence pause before speaking the next sentence
        const pauseDuration = userPauseMs ?? currentItem.pauseAfterMs;

        activeTimeoutId = setTimeout(() => {
          activeTimeoutId = null;
          playNextSentence();
        }, pauseDuration);
      } else {
        // Finished all sentences
        isPlaybackActive = false;
        options.onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      if (playbackSessionId !== thisSessionId) return;
      console.warn('SpeechSynthesis utterance error:', e);
      // Proceed to next or complete gracefully
      currentIndex++;
      if (currentIndex < sentences.length) {
        activeTimeoutId = setTimeout(playNextSentence, 200);
      } else {
        isPlaybackActive = false;
        options.onEnd?.();
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('SpeechSynthesis.speak failed:', err);
      isPlaybackActive = false;
      options.onError?.(err);
    }
  };

  playNextSentence();
  return true;
};

export const isAudioSpeaking = (): boolean => {
  return isPlaybackActive;
};
