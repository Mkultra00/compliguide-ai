import { createServerFn } from "@tanstack/react-start";

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
