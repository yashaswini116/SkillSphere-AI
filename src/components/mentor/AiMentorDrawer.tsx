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
  Sparkles,
  X,
  Send,
  Volume2,
  Bot,
  User,
  Loader2,
  Mic,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  isError?: boolean;
  /** The original user message that triggered this response — used for retry */
  retryPayload?: {
    messages: MentorChatMessage[];
  };
}

interface AiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyMessageButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Strip markdown markers for clipboard
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
      className="hover:opacity-100 p-0.5 text-[#52B788] transition-opacity"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const AiMentorDrawer: React.FC<AiMentorDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, addXp } = useAuth();

  const buildWelcome = (): ChatMessage => ({
    role: "assistant",
    content: `Hello ${user?.name?.split(" ")[0] || "there"}! I'm your **SkillSphere AI Mentor**. I can help with programming questions, algorithms, AI & ML, career advice, debugging, study plans, and much more.\n\nWhat would you like to explore today?`,
    timestamp: "Just now",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([buildWelcome()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLive, setIsLive] = useState<boolean | null>(null); // null = unknown until first call
  const [modelName, setModelName] = useState<string>("Ready");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "⚡ What should I focus on today?",
    "🎯 Explain recursion with an example",
    "📄 How to boost my ATS score past 90?",
    "🎙️ Ask me a technical interview question",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Speech synthesis ────────────────────────────────────────────────────────
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
    playAudioFeedback("click");
  };

  // ── Speech recognition ──────────────────────────────────────────────────────
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
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // ── Core send logic (shared by send + retry) ────────────────────────────────
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
            // Forward user-supplied key through server (never exposed in browser bundle)
            userApiKey: user?.geminiApiKey || undefined,
            groqApiKey: typeof window !== "undefined" ? localStorage.getItem("skillsphere_groq_key") || undefined : undefined,
          }),
        });

        const data: MentorChatResponse | MentorChatError = await res.json();

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        if (!data.isLive) {
          // Server returned an error object
          const errMsg = (data as MentorChatError).error;
          setIsLive(false);
          setModelName("No API Key");
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: errMsg,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
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
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
          addXp(15);
          playAudioFeedback("success");
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

  // ── Handle new message send ─────────────────────────────────────────────────
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    playAudioFeedback("click");
    setInput("");

    // Build the full conversation history for the API
    // Only include non-error assistant messages to keep history clean
    const historyForApi: MentorChatMessage[] = messages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      }));

    // Append the new user message
    const apiMessages: MentorChatMessage[] = [
      ...historyForApi,
      { role: "user", content: query },
    ];

    await sendRequest(apiMessages, query, true);
  };

  // ── Retry a failed request ──────────────────────────────────────────────────
  const handleRetry = async (retryPayload: { messages: MentorChatMessage[] }) => {
    if (loading) return;
    // Remove the error message before retrying
    setMessages((prev) => prev.filter((m) => !m.isError));
    playAudioFeedback("click");
    await sendRequest(retryPayload.messages, "", false);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 shadow-2xl ${
        isExpanded
          ? "inset-4 sm:inset-10 md:inset-16 max-w-5xl mx-auto rounded-3xl"
          : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] h-[660px] max-h-[90vh] rounded-2xl"
      } border border-[#E7E1D3] dark:border-white/15 bg-white/98 dark:bg-[#0E2018]/98 backdrop-blur-2xl flex flex-col overflow-hidden`}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 py-3.5 border-b border-[#E7E1D3] dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-[#D8F3DC]/70 via-[#F5F1E6]/40 to-[#D8F3DC]/40 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B4332] to-[#52B788] flex items-center justify-center text-white shadow-md shadow-[#1B4332]/25">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#13291E] dark:text-white">
                SkillSphere AI Mentor
              </h3>
              <AiBadge
                isDemo={isLive === false}
                modelName={modelName}
              />
            </div>
            <p className="text-[10px] text-[#526E60] dark:text-[#94A3B8]">
              Context: {user?.targetRole || "Full Stack AI"} • 24/7 Autonomous
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#526E60]">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse view" : "Expand view"}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#526E60] dark:text-[#94A3B8]"
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#526E60] dark:text-[#94A3B8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Quick Prompts ───────────────────────────────────────────────────── */}
      <div className="px-3 py-2 bg-[#FBF9F4] dark:bg-black/20 border-b border-[#E7E1D3] dark:border-white/5 overflow-x-auto flex items-center gap-1.5 no-scrollbar flex-shrink-0">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => !loading && handleSend(prompt)}
            disabled={loading}
            className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-[#1B4332] dark:text-[#95D5B2] hover:border-[#52B788] hover:bg-[#D8F3DC]/40 disabled:opacity-50 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* ── Messages ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FBF9F4]/40 dark:bg-transparent">
        {messages.map((msg, index) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={index}
              className={`flex gap-2.5 ${
                isAssistant ? "justify-start" : "justify-end"
              }`}
            >
              {isAssistant && (
                <div
                  className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-sm ${
                    msg.isError
                      ? "bg-amber-600"
                      : "bg-[#1B4332]"
                  }`}
                >
                  {msg.isError ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                  isAssistant
                    ? msg.isError
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700/30"
                      : "bg-white dark:bg-[#13291E] text-[#13291E] dark:text-[#EEF8F2] border border-[#E7E1D3] dark:border-white/10"
                    : "bg-[#1B4332] text-white"
                }`}
              >
                {/* Render markdown for assistant, plain text for user */}
                {isAssistant ? (
                  renderMarkdown(msg.content)
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}

                {/* Timestamp + action buttons */}
                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] opacity-70 flex-wrap">
                  <span>{msg.timestamp}</span>
                  {isAssistant && (
                    <div className="flex items-center gap-1.5">
                      {msg.isError && msg.retryPayload && (
                        <button
                          onClick={() => handleRetry(msg.retryPayload!)}
                          disabled={loading}
                          title="Retry"
                          className="flex items-center gap-1 hover:opacity-100 text-amber-600 dark:text-amber-400 disabled:opacity-40"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span className="text-[10px] font-medium">Retry</span>
                        </button>
                      )}
                      {!msg.isError && (
                        <>
                          <CopyMessageButton text={msg.content} />
                          <button
                            onClick={() => speakText(msg.content)}
                            title="Read aloud"
                            className="hover:opacity-100 p-0.5 text-[#52B788]"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-7 h-7 rounded-lg bg-[#2D6A4F] flex-shrink-0 flex items-center justify-center text-white mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-[#1B4332] flex-shrink-0 flex items-center justify-center text-white">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white dark:bg-[#13291E] border border-[#E7E1D3] dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-[#526E60]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1B4332] dark:text-[#52B788]" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Composer ──────────────────────────────────────────────────── */}
      <div className="p-3 border-t border-[#E7E1D3] dark:border-white/10 bg-white dark:bg-[#0E2018] flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything — code, algorithms, career, AI..."
              disabled={loading}
              className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSpeechInput}
              title="Voice Input"
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#6C8677] hover:text-[#1B4332] transition-colors ${
                isListening ? "text-rose-500 animate-pulse" : ""
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-40 text-white transition-all shadow-md shadow-[#1B4332]/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
