"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { AiBadge } from "@/components/common/AiBadge";
import { playAudioFeedback } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdownRenderer";
import type {
  MentorChatMessage,
  MentorChatResponse,
  MentorChatError,
} from "@/app/api/mentor-chat/route";
import {
  Bot,
  User,
  Sparkles,
  Send,
  Volume2,
  Mic,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  isError?: boolean;
  retryPayload?: { messages: MentorChatMessage[] };
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyMessageButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const plain = text.replace(/\*\*/g, "").replace(/`/g, "");
    navigator.clipboard.writeText(plain).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy response"}
      className="hover:opacity-100 p-0.5 text-[#52B788] dark:text-emerald-400 transition-opacity"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ─── Suggested Prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  { icon: "⚡", label: "What is Python?", cat: "General" },
  { icon: "☕", label: "Write a Java program to reverse a string", cat: "Code" },
  { icon: "🧠", label: "Difference between AI and machine learning?", cat: "AI" },
  { icon: "🎯", label: "How do I prepare for an AI internship?", cat: "Career" },
  { icon: "🔄", label: "Explain recursion with an example", cat: "CS" },
  { icon: "📊", label: "What are the best data structures for interviews?", cat: "DSA" },
  { icon: "🐛", label: "How do I debug a segfault in C?", cat: "Debug" },
  { icon: "📈", label: "Explain gradient descent step by step", cat: "ML" },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function MentorLoungePage() {
  const { user, addXp } = useAuth();

  const buildWelcome = (): ChatMessage => ({
    role: "assistant",
    content: `Hello ${user?.name?.split(" ")[0] || "there"}! Welcome to your **AI Mentor Lounge**.\n\nI can help with:\n- **Programming** — Java, Python, C/C++, JavaScript, and more\n- **Algorithms & Data Structures** — explanations + code\n- **AI & Machine Learning** — concepts, math, implementation\n- **Career & Interviews** — prep, resume, internship strategy\n- **Debugging** — trace errors and fix bugs together\n- **General questions** — anything you're curious about\n\nWhat would you like to explore today?`,
    timestamp: "Just now",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([buildWelcome()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [modelName, setModelName] = useState<string>("Ready");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Speech synthesis ──────────────────────────────────────────────────────
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
    playAudioFeedback("click");
  };

  // ── Speech recognition ────────────────────────────────────────────────────
  const handleSpeechInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionClass =
      (
        window as unknown as {
          SpeechRecognition?: any;
          webkitSpeechRecognition?: any;
        }
      ).SpeechRecognition ||
      (
        window as unknown as {
          SpeechRecognition?: any;
          webkitSpeechRecognition?: any;
        }
      ).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        inputRef.current?.focus();
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // ── Core API call (shared by send + retry) ────────────────────────────────
  const sendRequest = useCallback(
    async (
      apiMessages: MentorChatMessage[],
      displayQuery: string,
      prependUserMsg: boolean
    ) => {
      setLoading(true);

      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (prependUserMsg) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: displayQuery, timestamp: now },
        ]);
      }

      try {
        const res = await fetch("/api/mentor-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            userContext: {
              targetRole: user?.targetRole || "Full Stack AI Developer",
              currentSkills: user?.currentSkills || [],
              xp: user?.xp ?? 0,
            },
            userApiKey: user?.geminiApiKey || undefined,
            groqApiKey: typeof window !== "undefined" ? localStorage.getItem("skillsphere_groq_key") || undefined : undefined,
          }),
        });

        const data: MentorChatResponse | MentorChatError = await res.json();

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const responseTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!data.isLive) {
          const errMsg = (data as MentorChatError).error;
          setIsLive(false);
          setModelName("No API Key");
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: errMsg,
              timestamp: responseTime,
              isError: true,
              retryPayload: { messages: apiMessages },
            },
          ]);
        } else {
          const successData = data as MentorChatResponse;
          setIsLive(true);
          setModelName(successData.modelUsed || "Live AI");
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: successData.reply,
              timestamp: responseTime,
            },
          ]);
          addXp(15);
          playAudioFeedback("xp");
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ **Network error** — could not reach the AI service. Please check your connection and try again.",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isError: true,
            retryPayload: { messages: apiMessages },
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [user, addXp]
  );

  // ── Send new message ──────────────────────────────────────────────────────
  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    playAudioFeedback("click");
    setInput("");

    // Build clean history excluding error messages
    const historyForApi: MentorChatMessage[] = messages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      }));

    const apiMessages: MentorChatMessage[] = [
      ...historyForApi,
      { role: "user", content: q },
    ];

    await sendRequest(apiMessages, q, true);
  };

  // ── Retry a failed message ────────────────────────────────────────────────
  const handleRetry = async (retryPayload: { messages: MentorChatMessage[] }) => {
    if (loading) return;
    setMessages((prev) => prev.filter((m) => !m.isError));
    playAudioFeedback("click");
    await sendRequest(retryPayload.messages, "", false);
  };

  // ── Reset session ─────────────────────────────────────────────────────────
  const handleReset = () => {
    setMessages([buildWelcome()]);
    setIsLive(null);
    playAudioFeedback("click");
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-[#0E2018]/80 backdrop-blur-sm p-5 rounded-2xl border border-[#E7E1D3] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1B4332] to-[#52B788] flex items-center justify-center text-white shadow-md shadow-[#1B4332]/25 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-extrabold text-[#13291E] dark:text-white">
                AI Mentor Lounge
              </h1>
              <AiBadge
                isDemo={isLive === false}
                modelName={modelName}
              />
            </div>
            <p className="text-xs text-[#526E60] dark:text-[#94A3B8] mt-0.5">
              Target: <span className="font-semibold text-[#2D6A4F] dark:text-[#52B788]">{user?.targetRole || "Full Stack AI Developer"}</span>
              &nbsp;·&nbsp; XP: <span className="font-semibold">{user?.xp ?? 0}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F1E6] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-xs font-semibold text-[#526E60] dark:text-[#94A3B8] hover:text-[#1B4332] dark:hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </div>

      {/* ── Main Chat Panel ─────────────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-[#0E2018]/80 backdrop-blur-sm rounded-2xl border border-[#E7E1D3] dark:border-white/10 flex-1 flex flex-col overflow-hidden shadow-sm">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((m, index) => {
            const isAssistant = m.role === "assistant";
            return (
              <div
                key={index}
                className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                {isAssistant && (
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm ${
                      m.isError
                        ? "bg-amber-500"
                        : "bg-gradient-to-tr from-[#1B4332] to-[#52B788]"
                    }`}
                  >
                    {m.isError ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[84%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isAssistant
                      ? m.isError
                        ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700/30"
                        : "bg-[#F5F1E6]/60 dark:bg-[#13291E] text-[#13291E] dark:text-[#EEF8F2] border border-[#E7E1D3] dark:border-white/10"
                      : "bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white"
                  }`}
                >
                  {isAssistant ? (
                    renderMarkdown(m.content)
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}

                  <div className="mt-2 flex items-center justify-between text-[10px] opacity-70 flex-wrap gap-2">
                    <span>{m.timestamp}</span>
                    {isAssistant && (
                      <div className="flex items-center gap-2">
                        {m.isError && m.retryPayload && (
                          <button
                            onClick={() => handleRetry(m.retryPayload!)}
                            disabled={loading}
                            title="Retry"
                            className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:opacity-100 disabled:opacity-40"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span className="font-medium">Retry</span>
                          </button>
                        )}
                        {!m.isError && (
                          <>
                            <CopyMessageButton text={m.content} />
                            <button
                              onClick={() => speakText(m.content)}
                              title="Read aloud"
                              className="hover:opacity-100 p-0.5 text-[#52B788]"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {!isAssistant && (
                  <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B4332] to-[#52B788] flex items-center justify-center text-white flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#F5F1E6]/60 dark:bg-[#13291E] border border-[#E7E1D3] dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2.5 text-xs text-[#526E60] dark:text-[#94A3B8]">
                <Loader2 className="w-4 h-4 animate-spin text-[#1B4332] dark:text-[#52B788]" />
                <span>Thinking...</span>
                {/* Animated dots */}
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full bg-[#52B788] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Suggested prompts (shown when conversation is fresh) ─────────── */}
        {messages.length <= 1 && !loading && (
          <div className="px-5 pb-3 flex-shrink-0">
            <p className="text-[10px] text-[#526E60] dark:text-[#94A3B8] mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#52B788]" />
              <span>Try asking:</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSend(p.label)}
                  className="text-left px-3 py-2 rounded-xl bg-[#F5F1E6] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-[11px] text-[#13291E] dark:text-[#EEF8F2] hover:border-[#52B788] hover:bg-[#D8F3DC]/40 transition-colors"
                >
                  <span className="mr-1.5">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input Bar ───────────────────────────────────────────────────── */}
        <div className="p-4 border-t border-[#E7E1D3] dark:border-white/10 bg-[#F5F1E6]/40 dark:bg-[#091610]/60 flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleSpeechInput}
              title="Voice Input"
              className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors ${
                isListening
                  ? "text-rose-500 border-rose-300 bg-rose-50 dark:bg-rose-900/20 animate-pulse"
                  : "text-[#526E60] border-[#E7E1D3] dark:border-white/10 bg-white dark:bg-black/20 hover:text-[#1B4332] dark:hover:text-[#52B788]"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything — code, algorithms, career advice, math..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-black/30 text-sm border border-[#E7E1D3] dark:border-white/10 text-[#13291E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] disabled:opacity-60 placeholder:text-[#A0B4A8] dark:placeholder:text-[#526E60]"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-40 text-white transition-all shadow-md shadow-[#1B4332]/25 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-[#A0B4A8] dark:text-[#526E60] mt-1.5 text-center">
            Powered by Groq / Gemini AI · Responses may not always be accurate — verify critical information
          </p>
        </div>
      </div>
    </div>
  );
}
