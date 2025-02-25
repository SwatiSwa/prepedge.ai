import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import config from "$/drizzle.config";
import env from "@/lib/env";

// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: env.POSTGRES_URL,
});

const db = drizzle(pool);

async function main() {
    try {
        if (config.out) {
            await migrate(db, { migrationsFolder: config.out });
            console.log("Migration done!");
        }
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await pool.end(); // Close the connection pool
    }
}

main();
