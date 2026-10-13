import React, { useState } from 'react';
import { Printer, Download, BookOpen, CheckSquare, Sparkles } from 'lucide-react';
import { allUnits, getUnitById } from '../data/curriculumData';
import { Language } from '../types/curriculum';
import { getTranslation } from '../translations/i18n';

interface WorksheetsPageProps {
  language: Language;
}

export const WorksheetsPage: React.FC<WorksheetsPageProps> = ({ language }) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const t = getTranslation(language);

  const unit = getUnitById(selectedUnitId) || allUnits[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      {/* Top controls - Hidden when printing */}
      <div className="no-print bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              Fiches Pédagogiques & Feuilles de Révision (CP)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Imprimez ou téléchargez les fiches de révision de phonétique, de lecture et d’écriture pour vos élèves ou enfants.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
          >
            <Printer className="w-5 h-5 text-amber-400" />
            <span>Imprimer la fiche (A4)</span>
          </button>
        </div>

        {/* Unit Selector Strip */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allUnits.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUnitId(u.id)}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-2 ${
                selectedUnitId === u.id
                  ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-100'
              }`}
            >
              U{u.id} : {u.theme}
            </button>
          ))}
        </div>
      </div>

      {/* Printable Sheet Area */}
      <div className="print-area bg-white rounded-3xl p-8 sm:p-12 border-2 border-slate-300 shadow-lg space-y-8 font-sans">
        {/* Worksheet Header */}
        <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-start">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-700">
              École élémentaire • Cours Préparatoire (CP) — Cycle 2
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 mt-1">
              Fiche de Travail : Unité {unit.id} — {unit.theme}
            </h2>
            <p className="text-xs text-slate-500">
              Manuel de référence : Petite Alouette (Bordas) • {unit.pageRange}
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-1 border border-slate-300 p-2.5 rounded-xl">
            <div><strong>Nom de l’élève :</strong> ___________________</div>
            <div><strong>Date :</strong> ___ / ___ / 2026</div>
          </div>
        </div>

        {/* Section 1: Phonics and Syllables */}
        <div className="space-y-4 print-card">
          <h3 className="text-base font-extrabold text-slate-900 bg-amber-100 p-2 rounded-lg border-l-4 border-amber-600">
            1. Étude du code & Lecture de syllabes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unit.phonics.map((ph) => (
              <div key={ph.id} className="p-3.5 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-amber-900">
                    Phonème {ph.phoneme} ➔ {ph.graphemes}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">p. {ph.page}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ph.syllables.map((syl) => (
                    <span key={syl} className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-xs">
                      {syl}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-slate-600 pt-1">
                  <strong>Mots modèles :</strong> {ph.words.slice(0, 5).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Reading text & comprehension */}
        <div className="space-y-4 print-card">
          <h3 className="text-base font-extrabold text-slate-900 bg-sky-100 p-2 rounded-lg border-l-4 border-sky-600">
            2. Texte de lecture & Questions (Texte 1 : {unit.readings[0].title})
          </h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-serif">
            <p className="text-sm leading-relaxed text-slate-800">
              « {unit.readings[0].text} »
            </p>
            <div className="text-xs text-slate-500 font-sans border-t border-slate-200 pt-2 flex gap-4">
              <span><strong>Mots-outils à retenir :</strong> {unit.readings[0].motsOutils.join(', ')}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-800">Réponds par écrit ou à l’oral :</div>
            {unit.readings[0].questions.map((q, idx) => (
              <div key={idx} className="p-2 border-b border-dashed border-slate-300">
                <span className="font-semibold">{idx + 1}. {q.question}</span>
                <div className="mt-2 text-slate-400">Réponse : ___________________________________________________________</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Grammar rule */}
        <div className="space-y-3 print-card">
          <h3 className="text-base font-extrabold text-slate-900 bg-emerald-100 p-2 rounded-lg border-l-4 border-emerald-600">
            3. Règle de langue : {unit.grammar.title} (Manuel p. {unit.grammar.page})
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
            {unit.grammar.ruleSummary}
          </p>
        </div>

        {/* Section 4: Writing practice */}
        <div className="space-y-3 print-card">
          <h3 className="text-base font-extrabold text-slate-900 bg-purple-100 p-2 rounded-lg border-l-4 border-purple-600">
            4. Atelier d’écriture : {unit.writing.title}
          </h3>
          <p className="text-xs text-slate-600">
            Consigne : {unit.writing.instruction}
          </p>
          <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl space-y-3">
            {unit.writing.sampleModel.fields.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">{f.label} :</span>
                <span className="text-slate-300">________________________________________________</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-4 flex justify-between text-[11px] text-slate-400">
          <span>Mon Petit Français — Petite Alouette CP</span>
          <span>Validé pour impression scolaire</span>
        </div>
      </div>
    </div>
  );
};
