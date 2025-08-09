import { drizzle } from 'drizzle-orm/libsql';
export const dbFileName = process.env.DB_FILE_NAME || 'file:sqlite.db';
export const db = drizzle(dbFileName);
import { user } from "@/lib/db/auth-schema"; // Import Better-Auth user table schema
export * from "@/lib/db/auth-schema"; // Re-export Better-Auth auth schema (user, session, etc.)



// const user = {id: text("id").primaryKey(), email: text("email").notNull().unique()} // Temporary type to avoid errors, replace with actual import when available
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow().notNull(),
});
