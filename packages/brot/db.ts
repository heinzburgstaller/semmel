import { sql } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

export const db = drizzle(sql);
