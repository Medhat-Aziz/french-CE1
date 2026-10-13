import { UserProgress, Language } from '../types/curriculum';

const STORAGE_KEY = 'mon_petit_francais_progress_v2';

export const getInitialProgress = (): UserProgress => ({
  completedUnits: [],
  completedExercises: {},
  starsEarned: 0,
  soundSpeed: 0.76,
  selectedLanguage: 'fr',
  notes: {},
  lastVisitedUnit: 1,
  selectedVoiceName: '',
  voicePitch: 0.88,
});

export const loadUserProgress = (): UserProgress => {
  if (typeof window === 'undefined') return getInitialProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialProgress();
    const parsed = JSON.parse(raw);
    return {
      completedUnits: Array.isArray(parsed.completedUnits) ? parsed.completedUnits : [],
      completedExercises: typeof parsed.completedExercises === 'object' && parsed.completedExercises !== null ? parsed.completedExercises : {},
      starsEarned: typeof parsed.starsEarned === 'number' ? parsed.starsEarned : 0,
      soundSpeed: typeof parsed.soundSpeed === 'number' ? parsed.soundSpeed : 0.76,
      selectedLanguage: (['fr', 'ar', 'en'].includes(parsed.selectedLanguage) ? parsed.selectedLanguage : 'fr') as Language,
      notes: parsed.notes || {},
      lastVisitedUnit: typeof parsed.lastVisitedUnit === 'number' ? parsed.lastVisitedUnit : 1,
      selectedVoiceName: typeof parsed.selectedVoiceName === 'string' ? parsed.selectedVoiceName : '',
      voicePitch: typeof parsed.voicePitch === 'number' ? parsed.voicePitch : 0.88,
    };
  } catch (err) {
    console.error('Failed to load progress from localStorage:', err);
    return getInitialProgress();
  }
};

export const saveUserProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage:', err);
  }
};

export const resetProgress = (): UserProgress => {
  const fresh = getInitialProgress();
  saveUserProgress(fresh);
  return fresh;
};
