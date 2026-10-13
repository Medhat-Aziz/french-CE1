import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Layers,
} from 'lucide-react';
import { Exercise, Language } from '../types/curriculum';
import { AudioButton } from './AudioButton';
import { getTranslation } from '../translations/i18n';

interface ExercisePlayerProps {
  exercises: Exercise[];
  unitId: number;
  language: Language;
  soundSpeed: number;
  onExerciseComplete: (exerciseId: string, isCorrect: boolean) => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({
  exercises,
  unitId,
  language,
  soundSpeed,
  onExerciseComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const t = getTranslation(language);
  const currentEx = exercises[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentEx.correctAnswer;

    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // safe fallback
      }
    }

    onExerciseComplete(currentEx.id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setSessionScore(0);
    setQuizFinished(false);
  };

  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-amber-200">
        <p className="text-slate-500">Aucun exercice disponible pour cette unité.</p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-amber-300 shadow-lg text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-4xl shadow-inner">
          🏆
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 font-display">
            {t.feedback.mastery}
          </h3>
          <p className="text-slate-600 mt-2">
            {t.feedback.score} <span className="font-extrabold text-amber-600 text-lg">{sessionScore} / {exercises.length}</span>
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold rounded-2xl shadow-sm transition-transform hover:scale-105 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.actions.restart}</span>
          </button>
        </div>
      </div>
    );
  }

  const isCurrentCorrect = selectedOption === currentEx.correctAnswer;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-md space-y-6">
      {/* Exercise metadata & category badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          {currentEx.sourceCategory === 'manual' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.officialSource}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.supplementarySource}</span>
            </span>
          )}
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Question {currentIndex + 1} / {exercises.length}
        </div>
      </div>

      {/* Question header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-lg md:text-xl font-bold text-slate-900 font-display">
            {language === 'ar' ? currentEx.titleArabic : language === 'en' ? currentEx.titleEnglish : currentEx.title}
          </h4>
          {currentEx.audioPrompt && (
            <AudioButton text={currentEx.audioPrompt} speed={soundSpeed} size="sm" />
          )}
        </div>
        <p className="text-sm text-slate-600">
          {language === 'ar' ? currentEx.instructionsArabic : language === 'en' ? currentEx.instructionsEnglish : currentEx.instructions}
        </p>
      </div>

      {/* Main question box */}
      <div className="p-4 md:p-5 bg-amber-50/70 border-2 border-amber-200 rounded-2xl flex items-center justify-between gap-3">
        <div className="text-base md:text-lg font-bold text-slate-800">
          {language === 'ar' && currentEx.questionArabic ? currentEx.questionArabic : currentEx.question}
        </div>
        <AudioButton text={currentEx.question} speed={soundSpeed} size="md" variant="secondary" />
      </div>

      {/* Options grid */}
      <div className="space-y-3">
        {currentEx.options.map((opt, idx) => {
          let btnStateClasses = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';

          if (selectedOption === idx) {
            btnStateClasses = 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs ring-2 ring-amber-300';
          }

          if (isAnswerSubmitted) {
            if (idx === currentEx.correctAnswer) {
              btnStateClasses = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400';
            } else if (selectedOption === idx) {
              btnStateClasses = 'bg-rose-100 border-rose-400 text-rose-900 ring-2 ring-rose-300';
            } else {
              btnStateClasses = 'opacity-50 border-slate-200 bg-slate-50 text-slate-600';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswerSubmitted}
              onClick={() => handleSelectOption(idx)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${btnStateClasses}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-700 shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-base font-semibold">{opt}</span>
              </div>

              <div className="flex items-center gap-2">
                <AudioButton text={opt} speed={soundSpeed} size="sm" variant="ghost" />
                {isAnswerSubmitted && idx === currentEx.correctAnswer && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                )}
                {isAnswerSubmitted && selectedOption === idx && idx !== currentEx.correctAnswer && (
                  <XCircle className="w-6 h-6 text-rose-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Pedagogical Explanation Box on submit */}
      {isAnswerSubmitted && (
        <div
          className={`p-4 md:p-5 rounded-2xl border-2 space-y-2 transition-all ${
            isCurrentCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2 font-black text-sm">
            {isCurrentCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{t.feedback.correct}</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>{t.feedback.incorrect}</span>
              </>
            )}
          </div>

          <div className="text-sm leading-relaxed pl-7">
            <span className="font-bold">{t.actions.explanation} </span>
            {language === 'ar'
              ? currentEx.explanationAr
              : language === 'en'
              ? currentEx.explanationEn
              : currentEx.explanationFr}
          </div>
        </div>
      )}

      {/* Action footer */}
      <div className="flex items-center justify-between pt-2">
        {currentEx.hint && !isAnswerSubmitted && (
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-bold cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{showHint ? 'Masquer l’indice' : t.actions.hint}</span>
          </button>
        )}

        {showHint && !isAnswerSubmitted && (
          <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 p-2.5 rounded-xl max-w-xs">
            💡 {language === 'ar' && currentEx.hintArabic ? currentEx.hintArabic : currentEx.hint}
          </div>
        )}

        <div className="ml-auto">
          {!isAnswerSubmitted ? (
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleSubmit}
              className={`px-6 py-2.5 rounded-2xl font-bold text-white transition-all cursor-pointer ${
                selectedOption !== null
                  ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-md hover:scale-105'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              {t.actions.verify}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-bold rounded-2xl shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <span>{t.actions.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
