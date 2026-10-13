import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Search,
  Printer,
  Table,
  GraduationCap,
} from 'lucide-react';
import { Unit, Language, UserProgress } from '../types/curriculum';
import { allUnits, periodInfo } from '../data/curriculumData';
import { getTranslation } from '../translations/i18n';

interface UnitDashboardProps {
  onSelectUnit: (unitId: number) => void;
  progress: UserProgress;
  language: Language;
  onOpenPreparatory: () => void;
  onOpenQuickQuiz: () => void;
  onOpenVoiceChat?: () => void;
  onGoToMatrix: () => void;
  onGoToMethod: () => void;
  onGoToWorksheets: () => void;
}

export const UnitDashboard: React.FC<UnitDashboardProps> = ({
  onSelectUnit,
  progress,
  language,
  onOpenPreparatory,
  onOpenQuickQuiz,
  onOpenVoiceChat,
  onGoToMatrix,
  onGoToMethod,
  onGoToWorksheets,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const t = getTranslation(language);

  const filteredUnits = useMemo(() => {
    return allUnits.filter((u) => {
      const matchesPeriod = selectedPeriod === 'all' || u.period === selectedPeriod;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.theme.toLowerCase().includes(q) ||
        u.themeArabic.includes(q) ||
        u.themeEnglish.toLowerCase().includes(q) ||
        u.phonics.some((ph) => ph.phoneme.toLowerCase().includes(q) || ph.graphemes.toLowerCase().includes(q));
      return matchesPeriod && matchesSearch;
    });
  }, [selectedPeriod, searchQuery]);

  return (
    <div className="space-y-10 py-6">
      {/* Website Hero Section */}
      <section className="bg-linear-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-100">
            <span>Ministère de l'Éducation</span>
            <span aria-hidden="true">·</span>
            <span>Programmes 2016</span>
            <span aria-hidden="true">·</span>
            <span>Cycle 2 (CP)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Apprendre à Lire & Écrire avec Petite Alouette CP
          </h1>

          <p className="text-amber-100 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
            Plateforme éducative officielle d'accompagnement du manuel <strong>Petite Alouette</strong> (Bordas). Une méthode syllabique progressive alliant écoute active, décodage phonétique, compréhension de textes authentiques et pratique quotidienne de la langue.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectUnit(progress.lastVisitedUnit || 1)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-amber-950 font-black rounded-2xl shadow-md hover:bg-amber-50 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Continuer l’Unité {progress.lastVisitedUnit || 1}</span>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </button>

            {/* Quick Quiz Action Button */}
            <button
              type="button"
              onClick={onOpenQuickQuiz}
              className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-yellow-400 to-amber-400 text-amber-950 font-black rounded-2xl shadow-lg border-2 border-yellow-200 transition-all hover:scale-105 hover:bg-yellow-300 cursor-pointer text-sm"
              title="Lancer le Quiz Rapide sur les unités validées"
            >
              <span className="text-base">⚡</span>
              <span>{t.quickQuiz.buttonLabel}</span>
              {progress.completedUnits.length > 0 && (
                <span className="text-[10px] bg-amber-900/20 px-2 py-0.5 rounded-full font-bold">
                  {progress.completedUnits.length} ⭐
                </span>
              )}
            </button>

            {/* Voice Chat Action Button */}
            {onOpenVoiceChat && (
              <button
                type="button"
                onClick={onOpenVoiceChat}
                className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl shadow-lg border-2 border-orange-300 transition-all hover:scale-105 hover:from-orange-600 hover:to-amber-600 cursor-pointer text-sm"
                title={t.voiceChat.subtitle}
              >
                <span className="text-base">🎙️</span>
                <span>{t.voiceChat.buttonLabel}</span>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                  Oral CP
                </span>
              </button>
            )}

            <button
              onClick={onOpenPreparatory}
              className="flex items-center gap-2 px-4 py-3 bg-amber-600/40 hover:bg-amber-600/60 text-white font-bold rounded-2xl border border-white/30 backdrop-blur-xs transition-colors cursor-pointer text-sm"
            >
              <span>🎒 {t.preparatoryTitle}</span>
            </button>

            <button
              onClick={onGoToWorksheets}
              className="flex items-center gap-2 px-4 py-3 bg-amber-600/40 hover:bg-amber-600/60 text-white font-bold rounded-2xl border border-white/30 backdrop-blur-xs transition-colors cursor-pointer text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Fiches à imprimer</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Quiz Interactive Feature Banner */}
      <section className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-5 border-2 border-amber-300 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner shrink-0">
            ⚡
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                {t.quickQuiz.badge}
              </span>
              <span className="text-xs text-amber-100 font-bold">
                {progress.completedUnits.length > 0
                  ? `${progress.completedUnits.length} unité(s) révisée(s)`
                  : 'Programme CP'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display">
              {t.quickQuiz.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium">
              {t.quickQuiz.subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenQuickQuiz}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-amber-950 hover:bg-amber-50 font-black rounded-2xl shadow-md transition-all hover:scale-105 cursor-pointer shrink-0 text-sm relative z-10"
        >
          <span>⚡ {t.quickQuiz.buttonLabel}</span>
          <ArrowRight className="w-4 h-4 text-amber-700" />
        </button>
      </section>

      {/* Website Educational Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-3xl font-black text-amber-600 font-display">12</div>
          <div className="text-xs font-bold text-slate-700">Unités thématiques</div>
          <div className="text-[11px] text-slate-400">4 périodes scolaires</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-3xl font-black text-sky-600 font-display">48</div>
          <div className="text-xs font-bold text-slate-700">Leçons de phonétique</div>
          <div className="text-[11px] text-slate-400">Sons & graphèmes avec audio</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-3xl font-black text-emerald-600 font-display">48</div>
          <div className="text-xs font-bold text-slate-700">Textes de lecture</div>
          <div className="text-[11px] text-slate-400">Compréhension & mots-outils</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-3xl font-black text-purple-600 font-display">100%</div>
          <div className="text-xs font-bold text-slate-700">Conforme Bordas</div>
          <div className="text-[11px] text-slate-400">Pages & contenus authentiques</div>
        </div>
      </section>

      {/* Directory Filter & Search Toolbar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-xs">
          {/* Period Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
            {[
              { id: 'all', label: 'Toutes les unités (1-12)' },
              { id: 1, label: 'Période 1 (U1-U3)' },
              { id: 2, label: 'Période 2 (U4-U6)' },
              { id: 3, label: 'Période 3 (U7-U9)' },
              { id: 4, label: 'Période 4 (U10-U12)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id as any)}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedPeriod === p.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher son, lettre, thème..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredUnits.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              Aucune unité ne correspond à votre recherche.
            </div>
          ) : (
            filteredUnits.map((unit) => {
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
                  className="group bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden"
                >
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Validé ⭐</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                        {unit.icon}
                      </div>
                      <div>
                        <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                          Unité {unit.id} • Période {unit.period}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-amber-600 transition-colors">
                          {unitTheme}
                        </h3>
                      </div>
                    </div>

                    {/* Phonics tags */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Sons & Graphèmes :
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

                    {/* Project summary */}
                    <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-2xl border border-amber-100 space-y-1">
                      <div className="font-bold text-amber-900">
                        📌 {unit.project.title}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {unit.project.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-amber-600 group-hover:text-amber-700">
                    <span className="text-slate-400 font-medium">Manuel : {unit.pageRange}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ouvrir l’unité <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Cross-Link Promotional Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div
          onClick={onGoToMatrix}
          className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
        >
          <div className="text-3xl">📋</div>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
            Tableau Synoptique Complet
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consultez la cartographie officielle des 12 unités du manuel avec toutes les références de pages et compétences.
          </p>
        </div>

        <div
          onClick={onGoToMethod}
          className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
        >
          <div className="text-3xl">📖</div>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
            La Démarche Pédagogique
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Découvrez les 6 piliers didactiques de Petite Alouette (Programmes 2016) et les recommandations pour enseignants et parents.
          </p>
        </div>

        <div
          onClick={onGoToWorksheets}
          className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
        >
          <div className="text-3xl">🖨️</div>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
            Fiches de Travail & Impression
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Générez et imprimez des fiches de révision A4 prêtes à l’emploi pour la classe ou les devoirs à la maison.
          </p>
        </div>
      </section>
    </div>
  );
};
