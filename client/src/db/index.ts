import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "@/db/schema";
import env from "@/lib/env";

// Optimize fetch requests for Neon
neonConfig.fetchConnectionCache = true;

const sql = neon(env.POSTGRES_URL);

export const db = drizzle(sql, { schema });

export type DB = typeof db;
