import { config } from 'dotenv';
config({ path: '.env.local' });
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './confige/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL,
  },
});
