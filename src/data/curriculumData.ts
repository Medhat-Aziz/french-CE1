import { Unit, LexiconItem } from '../types/curriculum';
import { period1Units } from './units/period1';
import { period2Units } from './units/period2';
import { period3Units } from './units/period3';
import { period4Units } from './units/period4';

export const allUnits: Unit[] = [
  ...period1Units,
  ...period2Units,
  ...period3Units,
  ...period4Units,
];

export const getUnitById = (id: number): Unit | undefined => {
  return allUnits.find((u) => u.id === id);
};

export const getAllDictionaryWords = (): (LexiconItem & { unitId: number; unitTheme: string })[] => {
  const result: (LexiconItem & { unitId: number; unitTheme: string })[] = [];
  for (const unit of allUnits) {
    for (const item of unit.dictionary) {
      result.push({
        ...item,
        unitId: unit.id,
        unitTheme: unit.theme,
      });
    }
  }
  return result;
};

export const periodInfo = [
  {
    period: 1,
    titleFr: 'Période 1 : L’École, les Amis & la Famille',
    titleAr: 'المرحلة 1 : المدرسة، الأصدقاء والعائلة',
    titleEn: 'Period 1: School, Friends & Family',
    units: [1, 2, 3],
    badgeColor: 'bg-amber-500 text-white',
    pages: 'p. 8 - 57',
    evaluationPage: 'p. 56 - 57',
  },
  {
    period: 2,
    titleFr: 'Période 2 : Santé, Nourriture & Sécurité',
    titleAr: 'المرحلة 2 : الصحة، الغذاء والسلامة',
    titleEn: 'Period 2: Health, Food & Safety',
    units: [4, 5, 6],
    badgeColor: 'bg-cyan-500 text-white',
    pages: 'p. 58 - 107',
    evaluationPage: 'p. 106 - 107',
  },
  {
    period: 3,
    titleFr: 'Période 3 : L’Eau, les Animaux & la Forêt',
    titleAr: 'المرحلة 3 : الماء، الحيوانات والغابة',
    titleEn: 'Period 3: Water, Animals & Forest',
    units: [7, 8, 9],
    badgeColor: 'bg-emerald-500 text-white',
    pages: 'p. 108 - 157',
    evaluationPage: 'p. 156 - 157',
  },
  {
    period: 4,
    titleFr: 'Période 4 : Les Fêtes, les Loisirs & les Vacances',
    titleAr: 'المرحلة 4 : الأعياد، الترفيه والعطلات',
    titleEn: 'Period 4: Celebrations, Leisure & Holidays',
    units: [10, 11, 12],
    badgeColor: 'bg-fuchsia-500 text-white',
    pages: 'p. 158 - 209',
    evaluationPage: 'p. 206 - 207',
  },
];
