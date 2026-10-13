import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize GoogleGenAI SDK if key exists
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err);
  }
}

/**
 * Intelligent local French CP pedagogue responder
 * Ensures seamless, zero-latency experience even under network or API limits
 */
function generateCPFallbackReply(message: string, unitId?: number): { reply: string; suggestions: string[] } {
  const lower = message.toLowerCase().trim();

  // 1. Greetings
  if (lower.match(/^(bonjour|salut|coucou|hello|bonsoir)/i)) {
    return {
      reply: 'Bonjour mon petit ami ! 🕊️ Je suis Petite Alouette. Es-tu prêt à chanter et lire les sons avec moi ?',
      suggestions: [
        'Quel son apprend-on aujourd’hui ?',
        'Fais-moi une devinette !',
        'Raconte-moi une histoire.',
        'Je veux répéter un mot.',
      ],
    };
  }

  // 2. Devinette / Riddle
  if (lower.includes('devinette') || lower.includes('devine') || lower.includes('jeu')) {
    const riddles = [
      {
        r: 'Voici ma devinette : j’ai deux petites oreilles, j’adore les carottes et je sautille. Qui suis-je ? ... Le lapin ! 🐇',
        s: ['Une autre devinette !', 'Comment s’écrit lapin ?', 'Répète après moi.'],
      },
      {
        r: 'Écoute bien : je suis un oiseau joyeux, je vole dans le ciel et je chante au lever du soleil. Qui suis-je ? ... Petite Alouette ! 🕊️',
        s: ['Fais-moi lire une phrase.', 'Quel son fait le [l] ?', 'Bravo Alouette !'],
      },
      {
        r: 'À toi de deviner : j’ai quatre pattes, je dis "miaou" et j’attrape les souris. Qui suis-je ? ... Le chat ! 🐱',
        s: ['Donne-moi un mot avec le son [a].', 'Une autre devinette !', 'Raconte une histoire.'],
      },
      {
        r: 'Devinette de lecture : je suis rouge, ronde, sucrée et on me croque au goûter. Qui suis-je ? ... La pomme ! 🍎',
        s: ['Comment s’écrit pomme ?', 'Fais-moi une devinette !', 'Je veux lire.'],
      },
    ];
    const picked = riddles[Math.floor(Math.random() * riddles.length)];
    return { reply: picked.r, suggestions: picked.s };
  }

  // 3. Sound & Phonics Practice (Sons [a], [i], [l], [u], [m], etc.)
  if (
    lower.includes('son') ||
    lower.includes('lettre') ||
    lower.includes('phon') ||
    lower.includes('syllabe') ||
    lower.includes('prononc')
  ) {
    if (lower.includes('a')) {
      return {
        reply: 'Le son [a] est ouvert et joyeux ! On l’entend dans "alouette", "ami" et "ananas". Ouvre grand la bouche : aaaaa ! 🕊️',
        suggestions: ['Et le son [i] ?', 'Fais-moi répéter un mot.', 'Fais-moi une devinette !'],
      };
    }
    if (lower.includes('i')) {
      return {
        reply: 'Pour le son [i], fais un grand sourire : iiiii ! On l’entend dans "Mina", "amie" et "souris". Peux-tu répéter : mi... ni... li ? ⭐',
        suggestions: ['Répète : Mina est mon amie.', 'Et le son [o] ?', 'Une devinette !'],
      };
    }
    if (lower.includes('l')) {
      return {
        reply: 'La lettre L chante le son [l] avec la langue qui monte au palais : la, le, li, lo, lu ! Bravo, c’est magnifique ! 🌟',
        suggestions: ['Répète : La lune brille.', 'Quel est le son [m] ?', 'Fais-moi lire.'],
      };
    }
    if (lower.includes('m')) {
      return {
        reply: 'Pour le son [m], on ferme les lèvres et on chante doucement : mmm... comme dans "maman" et "Mina" ! Répète : ma, me, mi, mo, mu ! 👏',
        suggestions: ['Répète : Maman prépare le dîner.', 'Le son [p] ?', 'Fais-moi une devinette !'],
      };
    }

    return {
      reply: 'Chaque lettre a sa petite chanson ! Répète après moi : ma... la... ra... pa... Bravo pour ta belle prononciation ! 🌟',
      suggestions: ['Entraîne-moi sur le son [a].', 'Entraîne-moi sur le son [i].', 'Fais-moi une devinette !'],
    };
  }

  // 4. Repeat after me / Répétition
  if (lower.includes('répète') || lower.includes('repete') || lower.includes('après moi') || lower.includes('apres moi')) {
    return {
      reply: 'Écoute bien et répète après moi à voix haute : "Mina a un petit vélo bleu." À ton tour ! 🚲',
      suggestions: ['Mina a un petit vélo bleu.', 'Un autre mot à répéter.', 'Fais-moi lire une phrase.'],
    };
  }

  // 5. Story / Conte
  if (lower.includes('histoire') || lower.includes('raconte') || lower.includes('conte')) {
    const stories = [
      'Il était une fois une petite alouette dorée qui volait au-dessus de l’école. Elle regardait les enfants de CP lire le mot "ami". Tout le monde souriait ! 🕊️',
      'Ce matin, Rémi a préparé son cartable rouge. Il y a mis son livre Petite Alouette, trois crayons et une belle pomme rouge pour son amie Mina ! 🎒',
      'Dans le jardin de l’école, un petit chat gris marchait doucement. Il a vu une plume d’alouette et s’est assis sous un grand arbre vert. 🌳',
    ];
    return {
      reply: stories[Math.floor(Math.random() * stories.length)],
      suggestions: ['Une autre histoire !', 'Fais-moi une devinette.', 'Je veux lire un mot.'],
    };
  }

  // 6. Reading / Lecture
  if (lower.includes('lire') || lower.includes('lecture') || lower.includes('phrase') || lower.includes('mot')) {
    return {
      reply: 'Lisons ensemble cette jolie phrase : "Le chat boit du bon lait dans son bol." Prends ton temps pour chaque syllabe ! 🐱',
      suggestions: ['Répète la phrase plus lentement.', 'Un autre mot à lire.', 'Fais-moi une devinette !'],
    };
  }

  // 7. Petite Alouette & Characters (Mina, Rémi, etc.)
  if (lower.includes('alouette') || lower.includes('mina') || lower.includes('rémi') || lower.includes('remi')) {
    return {
      reply: 'Mina et Rémi sont nos meilleurs amis du CP ! Ils adorent apprendre à lire avec Petite Alouette et explorer l’école ensemble. ⭐',
      suggestions: ['Que font Mina et Rémi ?', 'Fais-moi une devinette.', 'Raconte une histoire.'],
    };
  }

  // 8. Encouragement & Praise
  if (lower.includes('merci') || lower.includes('bravo') || lower.includes('super') || lower.includes('j’aime') || lower.includes('aime')) {
    return {
      reply: 'Avec grand plaisir ! C’est formidable d’apprendre avec toi. Tu fais d’immenses progrès chaque jour ! 🌟👏',
      suggestions: ['Pose-moi une question.', 'Fais-moi une devinette !', 'Je veux répéter un son.'],
    };
  }

  // Default context-aware CP French response
  if (unitId) {
    return {
      reply: `Tu travailles sur l’Unité ${unitId} ! C’est une excellente unité. Quels mots as-tu découverts aujourd’hui ? 📖`,
      suggestions: [
        `Pose-moi une devinette sur l’Unité ${unitId}.`,
        'Fais-moi lire une phrase.',
        'Entraîne-moi sur les sons.',
      ],
    };
  }

  return {
    reply: 'Tu as très bien parlé ! Continue d’écouter et de répéter chaque son. Que souhaites-tu explorer maintenant avec Petite Alouette ? 🕊️',
    suggestions: [
      'Fais-moi une devinette !',
      'Raconte-moi une petite histoire.',
      'Entraîne-moi sur le son [a].',
      'Fais-moi lire une phrase.',
    ],
  };
}

// API endpoint for Voice Chat
app.post('/api/voice-chat', async (req, res) => {
  try {
    const { message, history = [], unitId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message requis' });
    }

    // Try Gemini API first if configured
    if (aiClient) {
      try {
        const systemPrompt = `Tu es l'Ami Vocal de Petite Alouette (Alouette), le compagnon d'apprentissage du français pour un jeune élève de CP (Cycle 2, 6-7 ans), basé sur le manuel Petite Alouette (Bordas).
Consignes strictes pour ta réponse :
1. Réponds EXCLUSIVEMENT en français clair, doux, chaleureux et encourageant.
2. Fais des phrases TRÈS COURTES (1 à 2 phrases simples au maximum).
3. Le texte sera lu à voix haute par une synthèse vocale pédagogique avec pauses marquées en fin de phrase, donc utilise une ponctuation simple et naturelle (points, points d'interrogation, points d'exclamation).
4. Utilise des émoticônes amicales adaptées aux enfants (ex: 🕊️, ⭐, 🎈, 👏, 📖).
5. Sois ludique : propose de répéter des sons ([a], [i], [l], [m], etc.), des syllabes, des devinettes ou des félicitations.
6. Ne sors JAMAIS de ton rôle de compagnon bienveillant de CP.`;

        // Format recent messages for context
        const formattedContents = [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nContexte: Élève de CP ${unitId ? `sur l'Unité ${unitId}` : ''}. Message de l'élève: "${message}"` }] },
        ];

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents as any,
          config: {
            temperature: 0.7,
            maxOutputTokens: 150,
          },
        });

        const replyText = response.text?.trim();
        if (replyText) {
          const fallback = generateCPFallbackReply(message, unitId);
          return res.json({
            reply: replyText,
            suggestions: fallback.suggestions,
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or unavailable, using pedagogical CP fallback:', geminiError?.message || geminiError);
        // Fall through to fallback below
      }
    }

    // Pedagogical CP fallback
    const result = generateCPFallbackReply(message, unitId);
    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/voice-chat:', error);
    const fallback = generateCPFallbackReply('bonjour');
    return res.json(fallback);
  }
});

// Setup Vite in development or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mon Petit Français server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
