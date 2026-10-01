export type UserRole = "student" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  targetRole: string;
  currentSkills: string[];
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  badges: Badge[];
  completedRoadmapSteps: string[];
  geminiApiKey?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioSlug?: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: "starter" | "skill" | "quiz" | "interview" | "portfolio" | "streak";
}

export interface SkillGapAnalysis {
  targetRole: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: {
    skill: string;
    priority: "critical" | "high" | "medium" | "low";
    estimatedHours: number;
    recommendedResource: string;
  }[];
  redundantSkills: string[];
  summary: string;
  learningPathRecommendation: string[];
  marketDemandRating: number; // 1-10
  isDemo?: boolean;
}

export interface CareerPath {
  id: string;
  title: string;
  category: string;
  description: string;
  avgSalary: {
    inr: string;
    usd: string;
  };
  growthRate: string;
  demandLevel: "Very High" | "High" | "Medium";
  experienceLevels: ("Entry" | "Mid" | "Senior")[];
  topSkills: string[];
  toolsAndFrameworks: string[];
  dayInTheLife: string[];
}

export interface TechRadarItem {
  id: string;
  name: string;
  category: "Languages & Frameworks" | "AI & ML" | "Cloud & DevOps" | "Data & Storage";
  ring: "Adopt" | "Trial" | "Assess" | "Hold";
  description: string;
  popularityScore: number;
  trendingDirection: "up" | "stable" | "down";
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  phase: number;
  phaseName: string;
  status: "locked" | "available" | "completed";
  resources: {
    title: string;
    url: string;
    type: "documentation" | "video" | "project" | "course";
  }[];
  xpReward: number;
}

export interface Roadmap {
  id: string;
  title: string;
  targetRole: string;
  totalHours: number;
  steps: RoadmapStep[];
  isDemo?: boolean;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  roleFitPercentage: number;
  atsReadabilityScore: number;
  executiveSummary: string;
  detectedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  bulletPointRewrites: {
    original: string;
    enhanced: string;
    reasoning: string;
  }[];
  sectionsEvaluation: {
    name: string;
    score: number;
    feedback: string;
  }[];
  isDemo?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
}

export interface QuizSession {
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
  isDemo?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
  };
  solutionCode: {
    javascript: string;
    typescript: string;
    python: string;
  };
  testCases: {
    input: string;
    expected: string;
  }[];
  hints: string[];
  aiComplexityExplanation: string;
}

export interface MockInterviewMessage {
  id: string;
  sender: "interviewer" | "candidate";
  text: string;
  timestamp: string;
  feedback?: string;
}

export interface MockInterviewEvaluation {
  overallRating: number; // 0-100
  starAdherenceScore: number; // 0-100
  technicalAccuracyScore: number; // 0-100
  communicationScore: number; // 0-100
  confidenceScore: number; // 0-100
  summary: string;
  strengths: string[];
  weaknesses: string[];
  actionableTips: string[];
  isDemo?: boolean;
}

export interface ProjectSpec {
  id: string;
  title: string;
  tagline: string;
  targetRole: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedWeeks: number;
  techStack: string[];
  architectureOverview: string;
  coreFeatures: string[];
  stepByStepMilestones: {
    phase: string;
    tasks: string[];
  }[];
  isDemo?: boolean;
}

export interface UserPortfolio {
  username: string;
  fullName: string;
  headline: string;
  about: string;
  targetRole: string;
  skills: { name: string; level: number }[];
  featuredProjects: {
    title: string;
    description: string;
    tags: string[];
    liveDemoUrl?: string;
    repoUrl?: string;
  }[];
  certificationsAndBadges: string[];
  contactEmail: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  role: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  badgesCount: number;
}
