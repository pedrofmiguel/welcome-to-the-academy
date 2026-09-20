import {
  CLASSES,
  QUESTIONS,
  TIEBREAKER,
  MOTIFS,
  MOTIF_QUESTIONS,
  SUBCLASSES,
  SOURCES,
} from "./quiz-data.js";
import type { ClassInfo, Motif, Question, Subclass } from "./types";

/* The data file is plain JS; give it shape on the way in. */
export const classes = CLASSES as Record<string, ClassInfo>;
export const questions = QUESTIONS as Question[];
export const tiebreaker = TIEBREAKER as Question;
export const motifs = MOTIFS as Record<string, Motif>;
export const motifQuestions = MOTIF_QUESTIONS as Question[];
export const subclasses = SUBCLASSES as Record<string, Subclass[]>;
export const sources = SOURCES as Record<string, string>;

export type Scores = Record<string, number>;

export interface Combo {
  classId: string;
  cls: ClassInfo;
  sub: Subclass;
}

export interface Reading {
  motifKey: string;
  motif: Motif;
  combos: Combo[];
  classRank: { k: string; v: number }[];
  motifRank: { k: string; v: number }[];
}

export function addScores(target: Scores, score: Scores): void {
  for (const k in score) target[k] = (target[k] || 0) + score[k];
}

export function ranked(scores: Scores, keys: string[]): { k: string; v: number }[] {
  return keys
    .map((k) => ({ k, v: scores[k] || 0 }))
    .sort((a, b) => b.v - a.v || a.k.localeCompare(b.k));
}

/**
 * Cosine similarity between the player's motif vector and a subclass's
 * tags. Cosine rather than a raw dot product so a subclass carrying four
 * tags is not favoured over one carrying two.
 */
export function affinity(tags: Scores, motifVector: Scores): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const m in tags) {
    dot += tags[m] * (motifVector[m] || 0);
    na += tags[m] * tags[m];
  }
  for (const m in motifVector) nb += motifVector[m] * motifVector[m];
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/** True when the class scores cannot cleanly separate a top three. */
export function needsTiebreaker(classScores: Scores): boolean {
  const r = ranked(classScores, Object.keys(classes));
  if (r.length < 4) return false;
  return r[0].v - r[1].v < 1 || r[2].v - r[3].v < 1;
}

/**
 * The whole reading: top three classes, the dominant motif, and the
 * subclass inside each class that best matches that motif. The three
 * combos come out as siblings — one stormy spirit in three vessels.
 */
export function buildReading(classScores: Scores, motifScores: Scores): Reading {
  const classRank = ranked(classScores, Object.keys(classes));
  const motifRank = ranked(motifScores, Object.keys(motifs));
  const motifKey = motifRank[0].k;

  const combos: Combo[] = classRank.slice(0, 3).map(({ k: classId }) => {
    const list = subclasses[classId];
    const best = list
      .map((s) => ({ s, a: affinity(s.tags, motifScores) }))
      .sort((x, y) => y.a - x.a)[0].s;
    return { classId, cls: classes[classId], sub: best };
  });

  return { motifKey, motif: motifs[motifKey], combos, classRank, motifRank };
}

export function fillName(text: string, name: string): string {
  return text.replace(/\{name\}/g, name || "friend");
}

export function recordText(r: {
  name: string;
  className: string;
  subclassName: string;
  source: string;
  motifName: string;
  alternates: string[];
  createdAt: string;
}): string {
  return [
    "THE ACADEMY — ENROLMENT RECORD",
    `Name:     ${r.name}`,
    `Class:    ${r.className}`,
    `Subclass: ${r.subclassName} (${r.source})`,
    `Spirit:   ${r.motifName}`,
    `Also:     ${r.alternates.join(" · ")}`,
    `Filed:    ${new Date(r.createdAt).toLocaleString()}`,
  ].join("\n");
}
