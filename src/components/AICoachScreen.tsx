import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, RotateCcw, Send, Trash2 } from 'lucide-react';
import type {
  AppSettings,
  ChatMessage,
  Habit,
  ScoreSummary,
} from '../types';

interface AICoachScreenProps {
  habits: Habit[];
  completedTodayIds: Set<string>;
  scoreSummary: ScoreSummary;
  settings: AppSettings;
  messages: ChatMessage[];
  onAppendMessage: (msg: ChatMessage) => void;
  onClearChat: () => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const UZ_CHAT_COPY = {
  headerTitle: 'NO EXCUSES AI',
  clearChat: 'Tozalash',
  welcomeMessage:
    "Odatlaring va bugungi natijang ko'z oldimda turibdi. Bahona qidirishni bas qil — hozir nimani bajarding yoki nimada qiynalyapsan, ochiq yoz.",
  thinking: 'Natijalaring tahlil qilinmoqda...',
  inputPlaceholder: 'Xabar yozing...',
  send: 'Yuborish',
  micStart: 'Ovozli kiritishni yoqish',
  micStop: 'Ovozli kiritishni to‘xtatish',
  micUnsupported: 'Bu brauzerda ovozli kiritish qo‘llab-quvvatlanmaydi.',
  errorTitle: 'Aloqa uzildi',
  retry: 'Qayta urinish',
  suggestedTitle: 'Tezkor savollar',
  suggestedQuestions: [
    'Bugungi intizomimni ochiq va qattiq tahlil qilib ber.',
    'Hozir dangasalik tutyapti, meni hushyor torttir.',
    'Keyingi 2 soat uchun aniq harakat rejasini tuz.',
    'Seriyamni saqlab qolish uchun hozir nima qilay?',
  ],
} as const;

export function AICoachScreen({
  habits,
  completedTodayIds,
  scoreSummary,
  settings,
  messages,
  onAppendMessage,
  onClearChat,
}: AICoachScreenProps) {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  const listEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isThinking]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const normalizedMessages = messages.map((m) =>
    m.id === 'coach-welcome' ? { ...m, text: UZ_CHAT_COPY.welcomeMessage } : m,
  );

  const sendMessage = async (rawText: string, skipAppendUser = false) => {
    const trimmed = rawText.trim();
    if (!trimmed || isThinking) return;

    setErrorMsg(null);
    setLastFailedPrompt(null);
    setMicNotice(null);

    let updatedHistory = normalizedMessages;
    if (!skipAppendUser) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmed,
        timestamp: new Date().toISOString(),
      };
      onAppendMessage(userMsg);
      updatedHistory = [...normalizedMessages, userMsg];
      setInput('');
    }

    setIsThinking(true);
    try {
      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'uz',
          strictness: settings.strictness,
          coachState: scoreSummary.coachState,
          profileName: settings.profile.name,
          habits: habits.map((h) => ({
            title: h.title,
            description: h.description,
            reminderTime: h.reminderTime,
            completed: completedTodayIds.has(h.id),
          })),
          scoreSummary,
          messages: updatedHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        throw new Error(data.error || UZ_CHAT_COPY.errorTitle);
      }

      onAppendMessage({
        id: `coach-${Date.now()}`,
        role: 'coach',
        text: data.reply,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : UZ_CHAT_COPY.errorTitle);
      setLastFailedPrompt(trimmed);
    } finally {
      setIsThinking(false);
    }
  };

  const handleToggleMic = () => {
    setMicNotice(null);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      setMicNotice(UZ_CHAT_COPY.micUnsupported);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'uz-UZ';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
    } catch {
      setIsListening(false);
      setMicNotice(UZ_CHAT_COPY.micUnsupported);
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-7.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] border border-[#222C24] bg-[#080B09] lg:h-[calc(100dvh-4rem)]">
      {/* Minimal Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-[#1E2720] bg-[#111713] px-5 py-4">
        <h1 className="text-lg font-extrabold tracking-tight text-[#F4F7F2] sm:text-xl">
          {UZ_CHAT_COPY.headerTitle}
        </h1>

        <button
          type="button"
          onClick={onClearChat}
          aria-label={UZ_CHAT_COPY.clearChat}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl px-3.5 text-xs font-bold text-[#89948A] transition-colors hover:bg-[#182019] hover:text-[#F4F7F2] cursor-pointer"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span>{UZ_CHAT_COPY.clearChat}</span>
        </button>
      </header>

      {/* Simple Chat History Area */}
      <div
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
        data-testid="coach-messages"
      >
        {normalizedMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[86%] rounded-[20px] px-4 py-3.5 text-sm leading-relaxed whitespace-pre-wrap sm:text-[15px] ${
                  isUser
                    ? 'rounded-tr-md border border-[#B5FF38]/35 bg-[#B5FF38]/12 text-[#F4F7F2]'
                    : 'rounded-tl-md border border-[#222C24] bg-[#111713] text-[#F4F7F2]'
                }`}
              >
                {msg.text}
              </div>
              <span className="font-mono-tabular mt-1 px-1 text-[11px] text-[#89948A]">
                {formatTime(msg.timestamp)}
              </span>
            </motion.div>
          );
        })}

        {isThinking && (
          <div
            role="status"
            aria-live="polite"
            className="inline-flex max-w-[86%] items-center gap-3 rounded-[20px] rounded-tl-md border border-[#222C24] bg-[#111713] px-4 py-3.5 text-sm text-[#89948A]"
          >
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="h-2 w-2 rounded-full bg-[#B5FF38]"
              />
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="h-2 w-2 rounded-full bg-[#B5FF38]"
              />
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="h-2 w-2 rounded-full bg-[#B5FF38]"
              />
            </div>
            <span>{UZ_CHAT_COPY.thinking}</span>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-[20px] border border-[#FF414B]/45 bg-[#1A1113] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="text-sm">
              <p className="font-bold text-[#FF414B]">{UZ_CHAT_COPY.errorTitle}</p>
              <p className="mt-0.5 text-xs text-[#F4F7F2]">{errorMsg}</p>
            </div>
            {lastFailedPrompt && (
              <button
                type="button"
                onClick={() => sendMessage(lastFailedPrompt, true)}
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-[#FF414B] px-4 text-xs font-bold text-white cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{UZ_CHAT_COPY.retry}</span>
              </button>
            )}
          </div>
        )}

        <div ref={listEndRef} />
      </div>

      {/* Uzbek Suggested Questions */}
      <div className="shrink-0 border-t border-[#1E2720] bg-[#0B0F0C] px-4 pt-3 pb-2 sm:px-5">
        <p className="mb-2 text-[11px] font-bold tracking-wider text-[#89948A] uppercase">
          {UZ_CHAT_COPY.suggestedTitle}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1.5 sm:flex-wrap sm:overflow-visible">
          {UZ_CHAT_COPY.suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              disabled={isThinking}
              onClick={() => sendMessage(q)}
              className="min-h-[44px] shrink-0 rounded-2xl border border-[#222C24] bg-[#111713] px-3.5 py-2 text-xs font-semibold text-[#F4F7F2] transition-colors hover:border-[#B5FF38]/55 hover:text-[#B5FF38] disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Message Input + Mic + Send */}
      <div className="shrink-0 border-t border-[#222C24] bg-[#111713] p-3 sm:p-4">
        {micNotice && (
          <p role="status" className="mb-2 px-1 text-xs font-medium text-[#89948A]">
            {micNotice}
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2.5"
        >
          <label htmlFor="coach-message-input" className="sr-only">
            {UZ_CHAT_COPY.inputPlaceholder}
          </label>
          <input
            id="coach-message-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={UZ_CHAT_COPY.inputPlaceholder}
            disabled={isThinking}
            className="h-[52px] min-w-0 flex-1 rounded-[18px] border border-[#253027] bg-[#080B09] px-4 text-sm text-[#F4F7F2] placeholder-[#6B786D] focus:border-[#B5FF38] focus:outline-none"
          />

          <button
            type="button"
            onClick={handleToggleMic}
            disabled={isThinking}
            aria-label={isListening ? UZ_CHAT_COPY.micStop : UZ_CHAT_COPY.micStart}
            aria-pressed={isListening}
            className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] border transition-colors cursor-pointer ${
              isListening
                ? 'border-[#B5FF38] bg-[#B5FF38]/15 text-[#B5FF38]'
                : 'border-[#253027] bg-[#080B09] text-[#89948A] hover:border-[#B5FF38]/50 hover:text-[#F4F7F2]'
            }`}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Mic className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            aria-label={UZ_CHAT_COPY.send}
            className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-[18px] bg-[#B5FF38] px-5 text-sm font-extrabold text-[#080B09] transition-colors hover:bg-[#c5ff61] disabled:opacity-40 cursor-pointer whitespace-nowrap"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{UZ_CHAT_COPY.send}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
