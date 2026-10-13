import React from 'react';
import { X, Award, Star, CheckCircle, RotateCcw } from 'lucide-react';
import { UserProgress, Language } from '../types/curriculum';
import { allUnits } from '../data/curriculumData';
import { getTranslation } from '../translations/i18n';

interface ProgressReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  language: Language;
  onResetProgress: () => void;
}

export const ProgressReportModal: React.FC<ProgressReportModalProps> = ({
  isOpen,
  onClose,
  progress,
  language,
  onResetProgress,
}) => {
  const t = getTranslation(language);

  if (!isOpen) return null;

  const totalExercisesAttempted = Object.keys(progress.completedExercises).length;
  const completedCount = progress.completedUnits.length;
  const progressPercent = Math.round((completedCount / allUnits.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/20 rounded-2xl text-2xl">🎓</span>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-display">
                Carnet de Progrès CP
              </h2>
              <p className="text-amber-100 text-xs mt-0.5">
                Suivi pédagogique de l’élève — Petite Alouette
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <Star className="w-6 h-6 text-amber-500 mx-auto fill-amber-400 mb-1" />
              <div className="text-2xl font-black text-amber-900 font-display">
                {progress.starsEarned}
              </div>
              <div className="text-xs text-amber-700 font-bold">Étoiles gagnées</div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <div className="text-2xl font-black text-emerald-900 font-display">
                {completedCount} / 12
              </div>
              <div className="text-xs text-emerald-700 font-bold">Unités validées</div>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-center">
              <Award className="w-6 h-6 text-sky-500 mx-auto mb-1" />
              <div className="text-2xl font-black text-sky-900 font-display">
                {progressPercent}%
              </div>
              <div className="text-xs text-sky-700 font-bold">Maîtrise globale</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Progression du programme CP</span>
              <span>{progressPercent}% complété</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-linear-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Unit breakdown table */}
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-3">
              Détail des 12 unités officielles :
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {allUnits.map((u) => {
                const isDone = progress.completedUnits.includes(u.id);
                return (
                  <div
                    key={u.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{u.icon}</span>
                      <span>
                        Unité {u.id} : {u.theme}
                      </span>
                    </div>
                    {isDone ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Validé
                      </span>
                    ) : (
                      <span className="text-slate-400">En cours</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* LocalStorage persistence notice */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
            💾 <strong>Sauvegarde permanente active :</strong> Vos étoiles, vos réponses aux quiz et les unités terminées sont enregistrées localement dans votre navigateur. Vous pouvez recharger la page sans perdre votre progression.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            onClick={() => {
              if (window.confirm(t.actions.confirmReset)) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.actions.resetProgress}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
