/**
 * Speech Recognition utility for French CP learners
 * Wraps browser Web Speech Recognition (webkitSpeechRecognition / SpeechRecognition)
 */

// Extend window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export class FrenchSpeechListener {
  private recognition: any = null;
  private isListening = false;
  private callbacks: SpeechRecognitionCallbacks = {};

  constructor(callbacks: SpeechRecognitionCallbacks = {}) {
    this.callbacks = callbacks;
    this.initRecognition();
  }

  private initRecognition() {
    if (!isSpeechRecognitionSupported()) return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionClass();
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.callbacks.onResult?.(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        this.callbacks.onResult?.(interimTranscript.trim(), false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const errorMsg = event.error || 'Erreur de reconnaissance vocale';
      this.callbacks.onError?.(errorMsg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
    };
  }

  public start(): boolean {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        this.callbacks.onError?.('not-supported');
        return false;
      }
    }

    try {
      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('SpeechRecognition start error:', err);
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('SpeechRecognition stop error:', err);
      }
    }
    this.isListening = false;
  }

  public abort() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch (err) {
        console.warn('SpeechRecognition abort error:', err);
      }
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public setCallbacks(callbacks: SpeechRecognitionCallbacks) {
    this.callbacks = callbacks;
  }
}
