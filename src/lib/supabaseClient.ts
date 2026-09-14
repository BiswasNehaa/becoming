import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * `null` when Supabase isn't configured (no .env.local yet) — everything
 * that touches this falls back to the local file-backed API instead, so
 * the app keeps working during local-only development.
 */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const isHosted = supabase !== null;
