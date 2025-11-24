"use client";

import { useState, useEffect } from "react";
import CalendarPicker, { CalendarValue } from "./components/CalendarPicker";
import IdeaCard from "./components/IdeaCard";
import TimelineCard from "./components/TimelineCard";

function formatSelectedDate(value: CalendarValue): string {
  if (!value) return "No date selected";

  if (value instanceof Date) return value.toDateString();

  const [start, end] = value;
  if (start && end) {
    const diff =
      Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    return `${start.toDateString()} → ${end.toDateString()} (${diff} days)`;
  }

  return "Select a start and end date";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<CalendarValue>(null);
  const [mode, setMode] = useState<"ideas" | "timeline">("ideas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [plans, setPlans] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    setDate(new Date());
  }, []);

  async function generatePlans() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query,
    date: JSON.stringify(date),
  }),
});

      if (!res.ok) throw new Error(`Backend error: HTTP ${res.status}`);

      const data = await res.json();
      setPlans(data.ideas || []);
      setTimeline(data.timeline || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }

    setLoading(false);
  }

  /* SAVE PLAN ------------------------- */
  function savePlan() {
    const saved = { query, date, plans, timeline };
    localStorage.setItem("savedPlan", JSON.stringify(saved));
    alert("✨ Plan saved!");
  }

  return (
    <div className="min-h-screen p-6">
      <main className="glass-card w-full max-w-xl mx-auto p-6 rounded-3xl shadow-xl">

        <h1 className="text-4xl font-extrabold text-white text-center drop-shadow mb-6">
          Riff Planner
        </h1>

        {/* Mode Switch */}
        <div className="flex gap-3 mb-6 justify-center">
          {["ideas", "timeline"].map((m) => (
            <button
              key={m}
              className={`px-4 py-2 rounded-xl border transition ${
                mode === m
                  ? "bg-blue-400 text-white border-white"
                  : "bg-white/70 text-blue-400 border-blue-200"
              }`}
              onClick={() => setMode(m as any)}
            >
              {m === "ideas" ? "💡 Ideas" : "🕒 Timeline"}
            </button>
          ))}
        </div>

        {date && <CalendarPicker value={date} onChange={setDate} />}

        <div className="mt-3 mb-6 p-3 glass-card rounded-xl text-blue-400 font-medium">
          <strong>Selected:</strong> {formatSelectedDate(date)}
        </div>

        <label className="block text-white font-semibold mb-2">
          Trip Request
        </label>

        <textarea
          className="w-full p-3 rounded-xl bg-white/80 text-blue-900 mb-4"
          rows={4}
          placeholder="e.g. Weekend in Tokyo, romantic date in Vancouver…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          className="w-full py-3 bg-white text-blue-400 font-bold rounded-xl hover:bg-blue-50 transition"
          onClick={generatePlans}
          disabled={loading}
        >
          {loading ? "⏳ Generating…" : "✨ Generate Plans"}
        </button>

        <button
          onClick={savePlan}
          className="w-full mt-4 py-3 bg-blue-400 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          💾 Save This Plan
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-600/70 text-white rounded-xl">
            🚨 {error}
          </div>
        )}

        {/* Results */}
        {mode === "ideas" && (
          <div className="grid grid-cols-1 gap-4 mt-8">
            {plans.map((idea, i) => (
              <IdeaCard key={i} {...idea} />
            ))}
          </div>
        )}

        {mode === "timeline" && (
          <div className="mt-8 space-y-4">
            {timeline.map((item, i) => (
              <TimelineCard key={i} {...item} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
