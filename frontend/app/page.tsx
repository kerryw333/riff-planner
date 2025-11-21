"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ChatMessage from "./components/ChatMessage";

interface ChatEntry {
  role: "user" | "assistant";
  text: string;
  references?: { title?: string | null; url?: string | null; snippet?: string | null }[];
}

const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
const API_ROUTE = backendBase ? `${backendBase}/generate` : "/api/generate";

export default function Home() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  const canSubmit = useMemo(() => message.trim().length > 0 && !loading, [message, loading]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [history]);

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    const outbound = message.trim();
    setHistory((prev) => [...prev, { role: "user", text: outbound }]);
    setMessage("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_ROUTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: outbound }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Backend error: HTTP ${res.status} — ${detail || "unknown"}`);
      }

      const data = await res.json();
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "(No answer returned)",
          references: data.references || [],
        },
      ]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <main style={{ width: "100%", maxWidth: 720 }}>
        <div className="card" style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>🧭 Riff Planner</div>
          <p style={{ marginTop: 6, marginBottom: 0, color: "#515151" }}>
            Chat with Gemini + Google Search to brainstorm your next trip.
          </p>
        </div>

        <section className="card" style={{ marginBottom: 16 }}>
          <form onSubmit={sendMessage}>
            <label htmlFor="query" style={{ fontWeight: 700, display: "block", marginBottom: 8 }}>
              Trip request
            </label>
            <textarea
              id="query"
              rows={3}
              placeholder="e.g. Weekend in Taipei, romantic date in Vancouver…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "#fffdf7",
                resize: "vertical",
              }}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <button
                type="submit"
                disabled={!canSubmit}
                style={{
                  flex: 1,
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontWeight: 700,
                  opacity: canSubmit ? 1 : 0.5,
                }}
              >
                {loading ? "⏳ Talking to Gemini…" : "✨ Send"}
              </button>
              <span style={{ fontSize: 12, color: "#6b6b6b" }}>Backend: {API_ROUTE}</span>
            </div>
          </form>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 12,
                border: "1px solid #f7d7d9",
                background: "#fff1f2",
                color: "#b42318",
                fontWeight: 600,
              }}
            >
              🚨 {error}
              <div style={{ fontSize: 12, marginTop: 4, fontWeight: 500 }}>
                Check that the FastAPI server (port 8000) is running and the BACKEND_URL env var
                in Next.js matches it.
              </div>
            </div>
          )}
        </section>

        <section className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Conversation</div>
          <div
            ref={listRef}
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {history.length === 0 ? (
              <div style={{ color: "#6b6b6b", fontSize: 14 }}>
                Ask a question to see Gemini + Google Search respond.
              </div>
            ) : (
              history.map((entry, idx) => <ChatMessage key={idx} {...entry} />)
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
