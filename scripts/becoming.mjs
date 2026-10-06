import { signedInClient } from "./lib.mjs";

// Usage:
//   node scripts/becoming.mjs list <collection>
//   node scripts/becoming.mjs upsert <collection> '<json object or array, each with an id>'
//   node scripts/becoming.mjs delete <collection> <id>
const [command, collection, arg] = process.argv.slice(2);
if (!command || !collection) {
  console.error("Usage: list <collection> | upsert <collection> <json> | delete <collection> <id>");
  process.exit(1);
}

const { supabase, userId } = await signedInClient();

if (command === "list") {
  const { data, error } = await supabase.from("records").select("data").eq("user_id", userId).eq("collection", collection);
  if (error) throw error;
  console.log(JSON.stringify(data.map((r) => r.data), null, 2));
} else if (command === "upsert") {
  const items = [].concat(JSON.parse(arg));
  if (items.some((i) => !i.id)) throw new Error("Every item needs an id.");
  const { error } = await supabase
    .from("records")
    .upsert(items.map((item) => ({ user_id: userId, collection, id: item.id, data: item })), { onConflict: "user_id,collection,id" });
  if (error) throw error;
  console.log(`Saved ${items.length} item(s) to ${collection}.`);
} else if (command === "delete") {
  const { error } = await supabase.from("records").delete().eq("user_id", userId).eq("collection", collection).eq("id", arg);
  if (error) throw error;
  console.log(`Deleted ${arg} from ${collection}.`);
} else {
  throw new Error(`Unknown command: ${command}`);
}
