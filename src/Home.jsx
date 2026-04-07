import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  const sampleQuestions = [
    "What services do Ferndale provide?",
    "Who will I be working with?",
    "How do I contact Ferndale?",
    "I'd like to request a quote",
  ];

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    const t = e.target;
    t.style.height = "44px";
    t.style.height = Math.min(t.scrollHeight, 140) + "px";
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/apihttps://llm-cv-api.onrender.com/mother_query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.answer || "No response",
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Error: " + err.message,
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newChat = () => {
    if (messages.length && !window.confirm("Clear chat?")) return;
    setMessages([]);
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src="/thumbnail.jpg"
          alt="Logo"
          style={{ width: 28, height: 28, borderRadius: 6 }}
        />
        <div>
          <div style={styles.title}>Ferndale Accounting</div>
          <div style={styles.subtitle}>Ask me anything!</div>
        </div>
      </div>
      <button style={styles.secondaryBtn} onClick={newChat}>
        New Chat
      </button>
    </div>

      {/* Chat Panel */}
      <div style={styles.chatPanel}>
        <div ref={chatRef} style={styles.chat}>
          {messages.length === 0 && (
            <div style={styles.emptyArea}>
              <div style={styles.samplePanel}>
                <div style={styles.emptyTitle}>Start a conversation</div>
                <div style={styles.sampleGrid}>
                  {sampleQuestions.map((q, i) => (
                    <button
                      key={i}
                      style={styles.sampleBtn}
                      onClick={() => setInput(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                ...styles.row,
                justifyContent:
                  m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  ...(m.role === "user"
                    ? styles.userBubble
                    : styles.botBubble),
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={styles.row}>
              <div style={styles.botBubble}>Typing...</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={styles.inputBar}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            style={styles.textarea}
          />
          <button
            onClick={sendMessage}
            disabled={!input || loading}
            style={styles.sendBtn}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
    color: "#e5e7eb",
    fontFamily: "Inter, system-ui, sans-serif",
    padding: "20px",
    alignItems: "center",
  },

  header: {
    width: "100%",
    maxWidth: 500,
    marginBottom: 12,
    padding: "10px 12px",
    background: "transparent",
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "#2563eb", // placeholder logo color
  },

  title: {
    fontSize: 16,
    fontWeight: 600,
  },

  subtitle: {
    fontSize: 12,
    opacity: 0.7,
  },

  chatPanel: {
    width: "100%",
    maxWidth: 500,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#1e293b",
    borderRadius: 16,
    padding: 12,
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  emptyArea: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    borderRadius: 12,
    padding: 16,
  },

  samplePanel: {
    background: "#0b1e41",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 380,
    textAlign: "center",
  },

  emptyTitle: {
    marginBottom: 12,
    fontSize: 14,
    opacity: 0.8,
  },

  sampleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  sampleBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: 13,
  },

  row: {
    display: "flex",
  },

  bubble: {
    padding: "10px 14px",
    borderRadius: 14,
    maxWidth: "75%",
    fontSize: 14,
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
  },

  userBubble: {
    background: "#2563eb",
    color: "white",
  },

  botBubble: {
    background: "#334155",
  },

  inputBar: {
    display: "flex",
    gap: 8,
    paddingTop: 8,
  },

  textarea: {
    flex: 1,
    resize: "none",
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #1f2937",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    outline: "none",
  },

  sendBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: 38,
    height: 38,
    cursor: "pointer",
    fontSize: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryBtn: {
    background: "#fb9118",
    border: "1px solid #1f2937",
    color: "#0b1e41",
    padding: "4px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
};