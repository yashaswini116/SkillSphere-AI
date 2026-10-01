"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { demoStudentUser, sampleProjectSpecs } from "@/lib/mockData";
import {
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Award,
  CheckCircle2,
  Code2,
  FolderGit2,
  ArrowRight,
} from "lucide-react";

export default function PublicPortfolioPage() {
  const params = useParams();
  const username = params?.username as string || "aarav-sharma";
  const user = demoStudentUser;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Floating Badge */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified by SkillSphere AI • SIH26101 Career OS</span>
          </Link>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            🟢 Open to Opportunities
          </span>
        </div>

        {/* Profile Hero Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-1 flex-shrink-0 shadow-lg shadow-indigo-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-white font-extrabold text-2xl">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-sm font-semibold text-indigo-600 dark:text-cyan-400">
                {user.headline}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target Role: {user.targetRole} • Level {user.level} Engineer ({user.xp} Verified XP)
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {user.bio}
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {user.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
            )}
            {user.linkedinUrl && (
              <a
                href={user.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors shadow-sm"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            <a
              href={`mailto:${user.email}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              <Mail className="w-4 h-4 text-cyan-500" />
              <span>Contact Candidate</span>
            </a>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>AI Verified Skill Matrix</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.currentSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-500" />
            <span>Featured Capstone Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleProjectSpecs.map((proj) => (
              <div
                key={proj.id}
                className="glass-card p-6 rounded-3xl space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                    {proj.difficulty}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {proj.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-3">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-cyan-400">
                  <span className="flex items-center gap-1">
                    <span>Live Architecture</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Earned */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Credentials & Unlocked Achievements</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {user.badges.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2.5"
              >
                <span className="text-2xl">{b.icon}</span>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {b.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {b.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-8 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500">
          <p>
            Powered by <strong>SkillSphere AI</strong> • Build your own verified engineering portfolio.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-indigo-600 dark:text-cyan-400 font-semibold mt-2 hover:underline"
          >
            <span>Explore SkillSphere AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
