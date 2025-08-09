import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import Database from "better-sqlite3";
import { db } from "@/lib/db/schema";
import * as authSchema from "@/lib/db/auth-schema"; // Import Better-Auth user table schema


export const auth = betterAuth({
database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "pg",
        schema: authSchema
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
export type Session = typeof auth.$Infer.Session