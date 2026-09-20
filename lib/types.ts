/** Shapes shared by the quiz, the API route and the roster. */

export type ClassId = string;
export type MotifId = string;

export interface ClassInfo {
  name: string;
  blurb: string;
  reading: string;
}

export interface Subclass {
  id: string;
  name: string;
  short: string;
  src: string;
  blurb: string;
  note?: string;
  tags: Record<MotifId, number>;
}

export interface Answer {
  text: string;
  score: Record<string, number>;
}

export interface Question {
  id: string;
  title: string;
  prompt: string;
  ask: string;
  answers: Answer[];
}

export interface Motif {
  name: string;
  line: string;
}

/** One finished reading, as stored and as the roster renders it. */
export interface CharacterRecord {
  id: string;
  name: string;
  classId: string;
  className: string;
  subclassId: string;
  subclassName: string;
  comboShort: string;
  source: string;
  motif: string;
  motifName: string;
  alternates: string[];
  scores: string;
  createdAt: string;
}

/** The same record as it sits in Postgres (snake_case columns). */
export interface CharacterRow {
  id: string;
  name: string;
  class_id: string;
  class_name: string;
  subclass_id: string;
  subclass_name: string;
  combo_short: string;
  source: string | null;
  motif: string | null;
  motif_name: string | null;
  alternates: string[] | null;
  scores: string | null;
  created_at: string;
}

export function rowToRecord(r: CharacterRow): CharacterRecord {
  return {
    id: r.id,
    name: r.name,
    classId: r.class_id,
    className: r.class_name,
    subclassId: r.subclass_id,
    subclassName: r.subclass_name,
    comboShort: r.combo_short,
    source: r.source ?? "",
    motif: r.motif ?? "",
    motifName: r.motif_name ?? "",
    alternates: Array.isArray(r.alternates) ? r.alternates : [],
    scores: r.scores ?? "",
    createdAt: r.created_at,
  };
}
