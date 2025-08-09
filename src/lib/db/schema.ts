import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
console.log("DATABASE_URL:", process.env.DATABASE_URL);
export const dbUrl = process.env.DATABASE_URL || process.env.DB_URL!;
import { user } from "@/lib/db/auth-schema"; // Import Better-Auth user table schema
export * from "@/lib/db/auth-schema"; // Re-export Better-Auth auth schema (user, session, etc.)
// const user = {id: text("id").primaryKey(), email: text("email").notNull().unique()} // Temporary type to avoid errors, replace with actual import when available
import { integer, pgTable, varchar, serial, real, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
export const profilesTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
  .notNull()
  // Deleting a user will delete their profile as well
  .references(() => user.id, { onDelete: "cascade" }),
  displayName: varchar("display_name", { length: 255 }).notNull(),
});
export const moodsTable = pgTable("mood", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    // Deleting a profile will delete their moods as well
      .references(() => profilesTable.id, { onDelete: "cascade" }),
    emotion: varchar("emotion", { length: 50 }).notNull(),
    confidence: real("confidence").notNull(),
    timestamp: timestamp("timestamp")
      .default(sql`now()`),
  });

const sql_client = neon(dbUrl);
export const db = drizzle(sql_client, { schema: { profilesTable, moodsTable, user } });