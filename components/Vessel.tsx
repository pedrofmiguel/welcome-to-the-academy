"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addScores,
  buildReading,
  classes,
  fillName,
  motifQuestions,
  needsTiebreaker,
  questions,
  ranked,
  recordText,
  sources,
  tiebreaker,
  type Combo,
  type Reading,
  type Scores,
} from "@/lib/scoring";
import type { CharacterRecord, Question } from "@/lib/types";

type Stage = "gate" | "quiz" | "reveal" | "record";
interface Step { q: Question; stage: 1 | 2 }

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0l2.2 7.1L21 4l-3.1 6.8L24 12l-6.1 1.2L21 20l-6.8-3.1L12 24l-2.2-7.1L3 20l3.1-6.8L0 12l6.1-1.2L3 4l6.8 3.1z" />
  </svg>
);

export default function Vessel() {
  const [stage, setStage] = useState<Stage>("gate");
  const [name, setName] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [idx, setIdx] = useState(0);
  const [classScores, setClassScores] = useState<Scores>({});
  const [motifScores, setMotifScores] = useState<Scores>({});
  const [reading, setReading] = useState<Reading | null>(null);
  const [record, setRecord] = useState<CharacterRecord | null>(null);
  const [saveNote, setSaveNote] = useState(" ");
  const [copied, setCopied] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  /* ── theme toggle ─────────────────────────────────────────── */
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);
  const toggleTheme = () => {
    const now =
      theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = now === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
    document.dispatchEvent(new Event("themechange"));
  };

  /* ── press and hold the vessel ────────────────────────────── */
  const orbRef = useRef<HTMLButtonElement>(null);
  const [orbText, setOrbText] = useState("Press and hold\nthe vessel");
  const holdRef = useRef({ t0: 0, raf: 0, done: false });

  const setFill = (v: number) =>
    orbRef.current?.style.setProperty("--fill", v.toFixed(3));

  const finishHold = useCallback(() => {
    holdRef.current.done = true;
    setFill(1);
    setOrbText("…ah.");
    const player = (nameRef.current?.value ?? "").trim().slice(0, 40);
    setTimeout(() => {
      setName(player);
      setSteps(questions.map((q) => ({ q, stage: 1 as const })));
      setIdx(0);
      setClassScores({});
      setMotifScores({});
      setStage("quiz");
    }, 420);
  }, []);

  const cancelHold = useCallback(() => {
    if (holdRef.current.done) return;
    cancelAnimationFrame(holdRef.current.raf);
    setFill(0);
    setOrbText("Press and hold\nthe vessel");
  }, []);

  const beginHold = useCallback(
    (e?: React.PointerEvent) => {
      if (holdRef.current.done) return;
      e?.preventDefault();
      if (!(nameRef.current?.value ?? "").trim()) {
        setOrbText("Your name\nfirst");
        nameRef.current?.focus();
        return;
      }
      setOrbText("Hold…");
      holdRef.current.t0 = performance.now();
      cancelAnimationFrame(holdRef.current.raf);
      const frame = (now: number) => {
        const p = Math.min(1, (now - holdRef.current.t0) / 1100);
        setFill(p);
        if (p >= 1) finishHold();
        else holdRef.current.raf = requestAnimationFrame(frame);
      };
      holdRef.current.raf = requestAnimationFrame(frame);
    },
    [finishHold]
  );

  useEffect(() => () => cancelAnimationFrame(holdRef.current.raf), []);

  /* ── answering ────────────────────────────────────────────── */
  const current = steps[idx];

  function answer(step: Step, score: Scores) {
    const nextClass = { ...classScores };
    const nextMotif = { ...motifScores };
    addScores(step.stage === 1 ? nextClass : nextMotif, score);
    setClassScores(nextClass);
    setMotifScores(nextMotif);

    const at = idx + 1;

    // After the ten class questions, queue a tiebreaker when the reading
    // cannot separate a top three, then the four motif questions.
    if (step.stage === 1 && at === questions.length) {
      const tail: Step[] = [];
      if (needsTiebreaker(nextClass)) tail.push({ q: tiebreaker, stage: 1 });
      motifQuestions.forEach((q) => tail.push({ q, stage: 2 }));
      setSteps((s) => [...s, ...tail]);
      setIdx(at);
      return;
    }

    if (at >= steps.length) {
      setReading(buildReading(nextClass, nextMotif));
      setStage("reveal");
      return;
    }
    setIdx(at);
  }

  /* ── choosing a vessel ────────────────────────────────────── */
  async function choose(combo: Combo) {
    if (!reading) return;
    const id =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    const rec: CharacterRecord = {
      id,
      name,
      classId: combo.classId,
      className: combo.cls.name,
      subclassId: combo.sub.id,
      subclassName: combo.sub.name,
      comboShort: `${combo.sub.short} ${combo.cls.name}`.toUpperCase(),
      source: combo.sub.src,
      motif: reading.motifKey,
      motifName: reading.motif.name,
      alternates: reading.combos
        .filter((c) => c !== combo)
        .map((c) => `${c.sub.short} ${c.cls.name}`),
      scores: reading.classRank
        .slice(0, 5)
        .map((r) => `${classes[r.k].name} ${r.v}`)
        .join(", "),
      createdAt: new Date().toISOString(),
    };

    setRecord(rec);
    setStage("record");
    setSaveNote("Filing with the Academy…");

    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rec),
      });
      setSaveNote(
        res.ok
          ? "Filed with the Academy. Your DM can already see it."
          : "Could not file it — show this to your DM instead."
      );
    } catch {
      setSaveNote("Could not reach the Academy — show this to your DM instead.");
    }
  }

  function restart() {
    holdRef.current.done = false;
    setFill(0);
    setOrbText("Press and hold\nthe vessel");
    setName("");
    setSteps([]);
    setIdx(0);
    setClassScores({});
    setMotifScores({});
    setReading(null);
    setRecord(null);
    setSaveNote(" ");
    setCopied(false);
    setStage("gate");
    setTimeout(() => nameRef.current?.focus(), 50);
  }

  async function copyRecord() {
    if (!record) return;
    try {
      await navigator.clipboard.writeText(recordText(record));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setSaveNote("Copying is blocked here — screenshot it instead.");
    }
  }

  const spectrum = useMemo(() => {
    if (!reading) return [];
    const max = reading.classRank[0]?.v || 1;
    return reading.classRank.slice(0, 6).map(({ k, v }) => ({
      name: classes[k].name,
      v,
      pct: Math.round((v / max) * 100),
    }));
  }, [reading]);

  /* ══ GATE ═══════════════════════════════════════════════════ */
  if (stage === "gate") {
    return (
      <main className="shell fade">
        <div className="stack" style={{ gap: ".6rem" }}>
          <p className="label">Welcome to the Academy · Aptitude Reading</p>
          <p className="genie">
            There is a lamp on the table, and something inside it is awake. It does
            not introduce itself. It rarely does.
          </p>
          <p className="note">
            <em>
              &ldquo;Before I look at you properly — and I will look properly — I
              would like to know what to call you.&rdquo;
            </em>
          </p>
        </div>

        <div className="field">
          <label className="ask" htmlFor="pname">
            What is your name, future hero?
          </label>
          <input
            type="text"
            id="pname"
            ref={nameRef}
            placeholder="Speak it, or write it here"
            autoComplete="off"
            maxLength={40}
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                orbRef.current?.focus();
              }
            }}
          />
        </div>

        <div className="rule"><Star /></div>

        <div className="orbwrap">
          <button
            className="orb"
            ref={orbRef}
            aria-describedby="orbhint"
            onPointerDown={beginHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault();
                beginHold();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") cancelHold();
            }}
          >
            <span className="orb-text" style={{ whiteSpace: "pre-line" }}>
              {orbText}
            </span>
          </button>
          <p className="label" id="orbhint" style={{ textAlign: "center" }}>
            Fourteen questions · about four minutes
          </p>
        </div>

        <div className="foot">
          <a href="/admin">Proctor</a>
          <button className="linkish" type="button" onClick={toggleTheme}>
            {(theme ?? "dark") === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </main>
    );
  }

  /* ══ QUIZ ═══════════════════════════════════════════════════ */
  if (stage === "quiz" && current) {
    return (
      <main className="shell">
        <div className="stack" style={{ gap: ".75rem" }}>
          <div
            className="progress"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuenow={idx}
            aria-valuemin={0}
            aria-valuemax={steps.length}
          >
            {steps.map((s, i) => (
              <span
                key={i}
                className={[
                  "pip",
                  s.stage === 2 ? "stage2" : "",
                  i < idx ? "done" : i === idx ? "now" : "",
                ].filter(Boolean).join(" ")}
              />
            ))}
          </div>
          <p className="label">{current.q.title}</p>
        </div>

        <div key={idx} className="stack fade">
          <p className="genie">{fillName(current.q.prompt, name)}</p>
          <p className="ask">{fillName(current.q.ask, name)}</p>
          <div className="answers">
            {current.q.answers.map((a, i) => (
              <button
                key={i}
                type="button"
                className="answer"
                onClick={() => answer(current, a.score)}
              >
                <span className="k">{String.fromCharCode(65 + i)}</span>
                <span>{a.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="foot">
          <button className="linkish" type="button" onClick={restart}>
            Start over
          </button>
          <span>{idx + 1} / {steps.length}</span>
        </div>
      </main>
    );
  }

  /* ══ REVEAL ═════════════════════════════════════════════════ */
  if (stage === "reveal" && reading) {
    return (
      <main className="shell fade">
        <div className="stack" style={{ gap: ".5rem" }}>
          <p className="label">The reading is finished, {name}</p>
          <h1 className="spirit-name">Your spirit is {reading.motif.name}</h1>
          <p className="note">{reading.motif.line}</p>
        </div>

        <p className="genie">{fillName(reading.combos[0].cls.reading, name)}</p>

        <div className="rule"><Star /></div>

        <p className="ask">
          Three vessels will hold a spirit like yours. Choose one, {name}.
        </p>

        <div className="stack" style={{ gap: ".6rem" }}>
          {reading.combos.map((c, i) => (
            <button
              key={c.classId}
              type="button"
              className="combo"
              onClick={() => choose(c)}
            >
              <p className="combo-name">
                {c.sub.short} <span className="cls">{c.cls.name}</span>
              </p>
              <p className="combo-blurb">{c.sub.blurb}</p>
              <div className="combo-meta">
                <span
                  className={`tag${c.sub.src === "UA" ? " ua" : ""}`}
                  title={sources[c.sub.src] ?? c.sub.src}
                >
                  {c.sub.src}
                </span>
                <span className="tag">{i === 0 ? "Strongest pull" : "Also true"}</span>
                {c.sub.note && (
                  <span className="tag" title={c.sub.note}>Revised in UA</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <details className="stack" style={{ gap: ".6rem" }}>
          <summary className="label">How your aura fell</summary>
          <div className="spectrum">
            {spectrum.map((s) => (
              <div className="spec-row" key={s.name}>
                <span>{s.name}</span>
                <span className="spec-bar"><i style={{ width: `${s.pct}%` }} /></span>
                <span className="spec-num">{s.v}</span>
              </div>
            ))}
          </div>
        </details>

        <div className="foot">
          <button className="linkish" type="button" onClick={restart}>
            Read another aura
          </button>
        </div>
      </main>
    );
  }

  /* ══ RECORD ═════════════════════════════════════════════════ */
  if (stage === "record" && record) {
    const rows: [string, React.ReactNode][] = [
      ["Name", <strong key="n">{record.name}</strong>],
      ["Class", <strong key="c">{record.className}</strong>],
      ["Subclass", <strong key="s">{record.subclassName}</strong>],
      ["Source", sources[record.source] ?? record.source],
      ["Spirit", record.motifName],
      ["Also true", record.alternates.join(" · ")],
      ["Filed", new Date(record.createdAt).toLocaleString()],
    ];

    return (
      <main className="shell fade">
        <div className="stack" style={{ gap: ".5rem" }}>
          <p className="label">Enrolment record · filed</p>
          <h1 className="spirit-name">{record.comboShort}</h1>
        </div>

        <p className="genie">
          Then it is settled, {name}. The lamp has written it down, and the lamp
          does not misplace things.
        </p>

        <div className="record">
          <div className="record-head">
            <span className="label" style={{ color: "var(--brass)" }}>The Academy</span>
            <span className="label">№ {record.id.slice(-6).toUpperCase()}</span>
          </div>
          <dl className="record-body">
            {rows.map(([k, v]) => (
              <div className="rrow" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="row">
          <button className="btn solid" type="button" onClick={copyRecord}>
            {copied ? "Copied" : "Copy record"}
          </button>
          <button className="btn quiet" type="button" onClick={restart}>
            Read another aura
          </button>
        </div>

        <p className="label" style={{ textAlign: "center" }}>{saveNote}</p>

        <div className="foot">
          <span>Show this to your Dungeon Master</span>
        </div>
      </main>
    );
  }

  return null;
}
