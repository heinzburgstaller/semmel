import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
			<section className="relative py-20 px-6 text-center overflow-hidden">
				<h1 className="text-6xl md:text-7xl font-black text-white tracking-[-0.04em]">
					Hello Kornspitz
				</h1>
				<div className="mt-10">
					<Link
						to="/todos"
						className="inline-flex items-center rounded-lg bg-amber-400 px-6 py-3 text-lg font-semibold text-slate-900 transition hover:bg-amber-300"
					>
						Go to Todos
					</Link>
				</div>
			</section>
		</div>
	);
}
