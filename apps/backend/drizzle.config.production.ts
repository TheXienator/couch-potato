import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// Ensure SSL is enabled for production database connections
const productionUrl = process.env.PRODUCTION_DATABASE_URL!;
const urlWithSsl = productionUrl.includes('?')
  ? `${productionUrl}&ssl=true`
  : `${productionUrl}?ssl=true`;

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: urlWithSsl,
  },
  verbose: true,
  strict: true,
});
