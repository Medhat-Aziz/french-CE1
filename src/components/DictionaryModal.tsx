import React, { useState, useMemo } from 'react';
import { X, Search, Book, Volume2 } from 'lucide-react';
import { getAllDictionaryWords } from '../data/curriculumData';
import { AudioButton } from './AudioButton';
import { Language } from '../types/curriculum';
import { getTranslation } from '../translations/i18n';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundSpeed: number;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  isOpen,
  onClose,
  language,
  soundSpeed,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = getTranslation(language);

  const allWords = useMemo(() => getAllDictionaryWords(), []);

  const filteredWords = useMemo(() => {
    return allWords.filter((item) => {
      const matchesSearch =
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.translationAr.includes(searchTerm) ||
        item.translationEn.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [allWords, searchTerm, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/20 rounded-2xl text-2xl">📚</span>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-display">
                {t.tabs.dictionary} (Petite Alouette)
              </h2>
              <p className="text-amber-100 text-xs mt-0.5">
                {allWords.length} mots illustrés issus des 12 unités officielles
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

        {/* Filter & Search Bar */}
        <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t.actions.searchDict}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto text-xs font-bold">
            {['all', 'nom', 'verbe', 'adjectif'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-amber-100 border border-slate-200'
                }`}
              >
                {cat === 'all'
                  ? t.actions.showAll
                  : cat === 'nom'
                  ? 'Noms'
                  : cat === 'verbe'
                  ? 'Verbes'
                  : 'Adjectifs'}
              </button>
            ))}
          </div>
        </div>

        {/* Words Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          {filteredWords.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              Aucun mot ne correspond à votre recherche.
            </div>
          ) : (
            filteredWords.map((item) => (
              <div
                key={`${item.unitId}_${item.id}`}
                className="p-4 bg-white hover:bg-amber-50/50 border-2 border-slate-200 hover:border-amber-300 rounded-2xl flex flex-col justify-between transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 bg-amber-100/70 rounded-xl">{item.icon}</span>
                    <div>
                      <div className="font-extrabold text-slate-800 text-base">{item.word}</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        {item.category} • Unité {item.unitId}
                      </span>
                    </div>
                  </div>
                  <AudioButton text={item.word} speed={soundSpeed} size="sm" variant="ghost" />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <div className="text-xs font-semibold text-emerald-800" dir="rtl">
                    {item.translationAr}
                  </div>
                  <div className="text-xs text-slate-500 italic">
                    {item.translationEn}
                  </div>
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg mt-2">
                    « {item.example} »
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>{filteredWords.length} mots affichés</span>
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
