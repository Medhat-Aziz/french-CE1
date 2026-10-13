import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Bookmark,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { Unit, Language, UserProgress } from '../types/curriculum';
import { allUnits, periodInfo } from '../data/curriculumData';
import { getTranslation } from '../translations/i18n';

interface UnitDashboardProps {
  onSelectUnit: (unitId: number) => void;
  progress: UserProgress;
  language: Language;
  onOpenPreparatory: () => void;
}

export const UnitDashboard: React.FC<UnitDashboardProps> = ({
  onSelectUnit,
  progress,
  language,
  onOpenPreparatory,
}) => {
  const t = getTranslation(language);

  return (
    <div className="space-y-10 py-6">
      {/* Hero Banner */}
      <section className="bg-linear-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 text-9xl opacity-10 pointer-events-none select-none">
          📖
        </div>
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black tracking-wide uppercase">
            <span>✨</span>
            <span>{t.officialCurriculum}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            {t.appTitle}
          </h1>

          <p className="text-amber-100 text-sm sm:text-base leading-relaxed font-medium">
            Découvrez les 12 unités officielles du manuel <strong>Petite Alouette CP</strong> (Bordas éditeur). Phonie-graphie, compréhension de lecture avec Jad, Fatou, Benoît et Irina, poésies authentiques et vocabulaire thématique.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectUnit(progress.lastVisitedUnit || 1)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-amber-900 font-extrabold rounded-2xl shadow-md hover:bg-amber-50 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Continuer l’Unité {progress.lastVisitedUnit || 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenPreparatory}
              className="flex items-center gap-2 px-5 py-3 bg-amber-600/40 hover:bg-amber-600/60 text-white font-bold rounded-2xl border border-white/30 backdrop-blur-xs transition-colors cursor-pointer text-sm"
            >
              <span>🎒 Activités Préparatoires (p. 6-7)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Period Grouped Units */}
      {periodInfo.map((p) => {
        const periodUnits = allUnits.filter((u) => u.period === p.period);
        const title =
          language === 'ar'
            ? p.titleAr
            : language === 'en'
            ? p.titleEn
            : p.titleFr;

        return (
          <section key={p.period} className="space-y-4">
            {/* Period Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-200 pb-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-black ${p.badgeColor}`}>
                  Période {p.period}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-display">
                  {title}
                </h2>
              </div>
              <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                <span>{t.pageLabel} <strong>{p.pages}</strong></span>
                <span className="hidden sm:inline">•</span>
                <span className="text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  Bilan & soutien : {p.evaluationPage}
                </span>
              </div>
            </div>

            {/* Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {periodUnits.map((unit) => {
                const isCompleted = progress.completedUnits.includes(unit.id);
                const unitTheme =
                  language === 'ar'
                    ? unit.themeArabic
                    : language === 'en'
                    ? unit.themeEnglish
                    : unit.theme;

                return (
                  <div
                    key={unit.id}
                    onClick={() => onSelectUnit(unit.id)}
                    className="group bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden"
                  >
                    {isCompleted && (
                      <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Validé ⭐</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Top icon and Unit identifier */}
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                          {unit.icon}
                        </div>
                        <div>
                          <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                            Unité {unit.id}
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-amber-600 transition-colors">
                            {unitTheme}
                          </h3>
                        </div>
                      </div>

                      {/* Phonics badges */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Sons & Lettres étudiés :
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {unit.phonics.map((ph) => (
                            <span
                              key={ph.id}
                              className="text-xs font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200"
                            >
                              {ph.phoneme} ➔ {ph.graphemes}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Project info snippet */}
                      <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-2xl border border-amber-100 space-y-1">
                        <div className="font-bold text-amber-900 flex items-center gap-1">
                          <span>📌 {unit.project.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {unit.project.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom action */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-amber-600 group-hover:text-amber-700">
                      <span className="text-slate-400 font-medium">Manuel : {unit.pageRange}</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Ouvrir l’unité <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
