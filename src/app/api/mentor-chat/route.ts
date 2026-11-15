import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MentorChatMessage {
  role: "user" | "model";
  content: string;
}

export interface MentorChatRequest {
  messages: MentorChatMessage[]; // Full conversation so far (last message = latest user query)
  userContext: {
    targetRole: string;
    currentSkills: string[];
    xp: number;
  };
  userApiKey?: string; // Optional: user-supplied key (Gemini AIza... or Groq gsk_...)
  groqApiKey?: string; // Optional: user-supplied Groq key
}

export interface MentorChatResponse {
  reply: string;
  modelUsed: string;
  isLive: true;
}

export interface MentorChatError {
  error: string;
  code: "NO_KEY" | "INVALID_KEY" | "RATE_LIMIT" | "QUOTA" | "NETWORK" | "INTERNAL";
  isLive: false;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

// Keep the last N messages to avoid exceeding context limits. 20 messages = 10 turns.
const MAX_CONTEXT_MESSAGES = 20;

// Reject requests with a user message longer than this
const MAX_INPUT_CHARS = 4000;

// ─── Groq Chat Implementation ─────────────────────────────────────────────────

async function callGroqChat(
  apiKey: string,
  systemInstruction: string,
  contextMessages: MentorChatMessage[]
): Promise<NextResponse> {
  const messages = [
    { role: "system", content: systemInstruction },
    ...contextMessages.map((msg) => ({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.content,
    })),
  ];

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      let errorBody: { error?: { message?: string; type?: string; code?: string } } = {};
      try {
        errorBody = await res.json();
      } catch {}

      const status = res.status;
      const apiMessage = errorBody?.error?.message || "";
      console.error(`[mentor-chat] Groq API error ${status}: ${apiMessage}`);

      if (status === 401 || status === 403) {
        return NextResponse.json(
          {
            error:
              "Your Groq API key is invalid or lacks permission. Check your key in .env.local or Settings.",
            code: "INVALID_KEY",
            isLive: false,
          } satisfies MentorChatError,
          { status: 200 }
        );
      }

      if (status === 404 || apiMessage.toLowerCase().includes("model") || apiMessage.toLowerCase().includes("decommissioned")) {
        return NextResponse.json(
          {
            error: `The Groq model 'openai/gpt-oss-120b' is unavailable or not found (${apiMessage || `HTTP ${status}`}). Please check your Groq tier or model status.`,
            code: "INTERNAL",
            isLive: false,
          } satisfies MentorChatError,
          { status: 200 }
        );
      }

      if (status === 429) {
        return NextResponse.json(
          {
            error:
              "You've hit the Groq API rate limit. Please wait a moment and try again.",
            code: "RATE_LIMIT",
            isLive: false,
          } satisfies MentorChatError,
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          error: `Groq API returned an error (${status}): ${apiMessage || "Please try again."}`,
          code: "INTERNAL",
          isLive: false,
        } satisfies MentorChatError,
        { status: 200 }
      );
    }

    const data = await res.json();
    const replyText = data?.choices?.[0]?.message?.content?.trim();

    if (!replyText) {
      return NextResponse.json(
        {
          error: "Groq returned an empty response. Please try rephrasing your question.",
          code: "INTERNAL",
          isLive: false,
        } satisfies MentorChatError,
        { status: 200 }
      );
    }

    return NextResponse.json({
      reply: replyText,
      modelUsed: "Groq (openai/gpt-oss-120b)",
      isLive: true,
    } satisfies MentorChatResponse);
  } catch (networkErr) {
    console.error("[mentor-chat] Network error calling Groq:", networkErr);
    return NextResponse.json(
      {
        error:
          "Could not reach the Groq API. Please check your internet connection and try again.",
        code: "NETWORK",
        isLive: false,
      } satisfies MentorChatError,
      { status: 200 }
    );
  }
}

// ─── System Instruction ───────────────────────────────────────────────────────

function buildSystemInstruction(
  targetRole: string,
  currentSkills: string[],
  xp: number
): string {
  const skillList =
    currentSkills.length > 0
      ? currentSkills.join(", ")
      : "not specified yet";

  return `You are SkillSphere AI Mentor — a world-class, empathetic senior engineer and career strategist.

USER CONTEXT:
- Target role: ${targetRole}
- Current skills: ${skillList}
- XP earned: ${xp}

BEHAVIOUR RULES:
1. Answer ANY question the user asks — general knowledge, programming, debugging, algorithms, AI/ML, web development, math, career advice, study tips, or everyday topics. Do NOT restrict yourself to career questions only.
2. Tailor your tone and depth to the question. For technical questions, be precise and provide working code examples. For conceptual questions, explain clearly. For career advice, be actionable.
3. Use Markdown formatting in your responses:
   - Use **bold** for key terms.
   - Use \`inline code\` for short code references.
   - Use triple-backtick code blocks with the language name for code examples (e.g. \`\`\`java).
   - Use numbered lists for step-by-step procedures.
   - Use bullet lists for comparisons or options.
   - Use tables for side-by-side comparisons when helpful.
4. Follow-up questions like "Explain that again", "Give an example", "Make it shorter", or "What did you mean by X?" rely on conversation history. Use the full provided history to answer them accurately.
5. When you are uncertain, say so. Do not invent facts or APIs.
6. Do NOT start every response with an introduction or end with a generic motivational paragraph. Get to the point.
7. Vary your response structure depending on what the question needs — not every answer requires a learning plan.`.trim();
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let body: MentorChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON in request body.",
        code: "INTERNAL",
        isLive: false,
      } satisfies MentorChatError,
      { status: 400 }
    );
  }

  const { messages, userContext, userApiKey, groqApiKey } = body;

  // ── 2. Validate input ──────────────────────────────────────────────────────
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      {
        error: "messages array is required and must not be empty.",
        code: "INTERNAL",
        isLive: false,
      } satisfies MentorChatError,
      { status: 400 }
    );
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== "user") {
    return NextResponse.json(
      {
        error: "The last message must have role 'user'.",
        code: "INTERNAL",
        isLive: false,
      } satisfies MentorChatError,
      { status: 400 }
    );
  }

  if (lastMessage.content.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      {
        error: `Your message is too long (max ${MAX_INPUT_CHARS} characters). Please shorten it and try again.`,
        code: "INTERNAL",
        isLive: false,
      } satisfies MentorChatError,
      { status: 400 }
    );
  }

  // ── 3. Resolve API keys & provider ──────────────────────────────────────────
  // Check for Groq first
  const envGroqKey = process.env.GROQ_API_KEY?.trim();
  const effectiveGroqKey =
    (envGroqKey && !envGroqKey.includes("your_groq_api_key_here") && envGroqKey) ||
    groqApiKey?.trim() ||
    (userApiKey?.trim().startsWith("gsk_") ? userApiKey.trim() : undefined);

  // Check for Gemini
  const envGeminiKey = process.env.GEMINI_API_KEY?.trim();
  const effectiveGeminiKey =
    (envGeminiKey && !envGeminiKey.includes("YourGeminiApiKeyHere") && envGeminiKey) ||
    (userApiKey && !userApiKey.startsWith("gsk_") ? userApiKey.trim() : undefined);

  // Trim messages to avoid huge payloads
  const trimmedMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
  const firstUserIdx = trimmedMessages.findIndex((m) => m.role === "user");
  const contextMessages =
    firstUserIdx > 0 ? trimmedMessages.slice(firstUserIdx) : trimmedMessages;

  const systemInstruction = buildSystemInstruction(
    userContext?.targetRole || "Software Engineer",
    userContext?.currentSkills || [],
    userContext?.xp || 0
  );

  // ── 4. Execute Groq if key is present ──────────────────────────────────────
  if (effectiveGroqKey && effectiveGroqKey.length > 8) {
    return await callGroqChat(effectiveGroqKey, systemInstruction, contextMessages);
  }

  // ── 5. Fallback to Gemini if key is present ────────────────────────────────
  const apiKey = effectiveGeminiKey;
  if (!apiKey || apiKey.trim().length < 10) {
    return NextResponse.json(
      {
        error:
          "No Groq or Gemini API key configured. Add GROQ_API_KEY or GEMINI_API_KEY to your .env.local file, or configure your key in Settings.",
        code: "NO_KEY",
        isLive: false,
      } satisfies MentorChatError,
      { status: 200 } // 200 so the UI can display the message gracefully
    );
  }

  const contents = contextMessages.map((msg) => ({
    role: msg.role, // "user" | "model"
    parts: [{ text: msg.content }],
  }));

  // ── 6. Build Gemini request body ──────────────────────────────────────────
  const geminiBody = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents,
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 2048,
      topP: 0.95,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_ONLY_HIGH",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_ONLY_HIGH",
      },
    ],
  };

  // ── 6. Call Gemini REST API ───────────────────────────────────────────────
  let geminiResp: Response;
  try {
    geminiResp = await fetch(`${GEMINI_API_URL}?key=${apiKey.trim()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });
  } catch (networkErr) {
    console.error("[mentor-chat] Network error calling Gemini:", networkErr);
    return NextResponse.json(
      {
        error:
          "Could not reach the Gemini API. Please check your internet connection and try again.",
        code: "NETWORK",
        isLive: false,
      } satisfies MentorChatError,
      { status: 200 }
    );
  }

  // ── 7. Handle Gemini API errors ───────────────────────────────────────────
  if (!geminiResp.ok) {
    let errorBody: { error?: { message?: string; status?: string } } = {};
    try {
      errorBody = await geminiResp.json();
    } catch {
      // ignore parse failure
    }

    const status = geminiResp.status;
    const apiMessage = errorBody?.error?.message || "";

    console.error(
      `[mentor-chat] Gemini API error ${status}: ${apiMessage}`
    );

    if (status === 400 || status === 403) {
      return NextResponse.json(
        {
          error:
            "Your Gemini API key appears to be invalid or lacks permission. Verify it in Google AI Studio and update it in your .env.local or Settings.",
          code: "INVALID_KEY",
          isLive: false,
        } satisfies MentorChatError,
        { status: 200 }
      );
    }

    if (status === 429) {
      return NextResponse.json(
        {
          error:
            "You've hit the Gemini API rate limit. Please wait a moment and try again.",
          code: "RATE_LIMIT",
          isLive: false,
        } satisfies MentorChatError,
        { status: 200 }
      );
    }

    if (status === 503 || apiMessage.toLowerCase().includes("quota")) {
      return NextResponse.json(
        {
          error:
            "Gemini API quota exceeded. Check your usage limits in Google AI Studio.",
          code: "QUOTA",
          isLive: false,
        } satisfies MentorChatError,
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: `Gemini API returned an unexpected error (HTTP ${status}). Please try again.`,
        code: "INTERNAL",
        isLive: false,
      } satisfies MentorChatError,
      { status: 200 }
    );
  }

  // ── 8. Parse successful response ──────────────────────────────────────────
  let geminiData: {
    candidates?: {
      content?: { parts?: { text?: string }[] };
      finishReason?: string;
    }[];
  };

  try {
    geminiData = await geminiResp.json();
  } catch {
    return NextResponse.json(
      {
        error: "Received an unreadable response from Gemini. Please try again.",
        code: "INTERNAL",
        isLive: false,
      } satisfies MentorChatError,
      { status: 200 }
    );
  }

  const replyText =
    geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!replyText) {
    const finishReason = geminiData?.candidates?.[0]?.finishReason;
    if (finishReason === "SAFETY") {
      return NextResponse.json(
        {
          error:
            "The response was blocked by Gemini's safety filters. Please rephrase your question.",
          code: "INTERNAL",
          isLive: false,
        } satisfies MentorChatError,
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        error:
          "Gemini returned an empty response. Please try rephrasing your question.",
        code: "INTERNAL",
        isLive: false,
      } satisfies MentorChatError,
      { status: 200 }
    );
  }

  // ── 9. Return success ─────────────────────────────────────────────────────
  return NextResponse.json({
    reply: replyText,
    modelUsed: "Gemini 1.5 Flash",
    isLive: true,
  } satisfies MentorChatResponse);
}
