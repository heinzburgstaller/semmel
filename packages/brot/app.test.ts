import { describe, expect, it, mock } from "bun:test";
import { testClient } from "hono/testing";
import { app } from "./app";
import type { Todo } from "./schema";

const mockTodos: Todo[] = [
	{ id: "1", todo: "test todo" },
	{ id: "2", todo: "another todo" },
];

mock.module("./db", () => {
	return {
		db: {
			select: () => ({
				from: () => Promise.resolve(mockTodos),
			}),
		},
	};
});

describe("Api", () => {
	// Create the test client from the app instance
	const client = testClient(app);

	it("should return todos", async () => {
		const res = await client.todos.$get();

		// Assertions
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual([
			{
				id: "1",
				todo: "test todo",
			},
			{
				id: "2",
				todo: "another todo",
			},
		]);
	});
});
