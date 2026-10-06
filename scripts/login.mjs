import fs from "node:fs";
import readline from "node:readline";

import { makeClient, sessionFile } from "./lib.mjs";

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(s);
        else if (s.includes("\n") || s.includes("\r")) rl.output.write("\n");
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const email = await ask("Becoming email: ");
const password = await ask("Password (hidden, never saved): ", true);

const { data, error } = await makeClient().auth.signInWithPassword({ email, password });
if (error || !data.session) {
  console.error(`\nSign-in failed: ${error?.message ?? "no session"}`);
  process.exit(1);
}

fs.writeFileSync(sessionFile, JSON.stringify({ access_token: data.session.access_token, refresh_token: data.session.refresh_token }));
console.log(`\nSigned in as ${data.session.user.email}. Session saved to .becoming-session.json (private, not in git). Password was not stored.`);
