import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabase !== null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
    signOut: () => supabase?.auth.signOut(),
  };
}
