import { serve } from "bun";
import { app } from "./app";
import { runMigrations } from "./migrate";

await runMigrations();

const port = 4040;

serve({
	port,
	fetch: app.fetch,
});

console.log(`Listening on http://localhost:${port}`);
