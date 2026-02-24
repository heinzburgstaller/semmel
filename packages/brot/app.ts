import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "./db";
import * as schema from "./schema";

export const app = new Hono()
	.get("/todos", async (c) => {
		const result = await db.select().from(schema.todos);
		return c.json(result);
	})
	.post("/todos/:text", async (c) => {
		await db.insert(schema.todos).values({ todo: c.req.param("text") });
		return c.text("Created!", 201);
	})
	.delete("/todos/:id", async (c) => {
		await db
			.delete(schema.todos)
			.where(eq(schema.todos.id, c.req.param("id")))
			.returning();
		return c.text("Created!", 201);
	});
