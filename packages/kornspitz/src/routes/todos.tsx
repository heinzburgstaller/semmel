import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/todos")({
	component: TodosLayoutComponent,
});

function TodosLayoutComponent() {
	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-white">
			<h1>Layout</h1>
      <Outlet />
		</div>
	);
}
