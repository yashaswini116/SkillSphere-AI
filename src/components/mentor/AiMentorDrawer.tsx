"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { queryMentorChat, isLiveAIConfigured } from "@/lib/gemini";
import { AiBadge } from "@/components/common/AiBadge";
import { playAudioFeedback } from "@/lib/utils";
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
} from "lucide-react";

interface AiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiMentorDrawer: React.FC<AiMentorDrawerProps> = ({ isOpen, onClose }) => {
  const { user, addXp } = useAuth();
  const [messages, setMessages] = useState<
    { role: "assistant" | "user"; content: string; timestamp: string; isDemo?: boolean }[]
  >([
    {
      role: "assistant",
      content: `Hello ${user?.name?.split(" ")[0] || "there"}! I'm your 24/7 **SkillSphere AI Career Mentor**. I have full context on your target trajectory (**${user?.targetRole || "AI Engineer"}**) and active roadmaps. How can I accelerate your learning today?`,
      timestamp: "Just now",
      isDemo: !isLiveAIConfigured(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "⚡ What should I focus on today?",
    "🎯 Review my critical skill gaps",
    "📄 How to boost my ATS score past 90?",
    "🎙️ Ask me a technical interview question",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
    playAudioFeedback("click");
  };

  const handleSpeechInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

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
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    playAudioFeedback("click");
    setInput("");

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user" as const, content: query, timestamp: now };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const res = await queryMentorChat(
        query,
        {
          role: user?.targetRole || "Full Stack AI Developer",
          currentSkills: user?.currentSkills || [],
          level: user?.level || 1,
          streakDays: user?.streakDays || 1,
        },
        history,
        user?.geminiApiKey
      );

      const aiMsg = {
        role: "assistant" as const,
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isDemo: res.isDemo,
      };

      setMessages((prev) => [...prev, aiMsg]);
      addXp(15);
      playAudioFeedback("success");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm experiencing a brief network sync delay. Please try asking again in a moment.",
          timestamp: "Now",
          isDemo: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 shadow-2xl ${
        isExpanded
          ? "inset-4 sm:inset-10 md:inset-16 max-w-5xl mx-auto rounded-3xl"
          : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[640px] max-h-[88vh] rounded-2xl"
      } border border-[#E7E1D3] dark:border-white/15 bg-white/98 dark:bg-[#0E2018]/98 backdrop-blur-2xl flex flex-col overflow-hidden`}
    >
      {/* Mentor Header */}
      <div className="px-4 py-3.5 border-b border-[#E7E1D3] dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-[#D8F3DC]/70 via-[#F5F1E6]/40 to-[#D8F3DC]/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B4332] to-[#52B788] flex items-center justify-center text-white shadow-md shadow-[#1B4332]/25">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#13291E] dark:text-white">
                SkillSphere AI Mentor
              </h3>
              <AiBadge isDemo={!isLiveAIConfigured()} />
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
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#526E60] dark:text-[#94A3B8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-[#FBF9F4] dark:bg-black/20 border-b border-[#E7E1D3] dark:border-white/5 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-[#1B4332] dark:text-[#95D5B2] hover:border-[#52B788] hover:bg-[#D8F3DC]/40 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FBF9F4]/40 dark:bg-transparent">
        {messages.map((msg, index) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={index}
              className={`flex gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
            >
              {isAssistant && (
                <div className="w-7 h-7 rounded-lg bg-[#1B4332] flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-sm">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                  isAssistant
                    ? "bg-white dark:bg-[#13291E] text-[#13291E] dark:text-[#EEF8F2] border border-[#E7E1D3] dark:border-white/10"
                    : "bg-[#1B4332] text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {isAssistant && (
                    <button
                      onClick={() => speakText(msg.content)}
                      title="Read aloud"
                      className="hover:opacity-100 p-0.5 text-[#52B788]"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
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

        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-[#1B4332] flex-shrink-0 flex items-center justify-center text-white">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white dark:bg-[#13291E] border border-[#E7E1D3] dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-[#526E60]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1B4332] dark:text-[#52B788]" />
              <span>Synthesizing mentorship strategy...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="p-3 border-t border-[#E7E1D3] dark:border-white/10 bg-white dark:bg-[#0E2018]">
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
              placeholder="Ask anything about skills, roadmaps, interviews..."
              className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-[#FBF9F4] dark:bg-black/30 text-xs border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40 focus:border-[#1B4332] text-[#13291E] dark:text-white"
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
