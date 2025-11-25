'use client';

import { FormEvent, useState } from 'react';

interface DayPlan {
  title: string;
  details: string;
}

interface PlanResponse {
  destination: string;
  timeline: DayPlan[];
  notes: string;
}

async function generatePlans(destination: string): Promise<PlanResponse> {
  const res = await fetch('/api/plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ destination })
  });

  if (!res.ok) {
    // Provide clear error context for debugging and UI feedback
    throw new Error(`Backend error: HTTP ${res.status}`);
  }

  return res.json();
}

export default function HomePage() {
  const [destination, setDestination] = useState('Lisbon, Portugal');
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await generatePlans(destination.trim());
      setPlan(result);
    } catch (err) {
      setPlan(null);
      setError(err instanceof Error ? err.message : 'Unexpected error while calling the planner API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <h1>Riff Planner</h1>
      <p>AI trip planner powered by Gemini 2.5 — Ideas, timeline, and real places.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
        <label>
          Destination
          <input
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Where do you want to go?"
            style={{
              width: '100%',
              padding: '0.75rem 0.9rem',
              marginTop: '0.25rem',
              borderRadius: '0.6rem',
              border: '1px solid #cbd5e1',
              fontSize: '1rem'
            }}
            required
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '0.8rem 1rem',
            borderRadius: '0.7rem',
            border: 'none',
            backgroundColor: '#2563eb',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          {isLoading ? 'Planning…' : 'Generate plan'}
        </button>
      </form>

      {error ? (
        <div style={{ marginTop: '1.25rem', padding: '0.9rem 1rem', borderRadius: '0.6rem', background: '#fee2e2', color: '#991b1b' }}>
          <strong>Something went wrong:</strong> {error}
        </div>
      ) : null}

      {plan ? (
        <section style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'grid', gap: '0.9rem' }}>
          <h2 style={{ margin: 0 }}>3-day plan for {plan.destination}</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            {plan.timeline.map((day) => (
              <li key={day.title} style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'white', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)' }}>
                <h3 style={{ margin: '0 0 0.35rem' }}>{day.title}</h3>
                <p style={{ margin: 0, color: '#334155' }}>{day.details}</p>
              </li>
            ))}
          </ul>
          <p style={{ margin: 0, color: '#475569' }}>{plan.notes}</p>
        </section>
      ) : null}
    </main>
  );
}
