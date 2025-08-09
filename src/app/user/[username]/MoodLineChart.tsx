"use client";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const moodMap = {
  happy: { y: 2, color: "#FFD700" }, // top
  neutral: { y: 1, color: "#888888" }, // middle
  sad: { y: 0, color: "#3498DB" }, // bottom
  angry: { y: 0, color: "#FF3B30" }, // bottom, red
  fearful: { y: 0, color: "#8E44AD" }, // bottom, purple
  disgusted: { y: 0, color: "#27AE60" }, // bottom, green
  surprised: { y: 0, color: "#F7CA18" }, // bottom, yellow
};

export default function MoodLineChart({ moods: initialMoods }: { moods: Array<{ emotion: string, confidence: number, timestamp: number }> }) {
  const [moods, setMoods] = useState(initialMoods);
  useEffect(() => {
    const interval = setInterval(() => {
      // Reload data from parent prop (if changed)
      setMoods(initialMoods);
    }, 5000);
    return () => clearInterval(interval);
  }, [initialMoods]);

  // Prepare data for recharts
  const sortedMoods = moods.sort((a, b) => a.timestamp - b.timestamp);
  // If too many points, sample every Nth
  const maxPoints = 40;
  const step = Math.max(1, Math.floor(sortedMoods.length / maxPoints));
  const data = sortedMoods.filter((_, i) => i % step === 0 || i === sortedMoods.length - 1)
    .map(m => {
      const moodInfo = (moodMap as Record<string, { y: number; color: string }>)[m.emotion] || { y: 1, color: "#888888" };
      return {
        time: new Date(m.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: moodInfo.y,
        color: moodInfo.color,
        emotion: m.emotion,
      };
    });

  return (
    <div style={{ width: "100%", height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 40, right: 40, left: 40, bottom: 40 }}>
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#aaa', fontSize: 16 }} />
          <YAxis
            type="number"
            domain={[0, 2]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#aaa', fontSize: 16 }}
            ticks={[0, 1, 2]}
            tickFormatter={v => v === 2 ? "Happy" : v === 1 ? "Neutral" : "Other"}
          />
          <Tooltip
            contentStyle={{ background: "#222", color: "#fff", borderRadius: 12, fontSize: 16 }}
            labelStyle={{ color: "#FFD700" }}
            formatter={undefined}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#222"
            strokeWidth={4}
            dot={({ payload, cx, cy, index }) => (
              <circle key={index} r={10} cx={cx} cy={cy} fill={payload.color} stroke="#fff" strokeWidth={3} />
            )}
            activeDot={{ r: 12 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
