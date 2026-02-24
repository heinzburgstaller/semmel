import {
	createFileRoute,
	type ErrorComponentProps,
	Link,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

type Todo = {
	id: string;
	todo: string;
};

const getTodo = createServerFn({ method: "GET" })
	.inputValidator((data: { todoId: string }) => data)
	.handler(async ({ data }) => {
		const response = await fetch(`http://localhost:4040/todos/${data.todoId}`);

		if (!response.ok) {
			throw new Error("Failed to load post");
		}

		return (await response.json()) as Todo;
	});

export const Route = createFileRoute("/todos/$todoId")({
	loader: async ({ params }): Promise<{todo: Todo}> => {
		const todo = await getTodo({ data: { todoId: params.todoId } });
		return { todo };
	},
	pendingComponent: PostPending,
	errorComponent: PostError,
	component: RouteComponent,
});


function PostPending() {
	return <p className="mt-8 text-slate-300">Loading post...</p>;
}

function PostError({ error }: ErrorComponentProps) {
	const message = error instanceof Error ? error.message : "Failed to load post";

	return (
		<div className="mt-8 rounded-lg border border-red-500/60 bg-red-950/40 px-4 py-3 text-red-200">
			{message}
		</div>
	)
}

function RouteComponent() {
	const { todo } = Route.useLoaderData();

	return (
		<>
			<Link to="/todos" className="mt-8 inline-block text-amber-300 hover:text-amber-200">
				← Back to todos
			</Link>
			<div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-3">
				<p className="text-xs text-slate-400">{todo.id}</p>
				<p className="mt-2 text-lg">{todo.todo}</p>
			</div>
		</>
	)
}
