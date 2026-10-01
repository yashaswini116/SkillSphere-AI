import {
  UserProfile,
  CareerPath,
  TechRadarItem,
  Roadmap,
  CodingProblem,
  QuizQuestion,
  LeaderboardUser,
  ProjectSpec,
  Badge,
} from "./types";

export const initialBadges: Badge[] = [
  {
    id: "badge-1",
    name: "First Leap",
    description: "Joined SkillSphere AI and set up target career trajectory.",
    icon: "🚀",
    category: "starter",
    unlockedAt: "2026-09-01T10:00:00Z",
  },
  {
    id: "badge-2",
    name: "Skill Scout",
    description: "Completed your first comprehensive AI Skill-Gap Analysis.",
    icon: "🎯",
    category: "skill",
    unlockedAt: "2026-09-02T14:30:00Z",
  },
  {
    id: "badge-3",
    name: "7-Day Streak Warrior",
    description: "Consistently logged in and practiced for 7 consecutive days.",
    icon: "🔥",
    category: "streak",
    unlockedAt: "2026-09-08T09:15:00Z",
  },
  {
    id: "badge-4",
    name: "ATS 90+ Master",
    description: "Optimized a resume to score 90% or higher ATS readiness.",
    icon: "📄",
    category: "portfolio",
    unlockedAt: "2026-09-12T16:45:00Z",
  },
  {
    id: "badge-5",
    name: "Algorithm Ace",
    description: "Solved 10 coding challenges with optimal time-complexity.",
    icon: "⚡",
    category: "quiz",
    unlockedAt: "2026-09-15T11:20:00Z",
  },
  {
    id: "badge-6",
    name: "Mock Interview Titan",
    description: "Completed an AI mock interview achieving STAR score > 85.",
    icon: "🎙️",
    category: "interview",
  },
  {
    id: "badge-7",
    name: "System Architect",
    description: "Generated and completed a full capstone architectural milestone.",
    icon: "🏛️",
    category: "portfolio",
  },
  {
    id: "badge-8",
    name: "RAG Scholar",
    description: "Queried over 50 complex PDF study topics with citation extraction.",
    icon: "📚",
    category: "skill",
  },
];

export const demoStudentUser: UserProfile = {
  uid: "demo-student-101",
  name: "Aarav Sharma",
  email: "aarav.student@skillsphere.ai",
  role: "student",
  headline: "Aspiring AI Full-Stack Engineer & Final-Year CS Undergrad",
  bio: "Passionate about generative AI agents, modern web architectures, and high-concurrency cloud distributed systems.",
  targetRole: "Full Stack AI Developer",
  currentSkills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Tailwind CSS",
    "Git",
    "Python",
    "SQL Basics",
  ],
  xp: 3850,
  level: 6,
  streakDays: 8,
  lastActiveDate: new Date().toISOString(),
  badges: initialBadges.slice(0, 5),
  completedRoadmapSteps: ["step-1", "step-2", "step-3", "step-4"],
  githubUrl: "https://github.com/aarav-sharma-ai",
  linkedinUrl: "https://linkedin.com/in/aarav-sharma-dev",
  portfolioSlug: "aarav-sharma",
  createdAt: "2026-08-15T00:00:00Z",
};

export const demoAdminUser: UserProfile = {
  uid: "demo-admin-999",
  name: "Dr. Elena Rostova",
  email: "admin@skillsphere.ai",
  role: "admin",
  headline: "Chief Academic Officer & Platform Administrator",
  bio: "Managing curriculum pipelines, SIH talent cohorts, and AI model performance standards.",
  targetRole: "System Administrator",
  currentSkills: ["Platform Analytics", "Curriculum Design", "AI Governance", "Security Audit"],
  xp: 15400,
  level: 25,
  streakDays: 42,
  lastActiveDate: new Date().toISOString(),
  badges: initialBadges,
  completedRoadmapSteps: [],
  createdAt: "2026-01-01T00:00:00Z",
};

export const careerPaths: CareerPath[] = [
  {
    id: "ai-fullstack",
    title: "Full Stack AI Developer",
    category: "AI & Software Engineering",
    description: "Bridges cutting-edge generative AI models (LLMs, RAG, agents) with responsive, production-ready full-stack web applications.",
    avgSalary: { inr: "₹18 - ₹36 LPA", usd: "$120,000 - $195,000/yr" },
    growthRate: "+38% YoY",
    demandLevel: "Very High",
    experienceLevels: ["Entry", "Mid", "Senior"],
    topSkills: ["TypeScript", "Next.js", "Python", "Vector Databases", "LangChain/Genkit", "Docker"],
    toolsAndFrameworks: ["Gemini API", "ChromaDB/Pinecone", "TailwindCSS", "FastAPI", "PostgreSQL", "Vercel"],
    dayInTheLife: [
      "Architecting low-latency RAG vector pipelines and token caching layers.",
      "Building reactive UI components with streaming responses and optimistic updates.",
      "Optimizing system prompts, guardrails, and context windows for cost & accuracy.",
      "Setting up end-to-end evaluation benchmarks for GenAI responses."
    ],
  },
  {
    id: "cloud-devops-sre",
    title: "Cloud & DevOps SRE Engineer",
    category: "Cloud & Infrastructure",
    description: "Specializes in automated CI/CD pipelines, container orchestration, multi-cloud reliability, and infrastructure as code.",
    avgSalary: { inr: "₹16 - ₹32 LPA", usd: "$125,000 - $185,000/yr" },
    growthRate: "+28% YoY",
    demandLevel: "Very High",
    experienceLevels: ["Entry", "Mid", "Senior"],
    topSkills: ["Kubernetes", "Terraform", "Docker", "AWS/GCP", "Linux", "CI/CD"],
    toolsAndFrameworks: ["GitHub Actions", "Prometheus/Grafana", "Helm", "ArgoCD", "Ansible"],
    dayInTheLife: [
      "Designing declarative Terraform modules for multi-region resilience.",
      "Troubleshooting Kubernetes cluster networking, ingress, and pod autoscaling.",
      "Maintaining 99.99% service availability with automated health alerts.",
      "Hardening zero-trust security postures and secret rotation workflows."
    ],
  },
  {
    id: "mlops-engineer",
    title: "MLOps & Data Platform Engineer",
    category: "Data & ML",
    description: "Deploys, monitors, and operationalizes machine learning pipelines, feature stores, and automated model retraining at scale.",
    avgSalary: { inr: "₹20 - ₹40 LPA", usd: "$135,000 - $210,000/yr" },
    growthRate: "+34% YoY",
    demandLevel: "High",
    experienceLevels: ["Mid", "Senior"],
    topSkills: ["Python", "PyTorch/TensorFlow", "MLflow", "Kafka", "Docker", "BigQuery"],
    toolsAndFrameworks: ["Kubeflow", "Triton Server", "Weights & Biases", "Airflow", "DVC"],
    dayInTheLife: [
      "Constructing automated continuous training and validation pipelines.",
      "Monitoring model drift, inference latency, and data distributions.",
      "Serving high-throughput models with Triton or vLLM container engines."
    ],
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity & AppSec Specialist",
    category: "Security",
    description: "Safeguards cloud architectures, detects intrusion vectors, and enforces secure code auditing against OWASP vulnerabilities.",
    avgSalary: { inr: "₹14 - ₹28 LPA", usd: "$110,000 - $170,000/yr" },
    growthRate: "+31% YoY",
    demandLevel: "Very High",
    experienceLevels: ["Entry", "Mid", "Senior"],
    topSkills: ["Threat Modeling", "SIEM", "Penetration Testing", "Network Security", "Cryptography", "Python"],
    toolsAndFrameworks: ["Wireshark", "Burp Suite", "Splunk", "Snort", "Metasploit", "SonarQube"],
    dayInTheLife: [
      "Running automated SAST/DAST vulnerability scans across code repositories.",
      "Conducting red-team security penetration exercises and incident root cause analysis.",
      "Implementing IAM role-based access control and Zero Trust compliance."
    ],
  },
  {
    id: "data-scientist-genai",
    title: "Data Scientist & AI Researcher",
    category: "AI & Research",
    description: "Extracts predictive insights from massive unstructured corpora and fine-tunes specialized domain models.",
    avgSalary: { inr: "₹17 - ₹35 LPA", usd: "$128,000 - $190,000/yr" },
    growthRate: "+26% YoY",
    demandLevel: "High",
    experienceLevels: ["Entry", "Mid", "Senior"],
    topSkills: ["Python", "Statistics", "SQL", "Pandas/NumPy", "Deep Learning", "Data Storytelling"],
    toolsAndFrameworks: ["Jupyter", "Scikit-Learn", "Hugging Face", "Tableau", "Databricks"],
    dayInTheLife: [
      "Developing statistical hypotheses and A/B test experiments.",
      "Fine-tuning open-weights models (Llama, Mistral) on enterprise data.",
      "Presenting actionable ROI insights to executive and product stakeholders."
    ],
  },
];

export const techRadarItems: TechRadarItem[] = [
  {
    id: "tr-1",
    name: "Next.js 15 & React 19",
    category: "Languages & Frameworks",
    ring: "Adopt",
    description: "Industry benchmark for production SSR, server actions, and streaming web experiences.",
    popularityScore: 98,
    trendingDirection: "up",
  },
  {
    id: "tr-2",
    name: "Vector Databases (Chroma/Pinecone/pgvector)",
    category: "Data & Storage",
    ring: "Adopt",
    description: "Essential foundation for high-precision semantic search and RAG knowledge retrieval.",
    popularityScore: 95,
    trendingDirection: "up",
  },
  {
    id: "tr-3",
    name: "Google Gemini 1.5/2.0 & Genkit",
    category: "AI & ML",
    ring: "Adopt",
    description: "Massive 2M token context window and multimodal capabilities powering next-gen agents.",
    popularityScore: 96,
    trendingDirection: "up",
  },
  {
    id: "tr-4",
    name: "Kubernetes & ArgoCD",
    category: "Cloud & DevOps",
    ring: "Adopt",
    description: "Standard declarative platform for container fleet orchestration and GitOps delivery.",
    popularityScore: 92,
    trendingDirection: "stable",
  },
  {
    id: "tr-5",
    name: "Rust for WebAssembly / Systems",
    category: "Languages & Frameworks",
    ring: "Trial",
    description: "Memory-safe, blazingly fast language rapidly adopted for high-performance tooling.",
    popularityScore: 88,
    trendingDirection: "up",
  },
  {
    id: "tr-6",
    name: "Small Language Models (SLMs / On-Device)",
    category: "AI & ML",
    ring: "Trial",
    description: "High efficiency, low latency models (Gemma 2, Phi-3) executing on edge devices.",
    popularityScore: 86,
    trendingDirection: "up",
  },
  {
    id: "tr-7",
    name: "Autonomous Agent Swarms",
    category: "AI & ML",
    ring: "Assess",
    description: "Multi-agent collaborative loops for complex multi-turn asynchronous workflows.",
    popularityScore: 78,
    trendingDirection: "up",
  },
  {
    id: "tr-8",
    name: "Monolithic Legacy VM Deployments",
    category: "Cloud & DevOps",
    ring: "Hold",
    description: "Phasing out in favor of serverless containers and distributed edge architectures.",
    popularityScore: 35,
    trendingDirection: "down",
  },
];

export const sampleRoadmap: Roadmap = {
  id: "roadmap-ai-fullstack",
  title: "Full Stack AI Developer Mastery",
  targetRole: "Full Stack AI Developer",
  totalHours: 140,
  steps: [
    {
      id: "step-1",
      phase: 1,
      phaseName: "Foundations & Modern TypeScript",
      title: "Deep TypeScript & React Architecture",
      description: "Master advanced TypeScript generics, union types, React hooks, state management, and modern component lifecycle.",
      estimatedHours: 20,
      status: "completed",
      xpReward: 150,
      resources: [
        { title: "TypeScript Handbook (Official)", url: "https://www.typescriptlang.org/docs/", type: "documentation" },
        { title: "Full-Stack React & Next.js Core", url: "https://nextjs.org/learn", type: "course" },
      ],
    },
    {
      id: "step-2",
      phase: 1,
      phaseName: "Foundations & Modern TypeScript",
      title: "Backend Services & PostgreSQL",
      description: "Build robust REST & GraphQL APIs using Node.js/Next.js route handlers, Prisma ORM, and relational database indexing.",
      estimatedHours: 25,
      status: "completed",
      xpReward: 200,
      resources: [
        { title: "Prisma & PostgreSQL Guide", url: "https://www.prisma.io/docs", type: "documentation" },
        { title: "Database Indexing & Query Tuning", url: "https://use-the-index-luke.com/", type: "documentation" },
      ],
    },
    {
      id: "step-3",
      phase: 2,
      phaseName: "Generative AI & LLM Integration",
      title: "Prompt Engineering & Gemini API",
      description: "Harness Google Gemini API for structured JSON outputs, streaming tokens, multi-modal vision inputs, and error fallbacks.",
      estimatedHours: 20,
      status: "completed",
      xpReward: 250,
      resources: [
        { title: "Google AI for Developers", url: "https://ai.google.dev/docs", type: "documentation" },
        { title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", type: "course" },
      ],
    },
    {
      id: "step-4",
      phase: 2,
      phaseName: "Generative AI & LLM Integration",
      title: "RAG & Vector Embeddings Architecture",
      description: "Implement document chunking, semantic similarity vector search, embedding models, and contextual re-ranking.",
      estimatedHours: 30,
      status: "completed",
      xpReward: 300,
      resources: [
        { title: "Pinecone / Vector Search Handbook", url: "https://www.pinecone.io/learn/", type: "documentation" },
        { title: "LangChain & Genkit Framework", url: "https://firebase.google.com/docs/genkit", type: "documentation" },
      ],
    },
    {
      id: "step-5",
      phase: 3,
      phaseName: "Production Engineering & Scale",
      title: "Autonomous Agents & Tool Calling",
      description: "Build autonomous multi-step agents that call custom external APIs, run calculators, search databases, and self-correct.",
      estimatedHours: 25,
      status: "available",
      xpReward: 350,
      resources: [
        { title: "Function Calling with Gemini", url: "https://ai.google.dev/gemini-api/docs/function-calling", type: "documentation" },
        { title: "Autonomous Agent Patterns", url: "https://lilianweng.github.io/posts/2023-06-23-agent/", type: "documentation" },
      ],
    },
    {
      id: "step-6",
      phase: 4,
      phaseName: "Capstone & Career Launch",
      title: "Full-Scale Capstone: Enterprise AI Learning OS",
      description: "Deploy an end-to-end production application on Vercel/Firebase with CI/CD, rate limits, caching, and analytics.",
      estimatedHours: 20,
      status: "available",
      xpReward: 500,
      resources: [
        { title: "Production Next.js Checklist", url: "https://nextjs.org/docs/app/building-your-application/deploying", type: "documentation" },
        { title: "Firebase Deployment Best Practices", url: "https://firebase.google.com/docs/hosting", type: "documentation" },
      ],
    },
  ],
};

export const sampleCodingProblems: CodingProblem[] = [
  {
    id: "prob-1",
    title: "1. Two Sum (Target Pair Locator)",
    difficulty: "Easy",
    category: "Arrays & Hash Maps",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution.",
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    },
    solutionCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement)!, i];
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        if target - num in hashmap:
            return [hashmap[target - num], i]
        hashmap[num] = i
    return []`,
    },
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expected: "[0, 1]" },
      { input: "nums = [3,2,4], target = 6", expected: "[1, 2]" },
      { input: "nums = [3,3], target = 6", expected: "[0, 1]" },
    ],
    hints: [
      "Level 1: Can you solve it in a single pass without using an O(n²) nested loop?",
      "Level 2: Use a Hash Map to store numbers you've already visited along with their array index.",
      "Level 3: For each element `x`, check if `target - x` is already present in your map.",
    ],
    aiComplexityExplanation: "Optimal Time Complexity: O(n) because we traverse the list containing n elements only once and hash map lookups take O(1) average time. Space Complexity: O(n) for the hash map storage.",
  },
  {
    id: "prob-2",
    title: "2. Valid Parentheses & Bracket Matching",
    difficulty: "Easy",
    category: "Stacks & String Parsing",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Brackets must close in the correct order.",
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    lookup = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in lookup:
            if not stack or stack.pop() != lookup[char]:
                return False
        else:
            stack.append(char)
    return len(stack) == 0`,
    },
    solutionCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
        else:
            stack.append(char)
    return not stack`,
    },
    testCases: [
      { input: 's = "()"', expected: "true" },
      { input: 's = "()[]{}"', expected: "true" },
      { input: 's = "(]"', expected: "false" },
    ],
    hints: [
      "Level 1: Consider what data structure naturally follows Last-In-First-Out (LIFO) behavior.",
      "Level 2: Push opening brackets onto a Stack. When a closing bracket arrives, verify if the top of the stack matches.",
      "Level 3: Remember to check if the stack is completely empty after iterating through the entire string.",
    ],
    aiComplexityExplanation: "Optimal Time Complexity: O(n) single pass over length n. Space Complexity: O(n) worst case if string contains all opening brackets.",
  },
  {
    id: "prob-3",
    title: "3. LRU Cache (Least Recently Used)",
    difficulty: "Medium",
    category: "Design & Data Structures",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement `get(key)` and `put(key, value)` with O(1) average time complexity for both operations.",
    starterCode: {
      javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}`,
      typescript: `class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value!;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}`,
      python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        elif len(self.cache) >= self.capacity:
            self.cache.popitem(last=False)
        self.cache[key] = value`,
    },
    solutionCode: {
      javascript: `// In JavaScript, standard Map maintains insertion order, enabling O(1) LRU
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const v = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, v);
    return v;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}`,
      typescript: `class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key: number, value: number): void {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value!);
    }
    this.cache.set(key, value);
  }
}`,
      python: `from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()
    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    def put(self, key: int, value: int) -> None:
        if key in self.cache: self.cache.move_to_end(key)
        elif len(self.cache) >= self.capacity: self.cache.popitem(last=False)
        self.cache[key] = value`,
    },
    testCases: [
      { input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', expected: "[null, null, null, 1, null, -1, null, -1, 3, 4]" },
    ],
    hints: [
      "Level 1: How can you combine a Hash Map (for fast key lookup) with a Doubly Linked List (for fast ordering manipulation)?",
      "Level 2: Every time an item is accessed via get or updated via put, move it to the head/most-recent position.",
      "Level 3: When capacity is exceeded, evict from the tail/least-recently-used node.",
    ],
    aiComplexityExplanation: "Time Complexity: O(1) for both get and put operations. Space Complexity: O(capacity) to store maximum key-value pairs.",
  },
];

export const sampleQuizQuestions: Record<string, QuizQuestion[]> = {
  "Full Stack AI & React": [
    {
      id: "q-1",
      topic: "React & Next.js",
      difficulty: "intermediate",
      question: "In Next.js 15 App Router, what is the primary benefit of React Server Components (RSC) over standard client components?",
      options: [
        "They execute animations faster on the browser thread",
        "They run on the server, sending zero JavaScript bundle weight to the client for dependencies",
        "They automatically replace CSS modules with Tailwind styles",
        "They prevent any database queries from running concurrently",
      ],
      correctIndex: 1,
      explanation: "RSCs execute solely on the server. Their code and package dependencies (like heavy markdown or date parsers) never get added to client JS bundles, drastically boosting initial page load speeds.",
    },
    {
      id: "q-2",
      topic: "Generative AI & RAG",
      difficulty: "intermediate",
      question: "In Retrieval-Augmented Generation (RAG), what is the primary purpose of semantic chunking?",
      options: [
        "To compress PDF file sizes on cloud storage",
        "To split source documents into meaningful conceptual segments that preserve context when calculating vector embeddings",
        "To encrypt text chunks before sending to the GPU",
        "To speed up CSS rendering in the browser",
      ],
      correctIndex: 1,
      explanation: "Semantic chunking breaks long documents into coherent paragraphs or topical sections rather than arbitrary character cuts, ensuring vector embeddings accurately represent complete ideas.",
    },
    {
      id: "q-3",
      topic: "System Design",
      difficulty: "advanced",
      question: "When designing a low-latency LLM streaming response architecture, which protocol is preferred over traditional HTTP polling?",
      options: [
        "Server-Sent Events (SSE) or WebSockets",
        "FTP file chunk download",
        "Synchronous JSON POST request with 60s timeout",
        "SOAP XML envelope transfer",
      ],
      correctIndex: 0,
      explanation: "Server-Sent Events (SSE) provide lightweight, unidirectional text streaming directly over HTTP, allowing LLM tokens to appear character-by-character on the user's screen with minimal overhead.",
    },
    {
      id: "q-4",
      topic: "Vector Databases",
      difficulty: "intermediate",
      question: "Which metric is most commonly used to measure semantic similarity between two high-dimensional text embeddings?",
      options: [
        "Cosine Similarity / Dot Product",
        "Hamming Distance on ASCII bytes",
        "Levenshtein Edit Distance",
        "SHA-256 collision index",
      ],
      correctIndex: 0,
      explanation: "Cosine similarity measures the angle between two normalized high-dimensional vectors, evaluating semantic orientation regardless of document length.",
    },
  ],
  "System Architecture": [
    {
      id: "q-5",
      topic: "Cloud Architecture",
      difficulty: "intermediate",
      question: "What is the primary role of a Reverse Proxy (such as NGINX or Cloudflare) in modern microservices?",
      options: [
        "Directly compile backend TypeScript code",
        "Handle SSL termination, DDoS mitigation, caching, and load balancing across origin servers",
        "Store persistent user sessions on relational disk drives",
        "Execute React Server Actions inside the Linux kernel",
      ],
      correctIndex: 1,
      explanation: "A reverse proxy acts as the frontline gatekeeper: terminating TLS/SSL certificates, distributing incoming traffic across healthy backend replicas, and absorbing malicious DDoS spikes.",
    },
  ],
};

export const sampleLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Priya Sundaram", role: "AI Systems Engineer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", xp: 14200, level: 23, streak: 34, badgesCount: 16 },
  { rank: 2, name: "Marcus Vance", role: "Full Stack AI Developer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", xp: 12850, level: 21, streak: 28, badgesCount: 14 },
  { rank: 3, name: "Aarav Sharma", role: "Full Stack AI Developer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", xp: 3850, level: 6, streak: 8, badgesCount: 5 },
  { rank: 4, name: "Kavya Patel", role: "Cloud SRE Specialist", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", xp: 3400, level: 5, streak: 6, badgesCount: 4 },
  { rank: 5, name: "David Kim", role: "Data Platform Architect", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80", xp: 2950, level: 4, streak: 4, badgesCount: 3 },
];

export const sampleProjectSpecs: ProjectSpec[] = [
  {
    id: "proj-1",
    title: "NeuroPulse: Enterprise Multi-Modal Agentic Knowledge Engine",
    tagline: "High-concurrency document intelligence platform with vector hybrid search and autonomous tool calling.",
    targetRole: "Full Stack AI Developer",
    difficulty: "Advanced",
    estimatedWeeks: 4,
    techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Gemini 1.5 Pro", "Pinecone/ChromaDB", "FastAPI", "Docker"],
    architectureOverview: "Dual-tier architecture separating high-speed user interface streaming from an asynchronous Python agent queue processing multi-gigabyte PDF archives.",
    coreFeatures: [
      "Semantic hybrid vector + BM25 keyword retrieval",
      "Dynamic prompt routing and autonomous hallucination detection",
      "Multi-tenant Firebase authentication with role-based RBAC",
      "Real-time token usage telemetry and cost forecasting graph",
    ],
    stepByStepMilestones: [
      {
        phase: "Phase 1: Ingestion & Vector Pipeline",
        tasks: [
          "Implement chunking strategies using recursive character and semantic headers.",
          "Generate text-embedding-004 vectors and index into namespace partitions.",
        ],
      },
      {
        phase: "Phase 2: Agent Orchestration & Tool Calling",
        tasks: [
          "Connect Gemini function calling for SQL queries and live web search.",
          "Implement streaming Server-Sent Events (SSE) to Next.js client.",
        ],
      },
      {
        phase: "Phase 3: Production Hardening & CI/CD",
        tasks: [
          "Containerize microservices with Docker Compose.",
          "Configure GitHub Actions workflow for zero-downtime deployment.",
        ],
      },
    ],
  },
  {
    id: "proj-2",
    title: "CloudGuardian: Automated Zero-Trust SRE Compliance Scanner",
    tagline: "Proactive infrastructure scanner detecting IAM misconfigurations, unencrypted buckets, and runaway cloud costs.",
    targetRole: "Cloud & DevOps SRE Engineer",
    difficulty: "Intermediate",
    estimatedWeeks: 3,
    techStack: ["Terraform", "Go / Python", "AWS SDK", "Docker", "Prometheus", "Next.js Dashboard"],
    architectureOverview: "Event-driven architecture leveraging cloud audit logs and serverless lambdas to trigger instant compliance checks.",
    coreFeatures: [
      "Automated CIS Benchmark compliance scoring",
      "Auto-remediation webhooks for publicly open S3/GCS buckets",
      "Slack / Discord alerts with instant triage buttons",
    ],
    stepByStepMilestones: [
      {
        phase: "Phase 1: Cloud Audit Ingestion",
        tasks: ["Set up event bridges to capture resource creation events."],
      },
      {
        phase: "Phase 2: Policy Engine",
        tasks: ["Write OPA (Open Policy Agent) rules for resource tagging and IAM roles."],
      },
    ],
  },
];
