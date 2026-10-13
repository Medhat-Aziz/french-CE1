import React, { useState } from 'react';
import {
  Star,
  Search,
  Menu,
  X,
  BookOpen,
  FileText,
  Printer,
  Table,
} from 'lucide-react';
import { Language } from '../types/curriculum';
import { getTranslation } from '../translations/i18n';
import { allUnits } from '../data/curriculumData';
import { speakFrench, stopSpeech, isAudioSpeaking } from '../utils/audio';

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
  onOpenPreparatory: () => void;
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
  onOpenPreparatory,
  onOpenDictionary,
  onOpenReport,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const t = getTranslation(language);

  const handleTestSpeech = () => {
    if (isTestingAudio || isAudioSpeaking()) {
      stopSpeech();
      setIsTestingAudio(false);
      return;
    }

    setIsTestingAudio(true);
    // Illustrates natural French voice with a distinct stop at the end of each sentence
    const sampleText =
      soundSpeed <= 0.85
        ? 'Bonjour ! Je lis lentement. Un arrêt marqué sépare chaque phrase.'
        : 'Bonjour ! Je lis avec fluidité naturelle. Une brève pause sépare les phrases.';

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
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

          {/* Zone 2: 4–5 clean single-line text navigation links */}
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

            {/* Speech Synthesis Mode Controls: Toggle Buttons + Visual Slider + Voice Test */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100/95 rounded-2xl p-1 border border-slate-200/90 shadow-2xs">
              {/* Mode Toggle Buttons */}
              <div
                className="flex items-center bg-white rounded-xl p-0.5 shadow-2xs border border-slate-200/80"
                role="group"
                aria-label="Mode de synthèse vocale"
              >
                <button
                  type="button"
                  onClick={() => onChangeSoundSpeed(0.78)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                    soundSpeed <= 0.85
                      ? 'bg-amber-500 text-white shadow-xs scale-102'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={t.speechMode.slowDesc}
                  aria-pressed={soundSpeed <= 0.85}
                  aria-label={`${t.speechMode.slow} - ${t.speechMode.slowDesc}`}
                >
                  <span className="text-xs">🐢</span>
                  <span>{t.speechMode.slow}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeSoundSpeed(0.95)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                    soundSpeed > 0.85
                      ? 'bg-amber-500 text-white shadow-xs scale-102'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={t.speechMode.normalDesc}
                  aria-pressed={soundSpeed > 0.85}
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
                  step="0.05"
                  value={soundSpeed}
                  onChange={(e) => onChangeSoundSpeed(parseFloat(e.target.value))}
                  aria-label="Régulateur de vitesse vocale"
                  className="w-16 lg:w-20 h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  title={`${soundSpeed.toFixed(2)}x - ${soundSpeed <= 0.85 ? t.speechMode.slow : t.speechMode.normal}`}
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
                title={
                  soundSpeed <= 0.85
                    ? 'Tester la voix lente avec arrêt marqué en fin de phrase'
                    : 'Tester la voix normale avec pause naturelle entre les phrases'
                }
                className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer select-none ${
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

            {/* Mobile Speech Mode Switch */}
            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2 mt-1">
              <div className="flex items-center justify-between text-xs text-amber-950 font-bold">
                <span>{t.speechMode.label}</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-amber-200 text-slate-700">
                  {soundSpeed.toFixed(2)}x • {soundSpeed <= 0.85 ? t.speechMode.slow : t.speechMode.normal}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangeSoundSpeed(0.78)}
                  className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    soundSpeed <= 0.85
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>🐢</span>
                  <span>{t.speechMode.slow}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeSoundSpeed(0.95)}
                  className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    soundSpeed > 0.85
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
                  step="0.05"
                  value={soundSpeed}
                  onChange={(e) => onChangeSoundSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.70x (Lent)</span>
                  <span>0.95x (Normal)</span>
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
                  {isTestingAudio ? 'Lecture de test en cours...' : 'Tester la voix (avec arrêt fin de phrase)'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
