import type { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todo", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	todo: text("todo").notNull(),
});

export type Todo = InferSelectModel<typeof todos>;
