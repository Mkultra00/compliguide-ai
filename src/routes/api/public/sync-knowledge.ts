import { createFileRoute } from "@tanstack/react-router";
import { syncKnowledge } from "@/lib/voice-knowledge.server";

export const Route = createFileRoute("/api/public/sync-knowledge")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const result = await syncKnowledge();
          return Response.json(result);
        } catch (error) {
          console.error(error);
          return Response.json({ ok: false, error: String(error) }, { status: 500 });
        }
      },
    },
  },
});
