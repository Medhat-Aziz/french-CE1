import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  BookOpen,
  Volume2,
  CheckCircle2,
  Star,
  Sparkles,
  MessageCircle,
  FileText,
  Bookmark,
  Share2,
  RotateCcw,
  ListOrdered,
  Layers,
} from 'lucide-react';
import { Unit, Language, UserProgress } from '../types/curriculum';
import { allUnits } from '../data/curriculumData';
import { AudioButton } from './AudioButton';
import { ExercisePlayer } from './ExercisePlayer';
import { getTranslation } from '../translations/i18n';

interface UnitViewProps {
  unit: Unit;
  onBackToDashboard: () => void;
  onSelectUnit: (unitId: number) => void;
  language: Language;
  soundSpeed: number;
  progress: UserProgress;
  onToggleUnitCompleted: (unitId: number) => void;
  onExerciseComplete: (exerciseId: string, isCorrect: boolean) => void;
}

export const UnitView: React.FC<UnitViewProps> = ({
  unit,
  onBackToDashboard,
  onSelectUnit,
  language,
  soundSpeed,
  progress,
  onToggleUnitCompleted,
  onExerciseComplete,
}) => {
  const [activeTab, setActiveTab] = useState<
    'oral' | 'phonics' | 'reading' | 'poetry' | 'grammar' | 'writing' | 'dictionary' | 'exercises'
  >('phonics');

  const [activePhonicIndex, setActivePhonicIndex] = useState(0);
  const [activeReadingIndex, setActiveReadingIndex] = useState(0);

  const t = getTranslation(language);
  const isCompleted = progress.completedUnits.includes(unit.id);

  const prevUnit = allUnits.find((u) => u.id === unit.id - 1);
  const nextUnit = allUnits.find((u) => u.id === unit.id + 1);

  const unitTheme =
    language === 'ar'
      ? unit.themeArabic
      : language === 'en'
      ? unit.themeEnglish
      : unit.theme;

  const currentPhonic = unit.phonics[activePhonicIndex] || unit.phonics[0];
  const currentReading = unit.readings[activeReadingIndex] || unit.readings[0];

  return (
    <div className="space-y-6 py-4">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.actions.backToDashboard}</span>
          </button>

          <span className="text-slate-300">/</span>

          <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
            Unité {unit.id} : {unitTheme}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {prevUnit && (
            <button
              onClick={() => onSelectUnit(prevUnit.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              ← U{prevUnit.id}
            </button>
          )}

          <button
            onClick={() => onToggleUnitCompleted(unit.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? t.actions.completedBadge : t.actions.markCompleted}</span>
          </button>

          {nextUnit && (
            <button
              onClick={() => onSelectUnit(nextUnit.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              U{nextUnit.id} →
            </button>
          )}
        </div>
      </div>

      {/* Unit Header Card */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-inner shrink-0">
              {unit.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                  Période {unit.period} • {unit.pageRange}
                </span>
                {isCompleted && (
                  <span className="text-xs bg-emerald-400 text-emerald-950 font-black px-2 py-0.5 rounded-full">
                    Maîtrisée ⭐
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-display mt-1">
                Unité {unit.id} : {unitTheme}
              </h2>
            </div>
          </div>

          <div className="bg-black/15 p-3.5 rounded-2xl backdrop-blur-xs max-w-md border border-white/10 text-xs space-y-1">
            <div className="font-black text-amber-200">
              📌 Projet de classe : {unit.project.title}
            </div>
            <p className="text-white/80 line-clamp-2">{unit.project.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-amber-200 shadow-xs">
        {[
          { key: 'phonics', label: t.tabs.phonics, icon: '🔤' },
          { key: 'reading', label: t.tabs.reading, icon: '📖' },
          { key: 'oral', label: t.tabs.oral, icon: '🎧' },
          { key: 'poetry', label: t.tabs.poetry, icon: '🎭' },
          { key: 'grammar', label: t.tabs.grammar, icon: '📝' },
          { key: 'writing', label: t.tabs.writing, icon: '✍️' },
          { key: 'dictionary', label: t.tabs.dictionary, icon: '📚' },
          { key: 'exercises', label: t.tabs.exercises, icon: '🎯' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-amber-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: PHONICS (ÉTUDE DU CODE) */}
      {activeTab === 'phonics' && (
        <div className="space-y-6">
          {/* Subtabs for the 4 phonemes */}
          <div className="flex gap-2 overflow-x-auto">
            {unit.phonics.map((ph, idx) => (
              <button
                key={ph.id}
                onClick={() => setActivePhonicIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-2 ${
                  activePhonicIndex === idx
                    ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50'
                }`}
              >
                Son {ph.phoneme} ➔ {ph.graphemes} (p. {ph.page})
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 bg-amber-100 rounded-2xl">{currentPhonic.imageIcon}</span>
                <div>
                  <div className="text-xs font-bold text-amber-700 uppercase">
                    Étude du code • Manuel p. {currentPhonic.page}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 font-display">
                    Phonème {currentPhonic.phoneme} — Graphème : {currentPhonic.graphemes}
                  </h3>
                  <p className="text-xs text-slate-500">Mot repère : <strong>{currentPhonic.keyword}</strong></p>
                </div>
              </div>

              <AudioButton
                text={`${currentPhonic.keyword}. Phonème ${currentPhonic.phoneme}.`}
                speed={soundSpeed}
                label="Écouter le son modèle"
                size="md"
              />
            </div>

            {/* Syllables section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                  <span>🔵 {t.sections.syllableReading} (Manuel p. {currentPhonic.page})</span>
                </h4>
                <span className="text-xs text-slate-400">Cliquez sur chaque syllabe pour entendre la fusion</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {currentPhonic.syllables.map((syl) => (
                  <div
                    key={syl}
                    className="p-3 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 rounded-2xl flex items-center justify-between shadow-xs transition-colors"
                  >
                    <span className="text-lg font-black text-amber-950 font-display">{syl}</span>
                    <AudioButton text={syl} speed={soundSpeed} size="sm" variant="ghost" />
                  </div>
                ))}
              </div>
            </div>

            {/* Words section */}
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                🟢 {t.sections.wordReading} (Manuel p. {currentPhonic.page})
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {currentPhonic.words.map((w) => (
                  <div
                    key={w}
                    className="p-2.5 px-3.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-2 shadow-xs hover:bg-sky-100 transition-colors"
                  >
                    <span className="text-sm font-bold text-sky-950">{w}</span>
                    <AudioButton text={w} speed={soundSpeed} size="sm" variant="ghost" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sentences section */}
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                🟣 {t.sections.sentenceReading} (Manuel p. {currentPhonic.page})
              </h4>
              <div className="space-y-2">
                {currentPhonic.phrases.map((phr, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-amber-300 transition-colors"
                  >
                    <span className="text-sm md:text-base font-semibold text-slate-800 leading-relaxed">
                      {phr}
                    </span>
                    <AudioButton text={phr} speed={soundSpeed} size="sm" variant="secondary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: READING COMPREHENSION */}
      {activeTab === 'reading' && (
        <div className="space-y-6">
          {/* Subtabs for the 4 reading texts */}
          <div className="flex gap-2 overflow-x-auto">
            {unit.readings.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => setActiveReadingIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-2 ${
                  activeReadingIndex === idx
                    ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50'
                }`}
              >
                Texte {r.number} : {r.title} (p. {r.page})
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase">
                  Lecture-Compréhension {currentReading.number} • Manuel p. {currentReading.page}
                </span>
                <h3 className="text-2xl font-black text-slate-800 font-display">
                  {currentReading.title}
                </h3>
              </div>

              <AudioButton
                text={currentReading.text}
                speed={soundSpeed}
                label={t.actions.readText}
                size="md"
              />
            </div>

            {/* Text passage */}
            <div className="p-6 bg-amber-50/50 rounded-2xl border-2 border-amber-200/80 space-y-4">
              <p className="text-lg md:text-xl font-serif text-slate-800 leading-relaxed whitespace-pre-line">
                {currentReading.text}
              </p>

              {currentReading.textArabic && (
                <p className="text-sm text-slate-600 pt-3 border-t border-amber-200/60 leading-relaxed font-sans" dir="rtl">
                  {currentReading.textArabic}
                </p>
              )}
            </div>

            {/* Mots-outils section */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex flex-wrap items-center gap-3">
              <span className="text-xs font-black text-orange-900 uppercase">
                🏷️ {t.sections.sightWords} :
              </span>
              <div className="flex flex-wrap gap-2">
                {currentReading.motsOutils.map((word) => (
                  <span
                    key={word}
                    className="px-3 py-1 bg-white text-orange-800 font-extrabold text-sm rounded-xl border border-orange-300 shadow-2xs flex items-center gap-1.5"
                  >
                    <span>{word}</span>
                    <AudioButton text={word} speed={soundSpeed} size="sm" variant="ghost" />
                  </span>
                ))}
              </div>
            </div>

            {/* Comprehension questions */}
            <div className="space-y-4 pt-2">
              <h4 className="font-extrabold text-slate-800 text-base">
                ❓ {t.sections.comprehensionQuestions} (Manuel p. {currentReading.page})
              </h4>
              <div className="space-y-3">
                {currentReading.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-800 text-sm md:text-base">
                        {idx + 1}. {q.question}
                      </span>
                      <AudioButton text={q.question} speed={soundSpeed} size="sm" variant="ghost" />
                    </div>
                    {q.questionArabic && (
                      <div className="text-xs text-slate-500 font-medium" dir="rtl">
                        {q.questionArabic}
                      </div>
                    )}
                    <div className="p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold">
                      💡 Réponse attendue : {q.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORAL & ACTIVE LISTENING */}
      {activeTab === 'oral' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase">
                Écoute active & Oral • Manuel p. {unit.oral.ecoutePage} - {unit.oral.oralPage}
              </span>
              <h3 className="text-2xl font-black text-slate-800 font-display">
                {unit.oral.oralTitle} ({unit.oral.ecouteTitle})
              </h3>
            </div>
            <AudioButton
              text={unit.oral.dialogue.map((d) => `${d.speaker} dit : ${d.text}`).join('. ')}
              speed={soundSpeed}
              label="Écouter le dialogue complet"
            />
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <span className="text-xs font-black text-amber-900 uppercase">Contexte :</span>
            <p className="text-sm text-slate-700">{unit.oral.context}</p>
            <p className="text-xs text-slate-500 pt-1" dir="rtl">{unit.oral.contextArabic}</p>
          </div>

          {/* Dialogue Lines */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 text-sm">Dialogue entre les personnages :</h4>
            {unit.oral.dialogue.map((line, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:bg-slate-100/80 transition-colors"
              >
                <div>
                  <span className="text-xs font-black text-amber-700 uppercase block mb-0.5">
                    {line.speaker}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    « {line.text} »
                  </span>
                </div>
                <AudioButton text={line.text} speed={soundSpeed} size="sm" variant="secondary" />
              </div>
            ))}
          </div>

          {/* Expressions-outils */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-slate-800 text-sm">
              Boîte d’expression orale (Je retiens) :
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unit.oral.toolExpressions.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2"
                >
                  <div className="font-bold text-emerald-950 text-sm">
                    {tool.useCase}
                  </div>
                  <div className="text-xs text-emerald-700 font-medium" dir="rtl">
                    {tool.useCaseArabic}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tool.expressions.map((exp) => (
                      <span
                        key={exp}
                        className="px-2.5 py-1 bg-white text-emerald-900 text-xs font-bold rounded-lg border border-emerald-300 flex items-center gap-1 shadow-2xs"
                      >
                        <span>{exp}</span>
                        <AudioButton text={exp} speed={soundSpeed} size="sm" variant="ghost" />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: POETRY */}
      {activeTab === 'poetry' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase">
                Poésie du CP • Manuel p. {unit.poetry.page}
              </span>
              <h3 className="text-2xl font-black text-slate-800 font-display">
                {unit.poetry.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Auteur : {unit.poetry.author} {unit.poetry.source ? `(${unit.poetry.source})` : ''}
              </p>
            </div>

            <AudioButton
              text={unit.poetry.stanzas.join('. ')}
              speed={soundSpeed}
              label="Réciter le poème"
              size="md"
            />
          </div>

          <div className="p-8 bg-amber-50/40 rounded-3xl border-2 border-amber-200/60 max-w-xl mx-auto text-center space-y-2 shadow-inner">
            <h4 className="text-xl font-black text-amber-900 font-display mb-4">
              {unit.poetry.title}
            </h4>
            {unit.poetry.stanzas.map((line, idx) => (
              <p key={idx} className="text-base md:text-lg font-serif text-slate-800 italic">
                {line}
              </p>
            ))}
            <div className="pt-4 text-xs font-bold text-amber-800">
              — {unit.poetry.author}
            </div>
          </div>

          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl space-y-1 text-xs">
            <span className="font-bold text-sky-900">Signification & Sens :</span>
            <p className="text-sky-800 font-medium" dir="rtl">{unit.poetry.summaryAr}</p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: GRAMMAR (LANGUE) */}
      {activeTab === 'grammar' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-amber-700 uppercase">
              Étude de la langue • Manuel p. {unit.grammar.page}
            </span>
            <h3 className="text-2xl font-black text-slate-800 font-display">
              {unit.grammar.title}
            </h3>
          </div>

          {/* Rule card */}
          <div className="p-6 bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 space-y-3">
            <div className="flex items-center gap-2 font-black text-amber-900 text-base">
              <span>📌 Règle : Je retiens (Manuel p. {unit.grammar.page})</span>
            </div>
            <p className="text-base text-slate-800 font-semibold leading-relaxed">
              {unit.grammar.ruleSummary}
            </p>
            <p className="text-sm text-slate-600 font-medium" dir="rtl">
              {unit.grammar.ruleSummaryArabic}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 text-sm">Exemples d’application :</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unit.grammar.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-sm font-semibold text-slate-800"
                >
                  <span>{ex}</span>
                  <AudioButton text={ex} speed={soundSpeed} size="sm" variant="ghost" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: WRITING (PRODUCTION D'ÉCRIT) */}
      {activeTab === 'writing' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-amber-700 uppercase">
              Production d’écrit • Manuel p. {unit.writing.page}
            </span>
            <h3 className="text-2xl font-black text-slate-800 font-display">
              {unit.writing.title}
            </h3>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <span className="text-xs font-black text-amber-900 uppercase">Consigne :</span>
            <p className="text-sm text-slate-800 font-semibold">{unit.writing.instruction}</p>
            <p className="text-xs text-slate-500 font-medium" dir="rtl">{unit.writing.instructionArabic}</p>
          </div>

          {/* Model template */}
          <div className="p-6 bg-white border-2 border-amber-300 rounded-2xl shadow-xs space-y-4 max-w-lg mx-auto">
            <h4 className="text-center font-black text-amber-900 font-display text-lg border-b border-amber-200 pb-2">
              📋 {unit.writing.sampleModel.heading}
            </h4>
            <div className="space-y-3">
              {unit.writing.sampleModel.fields.map((f, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-500">{f.label} :</span>
                  <span className="font-extrabold text-slate-800">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DICTIONARY (DICTIONNAIRE DU MANUEL) */}
      {activeTab === 'dictionary' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-display text-slate-800">
                Dictionnaire illustré de l’Unité {unit.id}
              </h3>
              <p className="text-xs text-slate-500">Mots clés visuels tirés de la page dictionnaire du manuel</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
              {unit.dictionary.length} mots
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {unit.dictionary.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-300 shadow-xs flex flex-col justify-between transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-amber-100 rounded-xl">{item.icon}</span>
                    <div>
                      <div className="font-black text-slate-800 text-base">{item.word}</div>
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <AudioButton text={item.word} speed={soundSpeed} size="sm" variant="ghost" />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <div className="text-xs font-semibold text-emerald-800" dir="rtl">
                    {item.translationAr}
                  </div>
                  <div className="text-xs text-slate-500 italic">
                    {item.translationEn}
                  </div>
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg mt-2">
                    « {item.example} »
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: EXERCISES & QUIZ */}
      {activeTab === 'exercises' && (
        <div className="space-y-4">
          <ExercisePlayer
            exercises={unit.exercises}
            unitId={unit.id}
            language={language}
            soundSpeed={soundSpeed}
            onExerciseComplete={onExerciseComplete}
          />
        </div>
      )}
    </div>
  );
};
