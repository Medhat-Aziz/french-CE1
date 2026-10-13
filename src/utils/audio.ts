/**
 * Web Speech Synthesis Audio Utility for French CP Pronunciation
 * Provides reliable, zero-latency text-to-speech with rate controls and fallbacks.
 */

let activeUtterance: SpeechSynthesisUtterance | null = null;
let currentFrenchVoice: SpeechSynthesisVoice | null = null;

export const initAudioVoices = (): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  const updateVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    // Prioritize fr-FR native voices
    const frVoices = voices.filter(v => v.lang.startsWith('fr'));
    if (frVoices.length > 0) {
      currentFrenchVoice = frVoices.find(v => v.lang === 'fr-FR') || frVoices[0];
    }
  };

  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
};

export const stopSpeech = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    } catch {
      // safe fallback
    }
  }
};

export interface SpeakOptions {
  rate?: number; // 0.8 for slow, 1.0 for normal
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export const speakFrench = (
  text: string,
  options: SpeakOptions = {}
): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    options.onError?.(new Error('Audio not supported in this environment'));
    return false;
  }

  try {
    stopSpeech();

    // Clean text of markdown or bracket notes if needed
    const cleanedText = text
      .replace(/\[\.\.\.\]/g, '')
      .replace(/[«»]/g, '')
      .trim();

    if (!cleanedText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'fr-FR';
    utterance.rate = options.rate || 0.95; // slightly relaxed for CP young learners
    utterance.pitch = options.pitch || 1.05; // slightly friendly warm pitch for CP

    if (currentFrenchVoice) {
      utterance.voice = currentFrenchVoice;
    } else {
      const voices = window.speechSynthesis.getVoices();
      const fallbackVoice = voices.find(v => v.lang.startsWith('fr'));
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
        currentFrenchVoice = fallbackVoice;
      }
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      options.onError?.(e);
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error('SpeechSynthesis error:', error);
    options.onError?.(error);
    return false;
  }
};

export const isAudioSpeaking = (): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
};
