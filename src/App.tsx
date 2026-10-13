import React, { useState, useEffect } from 'react';
import {
  loadUserProgress,
  saveUserProgress,
  resetProgress,
} from './utils/storage';
import { initAudioVoices } from './utils/audio';
import { UserProgress, Language } from './types/curriculum';
import { getUnitById } from './data/curriculumData';
import { Navbar, WebsiteView } from './components/Navbar';
import { UnitDashboard } from './components/UnitDashboard';
import { UnitView } from './components/UnitView';
import { MethodPage } from './components/MethodPage';
import { SynopticMatrix } from './components/SynopticMatrix';
import { WorksheetsPage } from './components/WorksheetsPage';
import { PreparatoryModal } from './components/PreparatoryModal';
import { DictionaryModal } from './components/DictionaryModal';
import { ProgressReportModal } from './components/ProgressReportModal';
import { getTranslation } from './translations/i18n';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [currentView, setCurrentView] = useState<WebsiteView>('home');
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
      setCurrentView('units');
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
        currentView={currentView}
        onChangeView={setCurrentView}
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

      {/* Main Website Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
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
        ) : currentView === 'method' ? (
          <MethodPage
            language={progress.selectedLanguage}
            onGoToUnits={() => setCurrentView('home')}
          />
        ) : currentView === 'matrix' ? (
          <SynopticMatrix
            onSelectUnit={handleSelectUnit}
            language={progress.selectedLanguage}
          />
        ) : currentView === 'worksheets' ? (
          <WorksheetsPage
            language={progress.selectedLanguage}
          />
        ) : (
          <UnitDashboard
            onSelectUnit={handleSelectUnit}
            progress={progress}
            language={progress.selectedLanguage}
            onOpenPreparatory={() => setIsPreparatoryOpen(true)}
            onGoToMatrix={() => setCurrentView('matrix')}
            onGoToMethod={() => setCurrentView('method')}
            onGoToWorksheets={() => setCurrentView('worksheets')}
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

      {/* Comprehensive Website Footer */}
      <footer className="border-t-2 border-amber-200 bg-white py-10 mt-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Identity */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🕊️</span>
                <span className="font-extrabold text-base text-slate-900 font-display">
                  Mon Petit Français
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Plateforme web interactive pour l’apprentissage de la langue française au Cours Préparatoire (CP Cycle 2), conforme au manuel officiel <em>Petite Alouette</em> (Bordas).
              </p>
            </div>

            {/* Col 2: Navigation rapide */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-sm">Navigation du Site</div>
              <ul className="space-y-1.5 text-slate-500">
                <li>
                  <button
                    onClick={() => {
                      setCurrentUnitId(null);
                      setCurrentView('home');
                    }}
                    className="hover:text-amber-600 cursor-pointer"
                  >
                    Accueil & Les 12 Unités
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentUnitId(null);
                      setCurrentView('matrix');
                    }}
                    className="hover:text-amber-600 cursor-pointer"
                  >
                    Tableau Synoptique (pp. 6-7)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentUnitId(null);
                      setCurrentView('method');
                    }}
                    className="hover:text-amber-600 cursor-pointer"
                  >
                    Méthode Pédagogique
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentUnitId(null);
                      setCurrentView('worksheets');
                    }}
                    className="hover:text-amber-600 cursor-pointer"
                  >
                    Fiches d'exercices à imprimer
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Outils & Ressources */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-sm">Outils d'Apprentissage</div>
              <ul className="space-y-1.5 text-slate-500">
                <li>
                  <button
                    onClick={() => setIsPreparatoryOpen(true)}
                    className="hover:text-amber-600 cursor-pointer"
                  >
                    Activités Préparatoires (pp. 6-7)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsDictionaryOpen(true)}
                    className="hover:text-amber-600 cursor-pointer"
                  >
                    Dictionnaire Illustré (12 unités)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="hover:text-amber-600 cursor-pointer"
                  >
                    Carnet de Progrès & Étoiles
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Références Officielles */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-sm">Références Officielles</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Coordinateur : Abdelhak Bel Lakhdar.<br />
                Auteurs : Mohamed Azzouzi, Fouad Chaib, Abderzak Elkahlaoui, Mostafa Rassy, Abdelaziz Ziouane.<br />
                Édition : Bordas éditeur (Programmes 2016).
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              © 2026 Mon Petit Français. Plateforme éducative pour l'apprentissage du français CP.
            </div>
            <div className="flex items-center gap-4">
              <span>Synthèse vocale intégrée</span>
              <span>·</span>
              <span>Support Arabe RTL complet</span>
              <span>·</span>
              <span>Sauvegarde automatique</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
