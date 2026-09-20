import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

export function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSubmitting(true);
    setStatus(null);

    const { error } =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })
        : await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);
    if (error) {
      setStatus({ kind: "error", text: error.message });
      return;
    }
    if (mode === "signup") {
      setStatus({ kind: "info", text: "Check your email to confirm the account, then sign in." });
    }
  }

  return (
    <div className="ambient-field flex min-h-screen items-center justify-center bg-paper p-6 text-foreground">
      <div className="glass-panel w-full max-w-sm rounded-3xl p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rainbow-bar grid size-9 place-items-center rounded-xl font-display text-sm font-bold text-glow-foreground shadow-lg">B</div>
          <div>
            <p className="font-display font-semibold leading-none">Becoming</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Personal growth, logged daily</p>
          </div>
        </div>

        <h1 className="font-display text-xl font-semibold">{mode === "signin" ? "Sign in" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your data is private to your own account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Email</label>
            <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Password</label>
            <Input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {status && <p className={status.kind === "error" ? "text-xs text-destructive" : "text-xs text-sage"}>{status.text}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </Button>
        </form>

        <button
          type="button"
          className="mt-5 text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => {
            setMode((m) => (m === "signin" ? "signup" : "signin"));
            setStatus(null);
          }}
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
