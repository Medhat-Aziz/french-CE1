import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  RotateCcw,
  Sparkles,
  Square,
  MessageSquare,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types/curriculum';
import { getTranslation } from '../translations/i18n';
import {
  speakFrench,
  stopSpeech,
  isAudioSpeaking,
  getCurrentVoiceProfile,
  getSpeechModeFromSpeed,
  SPEED_PRESETS,
} from '../utils/audio';
import {
  FrenchSpeechListener,
  isSpeechRecognitionSupported,
} from '../utils/speechRecognition';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'alouette';
  text: string;
  timestamp: string;
}

interface VoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundSpeed: number;
  onChangeSoundSpeed: (speed: number) => void;
  selectedVoiceName?: string;
  currentUnitId?: number | null;
}

export const VoiceChatModal: React.FC<VoiceChatModalProps> = ({
  isOpen,
  onClose,
  language,
  soundSpeed,
  onChangeSoundSpeed,
  selectedVoiceName,
  currentUnitId,
}) => {
  const t = getTranslation(language);
  const vc = t.voiceChat;

  const [activeTab, setActiveTab] = useState<'studio' | 'chat'>('studio');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);
  const [activeSentence, setActiveSentence] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([
    'Fais-moi une devinette !',
    'Entraîne-moi sur le son [a].',
    'Raconte-moi une petite histoire.',
    'Répète un mot avec moi.',
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listenerRef = useRef<FrenchSpeechListener | null>(null);

  // Initialize messages on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'welcome-' + Date.now(),
        sender: 'alouette',
        text: vc.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcome]);
      setActiveSentence(welcome.text);

      // Speak welcome if autoPlay is on
      if (autoPlayAudio) {
        setIsSpeaking(true);
        speakFrench(welcome.text, {
          rate: soundSpeed,
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    }
  }, [isOpen, vc.welcomeMessage]);

  // Keep track of speaking status from audio engine
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(isAudioSpeaking());
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // Initialize Speech Recognition listener
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) {
      return;
    }

    const listener = new FrenchSpeechListener({
      onStart: () => {
        setIsListening(true);
        setMicError(null);
        setInterimTranscript('');
        stopSpeech();
        setIsSpeaking(false);
      },
      onResult: (transcript, isFinal) => {
        setInterimTranscript(transcript);
        if (isFinal) {
          setIsListening(false);
          setInterimTranscript('');
          handleSendMessage(transcript);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setInterimTranscript('');
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setMicError(vc.micBlocked);
        } else if (err !== 'no-speech') {
          setMicError(`Erreur micro : ${err}`);
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    listenerRef.current = listener;

    return () => {
      listener.abort();
    };
  }, [vc.micBlocked]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, interimTranscript]);

  // Stop audio and speech recognition on modal close
  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      listenerRef.current?.stop();
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleToggleListening = () => {
    if (isListening) {
      listenerRef.current?.stop();
      setIsListening(false);
      if (interimTranscript.trim()) {
        const text = interimTranscript.trim();
        setInterimTranscript('');
        handleSendMessage(text);
      }
    } else {
      stopSpeech();
      setIsSpeaking(false);
      setMicError(null);
      const started = listenerRef.current?.start();
      if (!started && !isSpeechRecognitionSupported()) {
        setMicError(vc.speechNotSupported);
      }
    }
  };

  const handleStopSpeaking = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  const handleReplayText = (text: string) => {
    stopSpeech();
    setIsSpeaking(true);
    setActiveSentence(text);
    speakFrench(text, {
      rate: soundSpeed,
      onSentenceStart: (_idx, s) => setActiveSentence(s),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSendMessage = async (userText: string) => {
    const cleanText = userText.trim();
    if (!cleanText || isProcessing) return;

    setInputText('');
    setMicError(null);

    // Add user message to state
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsProcessing(true);

    try {
      // Call backend voice-chat endpoint
      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          unitId: currentUnitId,
          history: newHistory.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || 'Bravo ! Tu as une très jolie voix. Continuons à apprendre ensemble ! 🕊️';

      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }

      const alouetteMsg: ChatMessage = {
        id: 'alouette-' + Date.now(),
        sender: 'alouette',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, alouetteMsg]);
      setActiveSentence(replyText);

      // Play audio response automatically
      if (autoPlayAudio) {
        setIsSpeaking(true);
        speakFrench(replyText, {
          rate: soundSpeed,
          onSentenceStart: (_idx, s) => setActiveSentence(s),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } catch (err) {
      console.warn('Voice chat fetch failed, using gentle offline fallback:', err);
      // Gentle offline fallback
      const fallbackReply = 'C’est formidable ! Écoute bien et répète avec moi : a... i... u... Bravo, tu lis de mieux en mieux ! ⭐';
      const alouetteMsg: ChatMessage = {
        id: 'alouette-' + Date.now(),
        sender: 'alouette',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, alouetteMsg]);
      setActiveSentence(fallbackReply);

      if (autoPlayAudio) {
        setIsSpeaking(true);
        speakFrench(fallbackReply, {
          rate: soundSpeed,
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    stopSpeech();
    setIsSpeaking(false);
    const welcome: ChatMessage = {
      id: 'welcome-' + Date.now(),
      sender: 'alouette',
      text: vc.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcome]);
    setActiveSentence(welcome.text);
  };

  if (!isOpen) return null;

  const currentProfile = getCurrentVoiceProfile();
  const currentMode = getSpeechModeFromSpeed(soundSpeed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl h-[92vh] max-h-[820px] bg-linear-to-b from-amber-50/90 to-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-label={vc.title}
      >
        {/* Top Header Bar */}
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-2xl shadow-inner animate-bounce-gentle">
              🕊️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-white drop-shadow-xs">
                  {vc.title}
                </h2>
                <span className="hidden sm:inline-flex text-[11px] font-extrabold bg-amber-900/30 text-amber-100 px-2.5 py-0.5 rounded-full border border-white/20">
                  {vc.badge}
                </span>
              </div>
              <p className="text-xs text-amber-100 hidden sm:block font-medium">
                {vc.subtitle}
              </p>
            </div>
          </div>

          {/* Quick controls: Speed, Mute, Clear, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Speed Mode Toggle */}
            <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/20 text-xs font-bold">
              <button
                type="button"
                onClick={() => onChangeSoundSpeed(SPEED_PRESETS.slow)}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  currentMode === 'slow'
                    ? 'bg-white text-amber-900 shadow-xs'
                    : 'text-amber-100 hover:text-white'
                }`}
                title="Débit CP posé avec arrêt entre phrases"
              >
                <span>🐢</span>
                <span className="hidden md:inline">Lent</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeSoundSpeed(SPEED_PRESETS.normal)}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  currentMode === 'normal'
                    ? 'bg-white text-amber-900 shadow-xs'
                    : 'text-amber-100 hover:text-white'
                }`}
                title="Débit fluide"
              >
                <span>🐇</span>
                <span className="hidden md:inline">Normal</span>
              </button>
            </div>

            {/* Auto-Play Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                if (autoPlayAudio) {
                  stopSpeech();
                  setIsSpeaking(false);
                }
                setAutoPlayAudio(!autoPlayAudio);
              }}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                autoPlayAudio
                  ? 'bg-white/20 border-white/40 text-white hover:bg-white/30'
                  : 'bg-red-500/80 border-red-300 text-white hover:bg-red-500'
              }`}
              title={autoPlayAudio ? vc.autoPlayOn : vc.autoPlayOff}
            >
              {autoPlayAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset / Clear Chat */}
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white transition-all cursor-pointer"
              title={vc.clearChat}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/40 text-white transition-all cursor-pointer ml-1"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Tabs Bar */}
        <div className="bg-amber-100/70 border-b border-amber-200 px-4 sm:px-6 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-white text-amber-950 shadow-xs border border-amber-300 scale-102'
                  : 'text-amber-800 hover:text-amber-950 hover:bg-amber-200/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-orange-600" />
              <span>{vc.modeStudio}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white text-amber-950 shadow-xs border border-amber-300 scale-102'
                  : 'text-amber-800 hover:text-amber-950 hover:bg-amber-200/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
              <span>{vc.modeChat}</span>
              {messages.length > 1 && (
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                  {messages.length}
                </span>
              )}
            </button>
          </div>

          {/* Voice calibration info badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-amber-900/80 bg-white/70 px-2.5 py-1 rounded-lg border border-amber-200/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{currentProfile.name}</span>
            <span className="text-amber-600">({soundSpeed.toFixed(2)}x)</span>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'studio' ? (
          /* ========================================================= */
          /* MODE STUDIO VOCAL IMMERSIF (Live Voice Orb & Audio Wave)  */
          /* ========================================================= */
          <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto">
            {/* Companion Spoken Response Banner */}
            <div className="w-full max-w-2xl bg-white/90 rounded-2xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm relative text-center min-h-[100px] flex flex-col justify-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="text-lg">🕊️</span>
                <span className="text-xs font-black tracking-wider uppercase text-amber-800">
                  {isSpeaking ? vc.speaking : isProcessing ? vc.thinking : 'Petite Alouette vous dit :'}
                </span>
              </div>

              <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed font-reading">
                « {activeSentence || (messages[messages.length - 1]?.text ?? vc.welcomeMessage)} »
              </p>

              {/* Action buttons under response */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {isSpeaking ? (
                  <button
                    type="button"
                    onClick={handleStopSpeaking}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl border border-red-200 cursor-pointer transition-transform hover:scale-105"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>{vc.stopSpeech}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleReplayText(activeSentence || messages[messages.length - 1]?.text || vc.welcomeMessage)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 cursor-pointer transition-transform hover:scale-105"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{vc.replay}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Central Animated Voice Orb */}
            <div className="my-4 sm:my-6 flex flex-col items-center justify-center relative">
              {/* Outer Pulse Rings */}
              <div
                className={`absolute w-56 h-56 rounded-full transition-all duration-700 pointer-events-none ${
                  isListening
                    ? 'bg-rose-400/25 animate-ping scale-110'
                    : isSpeaking
                    ? 'bg-amber-400/25 animate-pulse scale-105'
                    : 'bg-amber-200/20'
                }`}
              />

              <div
                className={`absolute w-44 h-44 rounded-full transition-all duration-500 pointer-events-none ${
                  isListening
                    ? 'bg-rose-400/35 animate-pulse'
                    : isSpeaking
                    ? 'bg-amber-300/35 animate-pulse'
                    : 'bg-amber-100/40'
                }`}
              />

              {/* Main Interactive Tap-to-Talk Button */}
              <button
                type="button"
                onClick={handleToggleListening}
                className={`relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl cursor-pointer select-none active:scale-95 ${
                  isListening
                    ? 'bg-linear-to-tr from-rose-600 to-red-500 text-white ring-8 ring-rose-200 animate-pulse'
                    : isSpeaking
                    ? 'bg-linear-to-tr from-amber-500 to-orange-500 text-white ring-8 ring-amber-200'
                    : isProcessing
                    ? 'bg-linear-to-tr from-amber-400 to-yellow-500 text-amber-950 ring-6 ring-amber-100'
                    : 'bg-linear-to-tr from-amber-500 via-orange-500 to-amber-600 text-white ring-6 ring-amber-100 hover:scale-105'
                }`}
                title={isListening ? vc.tapToStop : vc.tapToSpeak}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-10 h-10 mb-1 animate-bounce" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Écoute...</span>
                  </>
                ) : isSpeaking ? (
                  <>
                    <Volume2 className="w-10 h-10 mb-1 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Parle...</span>
                  </>
                ) : isProcessing ? (
                  <>
                    <Sparkles className="w-9 h-9 mb-1 animate-spin" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Réflexion</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-11 h-11 mb-1 drop-shadow-xs" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Parler</span>
                  </>
                )}
              </button>

              {/* Status Indicator Label */}
              <div className="mt-4 text-center">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black shadow-xs ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : isSpeaking
                      ? 'bg-amber-500 text-white'
                      : isProcessing
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isListening
                        ? 'bg-white'
                        : isSpeaking
                        ? 'bg-white'
                        : 'bg-amber-600'
                    }`}
                  />
                  <span>
                    {isListening
                      ? vc.listening
                      : isSpeaking
                      ? vc.speaking
                      : isProcessing
                      ? vc.thinking
                      : vc.tapToSpeak}
                  </span>
                </span>

                {/* Real-time transcribed text from microphone */}
                {interimTranscript && (
                  <p className="mt-2 text-sm font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200 animate-fade-in max-w-md mx-auto">
                    « {interimTranscript} »
                  </p>
                )}

                {/* Mic error message if any */}
                {micError && (
                  <div className="mt-2 text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-xl border border-red-200 max-w-md mx-auto flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{micError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Suggestions Chips for CP Learners */}
            <div className="w-full max-w-2xl bg-amber-50/80 rounded-2xl p-3 border border-amber-200/80 mt-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>{vc.suggestionsTitle}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isProcessing}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/90 text-amber-950 border border-amber-300 shadow-2xs hover:scale-102 transition-all cursor-pointer disabled:opacity-50 text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* MODE DIALOGUE & ÉCRIT (Chat Message Bubbles)              */
          /* ========================================================= */
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
            {/* Scrollable Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-2xs ${
                        isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-linear-to-tr from-amber-500 to-orange-500 text-white'
                      }`}
                    >
                      {isUser ? '🧒' : '🕊️'}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[82%] sm:max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-white border-2 border-amber-200 text-slate-800 rounded-tl-xs font-reading'
                      }`}
                    >
                      <p className="font-semibold">{msg.text}</p>

                      <div
                        className={`flex items-center justify-between gap-3 mt-2 text-[10px] ${
                          isUser ? 'text-blue-200' : 'text-slate-400'
                        }`}
                      >
                        <span>{msg.timestamp}</span>

                        {/* Audio Replay for this message */}
                        <button
                          type="button"
                          onClick={() => handleReplayText(msg.text)}
                          className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            isUser
                              ? 'hover:bg-blue-700 text-white'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200'
                          }`}
                          title="Écouter ce message"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{vc.replay}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Processing indicator */}
              {isProcessing && (
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100/60 p-2.5 rounded-2xl w-fit">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                  <span>{vc.thinking}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips above text input */}
            <div className="flex flex-wrap gap-1.5 py-2 overflow-x-auto">
              {suggestions.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isProcessing}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Text & Mic Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-2 pt-2 border-t border-amber-200"
            >
              <button
                type="button"
                onClick={handleToggleListening}
                className={`p-3 rounded-2xl transition-all shadow-xs cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                }`}
                title={isListening ? vc.tapToStop : vc.tapToSpeak}
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={vc.typePlaceholder}
                disabled={isProcessing}
                className="flex-1 bg-white border-2 border-amber-300 focus:border-orange-500 focus:outline-hidden rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-inner"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{vc.send}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
