import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import Database from "better-sqlite3";
import { db } from "@/lib/db/schema";

export const auth = betterAuth({
database: drizzleAdapter(db, {
        provider: "sqlite", // or "mysql", "pg"
    }),

  plugins: [username()],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
});
