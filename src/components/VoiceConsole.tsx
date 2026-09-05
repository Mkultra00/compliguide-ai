import { useConversation } from "@elevenlabs/react";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { getVoiceToken } from "@/lib/voice.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AGENT_KEY = "bc.voice.agentId";

type Turn = { who: "analyst" | "agent"; text: string };

export function VoiceConsole() {
  const [agentId, setAgentId] = useState("");
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const mintToken = useServerFn(getVoiceToken);

  useEffect(() => {
    const stored = window.localStorage.getItem(AGENT_KEY);
    if (stored) setAgentId(stored);
  }, []);

  const conversation = useConversation({
    onMessage: (message: unknown) => {
      const m = message as { source?: string; message?: string };
      if (!m?.message) return;
      setTurns((prev) => [...prev, { who: m.source === "user" ? "analyst" : "agent", text: m.message! }]);
    },
    onError: (error: unknown) => {
      console.error(error);
      setNotice("The assistant disconnected. Check the agent settings and try again.");
    },
  });

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [turns]);

  const connected = conversation.status === "connected";

  const start = useCallback(async () => {
    setNotice(null);
    setBusy(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const { token, error } = await mintToken({ data: { agentId } });
      if (error) {
        setNotice(error);
        return;
      }
      if (token) {
        await conversation.startSession({ conversationToken: token, connectionType: "webrtc" });
      } else {
        await conversation.startSession({ agentId, connectionType: "webrtc" });
      }
    } catch (error) {
      console.error(error);
      setNotice("Microphone access is needed to talk to the assistant.");
    } finally {
      setBusy(false);
    }
  }, [agentId, conversation, mintToken]);

  const stop = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text || !connected) return;
    conversation.sendUserMessage(text);
    setDraft("");
  }, [connected, conversation, draft]);

  return (
    <section className="panel flex max-h-[38rem] flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="label-eyebrow">Analyst assistant</p>
        <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          <span
            className={
              connected
                ? "h-2 w-2 rounded-full bg-voice shadow-glow"
                : "h-2 w-2 rounded-full bg-muted-foreground/50"
            }
          />
          {connected ? (conversation.isSpeaking ? "speaking" : "listening") : "offline"}
        </span>
      </div>

      {!agentId ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Paste your assistant ID to enable voice. It is stored on this device only.
          </p>
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Assistant ID"
            className="font-mono text-xs"
          />
          <Button
            className="w-full"
            disabled={draft.trim() === ""}
            onClick={() => {
              const value = draft.trim();
              window.localStorage.setItem(AGENT_KEY, value);
              setAgentId(value);
              setDraft("");
            }}
          >
            Save
          </Button>
        </div>
      ) : (
        <>
          <div ref={scroller} className="mt-4 min-h-24 flex-1 space-y-3 overflow-y-auto pr-1">
            {turns.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ask what is at the top of the queue, who owns a machine account, or what a case still needs
                before it can be signed off. Every figure it quotes comes from the record, not from the model.
              </p>
            ) : (
              turns.map((turn, index) => (
                <div key={index} className="space-y-1">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    {turn.who}
                  </p>
                  <p className={turn.who === "agent" ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>
                    {turn.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {notice ? <p className="mt-3 text-xs text-destructive">{notice}</p> : null}

          <div className="mt-4 space-y-2">
            {connected ? (
              <>
                <div className="flex gap-2">
                  <Input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") send();
                    }}
                    placeholder="Type instead of speaking"
                    className="text-sm"
                  />
                  <Button variant="secondary" onClick={send} disabled={draft.trim() === ""}>
                    Send
                  </Button>
                </div>
                <Button variant="secondary" className="w-full" onClick={stop}>
                  End session
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={start} disabled={busy}>
                {busy ? "Connecting…" : "Start session"}
              </Button>
            )}
            <button
              type="button"
              className="w-full text-left font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              onClick={() => {
                window.localStorage.removeItem(AGENT_KEY);
                setAgentId("");
                setTurns([]);
              }}
            >
              change assistant
            </button>
          </div>
        </>
      )}
    </section>
  );
}
