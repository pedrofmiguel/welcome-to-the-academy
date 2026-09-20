"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clearRoster, deleteCharacter, signOutAction } from "./actions";
import { recordText, sources } from "@/lib/scoring";
import type { CharacterRecord } from "@/lib/types";

/**
 * The roster refreshes itself every few seconds by asking the server
 * component to re-render. The table is unreadable without the
 * service_role key, so the data never travels to anyone who has not
 * already signed in here — which rules out a browser-side realtime
 * subscription, and makes a short poll the honest way to stay live.
 */
const POLL_MS = 5000;

export default function Roster({ rows }: { rows: CharacterRecord[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [live, setLive] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => router.refresh(), POLL_MS);
    return () => clearInterval(t);
  }, [live, router]);

  const byClass = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.className] = (acc[r.className] || 0) + 1;
    return acc;
  }, {});
  const spread = Object.keys(byClass).length;

  async function onDelete(r: CharacterRecord) {
    if (!confirm(`Remove ${r.name || "this character"} from the roster?`)) return;
    setBusy(r.id);
    await deleteCharacter(r.id);
    setBusy(null);
    startTransition(() => router.refresh());
  }

  async function onClear() {
    if (!confirm(`Clear all ${rows.length} records? This cannot be undone.`)) return;
    await clearRoster();
    startTransition(() => router.refresh());
  }

  async function copyAll() {
    const text = rows.map(recordText).join("\n\n") || "No characters yet.";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  }

  return (
    <>
      <div className="rcard-top">
        <button
          type="button"
          className={`live${live ? "" : " off"}`}
          onClick={() => setLive((v) => !v)}
          style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}
          title={live ? "Pause auto-refresh" : "Resume auto-refresh"}
        >
          {live ? (pending ? "Refreshing" : "Listening") : "Paused"}
        </button>
        <span className="label">
          {rows.length} {rows.length === 1 ? "character" : "characters"}
        </span>
      </div>

      {rows.length > 0 && (
        <div className="stats">
          <div className="stat">
            <b>{rows.length}</b>
            <span>Filed</span>
          </div>
          <div className="stat">
            <b>{spread}</b>
            <span>Distinct classes</span>
          </div>
          <div className="stat">
            <b>{new Set(rows.map((r) => r.motifName)).size}</b>
            <span>Distinct spirits</span>
          </div>
        </div>
      )}

      <div className="roster">
        {rows.length === 0 ? (
          <p className="note">
            Nobody has been read yet. Send your players the link and they will
            appear here as they finish.
          </p>
        ) : (
          rows.map((r) => (
            <div className="rcard" key={r.id}>
              <div className="rcard-top">
                <span className="rcard-name">{r.name || "Unnamed"}</span>
                <button
                  className="rcard-del"
                  type="button"
                  onClick={() => onDelete(r)}
                  disabled={busy === r.id}
                >
                  {busy === r.id ? "Removing…" : "Remove"}
                </button>
              </div>
              <div className="rcard-combo">{r.comboShort}</div>
              <div className="note" style={{ fontSize: ".875rem" }}>
                {r.subclassName} · {r.className}
              </div>
              <div className="rcard-meta">
                {r.motifName && <span>{r.motifName}</span>}
                {r.source && <span>{sources[r.source] ?? r.source}</span>}
                <span>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              {r.alternates.length > 0 && (
                <div className="rcard-meta">
                  <span>Passed over: {r.alternates.join(" · ")}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="row">
        <button className="btn quiet" type="button" onClick={copyAll}>
          {copied ? "Copied" : "Copy all"}
        </button>
        {rows.length > 0 && (
          <button className="btn quiet" type="button" onClick={onClear}>
            Clear roster
          </button>
        )}
        <form action={signOutAction}>
          <button className="btn quiet" type="submit">Sign out</button>
        </form>
      </div>
    </>
  );
}
