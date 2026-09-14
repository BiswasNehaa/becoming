import type { ReactNode } from "react";

import { Login } from "@/pages/Login";
import { useAuth } from "@/hooks/useAuth";
import { isHosted } from "@/lib/supabaseClient";

/** Passes children through untouched in local-only mode; requires a signed-in
 * Supabase session once VITE_SUPABASE_URL/ANON_KEY are configured. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (!isHosted) return <>{children}</>;
  if (loading) return null;
  if (!session) return <Login />;
  return <>{children}</>;
}
