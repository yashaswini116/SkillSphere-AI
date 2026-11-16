"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { playAudioFeedback } from "@/lib/utils";
import {
  BookOpen,
  Search,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  FolderGit2,
  GraduationCap,
  Clock,
  ThumbsUp,
  Share2,
  ShieldCheck,
  Zap,
  Filter,
} from "lucide-react";

interface VerifiedResource {
  id: string;
  title: string;
  category: "docs" | "course" | "github" | "tools" | "interview";
  sourceName: string;
  url: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: string;
  description: string;
  keyTopics: string[];
  isVerified: boolean;
  upvotes: number;
}

const PRESET_SEARCHES = [
  "Next.js 15",
  "PyTorch Deep Learning",
  "System Design",
  "Docker & Containers",
  "FastAPI",
  "CS50 Harvard",
  "NeetCode DSA",
];

export default function ResourceFinderPage() {
  const { user, addXp } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [resources, setResources] = useState<VerifiedResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // Load bookmarks from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("skillsphere_bookmarked_resources");
      if (stored) setBookmarkedIds(JSON.parse(stored));
    } catch {}
  }, []);

  const saveBookmarks = (ids: string[]) => {
    setBookmarkedIds(ids);
    try {
      localStorage.setItem("skillsphere_bookmarked_resources", JSON.stringify(ids));
    } catch {}
  };

  const toggleBookmark = (id: string, title: string) => {
    const isBookmarked = bookmarkedIds.includes(id);
    let updated: string[];
    if (isBookmarked) {
      updated = bookmarkedIds.filter((b) => b !== id);
      showNotice(`Removed "${title.slice(0, 30)}..." from saved resources`);
    } else {
      updated = [...bookmarkedIds, id];
      playAudioFeedback("click");
      addXp(10);
      showNotice(`Bookmarked "${title.slice(0, 30)}..." (+10 XP)`);
    }
    saveBookmarks(updated);
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  // Fetch resources from API
  const fetchResources = async (searchQuery: string, cat: string, diff: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, category: cat, difficulty: diff }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.resources)) {
        setResources(data.resources);
      }
    } catch {
      console.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(query, category, difficulty);
  }, [category, difficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioFeedback("click");
    fetchResources(query, category, difficulty);
  };

  const handlePresetClick = (preset: string) => {
    setQuery(preset);
    playAudioFeedback("click");
    fetchResources(preset, category, difficulty);
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
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#52B788]" />
              AI Resource Finder • 100% Verified Authentic Links
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Zero Hallucinations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#13291E] dark:text-white mt-1">
            Curated Knowledge & Learning Resources
          </h1>
          <p className="text-xs sm:text-sm text-[#526E60] dark:text-[#94A3B8]">
            Discover official documentation, university lectures, starred GitHub repositories, and DSA interview roadmaps for <strong>{user?.targetRole || "your target career"}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-xs font-semibold text-[#13291E] dark:text-white flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-[#2D6A4F] dark:text-[#52B788]" />
            <span>Saved: {bookmarkedIds.length}</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, framework or skill (e.g. PyTorch, Next.js, System Design, Docker)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 text-xs text-[#13291E] dark:text-white border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold transition-all shadow-md shadow-[#1B4332]/20 flex items-center gap-1.5 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search Knowledge</span>
          </button>
        </form>

        {/* Preset query chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-[#526E60] font-medium flex-shrink-0">Popular:</span>
          {PRESET_SEARCHES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className="px-2.5 py-1 rounded-xl bg-[#F5F1E6] hover:bg-[#E7E1D3] dark:bg-white/5 dark:hover:bg-white/10 text-[11px] font-medium text-[#13291E] dark:text-slate-300 transition-colors flex-shrink-0"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E7E1D3] dark:border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            {[
              { id: "all", label: "All Formats" },
              { id: "docs", label: "Official Docs" },
              { id: "course", label: "Courses & Lectures" },
              { id: "github", label: "GitHub Repos" },
              { id: "interview", label: "DSA & Interview" },
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

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Level:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 text-xs text-[#13291E] dark:text-white focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((item) => {
          const isSaved = bookmarkedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#2D6A4F] transition-all group"
            >
              <div className="space-y-2.5">
                {/* Meta Badge Row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#D8F3DC] text-[#1B4332] dark:bg-emerald-950 dark:text-emerald-400">
                      {item.sourceName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        item.difficulty === "Beginner"
                          ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                          : item.difficulty === "Intermediate"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmark(item.id, item.title)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-[#1B4332] dark:hover:text-emerald-400 transition-colors"
                    title={isSaved ? "Saved" : "Save resource"}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-[#2D6A4F] dark:text-[#52B788]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-sm sm:text-base text-[#13291E] dark:text-white leading-snug group-hover:text-[#2D6A4F] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#526E60] dark:text-[#94A3B8] leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Topics Tag List */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {item.keyTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#F5F1E6] dark:bg-white/5 text-[10px] font-semibold text-[#526E60] dark:text-slate-300"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Footer Action */}
              <div className="pt-3 border-t border-[#E7E1D3] dark:border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-[11px] text-[#526E60] dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.estimatedHours}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    {item.upvotes.toLocaleString()}
                  </span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => addXp(5)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {resources.length === 0 && !loading && (
        <div className="glass-card p-12 text-center rounded-3xl space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#13291E] dark:text-white">
            No resources matched your filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for a broader term like "Python", "React", "AI", or reset your category filter.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
              setDifficulty("all");
            }}
            className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

