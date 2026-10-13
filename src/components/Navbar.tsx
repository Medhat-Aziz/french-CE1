import React from 'react';
import {
  BookOpen,
  Star,
  Globe,
  Volume2,
  Award,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';
import { Language } from '../types/curriculum';
import { getTranslation } from '../translations/i18n';
import { allUnits } from '../data/curriculumData';

interface NavbarProps {
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
  const t = getTranslation(language);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <button
            onClick={() => onSelectUnit(null)}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xl sm:text-2xl shadow-sm group-hover:scale-105 transition-transform">
              🕊️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg sm:text-xl font-display tracking-tight group-hover:text-amber-600 transition-colors">
                  {t.appTitle}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 hidden sm:inline-block">
                  Petite Alouette CP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Manuel de français CP (Cycle 2) • Édition Bordas
              </p>
            </div>
          </button>

          {/* Center / Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick jump to unit selector */}
            <div className="hidden lg:flex items-center">
              <select
                aria-label="Sélectionner une unité"
                value={currentUnitId ?? ''}
                onChange={(e) =>
                  onSelectUnit(e.target.value === '' ? null : Number(e.target.value))
                }
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50/80 border border-amber-300 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                <option value="">🏠 Sommaire des 12 Unités</option>
                {allUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    U{u.id} : {u.theme}
                  </option>
                ))}
              </select>
            </div>

            {/* Activités préparatoires button */}
            <button
              onClick={onOpenPreparatory}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
              title="Activités préparatoires p. 6-7"
            >
              <span>🎒</span>
              <span className="hidden sm:inline">Activités Préparatoires</span>
              <span className="sm:hidden">Prépa</span>
            </button>

            {/* Illustrated Dictionary button */}
            <button
              onClick={onOpenDictionary}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 transition-colors cursor-pointer"
              title="Dictionnaire des 12 unités"
            >
              <Search className="w-3.5 h-3.5 text-orange-700" />
              <span className="hidden sm:inline">{t.tabs.dictionary}</span>
            </button>

            {/* Audio Speed selector */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => onChangeSoundSpeed(0.8)}
                className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  soundSpeed === 0.8
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Voix lente (0.8x) pour CP"
              >
                0.8x
              </button>
              <button
                onClick={() => onChangeSoundSpeed(0.95)}
                className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  soundSpeed === 0.95
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Voix normale (1x)"
              >
                1.0x
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => onSelectLanguage('fr')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'fr'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Français"
              >
                FR
              </button>
              <button
                onClick={() => onSelectLanguage('ar')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'ar'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="العربية (RTL)"
              >
                عربي
              </button>
              <button
                onClick={() => onSelectLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Stars counter & report badge */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-amber-400 to-yellow-400 text-amber-950 font-black rounded-xl text-xs sm:text-sm shadow-xs border border-amber-300 hover:scale-105 transition-transform cursor-pointer"
              title="Voir mon carnet de progrès"
            >
              <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
              <span>{starsEarned}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
