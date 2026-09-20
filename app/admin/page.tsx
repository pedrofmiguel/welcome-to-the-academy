import type { Metadata } from "next";
import Smoke from "@/components/Smoke";
import SignInForm from "./SignInForm";
import Roster from "./Roster";
import { isSignedIn } from "@/lib/auth";
import { supabaseAdmin, isConfigured } from "@/lib/supabase";
import { rowToRecord, type CharacterRow, type CharacterRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Roster",
  robots: { index: false, follow: false },
};

async function loadRoster(): Promise<{ rows: CharacterRecord[]; error?: string }> {
  if (!isConfigured()) {
    return {
      rows: [],
      error:
        "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY " +
        "to .env.local, then restart the dev server.",
    };
  }

  const { data, error } = await supabaseAdmin()
    .from("characters")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[admin] roster read failed:", error.message);
    return {
      rows: [],
      error:
        "Could not read the roster. Check that the characters table exists — " +
        "run supabase/schema.sql in the SQL editor.",
    };
  }

  return { rows: (data as CharacterRow[]).map(rowToRecord) };
}

export default async function AdminPage() {
  const authed = await isSignedIn();

  return (
    <>
      <Smoke />
      <main className="shell wide">
        <div className="stack" style={{ gap: ".5rem" }}>
          <p className="label">Restricted · Proctor&rsquo;s office</p>
          <h1 className="spirit-name sm">The Roster</h1>
        </div>

        {!authed ? (
          <SignInForm />
        ) : (
          await (async () => {
            const { rows, error } = await loadRoster();
            return (
              <>
                {error && <p className="note err">{error}</p>}
                <Roster rows={rows} />
              </>
            );
          })()
        )}

        <div className="foot">
          <a href="/">Back to the quiz</a>
          <span>The Vessel · MMXXVI</span>
        </div>
      </main>
    </>
  );
}
