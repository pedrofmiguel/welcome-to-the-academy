/**
 * Types for quiz-data.js.
 *
 * The data file is plain JS so that `npm run sync:artifact` can emit it
 * verbatim for the published Artifact. This declaration gives the app
 * proper types over it without any casting at the import site.
 */
import type { ClassInfo, Motif, Question, Subclass } from "./types";

export declare const CLASSES: Record<string, ClassInfo>;
export declare const QUESTIONS: Question[];
export declare const TIEBREAKER: Question;
export declare const MOTIFS: Record<string, Motif>;
export declare const MOTIF_QUESTIONS: Question[];
export declare const SUBCLASSES: Record<string, Subclass[]>;
export declare const SOURCES: Record<string, string>;
