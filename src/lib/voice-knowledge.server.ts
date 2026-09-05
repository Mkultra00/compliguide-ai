import { DATASET_SOURCE } from "./dataset";
import { buildKnowledgeBriefing, KNOWLEDGE_DOC_NAME } from "./voice-knowledge";

const DEFAULT_AGENT_ID = "agent_8401ktcfgjbff6v9msgtsp734ba7";

type KnowledgeDoc = { type: string; id: string; name: string; usage_mode: string };

/**
 * Uploads the dataset briefing to the ElevenLabs knowledge base and attaches it
 * to the agent. Server-only: the API key never leaves this module.
 */
export async function syncKnowledge(): Promise<{
  ok: boolean;
  attached: string[];
  error: string | null;
}> {
  const apiKey = process.env["ELEVENLABS_API_KEY"];
  if (!apiKey) return { ok: false, attached: [], error: "No voice service key configured." };
  const agentId = process.env["ELEVENLABS_AGENT_ID"] ?? DEFAULT_AGENT_ID;
  const headers = { "xi-api-key": apiKey, "content-type": "application/json" };

  const call = async (path: string, init: RequestInit) => {
    const res = await fetch(`https://api.elevenlabs.io${path}`, { ...init, headers });
    const body = await res.text();
    if (!res.ok) throw new Error(`ElevenLabs ${path} failed [${res.status}]: ${body}`);
    return body ? (JSON.parse(body) as Record<string, unknown>) : {};
  };

  const docs: KnowledgeDoc[] = [];

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

  return { ok: true, attached: docs.map((doc) => doc.name), error: null };
}
