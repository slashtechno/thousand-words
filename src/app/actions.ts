import { moodsTable, db } from "@/lib/db/schema";

async function saveMood(mood: typeof moodsTable.$inferInsert) {
  "use server";
  await db.insert(moodsTable).values(mood);
}