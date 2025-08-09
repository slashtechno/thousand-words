import { db, profilesTable, moodsTable, user } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import React from "react";
import MoodLineChart from "./MoodLineChart";

// Helper to get user, profile, and moods
async function getUserData(username: string) {
  // Find user by username
  const userRow = await db.query.user.findFirst({
    where: eq(user.username, username),
  });
  if (!userRow) return null;
  // Find profile by userId
  const profile = await db.query.profilesTable.findFirst({
    where: eq(profilesTable.userId, userRow.id),
  });
  if (!profile) return null;
  // Get moods for profile
  const moods = await db.query.moodsTable.findMany({
    where: eq(moodsTable.profileId, profile.id),
    orderBy: desc(moodsTable.timestamp),
    limit: 100,
  });
  return { name: userRow.name, username, moods };
}

// Map moods to colors and ranks
const moodConfig = [
  { key: "happy", label: "Happy", color: "#FFD700" }, // gold
  { key: "neutral", label: "Neutral", color: "#888888" }, // gray
  { key: "angry", label: "Angry", color: "#FF3B30" }, // red
  { key: "fearful", label: "Fearful", color: "#8E44AD" }, // purple
  { key: "disgusted", label: "Disgusted", color: "#27AE60" }, // green
  { key: "surprised", label: "Surprised", color: "#F7CA18" }, // yellow
  { key: "sad", label: "Sad", color: "#3498DB" }, // blue
];

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getUserData(username);
  if (!data) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '20vh' }}>User not found.</div>;
  // Find most recent mood
  const latestMood = data.moods.length > 0 ? data.moods[0].emotion : null;
  const moodLabel = moodConfig.find(m => m.key === latestMood)?.label || latestMood || "No mood";
  const moodColor = moodConfig.find(m => m.key === latestMood)?.color || "#888";
  // Count moods
  const moodCounts: Record<string, number> = {
    neutral: 0, happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0,
  };
  for (const mood of data.moods) {
    if (moodCounts[mood.emotion] !== undefined) moodCounts[mood.emotion]++;
  }
  return (
    <main style={{ minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#111" }}>
      <div style={{ color: moodColor, fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Current emotion: {moodLabel}</div>
      <div style={{ color: "#eee", fontSize: 32, fontWeight: 600, marginBottom: 8 }}>Name: {data.name}</div>
      <div style={{ color: "#aaa", fontSize: 20, marginBottom: 32 }}>@{data.username}</div>
      <div style={{ width: "100%", maxWidth: 900, background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #0002", padding: 32 }}>
        <MoodLineChart moods={data.moods.map(mood => ({
          emotion: mood.emotion,
          confidence: mood.confidence,
          timestamp: mood.timestamp instanceof Date ? Math.floor(mood.timestamp.getTime() / 1000) : Number(mood.timestamp)
        }))} />
      </div>
    </main>
  );
}
