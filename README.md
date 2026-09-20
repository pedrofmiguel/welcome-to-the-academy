# Welcome to the Academy

A genie reads a player's aura across fourteen questions and names three
D&D class-and-subclass combinations their spirit could pour into. Built
for a session-zero table where everyone has a phone.

There are **two versions of the same quiz**, sharing one set of data:

| | Artifact | This app |
|---|---|---|
| Where | claude.ai (published Artifact) | Vercel |
| Who can open it | Members of your Claude workspace | Anyone with the link |
| Roster storage | Artifact's built-in database | Supabase |
| `/admin` password | In the page source — a doorbell | Server-checked — a lock |
| Setup | None | Env vars + one SQL migration |

---

## How the reading works

**Stage 1 — ten situational questions.** Every answer quietly adds points
to one or more of the thirteen classes. Nothing on screen names a class.
The top three become the vessels on offer.

If the top two, or the third and fourth, finish within a point of each
other, an eleventh **tiebreaker** question appears — the genie complains
that your aura will not settle.

**Stage 2 — four questions about the *flavour* of your power.** These
score fourteen motifs (storm, shadow, fey, forge, void…) rather than
classes.

**The result.** Each of the 126 subclasses carries motif tags. For each of
your top three classes, the app picks the subclass whose tags best match
your motif vector — by cosine similarity, so a subclass with four tags
isn't favoured over one with two.

The payoff is that the three options are always *siblings*. A stormy
spirit gets offered Tempest Cleric / Storm Sorcerer / Storm Herald
Barbarian — the same spirit in three different vessels — rather than
three unrelated picks.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

### Environment

Copy the values into `.env.local` (git-ignored):

| Variable | Where it comes from |
|---|---|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → `service_role` (**not** `anon`) |
| `ADMIN_PASSWORD` | Your choice — opens `/admin` |
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

### Database

Run [`supabase/schema.sql`](supabase/schema.sql) in Supabase → SQL Editor.

Then check the wiring:

```bash
node --env-file=.env.local scripts/check-supabase.mjs
```

It verifies the env vars, the table, and a real write/read/delete cycle.

---

## Security notes

**No Supabase credentials reach the browser.** The quiz posts finished
records to this app's own `/api/characters`, which writes using the
service-role key server-side. The table has RLS enabled with *no
policies*, so even a leaked `anon` key reads nothing.

**The admin password is never sent to the client.** `/admin` compares the
submitted word against `ADMIN_PASSWORD` on the server and sets an
httpOnly cookie holding an HMAC of it. `lib/auth.ts` and `lib/supabase.ts`
both import `server-only`, so importing either into a client component is
a build error rather than a leak.

**The roster polls rather than streaming.** A browser-side Supabase
realtime subscription would need the `anon` key to be able to read the
table, which would make the roster public. `/admin` re-renders on the
server every five seconds instead.

---

## The two copies of the quiz data

`lib/quiz-data.js` is the **single source of truth** — classes,
questions, motifs, all 126 subclasses and their tags.

The published Artifact loads `aura-data.js` as a plain `<script>`, where
`export` is a syntax error. That file is generated:

```bash
npm run sync:artifact     # lib/quiz-data.js  →  aura-data.js
```

**Never edit `aura-data.js` by hand — it gets overwritten.** Edit
`lib/quiz-data.js`, run the sync, then republish the Artifact.

`lib/quiz-data.d.ts` types the JS module for the app.

---

## Layout

```
app/
  page.tsx                 the quiz
  globals.css              design tokens, both themes
  api/characters/route.ts  POST a finished reading
  admin/
    page.tsx               server component; auth gate + roster
    actions.ts             sign in/out, delete, clear
    SignInForm.tsx         password form
    Roster.tsx             live-refreshing list
components/
  Vessel.tsx               the quiz state machine
  Smoke.tsx                canvas lamp smoke
lib/
  quiz-data.js             ← edit this
  quiz-data.d.ts           its types
  scoring.ts               affinity, ranking, the reading
  supabase.ts              server-only client
  auth.ts                  server-only admin session
  types.ts                 shared shapes
scripts/
  sync-artifact.mjs        regenerate aura-data.js
  check-supabase.mjs       connectivity check
vessel.html                the Artifact's page (standalone)
aura-data.js               GENERATED — do not edit
classes.txt                the class/subclass reference this grew from
```

---

## Deploying

```bash
npx vercel
```

Add the four environment variables in the Vercel project settings
(Production and Preview), then redeploy. `.env.local` is not uploaded.
