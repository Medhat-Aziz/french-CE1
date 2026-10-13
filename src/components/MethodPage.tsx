import React from 'react';
import { BookOpen, Award, CheckCircle2, Volume2, Sparkles, Compass, Users, HeartHandshake } from 'lucide-react';
import { Language } from '../types/curriculum';
import { getTranslation } from '../translations/i18n';

interface MethodPageProps {
  language: Language;
  onGoToUnits: () => void;
}

export const MethodPage: React.FC<MethodPageProps> = ({ language, onGoToUnits }) => {
  const t = getTranslation(language);

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Header section */}
      <section className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          <span>🕊️</span>
          <span>Programmes 2016 — Cycle 2</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display leading-tight">
          La Démarche Pédagogique de Petite Alouette CP
        </h1>
        <p className="text-amber-100 text-sm sm:text-base leading-relaxed max-w-3xl">
          Conçu par une équipe d’inspecteurs principaux de l’enseignement primaire et de professeurs émérites (Abdelhak Bel Lakhdar, Mohamed Azzouzi, Fouad Chaib, Abderzak Elkahlaoui, Mostafa Rassy, Abdelaziz Ziouane), <strong>Petite Alouette</strong> propose un outil souple, progressif et adapté aux rythmes scolaires d’apprentissage du CP.
        </p>
      </section>

      {/* 6 Structural Pillars from the Textbook Avant-propos (p. 4) */}
      <section className="space-y-6">
        <div className="border-b-2 border-amber-200 pb-3">
          <h2 className="text-2xl font-black text-slate-800 font-display">
            Les 6 Activités Clés Structurant le Manuel (p. 4)
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Transcription fidèle des orientations pédagogiques officielles des auteurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-300 shadow-sm space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl text-amber-800 font-black">
              1
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              La compréhension et la production de l’oral
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              L’écoute active des histoires et des dialogues permet à l’élève de s’entraîner à la réception et à la compréhension des énoncés oraux et ce, afin qu’il en produise d’autres, pour <em>raconter, décrire ou prescrire</em>.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-300 shadow-sm space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl text-sky-800 font-black">
              2
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              La lecture et la compréhension de l’écrit
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              En lisant des lettres, des syllabes et des mots, l’élève parvient progressivement à l’automatisation du décodage. L’entraînement soutenu à la lecture des phrases puis des textes permet l’accès au sens et favorise l’autonomie.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-300 shadow-sm space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl text-emerald-800 font-black">
              3
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              L’écriture & Geste graphique
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pour mieux préparer le CE1, le manuel propose diverses activités pour consolider le geste graphique, apprendre à copier correctement des énoncés courts et produire des écrits simples (fiche personnelle, carte d’invitation, notice).
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-300 shadow-sm space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl text-purple-800 font-black">
              4
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              Fonctionnement de la langue (Grammaire inductive)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Les activités de langue portent sur les constituants de la phrase, les articles, le masculin/féminin, le singulier/pluriel, et le verbe. Elles initient l’élève au raisonnement sur l’orthographe des mots et sur la graphie verbale usuelle.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-300 shadow-sm space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl text-rose-800 font-black">
              5
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              L’apprentissage du lexique & Dictionnaire visuel
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Les mots sont repris à divers endroits du manuel. Le dictionnaire illustré terminant chaque unité est une synthèse lexicale thématique qui permet à l’élève de mémoriser et réinvestir les termes en autonomie.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-300 shadow-sm space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl text-indigo-800 font-black">
              6
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              La poésie & Les projets de classe
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Des poèmes simples et des comptines de grands poètes (Robert Desnos, Federico García Lorca, Louisa Paulin) initient l’enfant au rythme poétique français. Les 4 projets coopératifs stimulent la créativité et la présentation orale.
            </p>
          </div>
        </div>
      </section>

      {/* Guide for Teachers and Parents */}
      <section className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-amber-200 rounded-2xl text-2xl">👨‍🏫</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
              Conseils d’Utilisation pour l’Enseignant et le Parent
            </h2>
            <p className="text-xs text-amber-800">
              Accompagner un élève de CP pas-à-pas avec la plateforme numérique
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-slate-900">1. Séance orale & Écoute active préalable :</h4>
            <p className="text-xs text-slate-600">
              Faire écouter le dialogue ou l’histoire sans le texte d’abord. Demander aux élèves qui parle, où ils sont et ce qu’ils font, avant d’afficher le texte écrit.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-slate-900">2. Étude du code & Fusion syllabique :</h4>
            <p className="text-xs text-slate-600">
              Faire combiner la consonne et la voyelle avec le bouton audio. Insister sur le geste articulatoire et la distinction phonème / graphème.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-slate-900">3. Lecture guidée puis autonome :</h4>
            <p className="text-xs text-slate-600">
              Identifier les mots-outils avant la lecture du passage. Poser les questions de compréhension pour valider le sens littéral et inférentiel.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-slate-900">4. Évaluation formative & Réinvestissement :</h4>
            <p className="text-xs text-slate-600">
              Effectuer les quiz interactifs. En cas d’erreur, lire l’explication pédagogique détaillée avec l’enfant pour corriger la représentation mentale.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onGoToUnits}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-md transition-all hover:scale-105 cursor-pointer"
          >
            Explorer les 12 Unités d’Apprentissage →
          </button>
        </div>
      </section>
    </div>
  );
};
