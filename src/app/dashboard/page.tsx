"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { StatsCard } from "@/components/common/StatsCard";
import { ProgressBar } from "@/components/common/ProgressBar";
import { AiBadge } from "@/components/common/AiBadge";
import { isLiveAIConfigured } from "@/lib/gemini";
import { playAudioFeedback } from "@/lib/utils";
import { sampleRoadmap } from "@/lib/mockData";
import {
  Target,
  FileText,
  MapPin,
  Mic,
  BookOpen,
  Code2,
  Award,
  Zap,
  Flame,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Clock,
  Compass,
  Sparkles,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user, markRoadmapStepComplete } = useAuth();
  const currentStep =
    sampleRoadmap.steps.find((s) => !user?.completedRoadmapSteps.includes(s.id)) ||
    sampleRoadmap.steps[sampleRoadmap.steps.length - 1];

  const totalSteps = sampleRoadmap.steps.length;
  const completedCount = user?.completedRoadmapSteps.length || 0;
  const roadmapPercentage = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Header Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[#E7E1D3] dark:border-white/10 bg-white dark:bg-[#0E2018] relative overflow-hidden shadow-sm">
        {/* Soft Green Ambient Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#52B788]/15 via-[#D8F3DC]/20 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D8F3DC] text-[#1B4332] border border-[#74C69D]/30">
                Target Role: {user?.targetRole || "Full Stack AI Developer"}
              </span>
              <AiBadge isDemo={!isLiveAIConfigured()} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#13291E] dark:text-white tracking-tight">
              Welcome back, {user?.name || "Learner"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#3D5A4C] dark:text-[#CBD5E1] max-w-xl">
              You are currently on an{" "}
              <strong className="text-[#1B4332] dark:text-[#52B788]">
                {user?.streakDays || 1}-day learning streak
              </strong>
              . Your skill match readiness is pacing at{" "}
              <strong className="text-[#2D6A4F] dark:text-[#74C69D]">78%</strong> against top
              2026 industry standards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/skill-gap"
              onClick={() => playAudioFeedback("click")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md shadow-[#1B4332]/20 transition-all hover:scale-105"
            >
              <Target className="w-4 h-4" />
              <span>Analyze Skill Gaps</span>
            </Link>
            <Link
              href="/dashboard/quiz"
              onClick={() => playAudioFeedback("click")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFDF9] dark:bg-white/5 hover:bg-[#F5F1E6] text-[#13291E] dark:text-[#EEF8F2] border border-[#E7E1D3] dark:border-white/10 text-xs font-bold transition-all shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Daily AI Quiz (+50 XP)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Career Readiness Index"
          value="78%"
          change="+4.2%"
          changeType="positive"
          subtitle="Based on 8 verified core skills"
          icon={<Target className="w-5 h-5" />}
        />
        <StatsCard
          title="Gamified Level & XP"
          value={`Level ${user?.level || 1}`}
          subtitle={`${user?.xp || 0} Total XP • ${750 - ((user?.xp || 0) % 750)} XP to next level`}
          icon={<Zap className="w-5 h-5 text-amber-500" />}
        />
        <StatsCard
          title="Active Streak"
          value={`${user?.streakDays || 1} Days`}
          subtitle="Keep practicing daily"
          change="🔥 Top 5% Consistent"
          changeType="positive"
          icon={<Flame className="w-5 h-5 text-amber-500 fill-amber-500" />}
        />
        <StatsCard
          title="Roadmap Velocity"
          value={`${roadmapPercentage}%`}
          subtitle={`${completedCount} of ${totalSteps} milestones reached`}
          icon={<MapPin className="w-5 h-5 text-[#52B788]" />}
        />
      </div>

      {/* 3. Middle Section: Active Roadmap Sprint + Skill Competency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Roadmap Sprint */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#E7E1D3] dark:border-white/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center font-bold text-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#13291E] dark:text-white">
                  Active Roadmap Sprint
                </h3>
                <p className="text-[11px] text-[#526E60] dark:text-[#94A3B8]">
                  {sampleRoadmap.title}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/roadmaps"
              className="text-xs font-bold text-[#1B4332] dark:text-[#52B788] hover:underline flex items-center gap-1"
            >
              <span>View Full Tree</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#FBF9F4] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#1B4332] text-white">
                Phase {currentStep?.phase}: {currentStep?.phaseName}
              </span>
              <span className="text-xs font-semibold text-[#526E60] dark:text-[#94A3B8] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Est. {currentStep?.estimatedHours} hours
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-[#13291E] dark:text-white">
                {currentStep?.title}
              </h4>
              <p className="text-xs text-[#3D5A4C] dark:text-[#CBD5E1] mt-1 leading-relaxed">
                {currentStep?.description}
              </p>
            </div>

            {/* Resources list */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[11px] font-bold text-[#526E60] dark:text-[#94A3B8] uppercase tracking-wider">
                Recommended Curated Learning Modules:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentStep?.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-[#13291E] border border-[#E7E1D3] dark:border-white/10 hover:border-[#52B788] flex items-center justify-between text-xs font-semibold text-[#13291E] dark:text-[#EEF8F2] transition-colors"
                  >
                    <span className="truncate pr-2">{res.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#526E60] flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Complete step action */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs font-bold text-[#1B4332] dark:text-[#52B788] flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Reward: +{currentStep?.xpReward} XP</span>
              </div>
              <button
                onClick={() => {
                  if (currentStep) {
                    markRoadmapStepComplete(currentStep.id, currentStep.xpReward);
                  }
                }}
                disabled={user?.completedRoadmapSteps.includes(currentStep?.id || "")}
                className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {user?.completedRoadmapSteps.includes(currentStep?.id || "")
                    ? "Completed"
                    : "Mark Complete & Claim XP"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Skill Competency Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#E7E1D3] dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#13291E] dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#2D6A4F] dark:text-[#52B788]" />
              <span>Skill Matrix Delta</span>
            </h3>
            <span className="text-[10px] text-[#526E60]">Target Benchmark</span>
          </div>

          <p className="text-xs text-[#526E60] dark:text-[#94A3B8]">
            Competency comparison against {user?.targetRole || "Full Stack AI"}.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <ProgressBar value={92} label="TypeScript & React Lifecycle" color="forest" />
            </div>
            <div>
              <ProgressBar value={85} label="Node.js & Route Handlers" color="forest" />
            </div>
            <div>
              <ProgressBar value={68} label="Vector DBs & RAG Pipelines" color="forest" />
            </div>
            <div>
              <ProgressBar value={54} label="Kubernetes & Container Fleet" color="amber" />
            </div>
            <div>
              <ProgressBar value={75} label="GitOps CI/CD Automation" color="forest" />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E7E1D3] dark:border-white/10">
            <Link
              href="/dashboard/skill-gap"
              className="w-full text-center block py-2.5 rounded-xl bg-[#F5F1E6] dark:bg-white/5 hover:bg-[#E8E2D5] text-xs font-bold text-[#1B4332] dark:text-[#52B788] transition-colors"
            >
              Perform Full AI Skill-Gap Audit
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Quick Action Launcher Hub */}
      <div>
        <h2 className="text-base font-bold text-[#13291E] dark:text-white mb-3">
          Instant Career OS Launchers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Resume ATS", href: "/dashboard/resume-analyzer", icon: FileText, color: "text-[#1B4332] dark:text-[#52B788]" },
            { label: "RAG Study", href: "/dashboard/study-assistant", icon: BookOpen, color: "text-[#2D6A4F] dark:text-[#74C69D]" },
            { label: "Mock Interview", href: "/dashboard/mock-interview", icon: Mic, color: "text-rose-600" },
            { label: "Coding Sandbox", href: "/dashboard/coding", icon: Code2, color: "text-amber-600" },
            { label: "AI Projects", href: "/dashboard/portfolio", icon: Sparkles, color: "text-[#52B788]" },
            { label: "Tech Radar", href: "/dashboard/career-explorer", icon: Compass, color: "text-[#1B4332] dark:text-[#74C69D]" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                onClick={() => playAudioFeedback("click")}
                className="p-4 rounded-2xl bg-white dark:bg-[#0E2018] border border-[#E7E1D3] dark:border-white/10 shadow-sm flex flex-col items-center text-center group hover:border-[#52B788]/60 hover:shadow-md transition-all"
              >
                <div className={`p-3 rounded-xl bg-[#F5F1E6] dark:bg-white/5 ${action.color} group-hover:scale-110 transition-transform mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#13291E] dark:text-[#CBD5E1] group-hover:text-[#1B4332] dark:group-hover:text-[#52B788] transition-colors">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. Unlocked Badges Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0E2018] border border-[#E7E1D3] dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-[#13291E] dark:text-white">
              Trophy Case &amp; Unlocked Badges
            </h3>
          </div>
          <Link
            href="/dashboard/gamification"
            className="text-xs font-bold text-[#1B4332] dark:text-[#52B788] hover:underline"
          >
            View Leaderboard
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {user?.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-3.5 rounded-2xl bg-[#FBF9F4] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 flex items-center gap-3"
            >
              <div className="text-2xl">{badge.icon}</div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#13291E] dark:text-white truncate">
                  {badge.name}
                </p>
                <p className="text-[10px] text-[#526E60] dark:text-[#94A3B8] truncate">
                  {badge.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
