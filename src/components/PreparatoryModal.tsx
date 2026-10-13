import React, { useState } from 'react';
import { X, BookOpen, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { preparatoryData } from '../data/preparatoryData';
import { AudioButton } from './AudioButton';
import { Language } from '../types/curriculum';
import { getTranslation } from '../translations/i18n';

interface PreparatoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundSpeed: number;
}

export const PreparatoryModal: React.FC<PreparatoryModalProps> = ({
  isOpen,
  onClose,
  language,
  soundSpeed,
}) => {
  const [activeTab, setActiveTab] = useState<'letters' | 'syllables' | 'colors' | 'numbers' | 'objects'>('letters');
  const t = getTranslation(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-400 via-orange-400 to-amber-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/20 rounded-2xl text-2xl">🎒</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-display">{t.preparatoryTitle}</h2>
                <span className="text-xs bg-white text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  p. 6-7 Manuel
                </span>
              </div>
              <p className="text-amber-100 text-sm mt-0.5">{t.preparatorySubtitle}</p>
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

        {/* Tab navigation */}
        <div className="flex border-b border-amber-100 bg-amber-50/50 p-2 gap-2 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('letters')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'letters' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-amber-100'
            }`}
          >
            1. Lettres ({preparatoryData.letters.length})
          </button>
          <button
            onClick={() => setActiveTab('syllables')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'syllables' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-amber-100'
            }`}
          >
            2. Syllabes ({preparatoryData.syllables.length})
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'colors' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-amber-100'
            }`}
          >
            3. Couleurs ({preparatoryData.colors.length})
          </button>
          <button
            onClick={() => setActiveTab('numbers')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'numbers' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-amber-100'
            }`}
          >
            4. Chiffres & Mots
          </button>
          <button
            onClick={() => setActiveTab('objects')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'objects' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-amber-100'
            }`}
          >
            5. Objets de l’école
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'letters' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <span>1. Je lis les lettres (Manuel p. 6)</span>
                </h3>
                <span className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full font-medium">
                  Clique sur une lettre pour l’écouter
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-3">
                {preparatoryData.letters.map((letter) => (
                  <div
                    key={letter}
                    className="p-3 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 shadow-xs"
                  >
                    <span className="text-2xl font-black text-amber-900 font-display">{letter}</span>
                    <span className="text-xs text-slate-500 mt-1 font-serif italic">{letter.toLowerCase()}</span>
                    <AudioButton text={letter} speed={soundSpeed} size="sm" variant="ghost" className="mt-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'syllables' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-lg">
                  2. Je lis les syllabes (Manuel p. 6)
                </h3>
                <span className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full font-medium">
                  Écoute la fusion consonne + voyelle
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {preparatoryData.syllables.map((syl) => (
                  <div
                    key={syl}
                    className="p-3.5 bg-sky-50 border-2 border-sky-200 rounded-2xl flex items-center justify-between shadow-xs hover:bg-sky-100 transition-colors"
                  >
                    <span className="text-xl font-extrabold text-sky-900 font-display">{syl}</span>
                    <AudioButton text={syl} speed={soundSpeed} size="sm" variant="secondary" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-4">
                3. Je dis le nom de chaque couleur (Manuel p. 6)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {preparatoryData.colors.map((color) => (
                  <div
                    key={color.fr}
                    className="p-4 bg-white border-2 border-slate-200 rounded-2xl flex items-center gap-3 shadow-xs hover:border-amber-400 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-xl shadow-xs shrink-0 border border-black/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">{color.fr}</div>
                      <div className="text-xs text-slate-500 font-medium" dir="rtl">{color.ar}</div>
                    </div>
                    <AudioButton text={color.fr} speed={soundSpeed} size="sm" variant="ghost" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'numbers' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-3">
                  4. Je lis les chiffres (Manuel p. 7)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {preparatoryData.numbers.map((num) => (
                    <div
                      key={num.num}
                      className="p-3 bg-purple-50 border-2 border-purple-200 rounded-2xl flex flex-col items-center justify-center shadow-xs"
                    >
                      <span className="text-2xl font-black text-purple-900 font-display">{num.num}</span>
                      <span className="text-xs font-bold text-purple-700">{num.wordFr}</span>
                      <span className="text-xs text-purple-500" dir="rtl">{num.wordAr}</span>
                      <AudioButton text={num.wordFr} speed={soundSpeed} size="sm" variant="ghost" className="mt-1" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-3">
                  5. Je compte le nombre de lettres dans chaque mot (Manuel p. 7)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preparatoryData.letterCountWords.map((item) => (
                    <div
                      key={item.word}
                      className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <span className="text-lg font-bold text-slate-800">{item.word}</span>
                        <span className="text-xs text-slate-500 ml-2 font-medium" dir="rtl">({item.translationAr})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                          {item.lettersCount} lettres
                        </span>
                        <AudioButton text={item.word} speed={soundSpeed} size="sm" variant="ghost" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'objects' && (
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-4">
                6. Je dis les noms des objets suivants (Manuel p. 7)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {preparatoryData.schoolObjects.map((obj) => (
                  <div
                    key={obj.name}
                    className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center gap-3 shadow-xs hover:bg-emerald-100/60 transition-colors"
                  >
                    <span className="text-3xl">{obj.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-emerald-950 text-sm">{obj.name}</div>
                      <div className="text-xs text-emerald-700" dir="rtl">{obj.translationAr}</div>
                    </div>
                    <AudioButton text={obj.name} speed={soundSpeed} size="sm" variant="ghost" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Source : Petite Alouette CP, Bordas (Activités préparatoires pp. 6-7)</span>
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
