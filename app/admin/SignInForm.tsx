"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "./actions";

export default function SignInForm() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(
    signInAction,
    {}
  );

  return (
    <form action={formAction} className="stack">
      <p className="note">The lamp keeps its own records. Say the word.</p>

      <div className="field">
        <label className="ask" htmlFor="password">Proctor&rsquo;s word</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          autoFocus
          required
        />
      </div>

      <div className="row">
        <button className="btn solid" type="submit" disabled={pending}>
          {pending ? "Listening…" : "Enter"}
        </button>
        <a className="btn quiet" href="/" style={{ textAlign: "center", textDecoration: "none", lineHeight: "1.6rem" }}>
          Back to the quiz
        </a>
      </div>

      <p className="label" style={{ color: "var(--ember)" }}>
        {state.error ?? " "}
      </p>
    </form>
  );
}
