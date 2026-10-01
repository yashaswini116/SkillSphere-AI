"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { sampleLeaderboard, initialBadges } from "@/lib/mockData";
import { ProgressBar } from "@/components/common/ProgressBar";
import { playAudioFeedback } from "@/lib/utils";
import {
  Trophy,
  Flame,
  Zap,
  Award,
  Shield,
  Star,
  CheckCircle2,
  Calendar,
  Lock,
} from "lucide-react";

export default function GamificationPage() {
  const { user, addXp } = useAuth();
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<"all" | "weekly">("all");

  const dailyQuests = [
    { id: "q1", title: "Complete Daily AI Skill Check", xp: 30, completed: true },
    { id: "q2", title: "Engage with 24/7 AI Mentor", xp: 15, completed: true },
    { id: "q3", title: "Solve 1 Algorithm Challenge in Sandbox", xp: 50, completed: false },
    { id: "q4", title: "Audit Resume against ATS standards", xp: 40, completed: true },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Module: Motivation & Habit Engineering
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Gamified XP, Streaks & Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Turn technical preparation into a structured, habit-forming daily routine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                {user?.streakDays || 8} Days Streak
              </span>
              <span className="text-[10px] text-slate-400">1 Freeze Safeguard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progression & Daily Quests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Level Progression (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Level
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Level {user?.level || 6} Engineer
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>{user?.xp || 3850} Total XP</span>
              <span className="text-indigo-600 dark:text-cyan-400">
                {750 - ((user?.xp || 0) % 750)} XP to Level {(user?.level || 6) + 1}
              </span>
            </div>
            <ProgressBar
              value={((user?.xp || 0) % 750) / 7.5}
              color="indigo"
              showPercent={false}
            />
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Level Milestones:
            </span>
            <div className="space-y-1.5 text-xs text-slate-500">
              <p className="flex items-center justify-between">
                <span>Lv. 1 - 5: Junior Apprentice</span>
                <span className="text-emerald-500 font-bold">✓ Achieved</span>
              </p>
              <p className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                <span>Lv. 6 - 15: Systems Practitioner</span>
                <span className="text-indigo-500">● In Progress</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Lv. 16+: Principal Architect</span>
                <span className="text-slate-400">Locked</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Daily Quests (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Today&apos;s Active Quests</span>
            </h3>
            <span className="text-xs text-slate-400">Resets in 6 hours</span>
          </div>

          <div className="space-y-3">
            {dailyQuests.map((quest) => (
              <div
                key={quest.id}
                className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      quest.completed
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 dark:bg-white/10 text-slate-400"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {quest.title}
                    </p>
                    <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-500" />
                      +{quest.xp} XP
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-xl ${
                    quest.completed
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-slate-100 dark:bg-white/10 text-slate-500"
                  }`}
                >
                  {quest.completed ? "Completed" : "Incomplete"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              <span>Badges & Accomplishments</span>
            </h3>
            <p className="text-xs text-slate-500">
              Unlockable credentials for mastering competencies across the platform.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-400">
            {user?.badges.length || 5} of {initialBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {initialBadges.map((badge) => {
            const isUnlocked = user?.badges.some((b) => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  isUnlocked
                    ? "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"
                    : "opacity-40 bg-slate-100 dark:bg-white/[0.02] border-dashed border-slate-300 dark:border-white/10"
                }`}
              >
                <div className="text-3xl mx-auto">{badge.icon}</div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {badge.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {badge.description}
                </p>
                <div className="pt-1">
                  {isUnlocked ? (
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">
                      ✓ Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Community Leaderboard */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Community Sprint Leaderboard</span>
          </h3>
          <span className="text-xs text-slate-400">Weekly Talent Cohort</span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-white/10">
          {sampleLeaderboard.map((learner) => {
            const isMe = learner.name === user?.name;
            return (
              <div
                key={learner.rank}
                className={`py-3.5 px-3 flex items-center justify-between rounded-xl transition-colors ${
                  isMe ? "bg-indigo-500/10 font-bold" : "hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 text-center text-xs font-bold ${
                      learner.rank === 1
                        ? "text-amber-500"
                        : learner.rank === 2
                        ? "text-slate-400"
                        : learner.rank === 3
                        ? "text-amber-700"
                        : "text-slate-500"
                    }`}
                  >
                    #{learner.rank}
                  </span>

                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{learner.name}</span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-600 text-white">
                          YOU
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-500">{learner.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    {learner.streak}d
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-cyan-400">
                    {learner.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
