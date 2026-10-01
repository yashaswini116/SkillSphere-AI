"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { sampleRoadmap } from "@/lib/mockData";
import { generateRoadmapAI, isLiveAIConfigured } from "@/lib/gemini";
import { Roadmap, RoadmapStep } from "@/lib/types";
import { AiBadge } from "@/components/common/AiBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { playAudioFeedback } from "@/lib/utils";
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  ExternalLink,
  Zap,
  RefreshCw,
  Share2,
  Calendar,
} from "lucide-react";

export default function RoadmapsPage() {
  const { user, markRoadmapStepComplete } = useAuth();
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap>(sampleRoadmap);
  const [timeframe, setTimeframe] = useState<number>(12);
  const [loading, setLoading] = useState(false);

  const completedSteps = user?.completedRoadmapSteps || [];
  const totalSteps = activeRoadmap.steps.length;
  const completedCount = activeRoadmap.steps.filter((s) =>
    completedSteps.includes(s.id)
  ).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const handleGenerateCustomRoadmap = async () => {
    setLoading(true);
    playAudioFeedback("click");
    try {
      const res = await generateRoadmapAI(
        user?.targetRole || "Full Stack AI Developer",
        timeframe,
        user?.geminiApiKey
      );
      setActiveRoadmap(res.data);
      playAudioFeedback("success");
    } catch {
      alert("Failed to regenerate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = (step: RoadmapStep) => {
    if (completedSteps.includes(step.id)) return;
    markRoadmapStepComplete(step.id, step.xpReward);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
              Module: Personalized Acceleration
            </span>
            <AiBadge isDemo={!isLiveAIConfigured()} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Personalized AI Learning Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Algorithmic milestones engineered specifically for {user?.targetRole || "your target role"}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateCustomRoadmap}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Regenerate with AI</span>
          </button>
        </div>
      </div>

      {/* Roadmap Overview Stats & Progress */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {activeRoadmap.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estimated Total Effort: ~{activeRoadmap.totalHours} hours • {timeframe} Weeks Sprint
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>
              {completedCount} of {totalSteps} Milestones Done
            </span>
            <span className="text-indigo-600 dark:text-cyan-400">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        <ProgressBar value={progressPercent} color="indigo" showPercent={false} />
      </div>

      {/* Visual Roadmap Step-by-Step Tree */}
      <div className="space-y-6 relative">
        {/* Continuous timeline vertical line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500 via-cyan-400 to-emerald-500 hidden sm:block -z-10" />

        {activeRoadmap.steps.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);

          return (
            <div
              key={step.id}
              className={`glass-card p-6 rounded-3xl border transition-all ${
                isDone
                  ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                  : "border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Node Milestone Checkbox */}
                <button
                  onClick={() => handleToggleStep(step)}
                  className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${
                    isDone
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-400 hover:border-indigo-500 hover:text-indigo-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="font-bold text-sm">{idx + 1}</span>
                  )}
                </button>

                {/* Step Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                        Phase {step.phase}: {step.phaseName}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {step.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {step.estimatedHours} hrs
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Zap className="w-3.5 h-3.5 fill-amber-500" />
                        +{step.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Resource Badges */}
                  <div className="pt-1">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Hand-Curated Resources & Docs:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.resources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{res.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {isDone ? "✅ Completed & Verified" : "⏳ Ready for execution"}
                    </span>
                    {!isDone && (
                      <button
                        onClick={() => handleToggleStep(step)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        Mark Completed (+{step.xpReward} XP)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
