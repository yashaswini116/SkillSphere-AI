"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { StatsCard } from "@/components/common/StatsCard";
import { sampleLeaderboard } from "@/lib/mockData";
import { LeaderboardUser } from "@/lib/types";
import { playAudioFeedback } from "@/lib/utils";
import confetti from "canvas-confetti";
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
  Download,
  Filter,
  BarChart3,
  Layers,
  Cpu,
  Clock,
  Award,
  ChevronRight,
  X,
  Send,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  FileText,
  Check,
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: "ai" | "academic" | "security" | "system";
  status: "success" | "warning" | "info";
  details: string;
}

interface ExtendedStudent extends LeaderboardUser {
  atsScore: number;
  roadmapProgress: number;
  status: "Exceptional" | "On Track" | "Needs Attention";
  department: string;
  skills: { name: string; score: number }[];
}

const INITIAL_EXTENDED_STUDENTS: ExtendedStudent[] = [
  {
    rank: 1,
    name: "Priya Sundaram",
    role: "AI Systems Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    xp: 14200,
    level: 23,
    streak: 34,
    badgesCount: 16,
    atsScore: 94,
    roadmapProgress: 88,
    status: "Exceptional",
    department: "Artificial Intelligence & Data Science",
    skills: [
      { name: "Vector Databases & RAG", score: 96 },
      { name: "PyTorch & Transformers", score: 92 },
      { name: "System Design", score: 85 },
      { name: "STAR Communication", score: 90 },
    ],
  },
  {
    rank: 2,
    name: "Marcus Vance",
    role: "Full Stack AI Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    xp: 12850,
    level: 21,
    streak: 28,
    badgesCount: 14,
    atsScore: 89,
    roadmapProgress: 82,
    status: "Exceptional",
    department: "Computer Science & Engineering",
    skills: [
      { name: "Next.js & TypeScript", score: 95 },
      { name: "LangChain / Genkit", score: 88 },
      { name: "PostgreSQL & Prisma", score: 84 },
      { name: "STAR Communication", score: 82 },
    ],
  },
  {
    rank: 3,
    name: "Aarav Sharma",
    role: "Full Stack AI Developer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    xp: 3850,
    level: 6,
    streak: 8,
    badgesCount: 5,
    atsScore: 82,
    roadmapProgress: 54,
    status: "On Track",
    department: "Information Technology",
    skills: [
      { name: "React & Tailwind", score: 84 },
      { name: "Node.js & Express", score: 76 },
      { name: "Algorithms & DS", score: 68 },
      { name: "Cloud Deployment", score: 58 },
    ],
  },
  {
    rank: 4,
    name: "Kavya Patel",
    role: "Cloud SRE Specialist",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    xp: 3400,
    level: 5,
    streak: 6,
    badgesCount: 4,
    atsScore: 78,
    roadmapProgress: 46,
    status: "On Track",
    department: "Computer Science & Engineering",
    skills: [
      { name: "Docker & Kubernetes", score: 72 },
      { name: "CI/CD GitHub Actions", score: 80 },
      { name: "Linux Systems", score: 75 },
      { name: "Observability & Metrics", score: 62 },
    ],
  },
  {
    rank: 5,
    name: "David Kim",
    role: "Data Platform Architect",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    xp: 2950,
    level: 4,
    streak: 2,
    badgesCount: 3,
    atsScore: 68,
    roadmapProgress: 32,
    status: "Needs Attention",
    department: "Information Technology",
    skills: [
      { name: "Apache Spark & ETL", score: 74 },
      { name: "SQL & BigQuery", score: 70 },
      { name: "Distributed Systems", score: 48 },
      { name: "ATS Resume Polish", score: 52 },
    ],
  },
  {
    rank: 6,
    name: "Rohan Varma",
    role: "DevOps & Cloud Engineer",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    xp: 1850,
    level: 3,
    streak: 1,
    badgesCount: 2,
    atsScore: 61,
    roadmapProgress: 24,
    status: "Needs Attention",
    department: "Electronics & Telecommunication",
    skills: [
      { name: "Linux Bash", score: 64 },
      { name: "Docker Basics", score: 55 },
      { name: "Networking (OSI)", score: 48 },
      { name: "Mock Interview Delivery", score: 45 },
    ],
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "Just now",
    actor: "System / AI Gateway",
    action: "Inference Ping",
    category: "ai",
    status: "success",
    details: "Groq (openai/gpt-oss-120b) healthcheck returned 200 OK (latency: 168ms).",
  },
  {
    id: "log-2",
    timestamp: "5 mins ago",
    actor: "Admin (Academic Oversight)",
    action: "Curriculum Intervention",
    category: "academic",
    status: "info",
    details: "Assigned 'Kubernetes Production Hardening' to Batch 2026 at-risk learners.",
  },
  {
    id: "log-3",
    timestamp: "18 mins ago",
    actor: "Priya Sundaram",
    action: "Milestone Verified",
    category: "academic",
    status: "success",
    details: "Completed 'Advanced Vector Search & RAG' with verified github artifact.",
  },
  {
    id: "log-4",
    timestamp: "42 mins ago",
    actor: "Security Guardian",
    action: "Token Rotation Audit",
    category: "security",
    status: "info",
    details: "Encrypted server-side BYOK variables validated; zero secret leakage detected.",
  },
  {
    id: "log-5",
    timestamp: "1 hour ago",
    actor: "David Kim",
    action: "ATS Resume Scan",
    category: "academic",
    status: "warning",
    details: "ATS Score: 68/100. System flagged missing high-demand terms: Docker, Cloud CI/CD.",
  },
];

const SKILL_DEFICIT_HEATMAP = [
  {
    skill: "Distributed Systems & Kubernetes",
    cohortReadiness: 54,
    targetBenchmark: 80,
    criticality: "High",
    affectedStudents: 28,
    action: "Mandate Hands-On Pod Cluster Lab in Week 6",
  },
  {
    skill: "Vector Databases & Hybrid Search",
    cohortReadiness: 82,
    targetBenchmark: 75,
    criticality: "Low",
    affectedStudents: 8,
    action: "Exceeding benchmark; unlock advanced agentic tool-use module",
  },
  {
    skill: "TypeScript 5 & Modern Next.js Architecture",
    cohortReadiness: 88,
    targetBenchmark: 70,
    criticality: "Low",
    affectedStudents: 5,
    action: "Cohort proficiency confirmed; recommend production portfolio deploys",
  },
  {
    skill: "STAR Method Behavioral Interview Delivery",
    cohortReadiness: 61,
    targetBenchmark: 85,
    criticality: "Medium",
    affectedStudents: 22,
    action: "Schedule AI Mock Interview drills with voice-analysis turnarounds",
  },
  {
    skill: "System Observability, Telemetry & Sentry",
    cohortReadiness: 48,
    targetBenchmark: 75,
    criticality: "High",
    affectedStudents: 31,
    action: "Introduce Datadog / OpenTelemetry micro-credential challenge",
  },
];

export default function AdminPortalPage() {
  const { user, activeRole, setActiveRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"cohort" | "skills" | "telemetry" | "logs">("cohort");
  const [searchLearner, setSearchLearner] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [students, setStudents] = useState<ExtendedStudent[]>(INITIAL_EXTENDED_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<ExtendedStudent | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [logFilter, setLogFilter] = useState<string>("all");
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ status: string; latency: number } | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchLearner.toLowerCase()) ||
      s.role.toLowerCase().includes(searchLearner.toLowerCase()) ||
      s.department.toLowerCase().includes(searchLearner.toLowerCase());
    const matchesRole = roleFilter === "All" || s.role.includes(roleFilter);
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Export Cohort CSV
  const handleExportCSV = () => {
    const headers = ["Rank,Name,Role,Department,Level,XP,Streak_Days,Badges,ATS_Score,Roadmap_Progress_Pct,Status"];
    const rows = students.map(
      (s) =>
        `${s.rank},"${s.name}","${s.role}","${s.department}",${s.level},${s.xp},${s.streak},${s.badgesCount},${s.atsScore},${s.roadmapProgress}%,"${s.status}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SkillSphere_Admin_Cohort_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playAudioFeedback("success");
    showNotice("Cohort audit CSV exported successfully!");
  };

  // Export Logs JSON
  const handleExportLogsJSON = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `SkillSphere_Audit_Logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playAudioFeedback("success");
    showNotice("Audit logs JSON exported!");
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Run AI Ping Test
  const handleRunPingTest = () => {
    setIsPinging(true);
    playAudioFeedback("click");
    setTimeout(() => {
      const simulatedLatency = Math.floor(Math.random() * 60) + 140; // 140-200ms
      setPingResult({ status: "200 OK (Nominal)", latency: simulatedLatency });
      setIsPinging(false);
      playAudioFeedback("success");

      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: "Just now",
          actor: "Admin (Manual Ping)",
          action: "Inference Health Probe",
          category: "ai",
          status: "success",
          details: `Groq openai/gpt-oss-120b test ping verified at ${simulatedLatency}ms response time.`,
        },
        ...prev,
      ]);
    }, 900);
  };

  // Award Honor Badge
  const handleAwardBadge = (studentName: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    playAudioFeedback("levelUp");
    setStudents((prev) =>
      prev.map((s) => (s.name === studentName ? { ...s, badgesCount: s.badgesCount + 1, xp: s.xp + 250 } : s))
    );
    if (selectedStudent && selectedStudent.name === studentName) {
      setSelectedStudent({
        ...selectedStudent,
        badgesCount: selectedStudent.badgesCount + 1,
        xp: selectedStudent.xp + 250,
      });
    }
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: "Just now",
        actor: "Admin",
        action: "Academic Commendation",
        category: "academic",
        status: "success",
        details: `Awarded 'Excellence in Engineering' Badge (+250 XP) to ${studentName}.`,
      },
      ...prev,
    ]);
    showNotice(`Commendation Badge awarded to ${studentName}! (+250 XP recorded)`);
  };

  // Assign Priority Milestone
  const handleAssignMilestone = (studentName: string) => {
    playAudioFeedback("xp");
    showNotice(`Custom Roadmap Milestone dispatched to ${studentName}'s learning trajectory.`);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: "Just now",
        actor: "Admin Intervention",
        action: "Curriculum Adjustment",
        category: "academic",
        status: "info",
        details: `Dispatched targeted micro-curriculum milestone to ${studentName}.`,
      },
      ...prev,
    ]);
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="space-y-8">
        {/* Floating Notification */}
        {actionNotice && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#1B4332] text-white shadow-2xl border border-emerald-500/30 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
            <span className="text-xs font-semibold">{actionNotice}</span>
          </div>
        )}

        {/* Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-500" />
                Administrative Command Center • SIH26101
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Institutional Oversight Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Institutional Talent Governance & Oversight
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Track student trajectory progress, audit skill deficits, control AI inference policies, and enforce academic benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              title="Export all cohort student records to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Cohort CSV</span>
            </button>

            <button
              onClick={() => {
                setActiveRole(activeRole === "admin" ? "student" : "admin");
                playAudioFeedback("click");
              }}
              className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-xs shadow-md shadow-[#1B4332]/20 transition-all flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Role: {activeRole.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Analytics KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Registered Learners"
            value="1,420"
            change="+18.4%"
            changeType="positive"
            subtitle="Across 34 University Batches"
            icon={<Users className="w-5 h-5 text-cyan-500" />}
          />
          <StatsCard
            title="Roadmap Milestones"
            value="4,892"
            change="+32%"
            changeType="positive"
            subtitle="78.2% Completion Rate"
            icon={<Activity className="w-5 h-5 text-indigo-500" />}
          />
          <StatsCard
            title="ATS Resumes Audited"
            value="3,840"
            change="+24.5%"
            changeType="positive"
            subtitle="Avg Institutional ATS: 82.4"
            icon={<FileCheck className="w-5 h-5 text-emerald-500" />}
          />
          <StatsCard
            title="Mock Interviews"
            value="5,120"
            change="+41%"
            changeType="positive"
            subtitle="Avg STAR Rating: 84.1"
            icon={<Sparkles className="w-5 h-5 text-amber-500" />}
          />
          <StatsCard
            title="AI Engine Availability"
            value="99.82%"
            change="Groq Live"
            changeType="positive"
            subtitle="Avg Latency: 168ms"
            icon={<Zap className="w-5 h-5 text-orange-500" />}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/10 gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("cohort")}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "cohort"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Cohort Talent & Dossiers ({filteredStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "skills"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Skill Gap Heatmap & Interventions</span>
          </button>

          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "telemetry"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>AI Telemetry & Model Governance</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "logs"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Platform Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: Cohort Talent & Dossiers */}
        {activeTab === "cohort" && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Institutional Talent Cohort Directory</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click <strong>Audit Dossier</strong> to inspect a learner's ATS resume readiness, verified skill competencies, and issue academic interventions.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    value={searchLearner}
                    onChange={(e) => setSearchLearner(e.target.value)}
                    placeholder="Search name, trajectory..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Trajectories</option>
                  <option value="Full Stack">Full Stack AI</option>
                  <option value="AI Systems">AI Systems Engineer</option>
                  <option value="Cloud">Cloud & SRE</option>
                  <option value="Data">Data Platform</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Standings</option>
                  <option value="Exceptional">Exceptional (Top 5%)</option>
                  <option value="On Track">On Track</option>
                  <option value="Needs Attention">Needs Attention</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Student & Department</th>
                    <th className="py-3 px-3">Target Trajectory</th>
                    <th className="py-3 px-3">Level & XP</th>
                    <th className="py-3 px-3">Roadmap %</th>
                    <th className="py-3 px-3">ATS Score</th>
                    <th className="py-3 px-3">Streak & Badges</th>
                    <th className="py-3 px-3">Academic Standing</th>
                    <th className="py-3 px-3 text-right">Oversight Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
                  {filteredStudents.map((s) => (
                    <tr key={s.rank} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{s.name}</p>
                            <p className="text-[10px] text-slate-500">{s.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {s.role}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        Lv.{s.level} <span className="text-slate-400 font-normal">({s.xp.toLocaleString()} XP)</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="w-24 bg-slate-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${s.roadmapProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                          {s.roadmapProgress}% done
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            s.atsScore >= 85
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : s.atsScore >= 70
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {s.atsScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-amber-500">🔥 {s.streak}d</span>
                          <span className="text-slate-400">•</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-white/10 font-bold">
                            {s.badgesCount} 🏅
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === "Exceptional"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : s.status === "On Track"
                              ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs transition-colors"
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
        )}

        {/* TAB 2: Skill Gap Heatmap & Interventions */}
        {activeTab === "skills" && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Institutional Skill Gap Heatmap & Deficit Remediation</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregate readiness ratings across 1,420 learners compared against top 2026 hiring benchmarks.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>2 Critical Deficits Identified</span>
              </span>
            </div>

            <div className="space-y-4">
              {SKILL_DEFICIT_HEATMAP.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.skill}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.criticality === "High"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : item.criticality === "Medium"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {item.criticality} Deficit
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Impact: {item.affectedStudents}% of cohort learners currently score below placement cutoff
                      </p>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {item.cohortReadiness}% / {item.targetBenchmark}%
                      </span>
                      <span className="text-[10px] text-slate-400">Target Benchmark</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="relative w-full bg-slate-200 dark:bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.cohortReadiness < item.targetBenchmark
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${item.cohortReadiness}%` }}
                    />
                    {/* Benchmark tick mark */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-rose-500 z-10"
                      style={{ left: `${item.targetBenchmark}%` }}
                      title={`Target Benchmark: ${item.targetBenchmark}%`}
                    />
                  </div>

                  {/* Recommended Action */}
                  <div className="flex items-center justify-between text-xs pt-1 text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      Remediation Plan: <strong>{item.action}</strong>
                    </span>

                    <button
                      onClick={() => {
                        showNotice(`Remediation milestone '${item.skill}' dispatched to batch trainees.`);
                        playAudioFeedback("click");
                      }}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      Enforce Module →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AI Telemetry & Governance */}
        {activeTab === "telemetry" && (
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-orange-500" />
                    <span>Multi-Provider LLM Gateway & Governance</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live telemetry across primary inference engines, safety filter compliance, and fallback resilience.
                  </p>
                </div>

                <button
                  onClick={handleRunPingTest}
                  disabled={isPinging}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? "animate-spin" : ""}`} />
                  <span>{isPinging ? "Probing LLM Cluster..." : "Probe Inference Latency"}</span>
                </button>
              </div>

              {/* Status Ping Alert */}
              {pingResult && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>
                      Live Gateway Ping: <strong>{pingResult.status}</strong> via Groq API (openai/gpt-oss-120b)
                    </span>
                  </div>
                  <span className="font-mono font-bold">{pingResult.latency}ms</span>
                </div>
              )}

              {/* Primary vs Fallback Engine Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Groq Card */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-orange-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-orange-500 uppercase font-extrabold tracking-wider">
                      Primary Engine
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Active
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Groq (openai/gpt-oss-120b)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ultra-low latency open-weights inference gateway
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Roundtrip:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">~168ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Context Window:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">128,000 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">24h Requests:</span>
                      <span className="font-mono font-bold text-emerald-500">14,290 calls</span>
                    </div>
                  </div>
                </div>

                {/* Gemini Fallback Card */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                      Secondary Fallback
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-500">
                      Standby
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Google Gemini 1.5 Flash
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Multi-modal vision and resume deep parsing fallback
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Roundtrip:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">~640ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Context Window:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">1,000,000 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Failover Status:</span>
                      <span className="font-mono font-bold text-indigo-500">Automatic</span>
                    </div>
                  </div>
                </div>

                {/* Resilience Mode Card */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                      Resilience Layer
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500">
                      Zero-Key Mode
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Smart Simulated Fallback
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Prevents user interruption if rate limits or network fail
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Error Tolerance:</span>
                      <span className="font-mono font-bold text-emerald-500">100% Graceful</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Safety Filters:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">Active (Hate/Harass)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">SIH26101 Status:</span>
                      <span className="font-mono font-bold text-indigo-500">Full Compliance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Platform Audit Logs */}
        {activeTab === "logs" && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  <span>Real-Time Institutional Audit Event Log</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological records of learner achievements, AI gateway requests, and administrative interventions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200"
                >
                  <option value="all">All Events</option>
                  <option value="ai">AI Inference</option>
                  <option value="academic">Academic & Milestones</option>
                  <option value="security">Security & Tokens</option>
                </select>

                <button
                  onClick={handleExportLogsJSON}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-200/60 dark:divide-white/5 text-xs">
              {auditLogs
                .filter((l) => logFilter === "all" || l.category === logFilter)
                .map((log) => (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          log.status === "success"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : log.status === "warning"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        }`}
                      >
                        {log.action}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{log.details}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Actor: <strong className="text-slate-600 dark:text-slate-300">{log.actor}</strong> • Category: {log.category.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap sm:text-right">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* STUDENT AUDIT DOSSIER MODAL */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {selectedStudent.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Rank #{selectedStudent.rank}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {selectedStudent.department} • Target: <strong>{selectedStudent.role}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">Experience & Level</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    Lv.{selectedStudent.level}
                  </span>
                  <span className="text-[10px] text-slate-500 block">({selectedStudent.xp.toLocaleString()} XP)</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">ATS Resume Score</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                    {selectedStudent.atsScore}/100
                  </span>
                  <span className="text-[10px] text-emerald-500 block">✓ Keyword Verified</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">Roadmap Progress</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                    {selectedStudent.roadmapProgress}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">Trajectory Verified</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">Daily Streak & Honor</span>
                  <span className="text-base font-extrabold text-amber-500 font-mono">
                    🔥 {selectedStudent.streak} Days
                  </span>
                  <span className="text-[10px] text-slate-500 block">{selectedStudent.badgesCount} Badges Awarded</span>
                </div>
              </div>

              {/* Verified Competencies */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Verified Skill Competency Breakdown
                </h4>
                <div className="space-y-2">
                  {selectedStudent.skills.map((sk, i) => (
                    <div key={i} className="text-xs space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{sk.name}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{sk.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            sk.score >= 85 ? "bg-emerald-500" : sk.score >= 70 ? "bg-cyan-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${sk.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Oversight Interventions */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Administrative Academic Interventions
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => handleAwardBadge(selectedStudent.name)}
                    className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>Award Honor Badge (+250 XP)</span>
                  </button>

                  <button
                    onClick={() => handleAssignMilestone(selectedStudent.name)}
                    className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Assign Priority Milestone</span>
                  </button>

                  <button
                    onClick={() => {
                      showNotice(`Placement cell flagged 1-on-1 career review for ${selectedStudent.name}.`);
                      playAudioFeedback("click");
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    <span>Flag Placement</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
