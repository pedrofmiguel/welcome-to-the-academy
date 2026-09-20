-- ═══════════════════════════════════════════════════════════════
--  Welcome to the Academy — character roster
--  Paste this into Supabase → SQL Editor → Run.
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.characters (
  id             text primary key,
  name           text not null,
  class_id       text not null,
  class_name     text not null,
  subclass_id    text not null,
  subclass_name  text not null,
  combo_short    text not null,
  source         text,
  motif          text,
  motif_name     text,
  alternates     jsonb not null default '[]'::jsonb,
  scores         text,
  created_at     timestamptz not null default now()
);

create index if not exists characters_created_at_idx
  on public.characters (created_at desc);

-- ── Lock the table down ──────────────────────────────────────────
-- RLS on with NO policies means anon and authenticated roles can do
-- nothing at all: no select, no insert, no update, no delete. Even if
-- someone finds your anon key, the roster is unreadable.
--
-- The app never uses the anon key. It talks to this table only from
-- server code using the service_role key, which bypasses RLS. So the
-- quiz can write and /admin can read, and nothing in a player's
-- browser can touch it.

alter table public.characters enable row level security;

-- Belt and braces: revoke the default grants Supabase hands these
-- roles, so the table is unreachable even if a policy is added later
-- by accident.
revoke all on public.characters from anon, authenticated;

-- ── Optional: wipe the roster between campaigns ──────────────────
-- truncate public.characters;
