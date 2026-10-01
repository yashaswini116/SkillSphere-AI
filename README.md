# SkillSphere AI – Your Personal AI Career & Learning OS 🚀
> Inspired by **SIH26101 (Smart India Hackathon)** • Production-Grade Next.js 15, TypeScript, Tailwind CSS, Firebase, and Google Gemini AI

SkillSphere AI is an autonomous, end-to-end Career & Learning Operating System designed to empower modern engineering students and tech professionals. It diagnoses technical skill gaps against real-world 2026 market benchmarks, synthesizes milestone-driven learning roadmaps, conducts speech/text mock interviews with STAR methodology scoring, and generates ATS-optimized resumes using the Google XYZ impact formula.

---

## 🌟 Key Features

| Feature Module | Technology / Engine | Description |
| :--- | :--- | :--- |
| **AI Skill-Gap Analyzer** | Gemini 1.5 Flash + Taxonomy Engine | Compares current skills against live industry requirements; outputs match score %, prioritized missing modules, and remedial sprints. |
| **Emerging Tech Radar** | 2026 Market Telemetry | Classifies 40+ technologies into **Adopt**, **Trial**, **Assess**, and **Hold** with salary benchmarks (INR & USD) and YoY growth rates. |
| **Personalized AI Roadmaps** | Interactive Tree + Checkpoints | Generates phase-by-phase milestones with estimated hours, curated open-source resources, and XP rewards. |
| **Resume ATS 90+ Optimizer** | Google XYZ Formula Engine | Audits resumes for ATS parsability, highlights missing keywords, and automatically re-writes passive bullet points. |
| **RAG PDF Study Assistant** | Vector Semantic Chunking | Dual-pane interface: document chunk explorer on left, grounded AI chat with verifiable citations and flashcard generator on right. |
| **AI Quiz & MCQ Engine** | Dynamic Evaluator + Timer | Timed technical multiple-choice questions with instant conceptual explanations and streak bonuses. |
| **Coding Sandbox** | In-Browser Execution Engine | Multi-language coding sandbox (JS, TS, Python) with simulated test runners, progressive 3-level AI hints, and Big-O complexity analysis. |
| **AI Mock Interviewer** | Web Speech API + STAR Rubrics | Voice & text turn-by-turn interview simulation with Sarah (ex-Google Lead) evaluating STAR adherence, accuracy, and confidence. |
| **Project Gen & Portfolio** | Capstone Blueprint Engine | Architects production-grade capstone specs and publishes an automated shareable public portfolio at `/p/[username]`. |
| **Gamified Career OS** | XP & Streak Engine | 8-day daily login streaks, streak freeze safeguards, level progression (Lv. 1 - 25+), trophy case, and community leaderboard. |
| **24/7 AI Mentor Lounge** | Context-Aware Agent | Omnipresent floating drawer and full-page lounge offering real-time architectural guidance, code reviews, and strategy. |
| **Admin Oversight Tower** | Institutional Governance | Track institutional cohorts, verified skill matrices, AI API health, and system telemetry. |

---

## 🚀 Quick Start (Zero Setup Required)

SkillSphere AI is designed for **instant evaluation out of the box**. If API keys are not supplied, the platform automatically switches to a high-fidelity **Smart Simulated Demo Mode** so every single button, quiz, interview, and analysis works immediately without errors.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/yashaswini116/MERN-Stack.git
cd "SkillSphere AI"
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Activating Live Google Gemini AI (BYOK)

To activate live real-time LLM inference:
1. Open the app and navigate to **Settings** (`/dashboard/settings`).
2. Paste your Google Gemini API Key in the **Google Gemini API Key (BYOK)** field.
3. Click **Save & Activate Key**.
4. All modules will immediately switch to live **Gemini 1.5 Flash** inference with active status indicators!

---

## 🔒 Firebase Deployment & Security Rules

### Security Rules Overview
- `firestore.rules`: Role-Based Access Control (RBAC) ensuring learners can only mutate their private profiles while keeping public portfolio showcases readable.
- `storage.rules`: Ensures private document storage for PDF resumes and study notes.

### Deploying to Firebase
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize & Deploy
firebase deploy
```

---

## 🏛️ Architecture & Tech Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom Dark/Light Glassmorphism
- **AI Core**: Google Gemini 1.5 Flash / Genkit Architecture
- **State & Auth**: React Context Provider with Firebase Auth & local persistence
- **Gamification**: Web Audio API Sound Synthesizer + Canvas Confetti
- **Icons**: Lucide React Icons
