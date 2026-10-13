import React from 'react';
import { BookOpen, ExternalLink, ArrowRight, Layers } from 'lucide-react';
import { allUnits } from '../data/curriculumData';
import { Language } from '../types/curriculum';
import { getTranslation } from '../translations/i18n';

interface SynopticMatrixProps {
  onSelectUnit: (unitId: number) => void;
  language: Language;
}

export const SynopticMatrix: React.FC<SynopticMatrixProps> = ({ onSelectUnit, language }) => {
  const t = getTranslation(language);

  return (
    <div className="space-y-6 py-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <span>📋</span>
              <span>Sommaire Officiel — Petite Alouette CP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 mt-2">
              Tableau Synoptique des 12 Unités (Manuel pp. 6-7)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Vue d'ensemble cartographique de l'intégralité du programme avec repères de pages originaux. Cliquez sur une unité pour l’explorer en détail.
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Overflow Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-amber-500 text-white font-extrabold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 border-r border-amber-600/30">Unité / Période</th>
                <th className="p-3.5 border-r border-amber-600/30">Thème</th>
                <th className="p-3.5 border-r border-amber-600/30">Écoute & Oral</th>
                <th className="p-3.5 border-r border-amber-600/30">Étude du code (Sons & Graphèmes)</th>
                <th className="p-3.5 border-r border-amber-600/30">Lecture-Compréhension</th>
                <th className="p-3.5 border-r border-amber-600/30">Poésie</th>
                <th className="p-3.5 border-r border-amber-600/30">Langue</th>
                <th className="p-3.5 border-r border-amber-600/30">Écriture</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allUnits.map((u) => {
                const isPeriodStart = u.id === 1 || u.id === 4 || u.id === 7 || u.id === 10;
                return (
                  <tr
                    key={u.id}
                    onClick={() => onSelectUnit(u.id)}
                    className="hover:bg-amber-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Unit ID & Period */}
                    <td className="p-3.5 font-bold text-slate-800 border-r border-slate-100 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                          {u.id}
                        </span>
                        <div>
                          <div className="font-extrabold text-slate-900">U{u.id}</div>
                          <div className="text-[10px] text-slate-400">Période {u.period}</div>
                        </div>
                      </div>
                    </td>

                    {/* Theme */}
                    <td className="p-3.5 font-extrabold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{u.icon}</span>
                        <div>
                          <div>{u.theme}</div>
                          <div className="text-[10px] text-slate-400 font-normal" dir="rtl">{u.themeArabic}</div>
                        </div>
                      </div>
                    </td>

                    {/* Oral */}
                    <td className="p-3.5 border-r border-slate-100 min-w-[160px]">
                      <div className="font-bold text-slate-800">{u.oral.oralTitle}</div>
                      <div className="text-[11px] text-amber-700 font-semibold">« {u.oral.ecouteTitle} » (p. {u.oral.ecoutePage})</div>
                    </td>

                    {/* Phonics */}
                    <td className="p-3.5 border-r border-slate-100 min-w-[200px]">
                      <div className="space-y-1">
                        {u.phonics.map((ph) => (
                          <div key={ph.id} className="text-[11px] text-slate-700 flex items-center justify-between">
                            <span className="font-bold">{ph.phoneme} ➔ {ph.graphemes}</span>
                            <span className="text-slate-400 font-mono text-[10px]">p. {ph.page}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Reading */}
                    <td className="p-3.5 border-r border-slate-100 min-w-[180px]">
                      <div className="space-y-0.5">
                        {u.readings.map((r) => (
                          <div key={r.id} className="text-[11px] text-slate-700 truncate">
                            <span className="text-amber-800 font-bold">{r.number}.</span> {r.title} <span className="text-slate-400 text-[10px]">(p. {r.page})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Poetry */}
                    <td className="p-3.5 border-r border-slate-100 min-w-[140px]">
                      <div className="font-bold text-slate-800">{u.poetry.title}</div>
                      <div className="text-[10px] text-slate-500">{u.poetry.author} (p. {u.poetry.page})</div>
                    </td>

                    {/* Grammar */}
                    <td className="p-3.5 border-r border-slate-100 min-w-[140px]">
                      <div className="font-bold text-slate-800">{u.grammar.title}</div>
                      <div className="text-[10px] text-slate-400">p. {u.grammar.page}</div>
                    </td>

                    {/* Writing */}
                    <td className="p-3.5 border-r border-slate-100 min-w-[150px]">
                      <div className="font-bold text-slate-800">{u.writing.title}</div>
                      <div className="text-[10px] text-slate-400">p. {u.writing.page}</div>
                    </td>

                    {/* Open Unit Button */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUnit(u.id);
                        }}
                        className="p-2 rounded-xl bg-amber-100 group-hover:bg-amber-500 text-amber-900 group-hover:text-white font-bold transition-all"
                        title={`Ouvrir l'Unité ${u.id}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
