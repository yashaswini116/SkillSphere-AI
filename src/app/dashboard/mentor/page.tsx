"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { queryMentorChat, isLiveAIConfigured } from "@/lib/gemini";
import { AiBadge } from "@/components/common/AiBadge";
import { playAudioFeedback } from "@/lib/utils";
import {
  Bot,
  User,
  Sparkles,
  Send,
  Volume2,
  Mic,
  RotateCcw,
  Zap,
} from "lucide-react";

export default function MentorLoungePage() {
  const { user, addXp } = useAuth();
  const [messages, setMessages] = useState<
    { role: "assistant" | "user"; text: string; timestamp: string }[]
  >([
    {
      role: "assistant",
      text: `Hello ${user?.name?.split(" ")[0] || "there"}! Welcome to your personal **AI Career & Strategy Lounge**. I'm tracking your trajectory towards **${user?.targetRole || "Full Stack AI Engineer"}**. What would you like to deep-dive into today?`,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
    playAudioFeedback("click");
  };

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    playAudioFeedback("click");
    const userMsg = {
      role: "user" as const,
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        content: m.text,
      }));

      const res = await queryMentorChat(history, {
        targetRole: user?.targetRole || "Full Stack AI Developer",
        currentSkills: user?.currentSkills || ["React", "TypeScript", "Node.js"],
        xp: user?.xp || 0,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.data,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      addXp(15);
      playAudioFeedback("xp");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I encountered a minor network latency issue. Please prompt me again.",
          timestamp: "Now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
              Module: 24/7 Strategic Mentoring
            </span>
            <AiBadge isDemo={!isLiveAIConfigured()} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            SkillSphere AI Mentor Lounge
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tailored career strategy, architectural advice, and code reviews directly aligned with your target profile.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                role: "assistant",
                text: `Session refreshed! I am ready to guide you on your journey towards **${user?.targetRole || "Full Stack AI Engineer"}**.`,
                timestamp: "Just now",
              },
            ]);
            playAudioFeedback("click");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Main Chat Panel */}
      <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-white/10 flex-1 flex flex-col overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, index) => {
            const isAssistant = m.role === "assistant";
            return (
              <div
                key={index}
                className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                {isAssistant && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isAssistant
                      ? "bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10"
                      : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                    <span>{m.timestamp}</span>
                    {isAssistant && (
                      <button
                        onClick={() => speakText(m.text)}
                        title="Read aloud"
                        className="hover:opacity-100 p-0.5 text-indigo-400"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {!isAssistant && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span>Synthesizing tailored mentorship guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about coding challenges, system design, or interview prep..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
