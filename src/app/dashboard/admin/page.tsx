"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { StatsCard } from "@/components/common/StatsCard";
import { sampleLeaderboard } from "@/lib/mockData";
import { playAudioFeedback } from "@/lib/utils";
import {
  Shield,
  Users,
  FileCheck,
  Activity,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Flame,
  Zap,
} from "lucide-react";

export default function AdminPortalPage() {
  const { user, activeRole, setActiveRole } = useAuth();
  const [searchLearner, setSearchLearner] = useState("");
  const [forcedDemoMode, setForcedDemoMode] = useState(false);

  const filteredStudents = sampleLeaderboard.filter((s) =>
    s.name.toLowerCase().includes(searchLearner.toLowerCase()) ||
    s.role.toLowerCase().includes(searchLearner.toLowerCase())
  );

  return (
    <ProtectedRoute adminOnly>
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Administrative Control Tower • SIH26101
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
              🟢 System Nominal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            SkillSphere Admin Oversight & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor institutional cohort progression, AI inference usage metrics, and curriculum compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveRole(activeRole === "admin" ? "student" : "admin");
              playAudioFeedback("click");
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            Active Role: {activeRole.toUpperCase()} (Click to toggle)
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Registered Learners"
          value="1,420"
          change="+18.4%"
          changeType="positive"
          subtitle="Across 34 University Cohorts"
          icon={<Users className="w-5 h-5 text-cyan-500" />}
        />
        <StatsCard
          title="Active Roadmap Milestones"
          value="4,892"
          change="+32%"
          changeType="positive"
          subtitle="78.2% Completion Rate"
          icon={<Activity className="w-5 h-5 text-indigo-500" />}
        />
        <StatsCard
          title="Resumes Audited"
          value="3,840"
          change="+24.5%"
          changeType="positive"
          subtitle="Average ATS Score: 82.4"
          icon={<FileCheck className="w-5 h-5 text-emerald-500" />}
        />
        <StatsCard
          title="Mock Interviews Conducted"
          value="5,120"
          change="+41%"
          changeType="positive"
          subtitle="Average STAR Rating: 84.1"
          icon={<Sparkles className="w-5 h-5 text-amber-500" />}
        />
      </div>

      {/* Cohort Learner Directory */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <span>Institutional Talent Cohort</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live student metrics, target trajectories, and verified XP standings.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchLearner}
              onChange={(e) => setSearchLearner(e.target.value)}
              placeholder="Filter by student or trajectory..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Target Trajectory</th>
                <th className="py-3 px-3">Level & XP</th>
                <th className="py-3 px-3">Streak</th>
                <th className="py-3 px-3">Badges</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {filteredStudents.map((s) => (
                <tr key={s.rank} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {s.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {s.role}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-cyan-400">
                    Lv.{s.level} ({s.xp} XP)
                  </td>
                  <td className="py-3 px-3 font-semibold text-amber-500">
                    🔥 {s.streak} Days
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-white/10 font-bold">
                      {s.badgesCount} Badges
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Viewing detailed audit dossier for ${s.name}...`)}
                      className="text-xs text-indigo-500 hover:underline font-semibold"
                    >
                      Audit Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Telemetry & Configuration Hub */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-500" />
          <span>Platform AI Telemetry & Governance</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Inference Engine
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              Google Gemini 1.5 Flash (v1beta REST)
            </p>
            <span className="text-[10px] text-emerald-500 font-bold block">
              ● High Throughput Ready
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Simulated Fallback Mode
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              Automatic Zero-Key Resilience
            </p>
            <span className="text-[10px] text-slate-400 block">
              Gracefully simulates responses if quotas exceed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              SIH Problem Alignment
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              SIH26101 Architecture
            </p>
            <span className="text-[10px] text-indigo-500 font-bold block">
              Career & Learning OS Specification
            </span>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
