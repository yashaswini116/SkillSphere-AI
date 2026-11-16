"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { sampleRoadmap } from "@/lib/mockData";
import { generateRoadmapAI, isLiveAIConfigured } from "@/lib/gemini";
import { Roadmap, RoadmapStep } from "@/lib/types";
import { AiBadge } from "@/components/common/AiBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { playAudioFeedback } from "@/lib/utils";
import confetti from "canvas-confetti";
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
  Hammer,
  HelpCircle,
  Briefcase,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

const CAREER_PRESETS = [
  "Full Stack AI Developer",
  "AI & MLOps Engineer",
  "Cloud & DevOps SRE",
  "Data Platform Architect",
  "Cybersecurity Specialist",
];

export default function RoadmapsPage() {
  const { user, markRoadmapStepComplete, updateProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.targetRole || "Full Stack AI Developer");
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
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
      updateProfile({ targetRole: selectedRole });
      const res = await generateRoadmapAI(
        selectedRole,
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
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });
    playAudioFeedback("levelUp");
    markRoadmapStepComplete(step.id, step.xpReward);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#E7E1D3] dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D8F3DC] text-[#1B4332] dark:bg-emerald-950 dark:text-emerald-400 border border-[#B7E4C7] dark:border-white/10 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#52B788]" />
              Personalized Learning Path • Differentiator Engine
            </span>
            <AiBadge isDemo={!isLiveAIConfigured()} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#13291E] dark:text-white mt-1">
            Adaptive Career &amp; Project Sprints
          </h1>
          <p className="text-xs sm:text-sm text-[#526E60] dark:text-[#94A3B8]">
            What to learn, where to learn it, what to build, and how to prepare for interviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateCustomRoadmap}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-xs shadow-md shadow-[#1B4332]/20 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Regenerate Trajectory</span>
          </button>
        </div>
      </div>

      {/* Career Goal & Pace Configurator */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#13291E] dark:text-white uppercase tracking-wider block">
              1. Target Career Goal
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {CAREER_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSelectedRole(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedRole === preset
                      ? "bg-[#1B4332] text-white shadow-xs"
                      : "bg-[#FFFDF9] dark:bg-white/5 text-[#526E60] dark:text-slate-400 border border-[#E7E1D3] dark:border-white/10"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 sm:text-right">
            <label className="text-xs font-bold text-[#13291E] dark:text-white uppercase tracking-wider block">
              2. Available Weekly Study Time
            </label>
            <div className="flex items-center gap-1.5 justify-start sm:justify-end">
              {[5, 10, 20].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => setWeeklyHours(hrs)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    weeklyHours === hrs
                      ? "bg-[#1B4332] text-white shadow-xs"
                      : "bg-[#FFFDF9] dark:bg-white/5 text-[#526E60] dark:text-slate-400 border border-[#E7E1D3] dark:border-white/10"
                  }`}
                >
                  {hrs} hrs/wk
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Overview Stats & Progress */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#13291E] dark:text-white">
              {activeRoadmap.title}
            </h3>
            <p className="text-xs text-[#526E60] dark:text-[#94A3B8]">
              Target: <strong>{selectedRole}</strong> • ~{activeRoadmap.totalHours} total learning hours • Pace: {weeklyHours} hrs/week
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#13291E] dark:text-white">
            <span>
              {completedCount} of {totalSteps} Milestones Verified
            </span>
            <span className="font-mono font-bold text-[#2D6A4F] dark:text-[#52B788]">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        <ProgressBar value={progressPercent} color="emerald" showPercent={false} />
      </div>

      {/* Step-by-Step Trajectory Tree */}
      <div className="space-y-6 relative">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#1B4332] via-[#2D6A4F] to-[#52B788] hidden sm:block -z-10" />

        {activeRoadmap.steps.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);

          return (
            <div
              key={step.id}
              className={`glass-card p-6 sm:p-7 rounded-3xl border transition-all ${
                isDone
                  ? "border-[#52B788]/40 bg-[#D8F3DC]/20 dark:bg-emerald-950/20"
                  : "border-[#E7E1D3] dark:border-white/10 hover:border-[#2D6A4F]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Node Milestone Checkbox */}
                <button
                  onClick={() => handleToggleStep(step)}
                  className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${
                    isDone
                      ? "bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/25"
                      : "bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-slate-400 hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                  }`}
                  title={isDone ? "Completed" : "Click to mark milestone completed"}
                >
                  {isDone ? <CheckCircle2 className="w-6 h-6 text-[#52B788]" /> : <span className="font-bold text-sm">{idx + 1}</span>}
                </button>

                {/* Step Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] dark:text-[#52B788]">
                        Phase {step.phase}: {step.phaseName}
                      </span>
                      <h4 className="text-base font-extrabold text-[#13291E] dark:text-white mt-0.5">
                        {step.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-[#526E60] dark:text-[#94A3B8]">
                        <Clock className="w-3.5 h-3.5" />
                        {step.estimatedHours} hrs
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Zap className="w-3.5 h-3.5 fill-amber-500" />
                        +{step.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#526E60] dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* 4-Pillar Differentiator Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    {/* What to Build */}
                    <div className="p-3.5 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-bold text-[#1B4332] dark:text-[#52B788] uppercase tracking-wider flex items-center gap-1">
                        <Hammer className="w-3 h-3 text-[#2D6A4F]" />
                        What to Build
                      </span>
                      <p className="text-[11px] text-[#526E60] dark:text-slate-300 font-medium">
                        Functional project module with test coverage &amp; GitHub artifact.
                      </p>
                    </div>

                    {/* How to Prepare */}
                    <div className="p-3.5 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        Interview Focus
                      </span>
                      <p className="text-[11px] text-[#526E60] dark:text-slate-300 font-medium">
                        STAR behavioral &amp; architectural trade-off discussion points.
                      </p>
                    </div>

                    {/* Where to Learn */}
                    <div className="p-3.5 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Knowledge Base
                      </span>
                      <Link
                        href={`/dashboard/resources`}
                        className="text-[11px] text-[#2D6A4F] dark:text-[#52B788] font-bold hover:underline block"
                      >
                        Explore Verified Docs →
                      </Link>
                    </div>
                  </div>

                  {/* Curated Resources Links */}
                  <div className="pt-1">
                    <div className="flex flex-wrap gap-2">
                      {step.resources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 hover:border-[#2D6A4F] text-[#13291E] dark:text-slate-200 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#52B788]" />
                          <span>{res.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Completion Action */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#526E60] font-medium">
                      {isDone ? "✅ Milestone Verified in Portfolio" : "⏳ Ready for execution"}
                    </span>
                    {!isDone && (
                      <button
                        onClick={() => handleToggleStep(step)}
                        className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold shadow-xs transition-all"
                      >
                        Complete Milestone (+{step.xpReward} XP)
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
