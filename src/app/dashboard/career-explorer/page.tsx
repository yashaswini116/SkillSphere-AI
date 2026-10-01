"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { careerPaths, techRadarItems } from "@/lib/mockData";
import { CareerPath, TechRadarItem } from "@/lib/types";
import { playAudioFeedback } from "@/lib/utils";
import {
  Compass,
  TrendingUp,
  Search,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowRight,
  Filter,
  Flame,
  Award,
} from "lucide-react";

export default function CareerExplorerPage() {
  const { user, updateProfile, addXp } = useAuth();
  const [selectedTrack, setSelectedTrack] = useState<CareerPath>(careerPaths[0]);
  const [radarCategory, setRadarCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSetTargetRole = (roleTitle: string) => {
    updateProfile({ targetRole: roleTitle });
    addXp(20);
    playAudioFeedback("success");
    alert(`Target role updated to "${roleTitle}"! Your OS telemetry and roadmaps have adapted.`);
  };

  const filteredRadar = techRadarItems.filter((item) => {
    const matchesCategory =
      radarCategory === "All" || item.category === radarCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
              Module: Market Intelligence & Trajectories
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Career Explorer & Tech Trends Radar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Real-time engineering job landscape, compensation benchmarks, and 2026 technology adoption lifecycles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Active Target:</span>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-sm">
              {user?.targetRole || "Full Stack AI"}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Career Tracks Directory */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-500" />
          <span>High-Growth Engineering Trajectories</span>
        </h2>

        {/* Roles Selection Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {careerPaths.map((path) => (
            <button
              key={path.id}
              onClick={() => {
                setSelectedTrack(path);
                playAudioFeedback("click");
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedTrack.id === path.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                  : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
              }`}
            >
              <span>{path.title}</span>
              <span className="text-[10px] opacity-80">{path.growthRate}</span>
            </button>
          ))}
        </div>

        {/* Selected Track Detailed Showcase Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                {selectedTrack.category}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {selectedTrack.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                {selectedTrack.description}
              </p>
            </div>

            <button
              onClick={() => handleSetTargetRole(selectedTrack.title)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Set as My Target Role (+20 XP)</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-white/5 border border-indigo-100 dark:border-white/10">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Average Market Compensation
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {selectedTrack.avgSalary.inr}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Global: {selectedTrack.avgSalary.usd}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-white/5 border border-indigo-100 dark:border-white/10">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Demand Momentum
              </span>
              <p className="text-base font-bold text-emerald-500 mt-1 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-emerald-500" />
                <span>{selectedTrack.demandLevel} Demand</span>
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Growth: {selectedTrack.growthRate}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-white/5 border border-indigo-100 dark:border-white/10">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Experience Bracket Fit
              </span>
              <p className="text-base font-bold text-indigo-600 dark:text-cyan-400 mt-1">
                {selectedTrack.experienceLevels.join(" • ")}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Hiring from undergrad to lead
              </span>
            </div>
          </div>

          {/* Skills & Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Mandatory Core Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedTrack.topSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Standard Industry Toolchain
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedTrack.toolsAndFrameworks.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-xs font-medium bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-indigo-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Day in the Life */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Day-to-Day Responsibilities:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {selectedTrack.dayInTheLife.map((duty, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{duty}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Interactive Tech Radar */}
      <div className="space-y-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <span>2026 Interactive Tech Radar</span>
            </h2>
            <p className="text-xs text-slate-500">
              Technology classification: Adopt (Standard), Trial (Promising), Assess (Early R&D), Hold (Phasing out).
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech (e.g. Next.js, Rust)..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Ring Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["Adopt", "Trial", "Assess", "Hold"] as const).map((ring) => {
            const ringColors = {
              Adopt: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
              Trial: "border-cyan-500/30 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400",
              Assess: "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400",
              Hold: "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400",
            };

            const itemsInRing = filteredRadar.filter((i) => i.ring === ring);

            return (
              <div
                key={ring}
                className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${ringColors[ring]}`}
                  >
                    {ring}
                  </span>
                  <span className="text-xs text-slate-400">
                    {itemsInRing.length} technologies
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {itemsInRing.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                        {item.description}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className="text-indigo-500 font-semibold">
                          Relevance: {item.popularityScore}%
                        </span>
                        <span
                          className={`font-semibold ${
                            item.trendingDirection === "up"
                              ? "text-emerald-500"
                              : item.trendingDirection === "down"
                              ? "text-rose-500"
                              : "text-slate-400"
                          }`}
                        >
                          {item.trendingDirection === "up" ? "▲ Growing" : item.trendingDirection === "down" ? "▼ Decreasing" : "— Stable"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
