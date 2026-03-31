import { sql } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";

const MIGRATIONS_FOLDER = "./drizzle";

const db = drizzle(sql);

async function getAppliedCount(): Promise<number> {
	try {
		const result = await db.$client`
			SELECT COUNT(*)::int AS count FROM drizzle.__drizzle_migrations
		`;
		return result[0]?.count ?? 0;
	} catch {
		// Table doesn't exist yet — first ever run
		return 0;
	}
}

export async function runMigrations(): Promise<void> {
	const localMigrations = readMigrationFiles({
		migrationsFolder: MIGRATIONS_FOLDER,
	});
	const totalOnDisk = localMigrations.length;
	const appliedBefore = await getAppliedCount();
	const pending = totalOnDisk - appliedBefore;

	console.log("Running database migrations...");

	if (pending > 0) {
		console.log(
			`  Pending: ${pending} migration(s) to apply (${totalOnDisk} total on disk, ${appliedBefore} already applied)`,
		);
	} else {
		console.log(
			`  Already up to date. (${appliedBefore} migration(s) applied)`,
		);
	}

	await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });

	const appliedAfter = await getAppliedCount();
	const newlyApplied = appliedAfter - appliedBefore;
	console.log(
		`Migrations applied successfully. (${newlyApplied} applied, ${appliedAfter} total)`,
	);
}

// Allow running standalone: bun run migrate.ts
await runMigrations().catch((err) => {
	console.error("Migration failed:", err);
	process.exit(1);
});
