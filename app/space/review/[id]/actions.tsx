"use client";

import { useState } from "react";

export function ReviewActions({
  id,
  status,
  slug,
  hasDraft,
}: {
  id: string;
  status: string;
  slug: string;
  hasDraft: boolean;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  async function patch(next: string, scheduledFor?: string | null) {
    setBusy(next);
    setMsg("");
    try {
      const res = await fetch("/api/space/pipeline", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status: next, scheduledFor: scheduledFor ?? null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setMsg(data.error || "Something went wrong.");
        setBusy(null);
        return;
      }
      if (next === "live") {
        window.location.href = `/articles/${slug}`;
      } else {
        window.location.href = "/space";
      }
    } catch {
      setMsg("Couldn't reach the server. Try again.");
      setBusy(null);
    }
  }

  function schedule() {
    const v = window.prompt("Publish on (YYYY-MM-DD):", "");
    if (v === null) return;
    const d = v.trim() ? new Date(v.trim()) : null;
    patch("scheduled", d && !isNaN(d.getTime()) ? d.toISOString() : null);
  }

  return (
    <div className="rev-actions">
      <style>{CSS}</style>
      {msg ? <span className="rev-msg">{msg}</span> : null}
      {status !== "idea" ? (
        <button className="a-ghost" disabled={!!busy} onClick={() => patch("idea")}>
          {busy === "idea" ? "…" : "Send back to Planning"}
        </button>
      ) : null}
      {hasDraft && status !== "scheduled" ? (
        <button className="a-ghost" disabled={!!busy} onClick={schedule}>
          {busy === "scheduled" ? "…" : "Schedule"}
        </button>
      ) : null}
      {hasDraft && status !== "live" ? (
        <button className="a-primary" disabled={!!busy} onClick={() => patch("live")}>
          {busy === "live" ? "Publishing…" : "Approve & publish"}
        </button>
      ) : null}
      {status === "live" ? (
        <a className="a-primary" href={`/articles/${slug}`}>View live</a>
      ) : null}
    </div>
  );
}

const CSS = `
  .rev-actions { position: fixed; left: 0; right: 0; bottom: 0; z-index: 10;
    display: flex; align-items: center; justify-content: flex-end; gap: 10px;
    padding: 12px clamp(16px,4vw,40px); background: rgba(12,13,16,.92);
    backdrop-filter: blur(12px); border-top: 1px solid #24262d; }
  .rev-msg { margin-right: auto; font-size: 13px; color: #ff9a80; }
  .rev-actions button, .rev-actions a { font-size: 13.5px; font-weight: 650; border-radius: 9px;
    padding: 10px 16px; cursor: pointer; text-decoration: none; font-family: inherit; }
  .a-ghost { background: transparent; border: 1px solid #2e3038; color: #b7bcc4; }
  .a-ghost:hover { color: #fff; border-color: #3a3f49; }
  .a-primary { background: #ff5a2c; border: 0; color: #140a06; }
  .a-primary:hover { filter: brightness(1.06); }
  .rev-actions button:disabled { opacity: .6; cursor: default; }
`;
