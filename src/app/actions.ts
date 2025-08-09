"use server";
import { moodsTable, db, profilesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function saveMood(mood: typeof moodsTable.$inferInsert) {
  await db.insert(moodsTable).values(mood);
}

export async function getProfileIdByUserId(userId: string) {
  const profile = await db.query.profilesTable.findFirst({
    where: eq(profilesTable.userId, userId),
  });
  return profile?.id ?? null;
}

export async function createProfile({
  userId,
  displayName,
}: {
  userId: string;
  displayName: string;
}) {
  await db.insert(profilesTable).values({ userId, displayName });
}