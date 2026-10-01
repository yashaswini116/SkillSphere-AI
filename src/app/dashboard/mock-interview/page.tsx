"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { evaluateMockInterviewAI, isLiveAIConfigured } from "@/lib/gemini";
import { MockInterviewEvaluation } from "@/lib/types";
import { AiBadge } from "@/components/common/AiBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { playAudioFeedback } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Send,
  User,
  Bot,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
} from "lucide-react";

interface InterviewMessage {
  id: string;
  sender: "interviewer" | "candidate";
  text: string;
}

export default function MockInterviewPage() {
  const { user, addXp } = useAuth();
  const [interviewType, setInterviewType] = useState<"technical" | "behavioral" | "mixed">("technical");
  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      id: "msg-1",
      sender: "interviewer",
      text: `Hello ${user?.name?.split(" ")[0] || "there"}! I'm Sarah, Principal Engineering Interviewer. We are evaluating your readiness for a **${user?.targetRole || "Full Stack AI Engineer"}** role. To start: How would you design a scalable real-time RAG ingestion pipeline to minimize end-user query latency?`,
    },
  ]);
  const [candidateInput, setCandidateInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<MockInterviewEvaluation | null>(null);

  const sampleAnswerPills = [
    "I would decouple document chunking into an async worker queue using Redis, while embedding queries using lightweight SLM vector caches to maintain <200ms p99 latency.",
    "Using the STAR method: In my last project, the situation was high cold starts. My task was reducing latency by 40%. I implemented Server-Sent Events and semantic caching, achieving 350ms streaming delivery.",
  ];

  const speakQuestion = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
    playAudioFeedback("click");
  };

  const handleVoiceRecord = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("Voice speech recognition is not supported in this browser. Please type your response.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCandidateInput((prev) => (prev ? prev + " " + transcript : transcript));
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleSendResponse = () => {
    if (!candidateInput.trim()) return;

    playAudioFeedback("click");
    const userMsg: InterviewMessage = {
      id: `msg-${Date.now()}`,
      sender: "candidate",
      text: candidateInput.trim(),
    };

    const nextInterviewerPrompt =
      messages.length === 1
        ? "Excellent technical breakdown. Now for a behavioral scenario: Tell me about a time you faced a contentious architectural disagreement with a peer. How did you resolve it using data?"
        : "Thank you for sharing that experience. What metrics would you track in production to ensure your solution is performing as expected?";

    const interviewerMsg: InterviewMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: "interviewer",
      text: nextInterviewerPrompt,
    };

    setMessages((prev) => [...prev, userMsg, interviewerMsg]);
    setCandidateInput("");

    setTimeout(() => {
      speakQuestion(nextInterviewerPrompt);
    }, 400);
  };

  const handleFinalizeInterview = async () => {
    setIsEvaluating(true);
    playAudioFeedback("click");

    try {
      const res = await evaluateMockInterviewAI(
        user?.targetRole || "Full Stack AI Developer",
        messages,
        user?.geminiApiKey
      );
      setEvaluation(res.data);
      addXp(75);
      playAudioFeedback("levelUp");
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    } catch {
      alert("Failed to evaluate interview. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "msg-1",
        sender: "interviewer",
        text: `Hello ${user?.name?.split(" ")[0] || "there"}! I'm Sarah, Principal Engineering Interviewer. We are evaluating your readiness for a **${user?.targetRole || "Full Stack AI Engineer"}** role. To start: How would you design a scalable real-time RAG ingestion pipeline to minimize end-user query latency?`,
      },
    ]);
    setEvaluation(null);
    playAudioFeedback("click");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Module: Conversational Readiness
            </span>
            <AiBadge isDemo={!isLiveAIConfigured()} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            AI Mock Interviewer with Feedback
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Interactive voice & text simulations with quantitative scoring for STAR adherence, technical rigor, and confidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(["technical", "behavioral", "mixed"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setInterviewType(m);
                playAudioFeedback("click");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                interviewType === m
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interview Area */}
      {!evaluation ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interviewer Persona & Rubric (4 cols) */}
          <div className="lg:col-span-4 glass-card p-6 rounded-3xl space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-rose-500/25">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sarah Jenkins
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Principal Engineering Lead • Ex-Google
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                🟢 Session Live
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Evaluation Rubrics:
              </span>
              <div className="space-y-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                <p>• <strong>STAR Method:</strong> Situation, Task, Action, Result</p>
                <p>• <strong>Technical Accuracy:</strong> Trade-offs & scale</p>
                <p>• <strong>Clarity & Tone:</strong> Concise, quantifiable</p>
              </div>
            </div>

            {/* Quick Answer Suggestion Pills */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Click to Insert Sample Answer:
              </span>
              {sampleAnswerPills.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => setCandidateInput(pill)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300 hover:border-indigo-500 transition-colors"
                >
                  &ldquo;{pill.slice(0, 75)}...&rdquo;
                </button>
              ))}
            </div>

            <button
              onClick={handleFinalizeInterview}
              disabled={messages.length < 2 || isEvaluating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg transition-all"
            >
              {isEvaluating ? "Calculating Rubrics..." : "End Session & Get AI Report (+75 XP)"}
            </button>
          </div>

          {/* Right Column: Conversational Dialogue (8 cols) */}
          <div className="lg:col-span-8 glass-card p-6 rounded-3xl flex flex-col h-[580px]">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {messages.map((m) => {
                const isInterviewer = m.sender === "interviewer";
                return (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${isInterviewer ? "justify-start" : "justify-end"}`}
                  >
                    {isInterviewer && (
                      <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                        isInterviewer
                          ? "bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10"
                          : "bg-gradient-to-r from-rose-600 to-indigo-600 text-white"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>

                      {isInterviewer && (
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => speakQuestion(m.text)}
                            title="Speak question aloud"
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {!isInterviewer && (
                      <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Input & Voice Controls */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <textarea
                  rows={2}
                  value={candidateInput}
                  onChange={(e) => setCandidateInput(e.target.value)}
                  placeholder="Speak via microphone or type your technical/STAR answer..."
                  className="flex-1 p-3 rounded-2xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />

                <button
                  type="button"
                  onClick={handleVoiceRecord}
                  title="Speech-to-Text Voice Recording"
                  className={`p-3 rounded-2xl border transition-all ${
                    isRecording
                      ? "bg-rose-600 text-white animate-pulse border-rose-500"
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10"
                  }`}
                >
                  {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleSendResponse}
                  disabled={!candidateInput.trim()}
                  className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white transition-all shadow-md shadow-rose-600/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Evaluation Report Card Screen */
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 animate-in zoom-in-95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Official Interview Report Card
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Overall Candidate Rating: {evaluation.overallRating}/100
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                {evaluation.summary}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-xs font-semibold text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Interview</span>
            </button>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">STAR Adherence</span>
              <span className="text-2xl font-bold text-rose-500">{evaluation.starAdherenceScore}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Technical Accuracy</span>
              <span className="text-2xl font-bold text-indigo-500">{evaluation.technicalAccuracyScore}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Communication</span>
              <span className="text-2xl font-bold text-cyan-500">{evaluation.communicationScore}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Confidence</span>
              <span className="text-2xl font-bold text-emerald-500">{evaluation.confidenceScore}%</span>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Observed Key Strengths</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {evaluation.strengths.map((s, i) => (
                  <li key={i}>✓ {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Actionable Recommendations</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {evaluation.actionableTips.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
