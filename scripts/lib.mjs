import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const sessionFile = path.join(root, ".becoming-session.json");

function readEnv() {
  const env = {};
  for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

export function makeClient() {
  const env = readEnv();
  return createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Signs in from the saved refresh token (never a password) and re-saves
 * the rotated tokens so the next run keeps working. */
export async function signedInClient() {
  if (!fs.existsSync(sessionFile)) throw new Error("Not signed in — run `npm run becoming:login` first.");
  const saved = JSON.parse(fs.readFileSync(sessionFile, "utf8"));
  const supabase = makeClient();
  const { data, error } = await supabase.auth.setSession({ access_token: saved.access_token, refresh_token: saved.refresh_token });
  if (error || !data.session) throw new Error(`Session expired — run \`npm run becoming:login\` again. (${error?.message ?? "no session"})`);
  fs.writeFileSync(sessionFile, JSON.stringify({ access_token: data.session.access_token, refresh_token: data.session.refresh_token }));
  return { supabase, userId: data.session.user.id };
}
