"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { queryDocumentRAG, isLiveAIConfigured } from "@/lib/gemini";
import { AiBadge } from "@/components/common/AiBadge";
import { playAudioFeedback } from "@/lib/utils";
import {
  BookOpen,
  Sparkles,
  Send,
  FileText,
  Upload,
  Bot,
  User,
  Quote,
  Layers,
  ChevronRight,
  HelpCircle,
  Zap,
} from "lucide-react";

interface SampleDoc {
  id: string;
  title: string;
  pages: number;
  category: string;
  chunks: string[];
}

const sampleDocuments: SampleDoc[] = [
  {
    id: "doc-1",
    title: "Deep Learning & Transformer Architectures.pdf",
    pages: 42,
    category: "AI & Neural Networks",
    chunks: [
      "Chunk 1: Transformer architectures replace recurrent structures with self-attention mechanisms, computing dependencies between input tokens regardless of their positional distance.",
      "Chunk 2: Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions, scaled by the square root of dimension d_k.",
      "Chunk 3: Positional encoding injects token ordering into the sequence via sinusoidal wave functions or learned positional embeddings.",
      "Chunk 4: Modern Large Language Models (LLMs) scale parameter weights into billions using mixture-of-experts (MoE) to activate only specific expert feedforward layers per token.",
    ],
  },
  {
    id: "doc-2",
    title: "Distributed System Design & High Scalability.pdf",
    pages: 68,
    category: "System Architecture",
    chunks: [
      "Chunk 1: Decoupling storage from compute layers allows horizontal elasticity: compute nodes handle query parsing while distributed object stores maintain durability.",
      "Chunk 2: The CAP theorem dictates that in the presence of a network partition, a distributed datastore can guarantee either Consistency (CP) or Availability (AP), but not both.",
      "Chunk 3: Consistent hashing distributes cache keys across a dynamic ring of cache servers with minimal key remapping when nodes join or fail.",
      "Chunk 4: Write-Ahead Logging (WAL) guarantees Atomicity and Durability (ACID) by appending state transitions to sequential disk storage before applying to memory indexes.",
    ],
  },
];

export default function StudyAssistantPage() {
  const { user, addXp } = useAuth();
  const [selectedDoc, setSelectedDoc] = useState<SampleDoc>(sampleDocuments[0]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    {
      role: "assistant" | "user";
      text: string;
      citations?: string[];
      flashcards?: { front: string; back: string }[];
    }[]
  >([
    {
      role: "assistant",
      text: `Welcome to the **RAG Study Assistant**! I am grounded in **"${sampleDocuments[0].title}"**. Ask any conceptual question, request a summary, or click a quick prompt below to synthesize flashcards!`,
    },
  ]);

  const handleSelectDoc = (doc: SampleDoc) => {
    setSelectedDoc(doc);
    setChatHistory([
      {
        role: "assistant",
        text: `Switched grounded document to **"${doc.title}"**. How can I help you dissect this material?`,
      },
    ]);
    playAudioFeedback("click");
  };

  const handleSend = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim() || loading) return;

    playAudioFeedback("click");
    setChatHistory((prev) => [...prev, { role: "user", text: q }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await queryDocumentRAG(
        q,
        selectedDoc.title,
        selectedDoc.chunks,
        user?.geminiApiKey
      );

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.data.answer,
          citations: res.data.citations,
          flashcards: res.data.flashcards,
        },
      ]);

      addXp(20);
      playAudioFeedback("success");
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Encountered a retrieval exception. Please try asking again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Module: Retrieval-Augmented Generation
            </span>
            <AiBadge isDemo={!isLiveAIConfigured()} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            RAG-based PDF Study Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ground AI responses in course PDFs, research papers, and technical manuscripts with verifiable citations.
          </p>
        </div>

        {/* Document Switcher */}
        <div className="flex items-center gap-2">
          {sampleDocuments.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleSelectDoc(doc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedDoc.id === doc.id
                  ? "bg-emerald-600 text-white font-semibold shadow-md"
                  : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
              }`}
            >
              {doc.title.split(" ")[0]}...
            </button>
          ))}
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
        {/* Left Pane: Document Viewer / Chunk Explorer (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                  {selectedDoc.title}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {selectedDoc.pages} Pages • {selectedDoc.chunks.length} Vector Chunks
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                playAudioFeedback("click");
                alert("Custom PDF upload: Drag & drop your PDF file to index text embeddings locally.");
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-emerald-500 border border-slate-200 dark:border-white/10"
              title="Upload custom PDF"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          {/* Chunks List */}
          <div className="flex-1 overflow-y-auto pt-4 space-y-3 pr-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Indexed Vector Embeddings (Semantic Segments):
            </p>
            {selectedDoc.chunks.map((chunk, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Chunk #{i + 1}
                  </span>
                  <span className="text-[9px] text-slate-400">Cosine: 0.94</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {chunk}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Interactive Grounded AI Chat (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl flex flex-col h-full overflow-hidden">
          {/* Top Quick Prompts */}
          <div className="pb-3 border-b border-slate-200 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              "Explain the core concept in simple terms",
              "Generate 2 flashcards from this text",
              "What are the main engineering trade-offs?",
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4 my-2 pr-1">
            {chatHistory.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm space-y-3 ${
                      isAssistant
                        ? "bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Quote className="w-3 h-3" />
                          Grounded Citations:
                        </span>
                        {msg.citations.map((c, cIdx) => (
                          <p key={cIdx} className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {c}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Flashcards */}
                    {msg.flashcards && msg.flashcards.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Synthesized Flashcards:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.flashcards.map((fc, fIdx) => (
                            <div
                              key={fIdx}
                              className="p-3 rounded-xl bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 space-y-1"
                            >
                              <p className="font-semibold text-slate-900 dark:text-white">
                                Q: {fc.front}
                              </p>
                              <p className="text-slate-600 dark:text-slate-300">
                                A: {fc.back}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-slate-500">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span>Retrieving semantic chunks and formulating response...</span>
              </div>
            )}
          </div>

          {/* Query Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="pt-2 flex items-center gap-2 border-t border-slate-200 dark:border-white/10"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything grounded in this PDF document..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-xs border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
