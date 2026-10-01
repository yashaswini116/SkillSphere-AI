"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { analyzeResumeAI, isLiveAIConfigured } from "@/lib/gemini";
import { ResumeAnalysisResult } from "@/lib/types";
import { AiBadge } from "@/components/common/AiBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { playAudioFeedback } from "@/lib/utils";
import {
  FileText,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function ResumeAnalyzerPage() {
  const { user, addXp } = useAuth();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sampleResume = `AARAV SHARMA
Email: aarav.sharma@example.com | Portfolio: skillsphere.ai/p/aarav | GitHub: github.com/aarav-ai

SUMMARY
Full Stack Engineer with 3+ years experience building reactive web apps using React, Next.js, TypeScript, and Node.js. Passionate about AI agents and vector embeddings.

EXPERIENCE
Software Engineer Intern | CloudTech Solutions (Jan 2025 - Present)
- Built a responsive web dashboard using React and Tailwind for tracking metrics.
- Worked on AI features and connected OpenAI APIs to our backend server.
- Fixed backend bugs and improved database queries in PostgreSQL.

PROJECTS
NeuroPulse AI (Next.js, TypeScript, Gemini 1.5, Vector DB)
- Built an agentic knowledge retrieval engine using document chunking and vector search.
- Used Tailwind CSS for dark mode and responsive layout.

SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML/CSS
Frameworks & Tools: React, Next.js, Node.js, Express, Tailwind CSS, Git, Docker, PostgreSQL`;

  const handleLoadSample = () => {
    setResumeText(sampleResume);
    setJobDescription("Senior Full Stack AI Developer: Experienced in Next.js 15, Vector Databases, Kubernetes, CI/CD, and Redis caching.");
    playAudioFeedback("click");
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert("Please paste or load a resume to analyze.");
      return;
    }

    setLoading(true);
    playAudioFeedback("click");

    try {
      const res = await analyzeResumeAI(resumeText, jobDescription, user?.geminiApiKey);
      setResult(res.data);
      addXp(40);
      playAudioFeedback("success");
    } catch {
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    playAudioFeedback("click");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
              Module: Career Acquisition & ATS
            </span>
            <AiBadge isDemo={!isLiveAIConfigured()} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            AI Resume ATS 90+ Optimizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Audit your resume against Fortune 500 ATS filters and transform passive bullets into high-impact Google XYZ statements.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-indigo-600 dark:text-cyan-400 border border-slate-300 dark:border-white/10 transition-colors"
        >
          Load Realistic Sample Resume
        </button>
      </div>

      {/* Input Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Resume Text */}
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Paste Resume Plaintext / Markdown
            </label>
            <span className="text-[10px] text-slate-400">
              {resumeText.length} characters
            </span>
          </div>

          <textarea
            rows={11}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here or click 'Load Realistic Sample Resume' above..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900/60 text-xs font-mono border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Right: Target Job Description & Scan Action */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Target Job Description (Optional context)
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste specific job posting requirements to evaluate exact keyword match..."
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900/60 text-xs font-mono border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-white/5 border border-indigo-100 dark:border-white/10 space-y-2">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              Why ATS Optimization Matters:
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              75% of resumes are automatically rejected by ATS algorithms before reaching human eyes.
              SkillSphere scores layout parsability, keywords, and metric impact.
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-40 text-white font-semibold text-xs shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? "Parsing ATS Structure..." : "Run AI Resume Audit (+40 XP)"}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-500">
          {/* Main Score Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                  ATS Audit Verdict
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Overall Readiness: {result.overallScore}/100
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {result.executiveSummary}
                </p>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                <div className="p-4 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Role Fit
                  </span>
                  <span className="text-2xl font-bold text-indigo-600 dark:text-cyan-400">
                    {result.roleFitPercentage}%
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Readability
                  </span>
                  <span className="text-2xl font-bold text-emerald-500">
                    {result.atsReadabilityScore}%
                  </span>
                </div>
              </div>
            </div>

            <ProgressBar value={result.overallScore} color="indigo" showPercent={false} />
          </div>

          {/* Missing Keywords vs Detected Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Keywords */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-rose-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Missing High-Impact Keywords ({result.missingKeywords.length})</span>
                </h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.missingKeywords.join(", "));
                    playAudioFeedback("click");
                    alert("Copied missing keywords to clipboard!");
                  }}
                  className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy All</span>
                </button>
              </div>

              <p className="text-xs text-slate-500">
                These critical terms were detected in the target job spec but missing from your resume:
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Detected Skills */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Detected Core Strengths ({result.detectedSkills.length})</span>
              </h4>
              <p className="text-xs text-slate-500">
                Successfully recognized and indexed by the ATS parsing algorithm:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.detectedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Bullet Point Rewriter (Google XYZ Formula) */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  AI Impact Rewriter (Google XYZ Formula)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Formula: &ldquo;Accomplished [X] as measured by [Y], by doing [Z]&rdquo;. Replaces passive tasks with quantified business results.
              </p>
            </div>

            <div className="space-y-4">
              {result.bulletPointRewrites.map((rw, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Original Passive Bullet:
                    </span>
                    <p className="text-xs text-slate-500 line-through">
                      &ldquo;{rw.original}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-1 p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        AI Enhanced XYZ Bullet:
                      </span>
                      <button
                        onClick={() => copyToClipboard(rw.enhanced, index)}
                        className="text-[10px] font-semibold text-indigo-600 dark:text-cyan-300 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedIndex === index ? "Copied!" : "Copy Bullet"}</span>
                      </button>
                    </div>
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      &ldquo;{rw.enhanced}&rdquo;
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                      💡 <em>Why this works:</em> {rw.reasoning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
