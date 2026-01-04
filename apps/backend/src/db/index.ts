import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../config/env.js';
import * as schema from './schema.js';

// Create postgres connection
const queryClient = postgres(env.DATABASE_URL);

// Create Drizzle ORM instance
export const db = drizzle(queryClient, { schema });

// Export schema for convenience
export { schema };
