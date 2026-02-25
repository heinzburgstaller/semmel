import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const addTodo = createServerFn({ method: "POST" })
	.inputValidator((formData: FormData) => {
		const rawTodoText = formData.get("todoText");

		if (typeof rawTodoText !== "string" || !rawTodoText.trim()) {
			throw new Error("todoText is required");
		}

		return { todoText: rawTodoText.trim() };
	})
	.handler(async ({ data }) => {
		const res = await fetch(
			`http://localhost:4040/todos/${encodeURIComponent(data.todoText)}`,
			{ method: "POST" },
		);

		if (!res.ok) {
			throw new Error("Failed to create todo");
		}

		throw redirect({ to: "/todos" });
	});

export const Route = createFileRoute("/todos/new")({
	component: NewTodoRoute,
});

function NewTodoRoute() {
	return (
		<main className="mx-auto flex w-full max-w-2xl flex-1 items-start justify-center px-4 py-10 sm:px-6 lg:px-8">
			<section className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
						New Todo
					</h1>
					<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
						Add a new task to your list.
					</p>
				</div>

				<form action={addTodo.url} method="post" className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="todoText"
							className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
						>
							Todo text
						</label>
						<input
							id="todoText"
							name="todoText"
							type="text"
							required
							placeholder="e.g. Buy milk"
							className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
						/>
					</div>

					<div className="flex items-center justify-end">
						<button
							type="submit"
							className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus:ring-zinc-700"
						>
							Add todo
						</button>
					</div>
				</form>
			</section>
		</main>
	);
}
