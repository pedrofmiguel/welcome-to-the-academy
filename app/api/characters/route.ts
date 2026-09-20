import { NextResponse } from "next/server";
import { supabaseAdmin, isConfigured } from "@/lib/supabase";
import type { CharacterRecord } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = {
  name: 40,
  text: 120,
  alternates: 5,
  scores: 300,
};

function clean(v: unknown, limit: number): string {
  return typeof v === "string" ? v.trim().slice(0, limit) : "";
}

/**
 * A finished reading arrives here from the quiz. Everything is bounded
 * and re-derived from the request body — the client is not trusted to
 * send well-formed rows, only plausible ones.
 */
export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "The Academy's files are not connected yet." },
      { status: 503 }
    );
  }

  let body: Partial<CharacterRecord>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const name = clean(body.name, MAX.name);
  const className = clean(body.className, MAX.text);
  const subclassName = clean(body.subclassName, MAX.text);

  if (!name || !className || !subclassName) {
    return NextResponse.json(
      { error: "A record needs a name, a class and a subclass." },
      { status: 400 }
    );
  }

  const alternates = Array.isArray(body.alternates)
    ? body.alternates.slice(0, MAX.alternates).map((a) => clean(a, MAX.text)).filter(Boolean)
    : [];

  const row = {
    id: clean(body.id, 40) || crypto.randomUUID(),
    name,
    class_id: clean(body.classId, 20),
    class_name: className,
    subclass_id: clean(body.subclassId, 40),
    subclass_name: subclassName,
    combo_short: clean(body.comboShort, MAX.text) || `${subclassName} ${className}`,
    source: clean(body.source, 8),
    motif: clean(body.motif, 20),
    motif_name: clean(body.motifName, 40),
    alternates,
    scores: clean(body.scores, MAX.scores),
    created_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin().from("characters").upsert(row, { onConflict: "id" });

  if (error) {
    console.error("[characters] insert failed:", error.message);
    return NextResponse.json(
      { error: "The lamp could not file that. Copy your record instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
}
