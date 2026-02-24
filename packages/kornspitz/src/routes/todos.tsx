import {
	createFileRoute,
	type ErrorComponentProps,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

type Todo = {
	id: string;
	todo: string;
};

const getTodos = createServerFn({ method: "GET" }).handler(async () => {
	const response = await fetch("http://localhost:4040/todos");
	if (!response.ok) {
		throw new Error(`Failed to load todos (${response.status})`);
	}
	return (await response.json()) as Todo[];
});

export const Route = createFileRoute("/todos")({
	loader: async () => {
		const todos = await getTodos();
		return { todos };
	},
	pendingComponent: TodosPending,
	errorComponent: TodosError,
	component: RouteComponent,
});

function TodosPending() {
	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-white">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-black tracking-[-0.02em]">Todos</h1>
				<p className="mt-8 text-slate-300">Loading todos...</p>
			</div>
		</div>
	);
}

function TodosError({ error }: ErrorComponentProps) {
	const message =
		error instanceof Error ? error.message : "Failed to load todos";

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-white">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-black tracking-[-0.02em]">Todos</h1>
				<div className="mt-8 rounded-lg border border-red-500/60 bg-red-950/40 px-4 py-3 text-red-200">
					{message}
				</div>
			</div>
		</div>
	);
}

function RouteComponent() {
	const { todos } = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-white">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-black tracking-[-0.02em]">Todos</h1>
				<ul className="mt-8 space-y-3">
					{todos.map((item) => (
						<li
							key={item.id}
							className="rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-3"
						>
							{item.todo}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
