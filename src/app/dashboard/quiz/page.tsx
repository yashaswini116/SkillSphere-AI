"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { generateQuizAI, isLiveAIConfigured } from "@/lib/gemini";
import { QuizQuestion, QuizSession } from "@/lib/types";
import { sampleQuizQuestions } from "@/lib/mockData";
import { AiBadge } from "@/components/common/AiBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { playAudioFeedback } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  Timer,
  RefreshCw,
  ArrowRight,
  Flame,
  Zap,
} from "lucide-react";

export default function QuizPage() {
  const { user, addXp } = useAuth();
  const [topic, setTopic] = useState("Full Stack AI & React");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [loading, setLoading] = useState(false);
  const [quizSession, setQuizSession] = useState<QuizSession | null>({
    topic: "Full Stack AI & React",
    difficulty: "intermediate",
    questions: sampleQuizQuestions["Full Stack AI & React"],
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  const questions = quizSession?.questions || [];
  const currentQ: QuizQuestion | undefined = questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (quizCompleted || isAnswerSubmitted || !currentQ) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAnswer(null); // Timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnswerSubmitted, quizCompleted, currentQ]);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    playAudioFeedback("click");
    try {
      const res = await generateQuizAI(topic, difficulty, user?.geminiApiKey);
      setQuizSession(res.data);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setQuizCompleted(false);
      setTimeLeft(45);
      playAudioFeedback("success");
    } catch {
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = (optionIdx: number | null) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIdx);
    setIsAnswerSubmitted(true);

    const isCorrect = optionIdx === currentQ?.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playAudioFeedback("success");
    } else {
      playAudioFeedback("click");
    }
  };

  const handleNextQuestion = () => {
    playAudioFeedback("click");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(45);
    } else {
      // Completed!
      setQuizCompleted(true);
      const earnedXp = score * 25 + 50;
      addXp(earnedXp);
      playAudioFeedback("levelUp");
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Module: Gamified Assessment
            </span>
            <AiBadge isDemo={!isLiveAIConfigured()} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            AI Quiz & MCQ Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Rapid-fire technical problem sets with instant AI reasoning and XP multipliers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold text-xs shadow-md shadow-amber-500/20 transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>New AI Quiz</span>
          </button>
        </div>
      </div>

      {/* Quiz Body */}
      {!quizCompleted && currentQ ? (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          {/* Progress & Timer bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-1.5 text-amber-500 font-mono">
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s remaining</span>
            </div>
          </div>

          <ProgressBar
            value={currentIndex + 1}
            max={questions.length}
            color="amber"
            showPercent={false}
          />

          {/* Question Text */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
              Topic: {currentQ.topic} • {currentQ.difficulty.toUpperCase()}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              let btnClass = "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-indigo-500";

              if (isAnswerSubmitted) {
                if (idx === currentQ.correctIndex) {
                  btnClass = "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold";
                } else if (idx === selectedOption) {
                  btnClass = "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400";
                } else {
                  btnClass = "opacity-40 border-transparent";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSubmitAnswer(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnClass}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{option}</span>
                  {isAnswerSubmitted && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  {isAnswerSubmitted && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Explanation upon answering */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Conceptual Breakdown:</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
                >
                  <span>{currentIndex < questions.length - 1 ? "Next Question" : "Complete Quiz & Claim XP"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="glass-card p-8 rounded-3xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20 shadow-lg">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Quiz Completed! 🎉
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You scored <strong className="text-emerald-500">{score} out of {questions.length}</strong> correct.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-bold">
            <Zap className="w-4 h-4 fill-amber-500" />
            <span>+{score * 25 + 50} XP Awarded to Your Profile</span>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleGenerateQuiz}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
