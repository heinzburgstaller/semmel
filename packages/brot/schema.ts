import type { InferSelectModel } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const todos = pgTable("todo", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	todo: text("todo").notNull(),
	comment: text("comment"),
});

export type Todo = InferSelectModel<typeof todos>;
