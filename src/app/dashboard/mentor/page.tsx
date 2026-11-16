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
  MessageSquare,
  History,
  Trash2,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Brain,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  isError?: boolean;
  retryPayload?: { messages: MentorChatMessage[] };
}

export interface MentorSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
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
  { icon: "🎯", label: "Build a roadmap to land an AI Internship this year", cat: "Career" },
  { icon: "🧠", label: "Explain RAG & Vector Embeddings with code", cat: "AI" },
  { icon: "☕", label: "Write a high-performance LRU Cache in Java/Python", cat: "Code" },
  { icon: "🔍", label: "How to review and optimize my resume for ATS 90+", cat: "Resume" },
  { icon: "📊", label: "Top 5 System Design questions for freshers", cat: "Architecture" },
  { icon: "⚡", label: "Differences between Llama 3, GPT-4 and Groq inference", cat: "AI Tech" },
];

export default function MentorLoungePage() {
  const { user, addXp } = useAuth();

  const buildWelcome = (): ChatMessage => ({
    role: "assistant",
    content: `Hello ${user?.name?.split(" ")[0] || "there"}! Welcome to your **AI Mentor Lounge**.\n\nI retain your **target career goal (${user?.targetRole || "AI Engineer"})**, verified skills, and **full conversation memory** across this session.\n\nI can help you:\n- **Understand what to learn** next on your trajectory\n- **Solve tough DSA & system design** problems\n- **Review architecture, code bugs, and mock interviews**\n- **Strategize internship & portfolio development**\n\nWhat would you like to master today?`,
    timestamp: "Just now",
  });

  const storageKey = `skillsphere_mentor_sessions_${user?.uid || "guest"}`;

  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [showSessionDrawer, setShowSessionDrawer] = useState<boolean>(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [modelName, setModelName] = useState<string>("Ready");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load sessions on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: MentorSession[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default first session
    const initialSession: MentorSession = {
      id: `session_${Date.now()}`,
      title: "Career & Tech Mentorship",
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [buildWelcome()],
    };
    setSessions([initialSession]);
    setActiveSessionId(initialSession.id);
  }, [storageKey]);

  // Persist sessions
  useEffect(() => {
    if (typeof window === "undefined" || sessions.length === 0) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions, storageKey]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;
  const messages = activeSession ? activeSession.messages : [];

  const updateActiveSessionMessages = (
    updater: (prevMessages: ChatMessage[]) => ChatMessage[],
    newTitle?: string
  ) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        const updatedMsgs = updater(s.messages);
        return {
          ...s,
          title: newTitle || s.title,
          updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          messages: updatedMsgs,
        };
      })
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Create new chat session
  const handleCreateNewSession = () => {
    playAudioFeedback("click");
    const newSession: MentorSession = {
      id: `session_${Date.now()}`,
      title: "New Conversation",
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [buildWelcome()],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsLive(null);
  };

  // Delete session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playAudioFeedback("click");
    const remaining = sessions.filter((s) => s.id !== sessionId);
    if (remaining.length === 0) {
      const fresh: MentorSession = {
        id: `session_${Date.now()}`,
        title: "New Conversation",
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        messages: [buildWelcome()],
      };
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
    } else {
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

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

  // ── Core API call (with conversation memory) ──────────────────────────────
  const sendRequest = useCallback(
    async (
      apiMessages: MentorChatMessage[],
      displayQuery: string,
      isNewTurn: boolean
    ) => {
      setLoading(true);
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Generate a smart title if this is the first user query in this session
      const isFirstTurn = activeSession && activeSession.messages.filter((m) => m.role === "user").length === 0;
      let sessionTitle: string | undefined = undefined;
      if (isFirstTurn && displayQuery) {
        sessionTitle = displayQuery.length > 30 ? displayQuery.slice(0, 30) + "..." : displayQuery;
      }

      if (isNewTurn) {
        updateActiveSessionMessages(
          (prev) => [...prev, { role: "user", content: displayQuery, timestamp: now }],
          sessionTitle
        );
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
            groqApiKey:
              typeof window !== "undefined"
                ? localStorage.getItem("skillsphere_groq_key") || undefined
                : undefined,
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
          updateActiveSessionMessages((prev) => [
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
          updateActiveSessionMessages((prev) => [
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
        updateActiveSessionMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ Could not reach the AI Mentor service. Please check your internet connection or verify your API key in Settings.",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isError: true,
            retryPayload: { messages: apiMessages },
          },
        ]);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, addXp, activeSessionId, activeSession]
  );

  // ── Send form submit ──────────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    playAudioFeedback("click");

    // Build multi-turn memory from active session
    const historyForApi: MentorChatMessage[] = messages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        content: m.content,
      }));

    const apiMessages: MentorChatMessage[] = [
      ...historyForApi,
      { role: "user", content: q },
    ];

    await sendRequest(apiMessages, q, true);
  };

  // ── Click suggested prompt ────────────────────────────────────────────────
  const handleSelectPrompt = async (promptText: string) => {
    if (loading) return;
    const q = promptText.trim();
    playAudioFeedback("click");

    const historyForApi: MentorChatMessage[] = messages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
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
    updateActiveSessionMessages((prev) => prev.filter((m) => !m.isError));
    playAudioFeedback("click");
    await sendRequest(retryPayload.messages, "", false);
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      {/* ── Top Header Bar ───────────────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-[#0E2018]/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-[#E7E1D3] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1B4332] to-[#52B788] flex items-center justify-center text-white shadow-md shadow-[#1B4332]/25 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-extrabold text-[#13291E] dark:text-white">
                AI Mentor Lounge
              </h1>
              <AiBadge isDemo={isLive === false} modelName={modelName} />
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332] dark:bg-emerald-950 dark:text-emerald-400 flex items-center gap-1">
                <Brain className="w-3 h-3 text-[#2D6A4F] dark:text-[#52B788]" />
                <span>Memory Active ({sessions.length} Threads)</span>
              </span>
            </div>
            <p className="text-xs text-[#526E60] dark:text-[#94A3B8] mt-0.5">
              Trajectory: <span className="font-semibold text-[#2D6A4F] dark:text-[#52B788]">{user?.targetRole || "Full Stack AI Developer"}</span>
              &nbsp;·&nbsp; XP: <span className="font-semibold">{user?.xp ?? 0}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSessionDrawer(!showSessionDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F1E6] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-xs font-semibold text-[#526E60] dark:text-[#94A3B8] hover:text-[#1B4332] dark:hover:text-white transition-colors"
            title="Toggle Sessions History Drawer"
          >
            {showSessionDrawer ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Threads</span>
          </button>

          <button
            onClick={handleCreateNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* ── Main Container (Sidebar + Chat Area) ────────────────────────────── */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Sessions History Drawer */}
        {showSessionDrawer && (
          <aside className="w-64 flex-shrink-0 bg-white/70 dark:bg-[#0E2018]/70 backdrop-blur-md rounded-2xl border border-[#E7E1D3] dark:border-white/10 flex flex-col overflow-hidden shadow-sm animate-fade-in">
            <div className="p-3 border-b border-[#E7E1D3] dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-[#13291E] dark:text-white flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#52B788]" />
                <span>Conversation Threads</span>
              </span>
              <button
                onClick={handleCreateNewSession}
                className="p-1 rounded-lg hover:bg-[#E7E1D3]/50 dark:hover:bg-white/10 text-slate-500"
                title="Create Thread"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSessionId(s.id);
                    playAudioFeedback("click");
                  }}
                  className={`p-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-between group transition-all ${
                    s.id === activeSessionId
                      ? "bg-[#D8F3DC] text-[#1B4332] dark:bg-emerald-950/60 dark:text-emerald-300 font-bold shadow-xs"
                      : "text-[#526E60] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{s.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-500 p-1 rounded transition-opacity"
                    title="Delete Thread"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-2.5 border-t border-[#E7E1D3] dark:border-white/10 text-[10px] text-center text-[#526E60] dark:text-slate-500">
              Auto-persisted in local & cloud memory
            </div>
          </aside>
        )}

        {/* ── Main Chat Conversation Panel ─────────────────────────────────── */}
        <div className="flex-1 bg-white/80 dark:bg-[#0E2018]/80 backdrop-blur-sm rounded-2xl border border-[#E7E1D3] dark:border-white/10 flex flex-col overflow-hidden shadow-sm">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((m, index) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B4332] to-[#2D6A4F] flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[80%] ${isAssistant ? "items-start" : "items-end"} flex flex-col`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isAssistant
                          ? m.isError
                            ? "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                            : "bg-[#FFFDF9] dark:bg-[#142A20] text-[#13291E] dark:text-slate-100 border border-[#E7E1D3] dark:border-white/10"
                          : "bg-[#1B4332] text-white border border-[#2D6A4F]"
                      }`}
                    >
                      {m.isError ? (
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                          <span>{m.content}</span>
                        </div>
                      ) : (
                        renderMarkdown(m.content)
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-[#A0B4A8] dark:text-[#526E60]">
                      <span>{m.timestamp}</span>
                      {isAssistant && !m.isError && (
                        <>
                          <span>·</span>
                          <CopyMessageButton text={m.content} />
                          <button
                            onClick={() => speakText(m.content)}
                            title="Read aloud"
                            className="hover:opacity-100 p-0.5 text-[#52B788] dark:text-emerald-400 transition-opacity"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {m.isError && m.retryPayload && (
                        <>
                          <span>·</span>
                          <button
                            onClick={() => handleRetry(m.retryPayload!)}
                            className="text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2D6A4F] to-[#52B788] flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 justify-start items-center text-xs text-[#526E60] dark:text-[#94A3B8]">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B4332] to-[#2D6A4F] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#FFFDF9] dark:bg-[#142A20] border border-[#E7E1D3] dark:border-white/10 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2D6A4F] dark:text-[#52B788]" />
                  <span>Synthesizing response with active memory...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pill Carousel */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-[#E7E1D3] dark:border-white/10 bg-[#FFFDF9]/60 dark:bg-black/10 overflow-x-auto flex gap-2">
              {SUGGESTED_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(p.label)}
                  disabled={loading}
                  className="flex-shrink-0 text-left px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 hover:border-[#2D6A4F] text-[11px] text-[#13291E] dark:text-white transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{p.icon}</span>
                  <span className="truncate max-w-[220px]">{p.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 sm:p-4 border-t border-[#E7E1D3] dark:border-white/10 bg-white/90 dark:bg-[#0E2018]/90">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about programming, system design, roadmap next steps, or interview prep..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-xs text-[#13291E] dark:text-white placeholder-[#A0B4A8] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              />

              <button
                type="button"
                onClick={handleSpeechInput}
                disabled={loading}
                className={`p-2.5 rounded-xl border border-[#E7E1D3] dark:border-white/10 text-xs transition-colors flex-shrink-0 ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-[#FFFDF9] dark:bg-white/5 text-[#526E60] dark:text-[#94A3B8] hover:text-[#1B4332]"
                }`}
                title="Voice Input (Speech-to-Text)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-40 text-white transition-all shadow-md shadow-[#1B4332]/25 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-[#A0B4A8] dark:text-[#526E60] mt-1.5 text-center">
              Powered by Groq (openai/gpt-oss-120b) & Gemini AI · Real-time multi-turn memory active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
