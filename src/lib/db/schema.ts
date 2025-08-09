import { drizzle } from 'drizzle-orm/libsql';
export const dbFileName = process.env.DB_FILE_NAME || 'file:sqlite.db';
export const db = drizzle(dbFileName);
import { user } from "@/lib/db/auth-schema"; // Import Better-Auth user table schema
export * from "@/lib/db/auth-schema"; // Re-export Better-Auth auth schema (user, session, etc.)
// const user = {id: text("id").primaryKey(), email: text("email").notNull().unique()} // Temporary type to avoid errors, replace with actual import when available
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const profilesTable = sqliteTable("profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    // Deleting a user will delete their profile as well
    .references(() => user.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
});
export const moodsTable = sqliteTable("mood", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  profileId: integer("profile_id")
    .notNull()
      // Deleting a profile will delete their moods as well
      .references(() => profilesTable.id, { onDelete: "cascade" }),
    emotion: text("emotion").notNull(),
    confidence: integer("confidence").notNull(),
    timestamp: integer("timestamp").notNull(),
  });