import {
  SkillGapAnalysis,
  Roadmap,
  ResumeAnalysisResult,
  QuizSession,
  MockInterviewEvaluation,
  ProjectSpec,
} from "./types";
import { sampleRoadmap, sampleProjectSpecs } from "./mockData";

export interface AIResponse<T> {
  data: T;
  isDemo: boolean;
  modelUsed: string;
}

// Helper to get active Gemini API key from localStorage or env
export const getGeminiApiKey = (): string | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("skillsphere_gemini_key");
    if (stored && stored.trim().length > 5) return stored.trim();
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
};

// Check if live AI is configured
export const isLiveAIConfigured = (): boolean => {
  const key = getGeminiApiKey();
  return Boolean(key && key.startsWith("AIza"));
};

// Generic call to Gemini REST API (v1beta)
async function callGeminiRest(prompt: string, customKey?: string, systemInstruction?: string): Promise<string | null> {
  const key = customKey || getGeminiApiKey();
  if (!key) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: (systemInstruction ? systemInstruction + "\n\n" : "") + prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      console.warn("Gemini API call returned non-200:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.warn("Failed to query Gemini API:", err);
    return null;
  }
}

// 1. AI Skill Gap Analyzer
export async function analyzeSkillGapAI(
  targetRole: string,
  currentSkills: string[],
  customKey?: string
): Promise<AIResponse<SkillGapAnalysis>> {
  const systemInstruction = `You are the SkillSphere Career AI Engine. Analyze the user's current skills against their target role. Return purely a valid JSON object matching the format:
{
  "targetRole": string,
  "matchScore": number (0-100),
  "matchedSkills": string[],
  "missingSkills": [
    { "skill": string, "priority": "critical" | "high" | "medium" | "low", "estimatedHours": number, "recommendedResource": string }
  ],
  "redundantSkills": string[],
  "summary": string,
  "learningPathRecommendation": string[],
  "marketDemandRating": number (1-10)
}
Do NOT enclose in markdown code fences if possible, or return raw JSON.`;

  const prompt = `Target Role: "${targetRole}". Current Skills: [${currentSkills.join(", ")}]. Provide a realistic, industry-standard skill gap analysis.`;
  const rawText = await callGeminiRest(prompt, customKey, systemInstruction);

  if (rawText) {
    try {
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned) as SkillGapAnalysis;
      return {
        data: { ...parsed, isDemo: false },
        isDemo: false,
        modelUsed: "Gemini 1.5 Flash (Live API)",
      };
    } catch {
      // Fallback on parse failure
    }
  }

  // Realistic Demo Fallback
  const lowerRole = targetRole.toLowerCase();
  let missing: SkillGapAnalysis["missingSkills"] = [
    { skill: "Vector Databases & RAG Architecture", priority: "critical", estimatedHours: 35, recommendedResource: "Pinecone Vector Handbook & LangChain Docs" },
    { skill: "Docker & Container Fleet Orchestration", priority: "high", estimatedHours: 25, recommendedResource: "Docker Deep Dive by Nigel Poulton" },
    { skill: "Next.js 15 Server Actions & Streaming", priority: "high", estimatedHours: 20, recommendedResource: "Official Next.js Learn Portal" },
    { skill: "CI/CD Pipeline Automation", priority: "medium", estimatedHours: 15, recommendedResource: "GitHub Actions for Modern Webapps" },
  ];

  if (lowerRole.includes("cloud") || lowerRole.includes("devops")) {
    missing = [
      { skill: "Kubernetes Cluster Administration (CKA)", priority: "critical", estimatedHours: 45, recommendedResource: "Mumshad Mannambeth CKA Course" },
      { skill: "Terraform Infrastructure as Code", priority: "critical", estimatedHours: 30, recommendedResource: "HashiCorp Terraform Associate Guide" },
      { skill: "Prometheus & Grafana Observability", priority: "high", estimatedHours: 20, recommendedResource: "Monitoring Microservices on K8s" },
      { skill: "Linux Kernel Security & eBPF", priority: "medium", estimatedHours: 25, recommendedResource: "Brendan Gregg Systems Performance" },
    ];
  }

  const matched = currentSkills.filter(s =>
    ["React", "TypeScript", "JavaScript", "Python", "Node.js", "Git", "SQL Basics", "Docker"].includes(s)
  );

  const fallbackData: SkillGapAnalysis = {
    targetRole,
    matchScore: Math.min(88, Math.max(45, Math.round((matched.length / (matched.length + missing.length)) * 100))),
    matchedSkills: matched.length > 0 ? matched : ["Fundamental Problem Solving", "Git Version Control"],
    missingSkills: missing,
    redundantSkills: ["Legacy jQuery", "Vanilla PHP 5", "Flash"].filter(s => currentSkills.includes(s)),
    summary: `You possess strong foundations in modern web technologies. However, transitioning into a production-level ${targetRole} requires mastering containerization, cloud telemetry, and distributed retrieval architectures.`,
    learningPathRecommendation: [
      "Dedicate 4-5 hours weekly to containerization and Dockerfile optimization.",
      "Build a functioning RAG project integrating vector similarity search.",
      "Harden TypeScript type safety and configure automated GitHub CI/CD tests.",
    ],
    marketDemandRating: 9,
    isDemo: true,
  };

  return {
    data: fallbackData,
    isDemo: true,
    modelUsed: "SkillSphere Realistic Demo Engine",
  };
}

// 2. AI Resume ATS Analyzer
export async function analyzeResumeAI(
  resumeText: string,
  targetJobDescription?: string,
  customKey?: string
): Promise<AIResponse<ResumeAnalysisResult>> {
  const systemInstruction = `You are a Tier-1 Tech Recruiter and ATS Parsing Engine. Analyze the provided resume against modern technical standards. Return purely a valid JSON object matching the format:
{
  "overallScore": number (0-100),
  "roleFitPercentage": number (0-100),
  "atsReadabilityScore": number (0-100),
  "executiveSummary": string,
  "detectedSkills": string[],
  "missingKeywords": string[],
  "strengths": string[],
  "improvements": string[],
  "bulletPointRewrites": [
    { "original": string, "enhanced": string, "reasoning": string }
  ],
  "sectionsEvaluation": [
    { "name": string, "score": number, "feedback": string }
  ]
}
Return raw JSON only.`;

  const prompt = `Resume Content:
${resumeText.slice(0, 3000)}

Target Job Context:
${targetJobDescription ? targetJobDescription.slice(0, 1000) : "Senior Full Stack AI Engineer at high-growth tech startup"}`;

  const rawText = await callGeminiRest(prompt, customKey, systemInstruction);

  if (rawText) {
    try {
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned) as ResumeAnalysisResult;
      return {
        data: { ...parsed, isDemo: false },
        isDemo: false,
        modelUsed: "Gemini 1.5 Flash (Live API)",
      };
    } catch {
      // Fallback
    }
  }

  // Realistic fallback ATS analysis
  const fallback: ResumeAnalysisResult = {
    overallScore: 84,
    roleFitPercentage: 81,
    atsReadabilityScore: 92,
    executiveSummary:
      "Strong technical foundation with tangible project outcomes. ATS formatting is clean and parsable. To achieve top 5% candidate ranking, replace generic task descriptions with the Google XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]) and incorporate missing distributed systems keywords.",
    detectedSkills: ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "Git", "REST APIs"],
    missingKeywords: ["Vector Search", "CI/CD Pipeline", "Kubernetes", "Prometheus/Grafana", "Redis Caching", "Load Balancing"],
    strengths: [
      "Clear chronological hierarchy and legible section headings that parse without ATS truncation.",
      "Good balance between technical programming languages and frontend application frameworks.",
      "Demonstrated initiative in personal open-source projects.",
    ],
    improvements: [
      "Quantify impact with hard metrics (e.g. latency reduction %, throughput QPS, user retention rate).",
      "Include explicit test coverage and automated integration tooling.",
      "Streamline educational achievements to prioritize high-leverage production deliverables.",
    ],
    bulletPointRewrites: [
      {
        original: "Built a responsive web dashboard using React and Tailwind for tracking metrics.",
        enhanced: "Architected a responsive analytics dashboard in Next.js/Tailwind, reducing initial page render latency by 42% and supporting 10,000+ daily active users.",
        reasoning: "Introduced quantifiable performance gain (42%) and scale benchmark (10k DAU) using the Google XYZ formula.",
      },
      {
        original: "Worked on AI features and connected OpenAI APIs to our backend server.",
        enhanced: "Implemented an asynchronous GenAI inference pipeline with Redis token caching, lowering API costs by 35% and guaranteeing <800ms streaming responses.",
        reasoning: "Demonstrates cost awareness, latency metrics, and architectural caching maturity.",
      },
    ],
    sectionsEvaluation: [
      { name: "ATS Formatting & Structure", score: 94, feedback: "Standard single-column layout, standard fonts, easily parsed by Workday and Greenhouse." },
      { name: "Technical Skills Alignment", score: 82, feedback: "Strong core frontend/backend stack; needs cloud infrastructure keywords." },
      { name: "Impact & Quantifiable Metrics", score: 76, feedback: "Some bullets still read like job descriptions rather than business achievements." },
      { name: "Project Architecture Depth", score: 85, feedback: "Projects are impressive; highlight concurrency and deployment architecture." },
    ],
    isDemo: true,
  };

  return {
    data: fallback,
    isDemo: true,
    modelUsed: "SkillSphere Realistic Demo Engine",
  };
}

// 3. AI Roadmap Generator
export async function generateRoadmapAI(
  targetRole: string,
  timeframeWeeks: number = 12,
  customKey?: string
): Promise<AIResponse<Roadmap>> {
  const systemInstruction = `You are a Chief Learning Officer at Google. Generate a personalized, highly structured learning roadmap for an aspiring professional. Return purely a valid JSON object matching the format:
{
  "id": string,
  "title": string,
  "targetRole": string,
  "totalHours": number,
  "steps": [
    {
      "id": string,
      "phase": number,
      "phaseName": string,
      "title": string,
      "description": string,
      "estimatedHours": number,
      "status": "available" | "locked",
      "xpReward": number,
      "resources": [
        { "title": string, "url": string, "type": "documentation" | "video" | "project" | "course" }
      ]
    }
  ]
}
Return raw JSON only.`;

  const prompt = `Generate a ${timeframeWeeks}-week intensive roadmap for "${targetRole}". Include 5-6 detailed milestone steps spanning foundational concepts to real-world capstone projects.`;
  const rawText = await callGeminiRest(prompt, customKey, systemInstruction);

  if (rawText) {
    try {
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned) as Roadmap;
      return {
        data: { ...parsed, isDemo: false },
        isDemo: false,
        modelUsed: "Gemini 1.5 Flash (Live API)",
      };
    } catch {
      // Fallback
    }
  }

  return {
    data: { ...sampleRoadmap, targetRole, title: `${targetRole} Accelerator Roadmap`, isDemo: true },
    isDemo: true,
    modelUsed: "SkillSphere Realistic Demo Engine",
  };
}

// 4. AI Quiz / MCQ Generator
export async function generateQuizAI(
  topic: string,
  difficulty: "beginner" | "intermediate" | "advanced",
  customKey?: string
): Promise<AIResponse<QuizSession>> {
  const systemInstruction = `You are a Technical Interview Assessor. Generate 4 high-quality Multiple Choice Questions (MCQs) for the given topic and difficulty. Return purely a valid JSON object matching the format:
{
  "topic": string,
  "difficulty": string,
  "questions": [
    {
      "id": string,
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": number (0-3),
      "explanation": string,
      "difficulty": "beginner" | "intermediate" | "advanced",
      "topic": string
    }
  ]
}
Return raw JSON only.`;

  const prompt = `Topic: "${topic}", Difficulty: "${difficulty}". Provide 4 tricky, realistic conceptual questions test actual engineering capability.`;
  const rawText = await callGeminiRest(prompt, customKey, systemInstruction);

  if (rawText) {
    try {
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned) as QuizSession;
      return {
        data: { ...parsed, isDemo: false },
        isDemo: false,
        modelUsed: "Gemini 1.5 Flash (Live API)",
      };
    } catch {
      // Fallback
    }
  }

  // Fallback quiz bank
  const questions = [
    {
      id: "demo-q-1",
      question: `In production ${topic}, which strategy is most effective for mitigating cold-start latencies in serverless compute environments?`,
      options: [
        "Increasing the CSS bundle size to cache client scripts",
        "Configuring provisioned concurrency and keeping worker dependencies under 50MB",
        "Using synchronous multi-stage database locks",
        "Disabling all HTTP keep-alive header flags",
      ],
      correctIndex: 1,
      explanation: "Provisioned concurrency keeps warm container instances in standby, while minimizing bundle dependencies speeds up container initialization time.",
      difficulty,
      topic,
    },
    {
      id: "demo-q-2",
      question: `When handling high concurrency in ${topic}, why is an in-memory Redis token bucket preferred for API rate limiting?`,
      options: [
        "Because it compiles C++ directly into the client browser",
        "Because Redis atomic operations (INCR, EXPIRE) provide sub-millisecond distributed state consistency without heavy database row locking",
        "Because it eliminates the need for any HTTPS SSL certificates",
        "Because it stores all user passwords in plaintext for faster lookup",
      ],
      correctIndex: 1,
      explanation: "Redis executes operations in-memory with single-threaded atomicity, guaranteeing fast rate-limit tracking across multiple application instances.",
      difficulty,
      topic,
    },
    {
      id: "demo-q-3",
      question: `Which architectural pattern is best suited for decoupling microservice write operations during unexpected traffic spikes in ${topic}?`,
      options: [
        "Event-driven message queues (Apache Kafka, RabbitMQ, SQS)",
        "Deeply nested synchronous REST call chains",
        "Global JavaScript client-side polling every 10ms",
        "Storing all payloads in localStorage on the client",
      ],
      correctIndex: 0,
      explanation: "Asynchronous message brokers buffer incoming write spikes, shielding downstream workers from overload and ensuring zero dropped messages.",
      difficulty,
      topic,
    },
    {
      id: "demo-q-4",
      question: `What is the core principle of Idempotency in distributed ${topic} API endpoints?`,
      options: [
        "The endpoint must never return an HTTP 200 response",
        "Making identical requests multiple times has the exact same side-effect as making a single request",
        "The database resets all tables after each transaction",
        "Client tokens must expire after exactly 1 millisecond",
      ],
      correctIndex: 1,
      explanation: "Idempotency prevents duplicate side-effects (e.g. charging a payment card twice or duplicate database writes) when network retries occur.",
      difficulty,
      topic,
    },
  ];

  return {
    data: { topic, difficulty, questions, isDemo: true },
    isDemo: true,
    modelUsed: "SkillSphere Realistic Demo Engine",
  };
}

// 5. AI Mock Interview Evaluator
export async function evaluateMockInterviewAI(
  role: string,
  transcript: { sender: string; text: string }[],
  customKey?: string
): Promise<AIResponse<MockInterviewEvaluation>> {
  const systemInstruction = `You are an Executive Tech Interview Coach at Meta/Google. Evaluate the candidate's interview transcript. Return purely a valid JSON object matching the format:
{
  "overallRating": number (0-100),
  "starAdherenceScore": number (0-100),
  "technicalAccuracyScore": number (0-100),
  "communicationScore": number (0-100),
  "confidenceScore": number (0-100),
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "actionableTips": string[]
}
Return raw JSON only.`;

  const prompt = `Target Role: "${role}".
Transcript:
${transcript.map(t => `${t.sender.toUpperCase()}: ${t.text}`).join("\n")}

Provide an objective, constructive evaluation report.`;

  const rawText = await callGeminiRest(prompt, customKey, systemInstruction);

  if (rawText) {
    try {
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned) as MockInterviewEvaluation;
      return {
        data: { ...parsed, isDemo: false },
        isDemo: false,
        modelUsed: "Gemini 1.5 Flash (Live API)",
      };
    } catch {
      // Fallback
    }
  }

  // Realistic fallback evaluation
  const fallback: MockInterviewEvaluation = {
    overallRating: 86,
    starAdherenceScore: 82,
    technicalAccuracyScore: 89,
    communicationScore: 88,
    confidenceScore: 85,
    summary:
      "Impressive clarity when explaining architectural trade-offs. You articulated system constraints effectively and demonstrated genuine familiarity with real-world failure modes. To push to L5/Senior caliber, structure behavioral answers strictly using Situation, Task, Action, and Result (STAR), concluding each with business impact.",
    strengths: [
      "Accurately addressed trade-offs between latency, data consistency, and implementation complexity.",
      "Clear, professional tone without filler words or hesitation.",
      "Demonstrated practical knowledge of modern cloud patterns and observability tools.",
    ],
    weaknesses: [
      "Could emphasize specific metrics in the 'Result' phase of the STAR methodology.",
      "Did not ask clarifying questions about edge-case scale requirements before proposing the solution.",
    ],
    actionableTips: [
      "Start system design answers by confirming functional vs non-functional requirements and scale numbers (DAU, QPS).",
      "Conclude technical answers by proactively noting monitoring metrics (e.g. p99 latency, error budgets).",
    ],
    isDemo: true,
  };

  return {
    data: fallback,
    isDemo: true,
    modelUsed: "SkillSphere Realistic Demo Engine",
  };
}

// 6. RAG PDF Study Assistant AI
export async function queryDocumentRAG(
  question: string,
  documentTitle: string,
  documentChunks: string[],
  customKey?: string
): Promise<AIResponse<{ answer: string; citations: string[]; flashcards?: { front: string; back: string }[] }>> {
  const systemInstruction = `You are SkillSphere AI Study Companion. Answer the user's question strictly grounded in the provided document excerpt chunks. Provide relevant citations. Return purely a valid JSON object matching the format:
{
  "answer": string,
  "citations": string[],
  "flashcards": [
    { "front": string, "back": string }
  ]
}
Return raw JSON only.`;

  const prompt = `Document Title: "${documentTitle}"
Relevant Extracted Chunks:
${documentChunks.map((chunk, i) => `[Chunk ${i + 1}]: ${chunk}`).join("\n\n")}

User Query: "${question}"`;

  const rawText = await callGeminiRest(prompt, customKey, systemInstruction);

  if (rawText) {
    try {
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        data: { ...parsed, isDemo: false },
        isDemo: false,
        modelUsed: "Gemini 1.5 Flash (Live API)",
      };
    } catch {
      // Fallback
    }
  }

  // Fallback study response
  return {
    data: {
      answer: `Based on **${documentTitle}**, the key architecture revolves around separating compute from stateful storage layers. When queries enter the system, semantic indexing matches high-dimensional embeddings against the nearest cosine cluster, guaranteeing sub-second retrieval while grounding generative answers to prevent hallucinations.`,
      citations: [
        `[Chunk 1: Overview & Motivations]: "Decoupled indexing enables horizontal scaling across multi-tenant clusters."`,
        `[Chunk 3: Performance Benchmarks]: "Observed 99.4% precision with hybrid dense-sparse vector scoring."`,
      ],
      flashcards: [
        {
          front: "What is the primary function of Vector Embeddings in RAG?",
          back: "Transforming unstructured textual semantics into dense numerical vectors to enable mathematical cosine similarity search.",
        },
        {
          front: "Why decouple storage from retrieval compute nodes?",
          back: "Allows independent scaling of memory-intensive vector index caching and CPU-intensive embedding calculations.",
        },
      ],
    },
    isDemo: true,
    modelUsed: "SkillSphere Realistic Demo Engine",
  };
}

// 7. 24/7 AI Mentor Chat Assistant
export async function queryMentorChat(
  history: { role: "user" | "model" | "assistant"; content: string }[],
  userContext: { targetRole: string; currentSkills: string[]; xp: number },
  customKey?: string
): Promise<AIResponse<string>> {
  const systemInstruction = `You are SkillSphere AI Mentor, an empathetic, hyper-knowledgeable principal engineer and career strategist. The user is targeting the role: "${userContext.targetRole}". Their current skills include: ${userContext.currentSkills.join(", ")}. Their current XP is ${userContext.xp}. Give crisp, empowering, technically rigorous advice with actionable next steps. Use markdown formatting with bullet points and code snippets where appropriate.`;

  const conversation = history.map(h => `${h.role.toUpperCase()}: ${h.content}`).join("\n\n");
  const rawText = await callGeminiRest(conversation, customKey, systemInstruction);

  if (rawText && rawText.trim().length > 0) {
    return {
      data: rawText.trim(),
      isDemo: false,
      modelUsed: "Gemini 1.5 Flash (Live API)",
    };
  }

  // Realistic dynamic mentor response
  const lastUserMsg = history[history.length - 1]?.content.toLowerCase() || "";
  let mentorReply = `Great question! As someone targeting **${userContext.targetRole}**, the key is balancing theoretical fundamentals with demonstrable production artifacts.

Here is my recommended immediate plan for you today:
1. **Focus Area**: Spend 45 minutes on the *Vector Databases & RAG Architecture* node in your roadmap.
2. **Coding Habit**: Solve today's *Valid Parentheses* problem in the sandbox to keep your algorithmic problem-solving sharp.
3. **Portfolio Polish**: Add quantifiable metrics to your resume projects using the ATS Analyzer.

Would you like me to generate a tailored mock interview question or review your code solution next?`;

  if (lastUserMsg.includes("interview") || lastUserMsg.includes("prep")) {
    mentorReply = `Preparing for a **${userContext.targetRole}** interview requires mastering both the STAR methodology and system architecture fundamentals.

Here's how to structure your answers:
* **Situation**: Briefly set up the engineering constraint or project challenge.
* **Task**: Define your explicit responsibility and the goal (e.g. reducing p99 latency by 30%).
* **Action**: Explain the exact technical decisions *you* made (e.g., using Redis cache, chunking strategies).
* **Result**: Close with concrete numbers and what you learned.

Head over to our **AI Mock Interview** tab to run a live voice or text session with instant scoring!`;
  } else if (lastUserMsg.includes("resume") || lastUserMsg.includes("ats")) {
    mentorReply = `For tech resumes in 2026, recruiters filter via automated ATS algorithms before any human sees your file.
- **Top tip**: Never use multi-column tables or embedded images.
- **Keywords**: Ensure high-demand terms like **TypeScript, Next.js, CI/CD, Docker, and Vector DBs** are explicitly listed in your skills section.
- **Check our Resume Analyzer** tab to get an immediate ATS score and AI-enhanced bullet points!`;
  }

  return {
    data: mentorReply,
    isDemo: true,
    modelUsed: "SkillSphere Realistic Demo Engine",
  };
}
