import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  Star,
  Check,
} from 'lucide-react';
import { Exercise, Language, Unit } from '../types/curriculum';
import { AudioButton } from './AudioButton';
import { getTranslation } from '../translations/i18n';

interface QuickQuizQuestion extends Exercise {
  originUnitId: number;
  originUnitTheme: string;
  originUnitIcon: string;
  originUnitPage: string;
}

interface QuickQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedUnitIds: number[];
  allUnits: Unit[];
  language: Language;
  soundSpeed: number;
  onExerciseComplete: (exerciseId: string, isCorrect: boolean) => void;
  onSelectUnit?: (unitId: number) => void;
}

export const QuickQuizModal: React.FC<QuickQuizModalProps> = ({
  isOpen,
  onClose,
  completedUnitIds,
  allUnits,
  language,
  soundSpeed,
  onExerciseComplete,
  onSelectUnit,
}) => {
  const t = getTranslation(language);

  // Fallback to Units 1 and 2 if student hasn't completed any units yet
  const [useFallbackUnits, setUseFallbackUnits] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(8);
  const [questions, setQuestions] = useState<QuickQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<
    { questionId: string; isCorrect: boolean; unitId: number; unitTheme: string }[]
  >([]);
  const [quizFinished, setQuizFinished] = useState(false);

  // Eligible units for pulling questions
  const eligibleUnits = useMemo(() => {
    if (completedUnitIds.length > 0 && !useFallbackUnits) {
      return allUnits.filter((u) => completedUnitIds.includes(u.id));
    }
    // Fallback units for testing when none are yet completed
    return allUnits.filter((u) => u.id === 1 || u.id === 2);
  }, [completedUnitIds, allUnits, useFallbackUnits]);

  // Generate shuffled questions from eligible units
  const generateQuizQuestions = () => {
    const pool: QuickQuizQuestion[] = [];

    eligibleUnits.forEach((unit) => {
      const theme =
        language === 'ar'
          ? unit.themeArabic
          : language === 'en'
          ? unit.themeEnglish
          : unit.theme;

      unit.exercises.forEach((ex) => {
        pool.push({
          ...ex,
          originUnitId: unit.id,
          originUnitTheme: theme,
          originUnitIcon: unit.icon,
          originUnitPage: unit.pageRange,
        });
      });
    });

    if (pool.length === 0) {
      setQuestions([]);
      return;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setHistory([]);
    setQuizFinished(false);
  };

  // Re-generate when modal opens or settings change
  useEffect(() => {
    if (isOpen) {
      generateQuizQuestions();
    }
  }, [isOpen, eligibleUnits, questionCount]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const hasCompletedUnits = completedUnitIds.length > 0;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswerSubmitted || !currentQ) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
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

    setHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        isCorrect,
        unitId: currentQ.originUnitId,
        unitTheme: currentQ.originUnitTheme,
      },
    ]);

    onExerciseComplete(currentQ.id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      if (score >= Math.ceil(questions.length * 0.7)) {
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch {
          // safe fallback
        }
      }
    }
  };

  const handleRestart = () => {
    generateQuizQuestions();
  };

  const qTitle =
    language === 'ar'
      ? currentQ?.titleArabic
      : language === 'en'
      ? currentQ?.titleEnglish
      : currentQ?.title;

  const qInstructions =
    language === 'ar'
      ? currentQ?.instructionsArabic
      : language === 'en'
      ? currentQ?.instructionsEnglish
      : currentQ?.instructions;

  const qQuestion =
    language === 'ar'
      ? currentQ?.questionArabic || currentQ?.question
      : language === 'en'
      ? currentQ?.questionEnglish || currentQ?.question
      : currentQ?.question;

  const qExplanation =
    language === 'ar'
      ? currentQ?.explanationAr
      : language === 'en'
      ? currentQ?.explanationEn
      : currentQ?.explanationFr;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-amber-300 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                  {t.quickQuiz.badge}
                </span>
                <span className="text-xs text-amber-100 font-bold">
                  {eligibleUnits.length} {eligibleUnits.length > 1 ? 'unités' : 'unité'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-display leading-tight">
                {t.quickQuiz.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Case: No units completed yet notice & discovery option */}
          {!hasCompletedUnits && !useFallbackUnits && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-900 font-black text-sm sm:text-base">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{t.quickQuiz.noUnitsTitle}</span>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                {t.quickQuiz.noUnitsDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  setUseFallbackUnits(true);
                  generateQuizQuestions();
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>🚀 {t.quickQuiz.tryFirstUnits}</span>
              </button>
            </div>
          )}

          {/* Quick Quiz Completed View */}
          {quizFinished ? (
            <div className="text-center py-6 sm:py-8 space-y-6">
              <div className="w-20 h-20 mx-auto bg-amber-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner animate-bounce">
                {score >= Math.ceil(questions.length * 0.8) ? '🏆' : '⭐'}
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900 font-display">
                  {t.quickQuiz.scoreTitle}
                </h4>
                <div className="text-3xl font-black text-amber-600 font-display">
                  {score} / {questions.length}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-md mx-auto">
                  {score === questions.length
                    ? t.quickQuiz.perfectScore
                    : score >= Math.ceil(questions.length * 0.7)
                    ? t.quickQuiz.goodScore
                    : t.quickQuiz.keepPracticing}
                </p>
              </div>

              {/* Units Review Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
                <div className="text-xs font-black text-slate-700 flex items-center justify-between">
                  <span>{t.quickQuiz.reviewedUnits}</span>
                  <span className="text-[11px] text-amber-600 font-bold">
                    +{score * 2} étoiles gagnées
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {history.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        item.isCorrect
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50/80 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-bold">U{item.unitId} :</span> {item.unitTheme}
                      </div>
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.quickQuiz.restart}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer"
                >
                  {t.quickQuiz.close}
                </button>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-slate-500 text-sm">Chargement des questions de révision...</p>
            </div>
          ) : (
            /* Active Question Card */
            <div className="space-y-5">
              {/* Progress and Question Source Header */}
              <div className="flex items-center justify-between gap-3 text-xs bg-slate-50 p-2.5 px-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-black text-amber-900 truncate">
                  <span>{currentQ.originUnitIcon}</span>
                  <span className="truncate">
                    {t.quickQuiz.fromUnit} {currentQ.originUnitId} : {currentQ.originUnitTheme}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-bold text-slate-600">
                    {currentIndex + 1} / {questions.length}
                  </span>
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                      {qTitle}
                    </span>
                    <p className="text-xs text-slate-500 font-medium">{qInstructions}</p>
                    <h4 className="text-base sm:text-lg font-black text-slate-800 font-display mt-1">
                      {qQuestion}
                    </h4>
                  </div>

                  <AudioButton
                    text={currentQ.audioPrompt || currentQ.question}
                    speed={soundSpeed}
                    size="md"
                    variant="primary"
                  />
                </div>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, idx) => {
                    let optStyle =
                      'bg-white border-2 border-slate-200 hover:border-amber-400 text-slate-800';

                    if (isAnswerSubmitted) {
                      if (idx === currentQ.correctAnswer) {
                        optStyle =
                          'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-black shadow-xs';
                      } else if (idx === selectedOption) {
                        optStyle = 'bg-rose-50 border-2 border-rose-500 text-rose-950 font-black';
                      } else {
                        optStyle = 'bg-slate-50 border border-slate-200 text-slate-400 opacity-60';
                      }
                    } else if (selectedOption === idx) {
                      optStyle = 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-black shadow-xs';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between gap-3 text-sm transition-all cursor-pointer ${optStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                              selectedOption === idx
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="font-semibold">{opt}</span>
                        </div>

                        <AudioButton text={opt} speed={soundSpeed} size="sm" variant="ghost" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback & Explanation Box */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-2xl border-2 space-y-2 animate-fade-in ${
                    selectedOption === currentQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm">
                    {selectedOption === currentQ.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{t.feedback.correct} (+2 ⭐)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span>{t.feedback.incorrect}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed font-medium">
                    {qExplanation}
                  </p>
                </div>
              )}

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-500">
                  Score : <span className="text-amber-600 font-black">{score}</span>
                </div>

                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      selectedOption !== null
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs hover:scale-105'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {t.actions.verify}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs shadow-xs transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>
                      {currentIndex < questions.length - 1
                        ? t.actions.next
                        : 'Voir les résultats'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
