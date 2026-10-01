"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { analyzeSkillGapAI, isLiveAIConfigured } from "@/lib/gemini";
import { SkillGapAnalysis } from "@/lib/types";
import { AiBadge } from "@/components/common/AiBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { playAudioFeedback } from "@/lib/utils";
import {
  Target,
  Sparkles,
  Plus,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function SkillGapPage() {
  const { user, updateProfile, addXp } = useAuth();
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Full Stack AI Developer");
  const [skills, setSkills] = useState<string[]>(
    user?.currentSkills || [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Tailwind CSS",
      "Git",
      "SQL Basics",
      "Python",
    ]
  );
  const [newSkillInput, setNewSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [modelUsed, setModelUsed] = useState("SkillSphere Engine");

  const commonRoles = [
    "Full Stack AI Developer",
    "Cloud & DevOps SRE Engineer",
    "MLOps & Data Platform Engineer",
    "Cybersecurity Specialist",
    "Data Scientist & AI Researcher",
  ];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (skills.includes(newSkillInput.trim())) return;

    const next = [...skills, newSkillInput.trim()];
    setSkills(next);
    setNewSkillInput("");
    updateProfile({ currentSkills: next });
    playAudioFeedback("click");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const next = skills.filter((s) => s !== skillToRemove);
    setSkills(next);
    updateProfile({ currentSkills: next });
    playAudioFeedback("click");
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    playAudioFeedback("click");

    try {
      const res = await analyzeSkillGapAI(targetRole, skills, user?.geminiApiKey);
      setAnalysis(res.data);
      setModelUsed(res.modelUsed);
      updateProfile({ targetRole });
      addXp(30);
      playAudioFeedback("success");
    } catch {
      alert("Failed to analyze skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
              Module: Diagnostic Intelligence
            </span>
            <AiBadge isDemo={!isLiveAIConfigured()} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            AI Skill-Gap Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Compare your active proficiency profile against real-world 2026 enterprise engineering standards.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{loading ? "Analyzing Matrix..." : "Run Skill-Gap Audit"}</span>
        </button>
      </div>

      {/* Input Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Target Role Selector */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            1. Target Career Trajectory
          </label>
          <div className="flex flex-wrap gap-2">
            {commonRoles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setTargetRole(role);
                  playAudioFeedback("click");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  targetRole === role
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                    : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block mb-1">Or enter a custom specialized role:</span>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Distributed Consensus Protocol Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Right: Current Skills Tag Manager */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              2. Your Current Skills ({skills.length})
            </label>
            <span className="text-[10px] text-slate-400">Click &times; to remove</span>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[90px] max-h-36 overflow-y-auto p-2 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-white/5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-500 text-slate-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input */}
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add skill (e.g. Docker, GraphQL, Redis)..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-white/10 hover:bg-slate-900 dark:hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-500">
          {/* Top Score Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                  Target Trajectory: {analysis.targetRole}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Overall Career Match Readiness: {analysis.matchScore}%
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              <div className="text-right sm:text-center p-4 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex-shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Market Demand
                </span>
                <span className="text-2xl font-extrabold text-indigo-600 dark:text-cyan-400">
                  {analysis.marketDemandRating}/10
                </span>
                <span className="text-[10px] text-emerald-500 font-bold block">🔥 High Trajectory</span>
              </div>
            </div>

            <ProgressBar value={analysis.matchScore} color="cyan" showPercent={false} />
          </div>

          {/* Missing Skills Grid (Prioritized) */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Critical Gaps & Missing Competencies
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Sorted by hiring manager impact
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.missingSkills.map((gap, i) => {
                const priorityColors = {
                  critical: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                  high: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                  medium: "bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border-indigo-500/20",
                  low: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
                };

                return (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {gap.skill}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${priorityColors[gap.priority]}`}
                      >
                        {gap.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Est. {gap.estimatedHours} hrs to mastery
                      </span>
                    </div>

                    <div className="pt-2 text-xs flex items-center justify-between">
                      <span className="text-slate-500 truncate max-w-[200px]">
                        📚 {gap.recommendedResource}
                      </span>
                      <button
                        onClick={() => {
                          addXp(15);
                          alert(`Added "${gap.skill}" to your target practice queue! (+15 XP)`);
                        }}
                        className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>Add to Queue</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matched vs Redundant Skills & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Matching Strengths ({analysis.matchedSkills.length})</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.matchedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Strategic Action Plan */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <h4 className="text-sm font-bold text-indigo-600 dark:text-cyan-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>AI Strategic Learning Sprints</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {analysis.learningPathRecommendation.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
