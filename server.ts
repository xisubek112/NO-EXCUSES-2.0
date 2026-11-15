import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface CoachContextBody {
  language?: 'en' | 'uz';
  strictness?: 'balanced' | 'relentless';
  coachState?: 'PROUD' | 'WATCHING' | 'DISAPPOINTED' | 'STRICT';
  profileName?: string;
  habits?: Array<{
    title: string;
    description: string;
    reminderTime: string;
    completed: boolean;
  }>;
  scoreSummary?: {
    dailyScore: number;
    completionPercentage: number;
    completedCount: number;
    totalCount: number;
    currentStreak: number;
    bestStreak: number;
  };
  messages?: Array<{
    role: 'user' | 'coach';
    text: string;
  }>;
}

function buildCoachSystemInstruction(
  body: CoachContextBody,
  forceUzbek = false,
): string {
  const lang = forceUzbek ? 'uz' : body.language === 'uz' ? 'uz' : 'en';
  const strictness = body.strictness === 'relentless' ? 'relentless' : 'balanced';
  const state = body.coachState || 'WATCHING';
  const name = body.profileName?.trim() || (lang === 'uz' ? 'Jangchi' : 'Warrior');
  const summary = body.scoreSummary;
  const habitsList = (body.habits || [])
    .map(
      (h, idx) =>
        `${idx + 1}. "${h.title}" (eslatma: ${h.reminderTime}) — ${h.completed ? 'BAJARILGAN' : 'BAJARILMAGAN'} — Qoida: ${h.description}`,
    )
    .join('\n');

  if (forceUzbek) {
    return [
      "Siz NO EXCUSES AI — foydalanuvchining qat'iyatli, aqlli, biroz kinoyali (sarkastik), rostgo'y va kuchli motivatsiya beruvchi intizom murabbiyisiz.",
      "TIL QOIDASI (ENG MUHIM): Siz FAQAT va FAQAT o'zbek tilida (lotin yozuvida) javob berishingiz shart. Hech qachon inglizcha yoki ruscha gap, so'z yoki ibora ishlatmang. Foydalanuvchi inglizcha, ruscha yoki boshqa tilda yozsa ham, har doim FAQAT o'zbek tilida javob qaytaring.",
      "SHAXSIYAT VA USLUB: Qat'iyatli, aqlli, achchiq haqiqatni yuziga aytadigan, o'rinli kinoya qiladigan, ammo aniq amaliy yechim va motivatsiya beradigan murabbiy bo'ling. Quruq maqtov yoki bo'sh gap yozmang.",
      "HAQQONIYLIK QOIDASI: Faqat quyida berilgan haqiqiy odatlar va kunlik natijalarni tahlil qiling. Hech qachon mavjud bo'lmagan odat, ball yoki statistika to'qib chiqarmang. Agar odatlar ro'yxati bo'sh bo'lsa, foydalanuvchi hali birorta ham odat qo'shmaganini ochiq ayting.",
      `Foydalanuvchi ismi: ${name}`,
      summary
        ? `Bugungi haqiqiy natija: Kunlik ball ${summary.dailyScore}/100, Bajarilish ${summary.completionPercentage}% (${summary.completedCount}/${summary.totalCount}), Joriy seriya ${summary.currentStreak} kun, Eng yaxshi seriya ${summary.bestStreak} kun.`
        : 'Bugungi natija: Hali maʼlumot kiritilmagan.',
      habitsList ? `Faol odatlar ro'yxati:\n${habitsList}` : 'Faol odatlar: Hozircha birorta odat belgilanmagan.',
    ].join('\n\n');
  }

  return [
    'You are the NO EXCUSES AI Discipline Coach—a calm, razor-sharp, futuristic mentor.',
    'Philosophy: Discipline over motivation. Maximum 3 habits. No excuses, no fluff, no emojis, no generic cheerleading.',
    lang === 'uz'
      ? 'CRITICAL: Respond ONLY in natural, sharp, grammatically clean Uzbek (Latin script). Never mix English sentences into Uzbek responses.'
      : 'CRITICAL: Respond ONLY in crisp, direct, commanding English. Never mix other languages.',
    `User Name: ${name}`,
    `Current Coach Mood State: ${state} | Accountability Mode: ${strictness}`,
    summary
      ? `Today's Telemetry: Score ${summary.dailyScore}/100, Completion ${summary.completionPercentage}% (${summary.completedCount}/${summary.totalCount}), Current Streak ${summary.currentStreak} days, Best Streak ${summary.bestStreak} days.`
      : 'Today Telemetry: Not yet initialized.',
    habitsList ? `Active Habits:\n${habitsList}` : 'Active Habits: None locked in yet.',
    'Response style: Concise, tactical, deeply observant of the exact habits and score above. Give concrete next actions.',
  ].join('\n\n');
}

app.post('/api/coach/chat', async (req: Request, res: Response) => {
  const body = (req.body || {}) as CoachContextBody;
  const ai = getGeminiClient();

  if (!ai) {
    res.status(503).json({
      error:
        'Gemini API kaliti sozlanmagan. Iltimos, Secrets bo‘limida GEMINI_API_KEY ni tekshiring.',
      code: 'API_KEY_MISSING',
    });
    return;
  }

  try {
    const history = (body.messages || []).slice(-12);
    const transcript = history
      .map((m) => `${m.role === 'user' ? 'FOYDALANUVCHI' : 'MURABBIY'}: ${m.text}`)
      .join('\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents:
        transcript ||
        "Bugungi intizomim va odatlarimni qisqacha, haqqoniy va faqat o'zbek tilida tahlil qilib ber.",
      config: {
        systemInstruction: buildCoachSystemInstruction(body, true),
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const reply = (response.text || '').trim();
    if (!reply) {
      res.status(502).json({
        error: 'NO EXCUSES AI bo‘sh javob qaytardi. Qayta urinib ko‘ring.',
        code: 'EMPTY_RESPONSE',
      });
      return;
    }

    res.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gemini API xatoligi yuz berdi.';
    res.status(500).json({
      error: message,
      code: 'GEMINI_REQUEST_FAILED',
    });
  }
});

app.post('/api/coach/daily-brief', async (req: Request, res: Response) => {
  const body = (req.body || {}) as CoachContextBody;
  const ai = getGeminiClient();

  if (!ai) {
    res.status(503).json({
      error: 'Gemini API key not configured',
      code: 'API_KEY_MISSING',
    });
    return;
  }

  try {
    const lang = body.language === 'uz' ? 'uz' : 'en';
    const prompt =
      lang === 'uz'
        ? "Foydalanuvchining bugungi odatlari va balli asosida 1-2 gapdan iborat qisqa, kuchli kundalik intizom xabarini yozing. Faqat o'zbek tilida yozing."
        : 'Write a 1 to 2 sentence personalized daily discipline briefing based on the user active habits, completion count, and streak. Direct, no emojis.';

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction: buildCoachSystemInstruction(body),
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const brief = (response.text || '').trim();
    res.json({ brief });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate daily brief';
    res.status(500).json({ error: message, code: 'GEMINI_REQUEST_FAILED' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NO EXCUSES server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
