import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { db, dbFileName } from '@/lib/db/schema';

export default {
schema: "./src/lib/db/schema.ts",
out: "./drizzle/migrations",
dialect: 'sqlite',
dbCredentials: {
  url: dbFileName
},
} 
