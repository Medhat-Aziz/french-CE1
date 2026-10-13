import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Search,
  Menu,
  X,
  BookOpen,
  FileText,
  Printer,
  Table,
  Mic,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Language } from '../types/curriculum';
import { getTranslation } from '../translations/i18n';
import { allUnits } from '../data/curriculumData';
import {
  speakFrench,
  stopSpeech,
  isAudioSpeaking,
  getAvailableFrenchVoices,
  VoiceItem,
  getCurrentVoiceProfile,
} from '../utils/audio';

export type WebsiteView = 'home' | 'units' | 'method' | 'matrix' | 'worksheets';

interface NavbarProps {
  currentView: WebsiteView;
  onChangeView: (view: WebsiteView) => void;
  currentUnitId: number | null;
  onSelectUnit: (unitId: number | null) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  starsEarned: number;
  soundSpeed: number;
  onChangeSoundSpeed: (speed: number) => void;
  selectedVoiceName?: string;
  onSelectVoice?: (voiceName: string) => void;
  onOpenPreparatory: () => void;
  onOpenQuickQuiz?: () => void;
  onOpenVoiceChat?: () => void;
  onOpenDictionary: () => void;
  onOpenReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onChangeView,
  currentUnitId,
  onSelectUnit,
  language,
  onSelectLanguage,
  starsEarned,
  soundSpeed,
  onChangeSoundSpeed,
  selectedVoiceName = '',
  onSelectVoice,
  onOpenPreparatory,
  onOpenQuickQuiz,
  onOpenVoiceChat,
  onOpenDictionary,
  onOpenReport,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceMenuOpen, setVoiceMenuOpen] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<VoiceItem[]>([]);
  const voiceMenuRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);

  // Load available French voices
  useEffect(() => {
    const updateVoices = () => {
      const list = getAvailableFrenchVoices();
      setAvailableVoices(list);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Close voice dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (voiceMenuRef.current && !voiceMenuRef.current.contains(event.target as Node)) {
        setVoiceMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTestSpeech = () => {
    if (isTestingAudio || isAudioSpeaking()) {
      stopSpeech();
      setIsTestingAudio(false);
      return;
    }

    setIsTestingAudio(true);
    // Explicit sample demonstrating the calm male voice with punctuation stop
    const sampleText =
      soundSpeed <= 0.84
        ? 'Bonjour ! Voici la nouvelle voix masculine calme. Un arrêt marqué sépare chaque phrase.'
        : 'Bonjour ! Voici la nouvelle voix masculine calme. Une pause nette sépare les phrases.';

    const started = speakFrench(sampleText, {
      rate: soundSpeed,
      onEnd: () => setIsTestingAudio(false),
      onError: () => setIsTestingAudio(false),
    });

    if (!started) {
      setIsTestingAudio(false);
    }
  };

  const handleNavClick = (view: WebsiteView) => {
    onChangeView(view);
    if (view !== 'units') {
      onSelectUnit(null);
    }
    setMobileMenuOpen(false);
  };

  const currentProfile = getCurrentVoiceProfile();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden whitespace-nowrap shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
              🕊️
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg sm:text-xl font-display tracking-tight group-hover:text-amber-600 transition-colors">
                {t.appTitle}
              </span>
              <span className="text-[10px] text-amber-700 font-bold block leading-none">
                Petite Alouette CP
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'home' && currentUnitId === null ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNavClick('units')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'units' || currentUnitId !== null ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.nav.units}
            </button>
            <button
              onClick={() => handleNavClick('matrix')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'matrix' ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.nav.matrix}
            </button>
            <button
              onClick={() => handleNavClick('method')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'method' ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.nav.method}
            </button>
            <button
              onClick={() => handleNavClick('worksheets')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'worksheets' ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : ''
              }`}
            >
              {t.nav.worksheets}
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Preparatory button */}
            <button
              onClick={onOpenPreparatory}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Activités préparatoires pp. 6-7"
            >
              <span>🎒</span>
              <span>Prépa</span>
            </button>

            {/* Dictionary button */}
            <button
              onClick={onOpenDictionary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Dictionnaire illustré"
            >
              <Search className="w-3.5 h-3.5 text-orange-700" />
              <span className="hidden sm:inline">{t.tabs.dictionary}</span>
            </button>

            {/* Quick Quiz button */}
            {onOpenQuickQuiz && (
              <button
                onClick={onOpenQuickQuiz}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-linear-to-r from-yellow-300 to-amber-300 hover:from-yellow-200 hover:to-amber-200 text-amber-950 border border-amber-300 transition-all hover:scale-105 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
                title={t.quickQuiz.title}
              >
                <span>⚡</span>
                <span className="hidden md:inline">{t.quickQuiz.buttonLabel}</span>
              </button>
            )}

            {/* Voice Chat Button */}
            {onOpenVoiceChat && (
              <button
                type="button"
                onClick={onOpenVoiceChat}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border border-orange-400 shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap shrink-0"
                title={t.voiceChat.subtitle}
              >
                <span className="text-sm">🎙️</span>
                <span>{t.voiceChat.buttonLabel}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </button>
            )}

            {/* Speech Synthesis Voice & Pacing Control Panel */}
            <div className="relative hidden sm:flex items-center gap-1.5 bg-slate-100/95 rounded-2xl p-1 border border-slate-200/90 shadow-2xs" ref={voiceMenuRef}>
              {/* Male Voice Profile Selector Button */}
              <button
                type="button"
                onClick={() => setVoiceMenuOpen(!voiceMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer select-none border ${
                  voiceMenuOpen
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200/80 shadow-2xs'
                }`}
                title="Voix masculine calme (calibrée sur l'échantillon audio). Cliquez pour choisir"
                aria-label="Configuration de la voix"
              >
                <span className="text-xs">🎙️</span>
                <span className="hidden xl:inline text-[11px]">
                  {selectedVoiceName
                    ? selectedVoiceName.split(' ')[0]
                    : t.voiceConfig.voiceBadge}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Voice Selection Dropdown Popover */}
              {voiceMenuOpen && (
                <div className="absolute top-full mt-2 right-0 sm:left-0 sm:right-auto w-72 bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-3 z-50 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>🎙️</span>
                      <span>{t.voiceConfig.title}</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      0.88x Pitch
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    {t.voiceConfig.pitchNote}
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      {t.voiceConfig.selectVoice}
                    </label>

                    {/* Auto-selected Male Voice Option */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectVoice?.('');
                        setVoiceMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                        !selectedVoiceName
                          ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>⭐</span>
                        <span>{t.voiceConfig.autoMale}</span>
                      </div>
                      {!selectedVoiceName && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>

                    {/* Detected Browser Voices */}
                    <div className="max-h-36 overflow-y-auto space-y-1 pt-1">
                      {availableVoices.map((item) => (
                        <button
                          key={item.voice.name}
                          type="button"
                          onClick={() => {
                            onSelectVoice?.(item.voice.name);
                            setVoiceMenuOpen(false);
                          }}
                          className={`w-full text-left p-1.5 px-2 rounded-lg border text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                            selectedVoiceName === item.voice.name
                              ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                              : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="truncate">{item.displayName}</span>
                          {selectedVoiceName === item.voice.name && (
                            <Check className="w-3 h-3 text-amber-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode Toggle Buttons (Lent / Normal) */}
              <div
                className="flex items-center bg-white rounded-xl p-0.5 shadow-2xs border border-slate-200/80"
                role="group"
                aria-label="Mode de synthèse vocale"
              >
                <button
                  type="button"
                  onClick={() => onChangeSoundSpeed(0.76)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                    soundSpeed <= 0.84
                      ? 'bg-amber-500 text-white shadow-xs scale-102'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={t.speechMode.slowDesc}
                  aria-pressed={soundSpeed <= 0.84}
                  aria-label={`${t.speechMode.slow} - ${t.speechMode.slowDesc}`}
                >
                  <span className="text-xs">🐢</span>
                  <span>{t.speechMode.slow}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeSoundSpeed(0.90)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                    soundSpeed > 0.84
                      ? 'bg-amber-500 text-white shadow-xs scale-102'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={t.speechMode.normalDesc}
                  aria-pressed={soundSpeed > 0.84}
                  aria-label={`${t.speechMode.normal} - ${t.speechMode.normalDesc}`}
                >
                  <span className="text-xs">🐇</span>
                  <span>{t.speechMode.normal}</span>
                </button>
              </div>

              {/* Visual Speed Slider with live rate tag */}
              <div className="hidden md:flex items-center gap-2 px-1">
                <input
                  type="range"
                  min="0.70"
                  max="1.05"
                  step="0.04"
                  value={soundSpeed}
                  onChange={(e) => onChangeSoundSpeed(parseFloat(e.target.value))}
                  aria-label="Régulateur de vitesse vocale"
                  className="w-16 lg:w-20 h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  title={`${soundSpeed.toFixed(2)}x - ${soundSpeed <= 0.84 ? t.speechMode.slow : t.speechMode.normal}`}
                />
                <span className="text-[11px] font-mono font-black text-slate-700 w-9 text-right tabular-nums">
                  {soundSpeed.toFixed(2)}x
                </span>
              </div>

              {/* Quick Audio Sample Test Button */}
              <button
                type="button"
                onClick={handleTestSpeech}
                disabled={isTestingAudio}
                title="Tester la voix masculine calme avec arrêt marqué en fin de phrase"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer select-none ${
                  isTestingAudio
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-white hover:bg-amber-50 text-amber-900 border border-slate-200/80 shadow-2xs'
                }`}
                aria-label="Tester la voix"
              >
                <span>{isTestingAudio ? '🔊' : '🔈'}</span>
                <span className="hidden lg:inline text-[11px]">
                  {isTestingAudio ? 'Écoute...' : 'Tester'}
                </span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => onSelectLanguage('fr')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'fr' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => onSelectLanguage('ar')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'ar' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => onSelectLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Stars counter / Report button */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-amber-400 to-yellow-400 text-amber-950 font-black rounded-xl text-xs sm:text-sm shadow-xs border border-amber-300 hover:scale-105 transition-transform cursor-pointer shrink-0"
              title="Carnet de progrès"
            >
              <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
              <span>{starsEarned}</span>
            </button>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 border-t border-slate-100 mt-2 flex flex-col gap-2 text-sm font-bold">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-slate-700"
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNavClick('units')}
              className="text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-slate-700"
            >
              {t.nav.units}
            </button>
            <button
              onClick={() => handleNavClick('matrix')}
              className="text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-slate-700"
            >
              {t.nav.matrix}
            </button>
            <button
              onClick={() => handleNavClick('method')}
              className="text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-slate-700"
            >
              {t.nav.method}
            </button>
            <button
              onClick={() => handleNavClick('worksheets')}
              className="text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-slate-700"
            >
              {t.nav.worksheets}
            </button>
            <button
              onClick={() => {
                onOpenPreparatory();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-amber-50 text-slate-700"
            >
              🎒 {t.preparatoryTitle}
            </button>

            {onOpenQuickQuiz && (
              <button
                onClick={() => {
                  onOpenQuickQuiz();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg bg-linear-to-r from-yellow-100 to-amber-100 text-amber-950 font-bold flex items-center gap-2 border border-amber-300"
              >
                <span>⚡</span>
                <span>{t.quickQuiz.buttonLabel}</span>
              </button>
            )}

            {onOpenVoiceChat && (
              <button
                onClick={() => {
                  onOpenVoiceChat();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white font-extrabold flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🎙️</span>
                  <span>{t.voiceChat.buttonLabel} ({t.voiceChat.badge})</span>
                </div>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full">Ouvrir</span>
              </button>
            )}

            {/* Mobile Speech Mode Switch */}
            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2 mt-1">
              <div className="flex items-center justify-between text-xs text-amber-950 font-bold">
                <span className="flex items-center gap-1">
                  <span>🎙️</span>
                  <span>{t.voiceConfig.activeProfile}</span>
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-amber-200 text-slate-700">
                  {soundSpeed.toFixed(2)}x
                </span>
              </div>

              {/* Voice selector in mobile drawer */}
              {availableVoices.length > 0 && (
                <div className="pt-1">
                  <select
                    value={selectedVoiceName}
                    onChange={(e) => onSelectVoice?.(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium"
                  >
                    <option value="">{t.voiceConfig.autoMale}</option>
                    {availableVoices.map((item) => (
                      <option key={item.voice.name} value={item.voice.name}>
                        {item.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onChangeSoundSpeed(0.76)}
                  className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    soundSpeed <= 0.84
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>🐢</span>
                  <span>{t.speechMode.slow}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeSoundSpeed(0.90)}
                  className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    soundSpeed > 0.84
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>🐇</span>
                  <span>{t.speechMode.normal}</span>
                </button>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0.70"
                  max="1.05"
                  step="0.04"
                  value={soundSpeed}
                  onChange={(e) => onChangeSoundSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.70x (Lent)</span>
                  <span>0.90x (Normal)</span>
                  <span>1.05x</span>
                </div>
              </div>

              {/* Mobile Voice Test Button */}
              <button
                type="button"
                onClick={handleTestSpeech}
                disabled={isTestingAudio}
                className={`w-full py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isTestingAudio
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                }`}
              >
                <span>{isTestingAudio ? '🔊' : '🔈'}</span>
                <span>
                  {isTestingAudio ? 'Lecture en cours...' : 'Tester la voix masculine calme'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
