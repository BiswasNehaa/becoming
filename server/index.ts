import fs from "node:fs";
import path from "node:path";

import cors from "cors";
import express from "express";

/**
 * A tiny local data API for Daybook.
 *
 * Every module (habits, reading, learning, nutrition, reflections...)
 * stores its records as a JSON array in data/<collection>.json. The React
 * app reads/writes through these endpoints (see src/lib/store.ts), and so
 * can a person editing the files directly (e.g. Claude, appending an entry
 * on your behalf when you describe it in chat) — a page reload always picks
 * up whatever is on disk.
 */

const PORT = 4321;
const DATA_DIR = path.resolve(import.meta.dirname, "..", "data");
const COLLECTION_NAME = /^[a-z][a-z0-9_-]*$/;

fs.mkdirSync(DATA_DIR, { recursive: true });

function collectionPath(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readCollection(name: string): unknown[] {
  try {
    const raw = fs.readFileSync(collectionPath(name), "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCollection(name: string, items: unknown[]) {
  fs.writeFileSync(collectionPath(name), JSON.stringify(items, null, 2), "utf-8");
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/collections/:name", (req, res) => {
  const { name } = req.params;
  if (!COLLECTION_NAME.test(name)) {
    res.status(400).json({ error: "invalid collection name" });
    return;
  }
  res.json(readCollection(name));
});

app.put("/api/collections/:name", (req, res) => {
  const { name } = req.params;
  if (!COLLECTION_NAME.test(name)) {
    res.status(400).json({ error: "invalid collection name" });
    return;
  }
  if (!Array.isArray(req.body)) {
    res.status(400).json({ error: "body must be a JSON array" });
    return;
  }
  writeCollection(name, req.body);
  res.json({ ok: true, count: req.body.length });
});

app.listen(PORT, () => {
  console.log(`[daybook-api] listening on http://localhost:${PORT} — data dir: ${DATA_DIR}`);
});
