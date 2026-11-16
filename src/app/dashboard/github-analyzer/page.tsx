"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { playAudioFeedback } from "@/lib/utils";
import {
  FolderGit2,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Star,
  GitFork,
  FileCode,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Check,
} from "lucide-react";

interface GitHubAnalysisResult {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  profileScore: number;
  grade: "A+" | "A" | "B" | "C";
  summary: string;
  topLanguages: { language: string; count: number }[];
  repoAudits: {
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    hasReadme: boolean;
    hasLicense: boolean;
    readiness: "Production Ready" | "Needs Polish" | "Draft";
  }[];
  recommendations: {
    priority: "High" | "Medium" | "Low";
    title: string;
    description: string;
    category: "Documentation" | "CI/CD" | "Portfolio" | "Quality";
  }[];
  isSimulatedFallback?: boolean;
}

export default function GitHubAnalyzerPage() {
  const { user, updateProfile, addXp } = useAuth();
  const [username, setUsername] = useState(user?.githubUrl?.replace("https://github.com/", "") || "yashaswini116");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GitHubAnalysisResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleAnalyze = async (targetUsername?: string) => {
    const un = (targetUsername || username).trim();
    if (!un) return;

    setLoading(true);
    playAudioFeedback("click");

    try {
      const res = await fetch("/api/github-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: un }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setResult(data.analysis);
        addXp(25);
        playAudioFeedback("success");
        updateProfile({ githubUrl: `https://github.com/${un}` });
        showNotice(`GitHub Profile for @${un} analyzed successfully! (+25 XP)`);
      } else {
        alert(data.error || "Failed to analyze profile.");
      }
    } catch {
      alert("Network error analyzing GitHub profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
              <FolderGit2 className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#52B788]" />
              GitHub Developer Profile & Repository Audit
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
              Recruiter-Ready Scoring
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#13291E] dark:text-white mt-1">
            GitHub Code & Portfolio Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#526E60] dark:text-[#94A3B8]">
            Audit repository READMEs, commit architecture, open-source licenses, and discover actionable steps to stand out to engineering hiring managers.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter public GitHub username or URL (e.g. yashaswini116, torvalds, vercel)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 text-xs text-[#13291E] dark:text-white border border-[#E7E1D3] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md shadow-[#1B4332]/20 flex items-center gap-1.5 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Analyzing Repos..." : "Audit Profile"}</span>
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-[#526E60] font-medium">Try Preset:</span>
          {["yashaswini116", "shadcn", "torvalds", "vercel"].map((p) => (
            <button
              key={p}
              onClick={() => {
                setUsername(p);
                handleAnalyze(p);
              }}
              className="px-2 py-0.5 rounded-lg bg-[#F5F1E6] hover:bg-[#E7E1D3] dark:bg-white/5 text-[11px] font-mono text-[#13291E] dark:text-slate-300"
            >
              @{p}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={result.avatarUrl}
                alt={result.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#52B788]/20 shadow-md flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-[#13291E] dark:text-white">
                    {result.name}
                  </h2>
                  <a
                    href={`https://github.com/${result.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#2D6A4F] dark:text-[#52B788] hover:underline font-mono flex items-center gap-1"
                  >
                    <span>@{result.username}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-[#526E60] dark:text-[#94A3B8] mt-1 max-w-lg">
                  {result.bio}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500 mt-2">
                  <span><strong>{result.publicRepos}</strong> Repos</span>
                  <span>·</span>
                  <span><strong>{result.followers}</strong> Followers</span>
                  <span>·</span>
                  <span><strong>{result.following}</strong> Following</span>
                </div>
              </div>
            </div>

            {/* Score Ring */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 flex-shrink-0">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Developer Score</span>
                <span className="text-3xl font-extrabold text-[#1B4332] dark:text-[#52B788] font-mono">
                  {result.profileScore}/100
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1B4332] to-[#52B788] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                {result.grade}
              </div>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="p-5 rounded-3xl bg-[#D8F3DC]/60 dark:bg-emerald-950/30 border border-[#B7E4C7] dark:border-white/10 text-xs text-[#1B4332] dark:text-emerald-300 leading-relaxed flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#2D6A4F] dark:text-[#52B788] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">SkillSphere AI Profile Assessment:</strong>
              {result.summary}
            </div>
          </div>

          {/* Language Breakdown & Repositories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Languages */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-sm text-[#13291E] dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#2D6A4F]" />
                <span>Tech Stack Distribution</span>
              </h3>
              <div className="space-y-3">
                {result.topLanguages.map((lang, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-[#13291E] dark:text-white">{lang.language}</span>
                      <span className="text-[#526E60] font-mono">{lang.count} repos</span>
                    </div>
                    <div className="w-full bg-[#E7E1D3] dark:bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#2D6A4F] dark:bg-[#52B788] h-full rounded-full"
                        style={{ width: `${Math.min(lang.count * 25, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Repositories Audited */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-sm text-[#13291E] dark:text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#2D6A4F]" />
                <span>Top Audited Repositories</span>
              </h3>

              <div className="space-y-3">
                {result.repoAudits.map((repo, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 space-y-2 hover:border-[#2D6A4F] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-sm text-[#13291E] dark:text-white hover:text-[#2D6A4F] flex items-center gap-1.5"
                      >
                        <span>{repo.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          repo.readiness === "Production Ready"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : repo.readiness === "Needs Polish"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-slate-500/10 text-slate-500"
                        }`}
                      >
                        {repo.readiness}
                      </span>
                    </div>

                    <p className="text-xs text-[#526E60] dark:text-[#94A3B8] line-clamp-2">
                      {repo.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#526E60] dark:text-slate-400 font-mono pt-1">
                      <span>{repo.language}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500" />
                        {repo.stars}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3 text-slate-400" />
                        {repo.forks}
                      </span>
                      {repo.hasLicense && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600 font-bold">✓ License</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Recruiter Optimization Recommendations */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-base text-[#13291E] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2D6A4F] dark:text-[#52B788]" />
              <span>Actionable Recruiter Readiness Recommendations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-white/5 border border-[#E7E1D3] dark:border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332] dark:bg-emerald-950 dark:text-emerald-400 uppercase">
                      {rec.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        rec.priority === "High" ? "text-rose-500" : "text-amber-500"
                      }`}
                    >
                      ● {rec.priority} Priority
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#13291E] dark:text-white">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-[#526E60] dark:text-[#94A3B8] leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

