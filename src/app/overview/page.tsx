"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { playAudioFeedback } from "@/lib/utils";
import { AiBadge } from "@/components/common/AiBadge";
import {
  Sparkles,
  ArrowRight,
  Target,
  FileText,
  MapPin,
  Mic,
  BookOpen,
  Code2,
  Award,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  Flame,
  Layers,
  ChevronRight,
  ExternalLink,
  LogIn,
} from "lucide-react";

export default function PlatformOverviewPage() {
  const { user, loginAsDemoStudent } = useAuth();
  const router = useRouter();
  const [selectedDemoRole, setSelectedDemoRole] = useState("Full Stack AI Developer");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState<number | null>(78);

  const handleSimulate = (role: string) => {
    playAudioFeedback("click");
    setSelectedDemoRole(role);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      if (role.includes("Full Stack")) setSimulatedScore(78);
      else if (role.includes("DevOps")) setSimulatedScore(65);
      else setSimulatedScore(82);
      playAudioFeedback("success");
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FBF9F4] dark:bg-[#091610] text-[#13291E] dark:text-[#EEF8F2]">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-grid-pattern">
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#1B4332]/20 via-[#52B788]/20 to-[#2D6A4F]/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#D8F3DC] text-[#1B4332] border border-[#74C69D]/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F] animate-pulse" />
              <span>SkillSphere AI Platform Tour • Autonomous Career Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#13291E] dark:text-white leading-[1.12]">
              Bridge Your Skill Gaps. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#52B788] bg-clip-text text-transparent">
                Command Your Career
              </span>{" "}
              with Intelligent AI.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#3D5A4C] dark:text-[#CBD5E1] max-w-2xl mx-auto font-normal leading-relaxed">
              SkillSphere AI dynamically pinpoints your exact technical blindspots, synthesizes
              personalized production roadmaps, simulates FAANG mock interviews, and crafts ATS-optimized resumes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/auth/login"
                onClick={() => playAudioFeedback("click")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#143326] hover:to-[#1B4332] text-white font-semibold text-sm shadow-xl shadow-[#1B4332]/25 transition-all hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                <span>Go to Login / Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => playAudioFeedback("click")}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#102219] hover:bg-[#F5F1E6] text-[#1B4332] dark:text-[#EEF8F2] border border-[#E7E1D3] dark:border-white/10 font-semibold text-sm transition-all shadow-sm"
                >
                  <Target className="w-4 h-4 text-[#52B788]" />
                  <span>Open Your Dashboard</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    loginAsDemoStudent();
                    router.push("/dashboard/skill-gap");
                  }}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#D8F3DC] text-[#1B4332] hover:bg-[#B7E4C7] border border-[#74C69D]/40 font-semibold text-sm transition-all shadow-sm"
                >
                  <Target className="w-4 h-4 text-[#1B4332]" />
                  <span>Quick Demo Preview</span>
                </button>
              )}
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#102219] border border-[#E7E1D3] dark:border-white/10 shadow-sm">
                <p className="text-2xl font-bold text-[#1B4332] dark:text-white">500+</p>
                <p className="text-xs text-[#526E60] dark:text-[#94A3B8]">Skill Taxonomies</p>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#102219] border border-[#E7E1D3] dark:border-white/10 shadow-sm">
                <p className="text-2xl font-bold text-[#2D6A4F] dark:text-[#52B788]">98.4%</p>
                <p className="text-xs text-[#526E60] dark:text-[#94A3B8]">ATS Match Rate</p>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#102219] border border-[#E7E1D3] dark:border-white/10 shadow-sm">
                <p className="text-2xl font-bold text-[#52B788]">40+ Stacks</p>
                <p className="text-xs text-[#526E60] dark:text-[#94A3B8]">Real-Time Radar</p>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#102219] border border-[#E7E1D3] dark:border-white/10 shadow-sm">
                <p className="text-2xl font-bold text-[#1B4332] dark:text-[#52B788]">24/7</p>
                <p className="text-xs text-[#526E60] dark:text-[#94A3B8]">AI Career Mentor</p>
              </div>
            </div>
          </div>

          {/* Interactive Live Hero Widget */}
          <div className="mt-12 max-w-4xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-[#E7E1D3] dark:border-white/15 shadow-xl relative bg-white/95 dark:bg-[#102219]/90">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E7E1D3] dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-[#52B788]" />
                <span className="text-xs font-mono text-[#526E60] dark:text-slate-400 ml-2">
                  skillsphere-core // autonomous-gap-telemetry.ts
                </span>
              </div>
              <AiBadge isDemo={false} modelName="SkillSphere AI Engine" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center">
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#1B4332] dark:text-[#95D5B2] uppercase tracking-wider">
                  Select Target Trajectory
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    "Full Stack AI Developer",
                    "Cloud & DevOps SRE Engineer",
                    "Cybersecurity Analyst",
                  ].map((role) => (
                    <button
                      key={role}
                      onClick={() => handleSimulate(role)}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        selectedDemoRole === role
                          ? "bg-[#1B4332] text-white font-semibold shadow-md shadow-[#1B4332]/30"
                          : "bg-[#F5F1E6] dark:bg-white/5 text-[#13291E] dark:text-[#CBD5E1] hover:bg-[#E8E2D5]"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Middle: Live Gap Meter */}
              <div className="p-5 rounded-2xl bg-[#FBF9F4] dark:bg-slate-900/60 border border-[#E7E1D3] dark:border-white/10 text-center space-y-2">
                <p className="text-xs text-[#526E60] dark:text-slate-400 font-medium">
                  Current Match Index
                </p>
                <div className="text-4xl font-extrabold text-[#1B4332] dark:text-[#52B788]">
                  {isSimulating ? "..." : `${simulatedScore}%`}
                </div>
                <p className="text-xs text-[#526E60] dark:text-slate-400">
                  {simulatedScore && simulatedScore > 75
                    ? "Competitive • 3 Critical Gaps Identified"
                    : "Foundation Ready • 5 Gaps Identified"}
                </p>
                <div className="w-full bg-[#E7E1D3] dark:bg-slate-800 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div
                    className="bg-[#2D6A4F] dark:bg-[#52B788] h-full rounded-full transition-all duration-700"
                    style={{ width: `${simulatedScore}%` }}
                  />
                </div>
              </div>

              {/* Right: Instant AI Remediation */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-[#13291E] dark:text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Top Recommended Modules:
                </p>
                <div className="space-y-1.5">
                  <div className="p-2.5 rounded-xl bg-[#D8F3DC]/60 dark:bg-white/5 border border-[#B7E4C7] dark:border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-[#1B4332] dark:text-[#74C69D]">
                      Vector DBs & RAG Flow
                    </span>
                    <span className="text-[10px] text-[#526E60]">~30 hrs</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#D8F3DC]/60 dark:bg-white/5 border border-[#B7E4C7] dark:border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-[#1B4332] dark:text-[#74C69D]">
                      Kubernetes Pod Topology
                    </span>
                    <span className="text-[10px] text-[#526E60]">~22 hrs</span>
                  </div>
                </div>
                <Link
                  href="/auth/login"
                  onClick={() => playAudioFeedback("click")}
                  className="inline-flex items-center gap-1 text-[#1B4332] dark:text-[#52B788] font-bold hover:underline mt-2"
                >
                  <span>Sign In for Full Intelligence</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars Bento Grid */}
      <section id="features" className="py-16 md:py-24 border-t border-[#E7E1D3] dark:border-white/10 bg-[#F5F1E6]/50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] dark:text-[#52B788]">
              Platform Architecture
            </h2>
            <p className="text-3xl font-extrabold text-[#13291E] dark:text-white sm:text-4xl">
              An End-to-End OS for Tech Mastery
            </p>
            <p className="text-sm text-[#526E60] dark:text-[#94A3B8]">
              Every module engineered to take you from foundational learner to hireable engineering leader.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Skill Gap */}
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between bg-white dark:bg-[#102219]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-5 border border-[#74C69D]/30">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#13291E] dark:text-white">
                  AI Skill-Gap Analyzer
                </h3>
                <p className="text-xs text-[#3D5A4C] dark:text-[#CBD5E1] mt-2 leading-relaxed">
                  Real-time algorithmic delta between your current capabilities and live industry requirements. Generates prioritized remediation sprints.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E1D3] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1B4332] dark:text-[#52B788]">
                <Link href="/auth/login" className="hover:underline flex items-center gap-1 font-bold">
                  <span>Explore Analyzer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-[#526E60]">Autonomous AI</span>
              </div>
            </div>

            {/* Bento Card 2: ATS Resume */}
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between bg-white dark:bg-[#102219]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-5 border border-[#74C69D]/30">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#13291E] dark:text-white">
                  Resume ATS 90+ Optimizer
                </h3>
                <p className="text-xs text-[#3D5A4C] dark:text-[#CBD5E1] mt-2 leading-relaxed">
                  Instant ATS compatibility score, missing keyword detection, and AI bullet point transformation using the Google XYZ impact formula.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E1D3] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1B4332] dark:text-[#52B788]">
                <Link href="/auth/login" className="hover:underline flex items-center gap-1 font-bold">
                  <span>Scan Resume</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-[#526E60]">ATS Formula</span>
              </div>
            </div>

            {/* Bento Card 3: Personalized Roadmaps */}
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between bg-white dark:bg-[#102219]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-5 border border-[#74C69D]/30">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#13291E] dark:text-white">
                  Personalized AI Roadmaps
                </h3>
                <p className="text-xs text-[#3D5A4C] dark:text-[#CBD5E1] mt-2 leading-relaxed">
                  Dynamic step-by-step milestones with estimated study hours, curated free open-source resources, and instant XP completions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E1D3] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1B4332] dark:text-[#52B788]">
                <Link href="/auth/login" className="hover:underline flex items-center gap-1 font-bold">
                  <span>View Roadmaps</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-[#526E60]">Milestone Driven</span>
              </div>
            </div>

            {/* Bento Card 4: RAG Study Assistant */}
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between bg-white dark:bg-[#102219]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-5 border border-[#74C69D]/30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#13291E] dark:text-white">
                  RAG PDF Study Assistant
                </h3>
                <p className="text-xs text-[#3D5A4C] dark:text-[#CBD5E1] mt-2 leading-relaxed">
                  Upload textbooks, research papers, or syllabus documents. Chat with exact citations, generate flashcards, and extract executive summaries.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E1D3] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1B4332] dark:text-[#52B788]">
                <Link href="/auth/login" className="hover:underline flex items-center gap-1 font-bold">
                  <span>Chat with Documents</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-[#526E60]">Vector Grounded</span>
              </div>
            </div>

            {/* Bento Card 5: AI Mock Interview */}
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between bg-white dark:bg-[#102219]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-5 border border-[#74C69D]/30">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#13291E] dark:text-white">
                  AI Mock Interview with Feedback
                </h3>
                <p className="text-xs text-[#3D5A4C] dark:text-[#CBD5E1] mt-2 leading-relaxed">
                  Interactive voice/text interviews with behavioral and technical scoring. Rubric evaluates STAR adherence, confidence, and system accuracy.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E1D3] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1B4332] dark:text-[#52B788]">
                <Link href="/auth/login" className="hover:underline flex items-center gap-1 font-bold">
                  <span>Start Interview</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-[#526E60]">Audio + STAR</span>
              </div>
            </div>

            {/* Bento Card 6: Coding Sandbox */}
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between bg-white dark:bg-[#102219]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-5 border border-[#74C69D]/30">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#13291E] dark:text-white">
                  Coding Sandbox with AI Hints
                </h3>
                <p className="text-xs text-[#3D5A4C] dark:text-[#CBD5E1] mt-2 leading-relaxed">
                  Multi-language coding environment with simulated test runners, progressive 3-level AI hints, and asymptotic complexity review.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E1D3] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1B4332] dark:text-[#52B788]">
                <Link href="/auth/login" className="hover:underline flex items-center gap-1 font-bold">
                  <span>Solve Challenges</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-[#526E60]">O(n) Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tech Radar Preview */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] dark:text-[#52B788]">
                Market Telemetry
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#13291E] dark:text-white mt-1">
                2026 Emerging Tech Radar
              </h2>
              <p className="text-xs text-[#526E60] dark:text-[#94A3B8] mt-1">
                Real-time adoption lifecycle for top technologies in modern engineering teams.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="text-xs font-bold text-[#1B4332] dark:text-[#52B788] hover:underline flex items-center gap-1"
            >
              <span>Explore Complete Radar (Sign In)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { ring: "Adopt", color: "border-[#52B788]/40 bg-[#D8F3DC]/30", tech: "Next.js 15, Vector DBs, Gemini 2.0" },
              { ring: "Trial", color: "border-[#74C69D]/40 bg-[#E8F8EE]/30", tech: "Rust for Wasm, Small Language Models" },
              { ring: "Assess", color: "border-amber-500/40 bg-amber-500/5", tech: "Autonomous Agent Swarms, eBPF" },
              { ring: "Hold", color: "border-rose-500/40 bg-rose-500/5", tech: "Monolithic Legacy VMs, jQuery" },
            ].map((item) => (
              <div
                key={item.ring}
                className={`p-5 rounded-2xl border ${item.color} glass-panel flex flex-col justify-between bg-white dark:bg-[#102219]`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#13291E] dark:text-white">
                    {item.ring}
                  </span>
                  <p className="text-xs text-[#3D5A4C] dark:text-[#CBD5E1] mt-2 font-medium">
                    {item.tech}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-[#526E60]">
                  <TrendingUp className="w-3 h-3 text-[#2D6A4F] dark:text-[#52B788]" />
                  <span>Verified across 5,000+ job specs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA to Authenticate */}
      <section className="py-16 border-t border-[#E7E1D3] dark:border-white/10 bg-gradient-to-b from-[#D8F3DC]/30 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/25">
            <Flame className="w-8 h-8 fill-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13291E] dark:text-white">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-sm text-[#3D5A4C] dark:text-[#CBD5E1] max-w-xl mx-auto">
            Sign in with Firebase to experience personalized skill gap analyses, interactive roadmaps, and 24/7 AI mentoring.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/auth/login"
              className="px-6 py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-sm shadow-xl shadow-[#1B4332]/25 transition-all hover:scale-105 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
