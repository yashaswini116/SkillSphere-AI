"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { playAudioFeedback } from "@/lib/utils";
import {
  Compass,
  Search,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Calendar,
  Trophy,
  DollarSign,
  GraduationCap,
  Globe,
  Sparkles,
  ShieldCheck,
  Building,
  Tag,
  ArrowRight,
  Clock,
  Layers,
} from "lucide-react";

interface OpportunityItem {
  id: string;
  title: string;
  organization: string;
  category: "hackathon" | "fellowship" | "internship" | "scholarship";
  mode: "Remote / Online" | "Onsite" | "Hybrid";
  eligibility: string;
  deadline: string;
  stipendOrPrize: string;
  description: string;
  applyUrl: string;
  tags: string[];
  isVerified: boolean;
  status: "Open Now" | "Upcoming" | "Rolling";
}

export default function OpportunityRadarPage() {
  const { user, addXp } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [mode, setMode] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [trackedIds, setTrackedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // Load tracked opportunities
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("skillsphere_tracked_opportunities");
      if (stored) setTrackedIds(JSON.parse(stored));
    } catch {}
  }, []);

  const saveTracked = (ids: string[]) => {
    setTrackedIds(ids);
    try {
      localStorage.setItem("skillsphere_tracked_opportunities", JSON.stringify(ids));
    } catch {}
  };

  const toggleTrack = (id: string, title: string) => {
    const isTracked = trackedIds.includes(id);
    let updated: string[];
    if (isTracked) {
      updated = trackedIds.filter((t) => t !== id);
      showNotice(`Removed "${title.slice(0, 30)}..." from application tracker`);
    } else {
      updated = [...trackedIds, id];
      playAudioFeedback("click");
      addXp(15);
      showNotice(`Tracked "${title.slice(0, 30)}..." (+15 XP)`);
    }
    saveTracked(updated);
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  // Fetch opportunities
  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, mode, status, query }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.opportunities)) {
        setOpportunities(data.opportunities);
      }
    } catch {
      console.error("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [category, mode, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioFeedback("click");
    fetchOpportunities();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#1B4332] text-white text-xs font-semibold shadow-2xl border border-emerald-500/30 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#E7E1D3] dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D8F3DC] text-[#1B4332] dark:bg-emerald-950 dark:text-emerald-400 border border-[#B7E4C7] dark:border-white/10 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#52B788]" />
              Opportunity Radar • Verified Student & Tech Programs
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Direct Application Portals
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#13291E] dark:text-white mt-1">
            Global Hackathons, Fellowships & Internships
          </h1>
          <p className="text-xs sm:text-sm text-[#526E60] dark:text-[#94A3B8]">
            Never miss high-impact student programs. Real deadlines, verified eligibility criteria, and direct portals for <strong>{user?.targetRole || "your engineering trajectory"}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-xs font-semibold text-[#13291E] dark:text-white flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-[#2D6A4F] dark:text-[#52B788]" />
            <span>Targeting: {trackedIds.length} Programs</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs by name, host organization or tag (e.g. SIH, Google, GSoC, YC, MLH, AWS)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 text-xs text-[#13291E] dark:text-white border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold transition-all shadow-md shadow-[#1B4332]/20 flex items-center gap-1.5 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Filter Radar</span>
          </button>
        </form>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E7E1D3] dark:border-white/10">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            {[
              { id: "all", label: "All Opportunities" },
              { id: "hackathon", label: "Hackathons" },
              { id: "fellowship", label: "Open Source Fellowships" },
              { id: "internship", label: "Early Internships" },
              { id: "scholarship", label: "Scholarships" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex-shrink-0 ${
                  category === cat.id
                    ? "bg-[#1B4332] text-white shadow-xs"
                    : "bg-[#FFFDF9] dark:bg-white/5 text-[#526E60] dark:text-slate-400 hover:text-[#13291E] dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mode & Status Dropdowns */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-xs text-[#13291E] dark:text-white focus:outline-none"
            >
              <option value="all">All Modes (Remote/Hybrid)</option>
              <option value="Remote">Remote / Online Only</option>
              <option value="Hybrid">Hybrid / Onsite</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-xs text-[#13291E] dark:text-white focus:outline-none"
            >
              <option value="all">All Timelines</option>
              <option value="Open Now">Open Now</option>
              <option value="Upcoming">Upcoming Cycles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((item) => {
          const isTracked = trackedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="glass-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#2D6A4F] transition-all group"
            >
              <div className="space-y-3">
                {/* Status + Org Row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#D8F3DC] text-[#1B4332] dark:bg-emerald-950 dark:text-emerald-400">
                      {item.organization}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        item.status === "Open Now"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      ● {item.status}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleTrack(item.id, item.title)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-[#1B4332] dark:hover:text-emerald-400 transition-colors"
                    title={isTracked ? "Tracked" : "Track application"}
                  >
                    {isTracked ? (
                      <BookmarkCheck className="w-4 h-4 text-[#2D6A4F] dark:text-[#52B788]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-extrabold text-base text-[#13291E] dark:text-white leading-snug group-hover:text-[#2D6A4F] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#2D6A4F] dark:text-[#52B788] font-semibold mt-0.5">
                    {item.stipendOrPrize}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-[#526E60] dark:text-[#94A3B8] leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Eligibility & Mode Badge Box */}
                <div className="p-3 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#526E60] dark:text-slate-300">
                    <Globe className="w-3.5 h-3.5 text-[#2D6A4F] flex-shrink-0" />
                    <span>Mode: <strong>{item.mode}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#526E60] dark:text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span>Eligibility: <strong>{item.eligibility}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#526E60] dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>Timeline: <strong>{item.deadline}</strong></span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#F5F1E6] dark:bg-white/5 text-[10px] font-semibold text-[#526E60] dark:text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E7E1D3] dark:border-white/10 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleTrack(item.id, item.title)}
                  className="text-xs font-semibold text-[#526E60] dark:text-slate-400 hover:text-[#13291E] dark:hover:text-white"
                >
                  {isTracked ? "✓ Tracked in Portfolio" : "+ Add to Target List"}
                </button>

                <a
                  href={item.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => addXp(10)}
                  className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Official Application</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

