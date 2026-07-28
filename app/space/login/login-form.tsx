"use client";

import { useActionState } from "react";
import { loginSpace, type SpaceLoginState } from "./actions";

const initial: SpaceLoginState = {};

export function SpaceLoginForm() {
  const [state, action, pending] = useActionState(loginSpace, initial);

  return (
    <form action={action} className="space-login-form">
      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@exalthuman.com"
        />
      </label>
      <label>
        <span>Team access code</span>
        <input
          name="code"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </label>

      {state.error ? <p className="space-login-error">{state.error}</p> : null}

      <button type="submit" disabled={pending}>
        {pending ? "Checking…" : "Enter Exalt Space"}
      </button>
    </form>
  );
}
