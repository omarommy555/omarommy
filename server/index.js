import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "JARVIS API", version: "2.0.0" }));

app.post("/api/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "Please provide a message." });
  if (!process.env.GROQ_API_KEY) return res.status(503).json({ error: "GROQ_API_KEY is not configured on the server." });

  try {
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are JARVIS, a clear, capable personal AI assistant. Be concise, practical, and honest about limitations." },
          { role: "user", content: message }
        ],
        temperature: 0.6
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data.error?.message || "Groq request failed." });
    return res.json({ reply: data.choices?.[0]?.message?.content || "I couldn't generate a response." });
  } catch (error) {
    return res.status(500).json({ error: "AI service request failed.", detail: error.message });
  }
});

const port = Number(process.env.PORT || 8787);
app.listen(port, "0.0.0.0", () => console.log(`JARVIS API listening on port ${port}`));
