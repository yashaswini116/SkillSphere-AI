"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { sampleProjectSpecs } from "@/lib/mockData";
import { ProjectSpec } from "@/lib/types";
import { playAudioFeedback } from "@/lib/utils";
import {
  FolderGit2,
  Sparkles,
  ExternalLink,
  Layers,
  Code2,
  CheckCircle2,
  Globe,
  Github,
  Linkedin,
  Copy,
  User,
  Zap,
} from "lucide-react";

export default function PortfolioManagementPage() {
  const { user, updateProfile, addXp } = useAuth();
  const [activeTab, setActiveTab] = useState<"projects" | "portfolio">("projects");
  const [projects, setProjects] = useState<ProjectSpec[]>(sampleProjectSpecs);
  const [copiedLink, setCopiedLink] = useState(false);

  // Portfolio form fields
  const [headline, setHeadline] = useState(
    user?.headline || "Aspiring AI Full-Stack Engineer & Final-Year CS Undergrad"
  );
  const [bio, setBio] = useState(
    user?.bio ||
      "Passionate about generative AI agents, modern web architectures, and high-concurrency cloud distributed systems."
  );
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "https://github.com/aarav-sharma-ai");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "https://linkedin.com/in/aarav-sharma-dev");

  const portfolioSlug = user?.portfolioSlug || "aarav-sharma";

  const handleSavePortfolio = () => {
    updateProfile({ headline, bio, githubUrl, linkedinUrl });
    addXp(30);
    playAudioFeedback("success");
    alert("Public Portfolio successfully updated and published! (+30 XP)");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}/p/${portfolioSlug}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      playAudioFeedback("click");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            Module: Proof of Work & Showcase
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Project Generator & AI Portfolio Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Architect non-generic, production-grade capstones and publish an automated public portfolio page.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
          <button
            onClick={() => {
              setActiveTab("projects");
              playAudioFeedback("click");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "projects"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-white"
            }`}
          >
            AI Capstone Specs
          </button>
          <button
            onClick={() => {
              setActiveTab("portfolio");
              playAudioFeedback("click");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "portfolio"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-white"
            }`}
          >
            Public Portfolio Editor
          </button>
        </div>
      </div>

      {activeTab === "projects" ? (
        /* Tab 1: AI Project Ideas */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>Tailored Blueprints for {user?.targetRole || "Full Stack AI"}</span>
            </h2>
            <span className="text-xs text-slate-400">
              Evaluated against real hiring committee rubrics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {proj.difficulty} • ~{proj.estimatedWeeks} Weeks
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Target: {proj.targetRole}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.tagline}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      System Architecture:
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {proj.architectureOverview}
                    </p>
                  </div>

                  {/* Tech stack badges */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Tech Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Core features */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Core Functional Deliverables:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {proj.coreFeatures.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => {
                      addXp(25);
                      alert(`Project "${proj.title}" added to your target portfolio tracker! (+25 XP)`);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Add to Portfolio Tracker (+25 XP)
                  </button>
                  <span className="text-xs text-slate-400">Production Caliber</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Tab 2: Public Portfolio Builder */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Editor Form (6 cols) */}
          <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Edit Your Public Profile Data
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Personal Bio & Engineering Philosophy
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSavePortfolio}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                Save & Update Live Portfolio (+30 XP)
              </button>
            </div>
          </div>

          {/* Right: Live Shareable Preview Card (6 cols) */}
          <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-4 border border-cyan-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>Live Shareable URL</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="text-xs text-indigo-500 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? "Copied Link!" : "Copy URL"}</span>
                </button>
                <Link
                  href={`/p/${portfolioSlug}`}
                  target="_blank"
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 flex items-center gap-1"
                >
                  <span>Open Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual Portfolio Card Preview */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.slice(0, 2).toUpperCase() || "AS"}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {user?.name || "Aarav Sharma"}
                  </h4>
                  <p className="text-xs text-slate-500">{headline}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{bio}&rdquo;
              </p>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Verified Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {user?.currentSkills.slice(0, 6).map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs text-indigo-500">
                <span className="flex items-center gap-1">
                  <Github className="w-3.5 h-3.5" />
                  GitHub Linked
                </span>
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn Linked
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
