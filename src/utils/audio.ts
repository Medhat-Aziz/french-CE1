/**
 * Natural French Speech Synthesis Engine for CP Learners (Petite Alouette)
 * Calibrated to match the requested male, calm, baritone pedagogical voice:
 * - Prioritizes male French natural/neural voices (Thomas, Paul, Henri, Sébastien, Nicolas, Mathieu)
 * - Deep, warm baritone pitch calibration (0.88 default, or 0.83 on female fallback voices)
 * - Gentle, unhurried CP reading pace (0.76x slow, 0.90x normal)
 * - Sentence-by-sentence queue with distinct, natural stops at sentence boundaries (., !, ?, :, \n)
 * - Supports custom voice selection & persistent preference
 */

export type SpeechMode = 'slow' | 'normal';

export const SPEED_PRESETS = {
  slow: 0.76,
  normal: 0.90,
} as const;

export const getSpeechModeFromSpeed = (speed: number): SpeechMode => {
  return speed <= 0.84 ? 'slow' : 'normal';
};

export interface SpeakOptions {
  rate?: number;
  mode?: SpeechMode;
  pitch?: number;
  voiceName?: string;
  pauseBetweenSentencesMs?: number;
  onStart?: () => void;
  onSentenceStart?: (index: number, sentence: string) => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export interface VoiceItem {
  voice: SpeechSynthesisVoice;
  isMale: boolean;
  isRecommended: boolean;
  displayName: string;
}

// Male voice keywords for French speech synthesis
const MALE_VOICE_KEYWORDS = [
  'paul',
  'thomas',
  'henri',
  'claude',
  'jerome',
  'jérôme',
  'nicolas',
  'sebastien',
  'sébastien',
  'mathieu',
  'alain',
  'homme',
  'male',
  'guy',
  'bernard',
];

// Female voice keywords to avoid when seeking the male voice profile
const FEMALE_VOICE_KEYWORDS = [
  'audrey',
  'aurelie',
  'aurélie',
  'denise',
  'julie',
  'celine',
  'céline',
  'amelie',
  'amélie',
  'chloe',
  'chloé',
  'hortense',
  'female',
  'femme',
];

let cachedFrenchVoice: SpeechSynthesisVoice | null = null;
let userSelectedVoiceName: string | null = null;
let activeTimeoutId: ReturnType<typeof setTimeout> | null = null;
let isPlaybackActive = false;
let playbackSessionId = 0;
let voicesInitialized = false;

/**
 * Checks if a voice matches male characteristics
 */
export const isVoiceMale = (voice: SpeechSynthesisVoice): boolean => {
  const name = voice.name.toLowerCase();
  for (const kw of MALE_VOICE_KEYWORDS) {
    if (name.includes(kw)) return true;
  }
  for (const kw of FEMALE_VOICE_KEYWORDS) {
    if (name.includes(kw)) return false;
  }
  return false;
};

/**
 * Gets all French voices available in the browser with male tagging and recommendation flags
 */
export const getAvailableFrenchVoices = (): VoiceItem[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices() || [];
  const frenchVoices = voices.filter(
    (v) =>
      (v.lang && (v.lang.toLowerCase().startsWith('fr-') || v.lang.toLowerCase() === 'fr')) ||
      v.name.toLowerCase().includes('français') ||
      v.name.toLowerCase().includes('french')
  );

  return frenchVoices.map((v) => {
    const isMale = isVoiceMale(v);
    const isNatural =
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('online') ||
      v.name.toLowerCase().includes('neural') ||
      v.name.toLowerCase().includes('premium') ||
      v.name.toLowerCase().includes('enhanced');

    const isRecommended = isMale && isNatural;

    let cleanName = v.name.replace(/Microsoft /g, '').replace(/ Online \(Natural\)/g, ' Natural');
    if (isMale) {
      cleanName += ' 🎙️ (Masculin)';
    }

    return {
      voice: v,
      isMale,
      isRecommended,
      displayName: cleanName,
    };
  });
};

/**
 * Explicitly sets the user's preferred voice name
 */
export const setUserSelectedVoice = (voiceName: string | null): void => {
  userSelectedVoiceName = voiceName && voiceName.trim() ? voiceName : null;
  cachedFrenchVoice = null; // force re-query
};

export const getUserSelectedVoice = (): string | null => {
  return userSelectedVoiceName;
};

/**
 * Searches and selects the requested male, calm French pedagogical voice.
 * Prioritizes natural male voices (Thomas, Paul, Henri, Sébastien, Nicolas).
 */
export const findBestNaturalFrenchVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return cachedFrenchVoice;
  }

  // 1. If user explicitly picked a voice that exists, respect their choice
  if (userSelectedVoiceName) {
    const userVoice = voices.find((v) => v.name === userSelectedVoiceName);
    if (userVoice) {
      cachedFrenchVoice = userVoice;
      return userVoice;
    }
  }

  // 2. Filter for French voices
  const frenchVoices = voices.filter(
    (v) =>
      (v.lang && (v.lang.toLowerCase().startsWith('fr-') || v.lang.toLowerCase() === 'fr')) ||
      v.name.toLowerCase().includes('français') ||
      v.name.toLowerCase().includes('french')
  );

  if (frenchVoices.length === 0) {
    return null;
  }

  // 3. Search for top-tier natural/neural MALE French voices
  for (const kw of MALE_VOICE_KEYWORDS) {
    const match = frenchVoices.find(
      (v) =>
        v.name.toLowerCase().includes(kw) &&
        (v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('online') ||
          v.name.toLowerCase().includes('neural') ||
          v.name.toLowerCase().includes('enhanced'))
    );
    if (match) {
      cachedFrenchVoice = match;
      return match;
    }
  }

  // 4. Search for any standard MALE French voice (e.g., Apple Thomas, Nicolas, Sébastien)
  for (const kw of MALE_VOICE_KEYWORDS) {
    const match = frenchVoices.find((v) => v.name.toLowerCase().includes(kw));
    if (match) {
      cachedFrenchVoice = match;
      return match;
    }
  }

  // 5. Look for French voices that are NOT female
  const nonFemaleFrFR = frenchVoices.find((v) => {
    const name = v.name.toLowerCase();
    const isFemale = FEMALE_VOICE_KEYWORDS.some((kw) => name.includes(kw));
    return !isFemale && (v.lang.toLowerCase().includes('fr-fr') || v.lang.toLowerCase() === 'fr');
  });
  if (nonFemaleFrFR) {
    cachedFrenchVoice = nonFemaleFrFR;
    return nonFemaleFrFR;
  }

  // 6. Prefer standard fr-FR voice
  const standardFrFR = frenchVoices.find(
    (v) => v.lang.toLowerCase() === 'fr-fr' || v.lang.toLowerCase().startsWith('fr-fr')
  );
  if (standardFrFR) {
    cachedFrenchVoice = standardFrFR;
    return standardFrFR;
  }

  // 7. Fallback to first available French voice
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

  findBestNaturalFrenchVoice();

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
  const rawSegments = cleaned.split(/(?<=[.!?:\n])\s+/);
  const results: { text: string; pauseAfterMs: number }[] = [];

  const isSlow = mode === 'slow';

  for (const segment of rawSegments) {
    const trimmed = segment.trim();
    if (!trimmed) continue;

    // Noticeable pause after sentences (850ms - 950ms in slow mode) matching user recording
    let pauseMs = isSlow ? 900 : 480;

    if (trimmed.endsWith('?') || trimmed.endsWith('!')) {
      pauseMs = isSlow ? 950 : 520;
    } else if (trimmed.endsWith(':') || trimmed.endsWith(';')) {
      pauseMs = isSlow ? 720 : 380;
    } else if (trimmed.endsWith('.')) {
      pauseMs = isSlow ? 900 : 480;
    } else {
      pauseMs = isSlow ? 620 : 320;
    }

    results.push({
      text: trimmed,
      pauseAfterMs: pauseMs,
    });
  }

  return results.length > 0
    ? results
    : [{ text: cleaned, pauseAfterMs: isSlow ? 850 : 450 }];
};

/**
 * Speaks French text with the calibrated male pedagogical voice, gentle CP pacing,
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

  stopSpeech();

  // Determine effective mode and speed
  const effectiveMode: SpeechMode =
    options.mode || (options.rate ? getSpeechModeFromSpeed(options.rate) : 'slow');

  const targetRate =
    options.rate ?? (effectiveMode === 'slow' ? SPEED_PRESETS.slow : SPEED_PRESETS.normal);

  const sentences = splitIntoSentences(text, effectiveMode);
  if (sentences.length === 0) return false;

  const voice = cachedFrenchVoice || findBestNaturalFrenchVoice();

  // Pitch calibration to match the deep, calm male voice sample:
  // If the voice is explicitly male, pitch 0.88 gives a warm, calm baritone.
  // If only a female voice is available on this browser, pitch 0.83 lowers the formant to sound masculine.
  const isMale = voice ? isVoiceMale(voice) : true;
  const defaultCalibratedPitch = isMale ? 0.88 : 0.83;
  const targetPitch = options.pitch ?? defaultCalibratedPitch;

  const thisSessionId = ++playbackSessionId;
  isPlaybackActive = true;
  const userPauseMs = options.pauseBetweenSentencesMs;

  let currentIndex = 0;

  const playNextSentence = () => {
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
        // DISTINCT STOP AT SENTENCE BOUNDARY
        const pauseDuration = userPauseMs ?? currentItem.pauseAfterMs;

        activeTimeoutId = setTimeout(() => {
          activeTimeoutId = null;
          playNextSentence();
        }, pauseDuration);
      } else {
        isPlaybackActive = false;
        options.onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      if (playbackSessionId !== thisSessionId) return;
      console.warn('SpeechSynthesis utterance error:', e);
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

/**
 * Returns current active voice name and profile
 */
export const getCurrentVoiceProfile = (): { name: string; isMale: boolean } => {
  const v = cachedFrenchVoice || findBestNaturalFrenchVoice();
  if (!v) {
    return { name: 'Voix masculine par défaut', isMale: true };
  }
  return {
    name: v.name,
    isMale: isVoiceMale(v),
  };
};
