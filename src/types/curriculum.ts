export type Language = 'fr' | 'ar' | 'en';

export type ExerciseType =
  | 'phonics_listen'
  | 'syllable_blend'
  | 'reading_comprehension'
  | 'grammar_mcq'
  | 'word_order'
  | 'fill_blank';

export interface PhonicLesson {
  id: string;
  phoneme: string; // e.g. "[a]", "[m]", "[o] - [ɔ]"
  graphemes: string; // e.g. "a", "m, mm", "au, eau"
  page: number;
  keyword: string; // e.g. "Ananas", "Maîtresse", "Poupée"
  imageIcon: string;
  syllables: string[];
  words: string[];
  phrases: string[];
}

export interface ReadingText {
  id: string;
  number: number; // 1, 2, 3, 4
  title: string;
  page: number;
  text: string;
  textArabic?: string;
  motsOutils: string[];
  questions: {
    question: string;
    questionArabic?: string;
    answer: string;
    answerArabic?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface LexiconItem {
  id: string;
  word: string;
  article?: string;
  category: 'nom' | 'verbe' | 'adjectif' | 'nombre';
  translationAr: string;
  translationEn: string;
  phonetic?: string;
  example: string;
  icon: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  sourceCategory: 'manual' | 'supplementary'; // Clearly labeled as Official Manual or Supplementary
  title: string;
  titleArabic: string;
  titleEnglish: string;
  instructions: string;
  instructionsArabic: string;
  instructionsEnglish: string;
  audioPrompt?: string;
  question: string;
  questionArabic?: string;
  questionEnglish?: string;
  options: string[];
  correctAnswer: number; // index of the correct option
  hint?: string;
  hintArabic?: string;
  explanationFr: string;
  explanationAr: string;
  explanationEn: string;
}

export interface Unit {
  id: number;
  period: 1 | 2 | 3 | 4;
  theme: string;
  themeArabic: string;
  themeEnglish: string;
  pageRange: string;
  badgeColor: string;
  accentBg: string;
  icon: string;
  project: {
    title: string;
    titleArabic: string;
    titleEnglish: string;
    page: number;
    description: string;
    steps: string[];
  };
  oral: {
    ecouteTitle: string;
    ecoutePage: number;
    oralTitle: string;
    oralPage: number;
    context: string;
    contextArabic: string;
    dialogue: { speaker: string; text: string; roleAr?: string }[];
    questions: { question: string; answer: string; questionAr?: string }[];
    toolExpressions: {
      useCase: string;
      useCaseArabic: string;
      expressions: string[];
    }[];
  };
  phonics: PhonicLesson[];
  readings: ReadingText[];
  poetry: {
    title: string;
    author: string;
    source?: string;
    page: number;
    stanzas: string[];
    summaryAr: string;
    summaryEn: string;
  };
  grammar: {
    title: string;
    page: number;
    ruleSummary: string;
    ruleSummaryArabic: string;
    examples: string[];
    observeSentences: string[];
  };
  writing: {
    title: string;
    page: number;
    instruction: string;
    instructionArabic: string;
    structureTips: string[];
    sampleModel: {
      heading: string;
      fields: { label: string; value: string }[];
    };
  };
  dictionary: LexiconItem[];
  exercises: Exercise[];
}

export interface UserProgress {
  completedUnits: number[];
  completedExercises: Record<string, { score: number; total: number; date: string }>;
  starsEarned: number;
  soundSpeed: number;
  selectedLanguage: Language;
  notes: Record<string, string>;
  lastVisitedUnit: number;
  selectedVoiceName?: string;
  voicePitch?: number;
}
