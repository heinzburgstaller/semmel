import {
	createFileRoute,
	type ErrorComponentProps,
	Link,
	useRouter,
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

export const deleteItem = createServerFn({ method: "POST" })
	.inputValidator((data: { todoId: string }) => data)
	.handler(async ({ data }) => {
		const res = await fetch(`http://localhost:4040/todos/${data.todoId}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			throw new Error("Failed to delete item");
		}

		return { success: true, id: data.todoId };
	});

export const Route = createFileRoute("/todos/")({
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
	const router = useRouter();

	const handleDelete = async (id: string) => {
		try {
			await deleteItem({ data: { todoId: id } });
			router.invalidate();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-white">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-black tracking-[-0.02em]">Todos</h1>
				<ul className="mt-8 space-y-3">
					{todos.map((item) => (
						<li
							key={item.id}
							className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-3"
						>
							<Link
								preload={false}
								to="/todos/$todoId"
								params={{ todoId: item.id }}
								className="hover:text-amber-300"
							>
								{item.todo}
							</Link>
							<button
								type="button"
								onClick={() => handleDelete(item.id)}
								className="inline-flex items-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
							>
								Delete
							</button>
						</li>
					))}
				</ul>
			</div>
			<div className="mt-10 flex justify-end border-t border-slate-700/70 pt-6">
				<Link
					to="/todos/new"
					className="inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
				>
					New Todo
				</Link>
			</div>
		</div>
	);
}
