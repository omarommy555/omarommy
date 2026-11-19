import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "32kb" }));

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "0.0.0.0";
const timeoutMs = Number(process.env.AI_TIMEOUT_MS || 30000);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "JARVIS API",
    version: "2.0.0",
    providers: { groqConfigured: Boolean(process.env.GROQ_API_KEY), huggingFaceConfigured: Boolean(process.env.HF_TOKEN) }
  });
});

async function callOpenAICompatible({ url, token, model, message, provider }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are JARVIS, a reliable personal AI assistant. Be clear, practical, concise, and honest. Do not claim to have performed actions you have not performed." },
          { role: "user", content: message }
        ],
        temperature: 0.5,
        max_tokens: 1200
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error?.message || data.error || `${provider} returned HTTP ${response.status}`);
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error(`${provider} returned an empty response`);
    return reply;
  } finally {
    clearTimeout(timeout);
  }
}

app.post("/api/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "Please provide a message." });
  if (message.length > 8000) return res.status(413).json({ error: "Message is too long. Please keep it under 8,000 characters." });

  const providers = [];
  if (process.env.GROQ_API_KEY) providers.push({
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    token: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
  });
  if (process.env.HF_TOKEN) providers.push({
    name: "Hugging Face",
    url: "https://router.huggingface.co/v1/chat/completions",
    token: process.env.HF_TOKEN,
    model: process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct"
  });
  if (!providers.length) return res.status(503).json({ error: "No AI provider is configured. Add a new GROQ_API_KEY to the server environment." });

  const errors = [];
  for (const provider of providers) {
    try {
      const reply = await callOpenAICompatible({ ...provider, message });
      return res.json({ reply, provider: provider.name });
    } catch (error) {
      errors.push(`${provider.name}: ${error.message}`);
    }
  }
  return res.status(502).json({ error: "All configured AI providers failed.", details: errors });
});

app.listen(port, host, () => console.log(`JARVIS API listening on http://${host}:${port}`));
