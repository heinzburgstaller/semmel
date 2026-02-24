import { db } from "./db";
import * as schema from "./schema";

await db
	.insert(schema.todos)
	.values([
		{ todo: "Mow the lawn" },
		{ todo: "Buy beer" },
		{ todo: "Watch Watchmen" },
	]);

console.log(`Seeding complete.`);
