import dotenv from 'dotenv';
dotenv.config();

import {defineConfig}  from 'drizzle-kit';
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: isProduction? process.env.NEXT_DATABASE_URL! : process.env.NEXT_LOCAL_DATABASE_URL!,
  },
});
