import { createServerFn } from "@tanstack/react-start";

/**
 * Lets the app pick up an assistant ID configured on the server, so the
 * analyst never has to paste it. Never returns the API key itself.
 */
const DEFAULT_AGENT_ID = "agent_8401ktcfgjbff6v9msgtsp734ba7";

export const getVoiceConfig = createServerFn({ method: "GET" }).handler(async () => ({
  agentId: process.env["ELEVENLABS_AGENT_ID"] ?? DEFAULT_AGENT_ID,
  keyConfigured: Boolean(process.env["ELEVENLABS_API_KEY"]),
}));

/**
 * Mints a short-lived conversation token so the ElevenLabs API key never
 * reaches the browser. Returns { token: null } when no key is configured yet —
 * the client then falls back to a public agent connection.
 */
export const getVoiceToken = createServerFn({ method: "POST" })
  .inputValidator((input: { agentId: string }) => {
    if (!input || typeof input.agentId !== "string" || input.agentId.trim() === "") {
      throw new Error("agentId is required");
    }
    return { agentId: input.agentId.trim() };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["ELEVENLABS_API_KEY"];
    if (!apiKey) return { token: null as string | null, error: null as string | null };

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(data.agentId)}`,
      { headers: { "xi-api-key": apiKey } },
    );

    if (!response.ok) {
      const body = await response.text();
      console.error(`ElevenLabs token request failed [${response.status}]: ${body}`);
      return { token: null as string | null, error: `Voice service error (${response.status})` };
    }

    const payload = (await response.json()) as { token?: string };
    return { token: payload.token ?? null, error: null as string | null };
  });

/**
 * One-shot sync: uploads the dataset briefing (plus the GitHub dataset link) to
 * the assistant's knowledge base and attaches both documents to the agent, so
 * the assistant answers from the record instead of from the model.
 */
export const syncVoiceKnowledge = createServerFn({ method: "POST" }).handler(async () => {
  const apiKey = process.env["ELEVENLABS_API_KEY"];
  if (!apiKey) return { ok: false, error: "No voice service key configured." };
  const agentId = process.env["ELEVENLABS_AGENT_ID"] ?? DEFAULT_AGENT_ID;

  const { buildKnowledgeBriefing, KNOWLEDGE_DOC_NAME } = await import("./voice-knowledge");
  const { DATASET_SOURCE } = await import("./dataset");
  const headers = { "xi-api-key": apiKey, "content-type": "application/json" };

  const call = async (path: string, init: RequestInit) => {
    const res = await fetch(`https://api.elevenlabs.io${path}`, { ...init, headers });
    const body = await res.text();
    if (!res.ok) throw new Error(`ElevenLabs ${path} failed [${res.status}]: ${body}`);
    return body ? (JSON.parse(body) as Record<string, unknown>) : {};
  };

  const docs: { type: string; id: string; name: string; usage_mode: string }[] = [];

  const textDoc = await call("/v1/convai/knowledge-base/text", {
    method: "POST",
    body: JSON.stringify({ name: KNOWLEDGE_DOC_NAME, text: buildKnowledgeBriefing() }),
  });
  docs.push({ type: "text", id: String(textDoc["id"]), name: KNOWLEDGE_DOC_NAME, usage_mode: "auto" });

  try {
    const urlDoc = await call("/v1/convai/knowledge-base/url", {
      method: "POST",
      body: JSON.stringify({ url: DATASET_SOURCE, name: "Regodit dataset repository" }),
    });
    docs.push({ type: "url", id: String(urlDoc["id"]), name: "Regodit dataset repository", usage_mode: "auto" });
  } catch (error) {
    console.error(error);
  }

  await call(`/v1/convai/agents/${encodeURIComponent(agentId)}`, {
    method: "PATCH",
    body: JSON.stringify({
      conversation_config: { agent: { prompt: { knowledge_base: docs, rag: { enabled: true } } } },
    }),
  });

  return { ok: true, attached: docs.map((doc) => doc.name), error: null as string | null };
});
