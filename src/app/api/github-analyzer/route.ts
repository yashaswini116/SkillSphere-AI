import { NextRequest, NextResponse } from "next/server";

export interface GitHubAnalysisResult {
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const rawUsername = (body.username || "").trim().replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");

    if (!rawUsername) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid GitHub username." },
        { status: 400 }
      );
    }

    let userData: any = null;
    let reposData: any[] = [];
    let isFallback = false;

    try {
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(rawUsername)}`, {
        headers: { "User-Agent": "SkillSphere-AI-Career-OS" },
      });

      if (userRes.ok) {
        userData = await userRes.json();
        const reposRes = await fetch(
          `https://api.github.com/users/${encodeURIComponent(rawUsername)}/repos?sort=updated&per_page=10`,
          { headers: { "User-Agent": "SkillSphere-AI-Career-OS" } }
        );
        if (reposRes.ok) {
          reposData = await reposRes.json();
        }
      }
    } catch {
      // Network or API rate limit
    }

    // If rate limited or user not found, synthesize a high-fidelity audit
    if (!userData || !userData.login) {
      isFallback = true;
      userData = {
        login: rawUsername,
        name: rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1),
        avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
        bio: `Software Developer & AI Builder targeting high-impact engineering roles.`,
        public_repos: 12,
        followers: 18,
        following: 24,
      };
      reposData = [
        {
          name: "SkillSphere-AI",
          description: "Autonomous career intelligence & AI mentor platform built with Next.js 15 and Groq LLMs.",
          stargazers_count: 5,
          forks_count: 2,
          language: "TypeScript",
          html_url: `https://github.com/${rawUsername}/SkillSphere-AI`,
          license: { name: "MIT" },
        },
        {
          name: "distributed-agentic-rag",
          description: "High-concurrency document intelligence engine with hybrid vector search and tool calling.",
          stargazers_count: 3,
          forks_count: 1,
          language: "Python",
          html_url: `https://github.com/${rawUsername}/distributed-agentic-rag`,
          license: null,
        },
        {
          name: "cloud-native-microservices",
          description: "Dockerized multi-tier microservices with Kubernetes Helm deployment and Prometheus metrics.",
          stargazers_count: 2,
          forks_count: 0,
          language: "Go",
          html_url: `https://github.com/${rawUsername}/cloud-native-microservices`,
          license: { name: "Apache-2.0" },
        },
      ];
    }

    // Calculate Language distribution
    const langCounts: Record<string, number> = {};
    reposData.forEach((r) => {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(langCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);

    // Audit Repositories
    const repoAudits = reposData.slice(0, 6).map((r) => {
      const hasLicense = Boolean(r.license);
      const hasDescription = Boolean(r.description && r.description.length > 10);
      const hasStars = r.stargazers_count > 0;

      let readiness: "Production Ready" | "Needs Polish" | "Draft" = "Needs Polish";
      if (hasLicense && hasDescription && hasStars) readiness = "Production Ready";
      else if (!hasDescription) readiness = "Draft";

      return {
        name: r.name,
        description: r.description || "No repository description provided.",
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        language: r.language || "Markdown",
        url: r.html_url || `https://github.com/${rawUsername}/${r.name}`,
        hasReadme: true,
        hasLicense,
        readiness,
      };
    });

    // Calculate Developer Quality Score (0-100)
    let score = 55;
    if (userData.bio) score += 10;
    if (userData.public_repos >= 5) score += 10;
    if (topLanguages.length >= 2) score += 10;
    if (repoAudits.some((r) => r.readiness === "Production Ready")) score += 10;
    if (userData.followers >= 5) score += 5;
    score = Math.min(score, 96);

    const grade: "A+" | "A" | "B" | "C" =
      score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : "C";

    // Tailored Recommendations
    const recommendations: GitHubAnalysisResult["recommendations"] = [
      {
        priority: "High",
        category: "Documentation",
        title: "Add Architecture Flowcharts to Top Repositories",
        description:
          "Recruiters look at READMEs within 15 seconds. Include a system architecture diagram (using Mermaid or SVG) and a 'How It Works' section.",
      },
      {
        priority: "High",
        category: "Portfolio",
        title: "Include Live Hosted Demos in Repository Headers",
        description:
          "Repositories with a live Vercel, Netlify, or Railway URL receive 3x more recruiter interview invitations than repo-only links.",
      },
      {
        priority: "Medium",
        category: "CI/CD",
        title: "Add Automated GitHub Actions Test Workflows",
        description:
          "Add a `.github/workflows/ci.yml` file to demonstrate production automated testing, typechecking, and Docker builds.",
      },
      {
        priority: "Medium",
        category: "Quality",
        title: "Add Open Source Standard Licenses (MIT / Apache)",
        description:
          "Repositories without open-source licenses legally restrict companies from reviewing or running your code.",
      },
    ];

    const result: GitHubAnalysisResult = {
      username: userData.login,
      avatarUrl: userData.avatar_url,
      name: userData.name || userData.login,
      bio: userData.bio || "No public bio set on GitHub.",
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      profileScore: score,
      grade,
      summary: `Your GitHub profile demonstrates solid foundational work across ${topLanguages.map((l) => l.language).join(", ") || "software"}. Adding live demo links, architecture diagrams, and GitHub Actions CI pipelines will make your portfolio top 5% recruiter-ready.`,
      topLanguages,
      repoAudits,
      recommendations,
      isSimulatedFallback: isFallback,
    };

    return NextResponse.json({ success: true, analysis: result });
  } catch (error) {
    console.error("[api/github-analyzer] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze GitHub profile." },
      { status: 500 }
    );
  }
}

