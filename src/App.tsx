import React, { useState, useEffect } from 'react';
import {
  loadUserProgress,
  saveUserProgress,
  resetProgress,
} from './utils/storage';
import { initAudioVoices } from './utils/audio';
import { UserProgress, Language } from './types/curriculum';
import { getUnitById } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { UnitDashboard } from './components/UnitDashboard';
import { UnitView } from './components/UnitView';
import { PreparatoryModal } from './components/PreparatoryModal';
import { DictionaryModal } from './components/DictionaryModal';
import { ProgressReportModal } from './components/ProgressReportModal';
import { getTranslation } from './translations/i18n';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [currentUnitId, setCurrentUnitId] = useState<number | null>(null);
  const [isPreparatoryOpen, setIsPreparatoryOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Initialize browser speech synthesis
  useEffect(() => {
    initAudioVoices();
  }, []);

  // Sync language and RTL direction with HTML document element
  useEffect(() => {
    const isRtl = progress.selectedLanguage === 'ar';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', progress.selectedLanguage);
  }, [progress.selectedLanguage]);

  // Persist progress to localStorage whenever progress changes
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  const handleSelectUnit = (unitId: number | null) => {
    setCurrentUnitId(unitId);
    if (unitId !== null) {
      setProgress((prev) => ({
        ...prev,
        lastVisitedUnit: unitId,
      }));
    }
  };

  const handleSelectLanguage = (lang: Language) => {
    setProgress((prev) => ({
      ...prev,
      selectedLanguage: lang,
    }));
  };

  const handleChangeSoundSpeed = (speed: number) => {
    setProgress((prev) => ({
      ...prev,
      soundSpeed: speed,
    }));
  };

  const handleExerciseComplete = (exerciseId: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const currentStats = prev.completedExercises[exerciseId] || { score: 0, total: 0, date: '' };
      const newScore = isCorrect ? currentStats.score + 1 : currentStats.score;
      const newTotal = currentStats.total + 1;
      const starsToAdd = isCorrect ? 2 : 0;

      return {
        ...prev,
        starsEarned: prev.starsEarned + starsToAdd,
        completedExercises: {
          ...prev.completedExercises,
          [exerciseId]: {
            score: newScore,
            total: newTotal,
            date: new Date().toISOString(),
          },
        },
      };
    });
  };

  const handleToggleUnitCompleted = (unitId: number) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedUnits.includes(unitId);
      const newUnits = alreadyDone
        ? prev.completedUnits.filter((id) => id !== unitId)
        : [...prev.completedUnits, unitId];

      const bonusStars = !alreadyDone ? 5 : 0;

      return {
        ...prev,
        completedUnits: newUnits,
        starsEarned: prev.starsEarned + bonusStars,
      };
    });
  };

  const handleReset = () => {
    const fresh = resetProgress();
    setProgress(fresh);
    setIsReportOpen(false);
  };

  const currentUnit = currentUnitId ? getUnitById(currentUnitId) : null;
  const t = getTranslation(progress.selectedLanguage);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      {/* Navigation Header */}
      <Navbar
        currentUnitId={currentUnitId}
        onSelectUnit={handleSelectUnit}
        language={progress.selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
        starsEarned={progress.starsEarned}
        soundSpeed={progress.soundSpeed}
        onChangeSoundSpeed={handleChangeSoundSpeed}
        onOpenPreparatory={() => setIsPreparatoryOpen(true)}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentUnit ? (
          <UnitView
            unit={currentUnit}
            onBackToDashboard={() => setCurrentUnitId(null)}
            onSelectUnit={handleSelectUnit}
            language={progress.selectedLanguage}
            soundSpeed={progress.soundSpeed}
            progress={progress}
            onToggleUnitCompleted={handleToggleUnitCompleted}
            onExerciseComplete={handleExerciseComplete}
          />
        ) : (
          <UnitDashboard
            onSelectUnit={handleSelectUnit}
            progress={progress}
            language={progress.selectedLanguage}
            onOpenPreparatory={() => setIsPreparatoryOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <PreparatoryModal
        isOpen={isPreparatoryOpen}
        onClose={() => setIsPreparatoryOpen(false)}
        language={progress.selectedLanguage}
        soundSpeed={progress.soundSpeed}
      />

      <DictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        language={progress.selectedLanguage}
        soundSpeed={progress.soundSpeed}
      />

      <ProgressReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        progress={progress}
        language={progress.selectedLanguage}
        onResetProgress={handleReset}
      />

      {/* Educational Footer */}
      <footer className="border-t border-amber-200 bg-white/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            Mon Petit Français — Conforme au manuel <strong>Petite Alouette CP (Cycle 2)</strong>, éditions Bordas.
          </p>
          <p className="text-[11px] text-slate-400">
            Contenus textuels, poèmes, phonèmes et repères de pages vérifiés d'après le spécimen officiel. Les exercices complémentaires pour débutants sont clairement indiqués.
          </p>
        </div>
      </footer>
    </div>
  );
}
