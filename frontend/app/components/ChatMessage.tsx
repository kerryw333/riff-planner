interface ChatMessageProps {
  role: "user" | "assistant";
  text: string;
  references?: { title?: string | null; url?: string | null; snippet?: string | null }[];
}

export default function ChatMessage({ role, text, references = [] }: ChatMessageProps) {
  return (
    <div className="card">
      <div className={`chat-bubble ${role === "user" ? "user" : "assistant"}`}>
        <div className="chat-meta">
          {role === "user" ? "You" : "Gemini + Google Search"}
        </div>
        <div className="chat-answer">{text}</div>
        {role === "assistant" && references.length > 0 && (
          <ul className="reference-list">
            {references.map((ref, idx) => (
              <li key={idx}>
                <strong>{ref.title || "Reference"}</strong>{" "}
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noreferrer">
                    {ref.url}
                  </a>
                ) : null}
                {ref.snippet ? <div>{ref.snippet}</div> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
