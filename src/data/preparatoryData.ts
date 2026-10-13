export interface PreparatoryData {
  title: string;
  subtitle: string;
  pages: string;
  letters: string[];
  syllables: string[];
  colors: { fr: string; ar: string; hex: string }[];
  numbers: { num: number; wordFr: string; wordAr: string }[];
  letterCountWords: { word: string; lettersCount: number; translationAr: string }[];
  schoolObjects: { name: string; translationAr: string; icon: string }[];
}

export const preparatoryData: PreparatoryData = {
  title: 'Activités Préparatoires',
  subtitle: 'Je prépare ma rentrée au CP : lettres, syllabes, couleurs, chiffres et école',
  pages: 'p. 6 - 7',
  letters: [
    'M', 'A', 'T', 'O', 'S', 'N', 'Z', 'P', 'V',
    'E', 'D', 'C', 'U', 'B', 'X', 'Y', 'I', 'L',
    'K', 'G', 'J', 'H', 'F', 'Q', 'W'
  ],
  syllables: [
    'Mi', 'Ta', 'So', 'Nu', 'Za', 'Pi',
    'Da', 'Bo', 'Lu', 'Jo', 'Fa', 'Ko'
  ],
  colors: [
    { fr: 'Rouge', ar: 'أحمر', hex: '#ef4444' },
    { fr: 'Vert', ar: 'أخضر', hex: '#22c55e' },
    { fr: 'Noir', ar: 'أسود', hex: '#1e293b' },
    { fr: 'Jaune', ar: 'أصفر', hex: '#eab308' },
    { fr: 'Bleu', ar: 'أزرق', hex: '#3b82f6' },
    { fr: 'Marron', ar: 'بني', hex: '#854d0e' },
  ],
  numbers: [
    { num: 1, wordFr: 'un', wordAr: 'واحد' },
    { num: 6, wordFr: 'six', wordAr: 'ستة' },
    { num: 2, wordFr: 'deux', wordAr: 'اثنان' },
    { num: 9, wordFr: 'neuf', wordAr: 'تسعة' },
    { num: 0, wordFr: 'zéro', wordAr: 'صفر' },
    { num: 5, wordFr: 'cinq', wordAr: 'خمسة' },
    { num: 3, wordFr: 'trois', wordAr: 'ثلاثة' },
    { num: 4, wordFr: 'quatre', wordAr: 'أربعة' },
    { num: 7, wordFr: 'sept', wordAr: 'سبعة' },
    { num: 8, wordFr: 'huit', wordAr: 'ثمانية' },
  ],
  letterCountWords: [
    { word: 'Maman', lettersCount: 5, translationAr: 'أمي' },
    { word: 'Papa', lettersCount: 4, translationAr: 'أبي' },
    { word: 'chat', lettersCount: 4, translationAr: 'قط' },
    { word: 'école', lettersCount: 5, translationAr: 'مدرسة' },
    { word: 'règle', lettersCount: 5, translationAr: 'مسطرة' },
  ],
  schoolObjects: [
    { name: 'Un cartable', translationAr: 'محفظة مدرسية', icon: '🎒' },
    { name: 'Une maîtresse', translationAr: 'معلمة', icon: '👩‍🏫' },
    { name: 'Un livre', translationAr: 'كتاب', icon: '📖' },
    { name: 'Un stylo', translationAr: 'قلم حبر', icon: '🖊️' },
    { name: 'Une classe', translationAr: 'قسم / فصل', icon: '🏫' },
    { name: 'Une table', translationAr: 'طاولة', icon: '🪑' },
  ]
};
