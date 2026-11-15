/**
 * Lightweight Markdown → React JSX renderer.
 * Zero extra npm packages — pure regex transforms.
 *
 * Supported syntax:
 *   - Fenced code blocks  ```lang\n...\n```
 *   - Inline code         `code`
 *   - Bold                **text** or __text__
 *   - Italic              *text* or _text_
 *   - Headings            ### h3  ## h2  # h1
 *   - Unordered lists     - item  or * item
 *   - Ordered lists       1. item
 *   - Horizontal rules    ---
 *   - Blank lines → paragraph breaks
 */

import React from "react";

type Token =
  | { type: "code_block"; lang: string; code: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "hr" }
  | { type: "paragraph"; text: string };

// ── Inline renderer (bold, italic, inline code) ───────────────────────────────

function renderInline(text: string): React.ReactNode[] {
  // We split on markers and rebuild as React nodes
  const parts: React.ReactNode[] = [];
  // Pattern: code `...`, bold **...** or __...__, italic *...* or _..._
  const re = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)|(?<!_)_(?!_)([^_]+)(?<!_)_(?!_))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const raw = match[0];
    if (raw.startsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-[#1B4332]/10 dark:bg-[#52B788]/15 text-[#1B4332] dark:text-[#95D5B2] font-mono text-[0.82em]"
        >
          {raw.slice(1, -1)}
        </code>
      );
    } else if (raw.startsWith("**") || raw.startsWith("__")) {
      parts.push(
        <strong key={match.index} className="font-semibold">
          {raw.slice(2, -2)}
        </strong>
      );
    } else {
      // italic
      const inner = raw.startsWith("*") ? raw.slice(1, -1) : raw.slice(1, -1);
      parts.push(<em key={match.index}>{inner}</em>);
    }

    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// ── Block tokenizer ───────────────────────────────────────────────────────────

function tokenize(markdown: string): Token[] {
  const tokens: Token[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      tokens.push({ type: "code_block", lang, code: codeLines.join("\n") });
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      tokens.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 3) as 1 | 2 | 3;
      tokens.push({ type: "heading", level, text: headingMatch[2] });
      i++;
      continue;
    }

    // Unordered list
    if (/^(\s*[-*+])\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^(\s*[-*+])\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*[-*+])\s+/, ""));
        i++;
      }
      tokens.push({ type: "ul", items });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      tokens.push({ type: "ol", items });
      continue;
    }

    // Empty line → skip (paragraph boundaries handled implicitly)
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-special lines
    const textLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,3}\s/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^(\s*[-*+])\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      textLines.push(lines[i]);
      i++;
    }
    if (textLines.length > 0) {
      tokens.push({ type: "paragraph", text: textLines.join(" ") });
    }
  }

  return tokens;
}

// ── Copy button helper ────────────────────────────────────────────────────────

interface CopyButtonProps {
  code: string;
}

function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors font-mono"
      title="Copy code"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ── Main renderer ─────────────────────────────────────────────────────────────

export function renderMarkdown(markdown: string): React.ReactNode {
  const tokens = tokenize(markdown);

  return (
    <div className="space-y-2.5">
      {tokens.map((token, idx) => {
        switch (token.type) {
          case "code_block":
            return (
              <div
                key={idx}
                className="rounded-xl overflow-hidden border border-[#1B4332]/20 dark:border-white/10"
              >
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#1B4332] dark:bg-[#0a1f13]">
                  <span className="text-[10px] font-mono text-[#95D5B2] uppercase tracking-wider">
                    {token.lang || "code"}
                  </span>
                  <CopyButton code={token.code} />
                </div>
                <pre className="overflow-x-auto p-3.5 bg-[#0E2018] dark:bg-black/60 text-[#D8F3DC] text-[11px] leading-relaxed font-mono">
                  <code>{token.code}</code>
                </pre>
              </div>
            );

          case "heading": {
            const sizes: Record<number, string> = {
              1: "text-base font-bold mt-1",
              2: "text-sm font-bold mt-0.5",
              3: "text-xs font-bold uppercase tracking-wide text-[#2D6A4F] dark:text-[#52B788]",
            };
            return (
              <div key={idx} className={sizes[token.level]}>
                {renderInline(token.text)}
              </div>
            );
          }

          case "ul":
            return (
              <ul key={idx} className="space-y-1 pl-4">
                {token.items.map((item, j) => (
                  <li key={j} className="flex gap-2 items-start">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#52B788] flex-shrink-0" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={idx} className="space-y-1 pl-4">
                {token.items.map((item, j) => (
                  <li key={j} className="flex gap-2 items-start">
                    <span className="flex-shrink-0 text-[#2D6A4F] dark:text-[#52B788] font-semibold min-w-[1.25rem]">
                      {j + 1}.
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );

          case "hr":
            return (
              <hr
                key={idx}
                className="border-[#E7E1D3] dark:border-white/10 my-1"
              />
            );

          case "paragraph":
            return (
              <p key={idx} className="leading-relaxed">
                {renderInline(token.text)}
              </p>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
