"use client";
// TODO: Update every 1 second but only save every 5 seconds
import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { db, moodsTable } from "@/lib/db/schema";
import { getProfileIdByUserId, saveMood } from "@/app/actions";
import { Session } from "../auth";
type moodsTable = typeof moodsTable.$inferSelect;

const runEvery = 5 * 1000; // 5 seconds

export default function FaceAnalyzer({ session }: { session: Session }) {
  const webcamRef = useRef<Webcam>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [emotions, setEmotions] = useState<{ emotion: string; confidence: number }[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function setup() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0)
        setSelectedDeviceId(videoDevices[0].deviceId);
      // Start interval only after models are loaded
      interval = setInterval(async () => {
        const video = webcamRef.current?.video;
        if (
          video &&
          video.readyState === 4 &&
          video.videoWidth > 0 &&
          video.videoHeight > 0
        ) {
          const detections = await faceapi
            .detectAllFaces(video)
            .withFaceExpressions();
          const newEmotions = detections.map((det) => {
            const expressions = det.expressions;
            if (expressions) {
              const [emotion, confidence] = Object.entries(expressions).reduce((a, b) => (a[1] > b[1] ? a : b));
              return { emotion, confidence };
            }
            return { emotion: "", confidence: 0 };
          });
          setEmotions(newEmotions);
          // console.log("Detected emotions:", newEmotions);
          // Save the first detected emotion to the database
          if (newEmotions.length > 0) {
            const profileId = await getProfileIdByUserId(session.user.id);
            if (profileId !== null) {
              console.log("Saving mood to DB:", {...newEmotions[0], profileId});
              await saveMood({
                ...newEmotions[0],
                profileId,
              });
            }
          }
        }
      }, runEvery);
    }
    setup();
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", width: 320, height: 240 }}>
      <label htmlFor="videoSource">Select Camera: </label>
      <select
        id="videoSource"
        value={selectedDeviceId}
        onChange={(e) => setSelectedDeviceId(e.target.value)}
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>
      <div style={{ position: "relative", width: 320, height: 240 }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{
            deviceId: selectedDeviceId
              ? { exact: selectedDeviceId }
              : undefined,
          }}
          width={320}
          height={240}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        {emotions.length === 0 ? (
          <div>No face detected</div>
        ) : (
          emotions.map((e, i) => (
            <div key={i}>
              <strong>Face {i + 1}:</strong> {e.emotion} ({(e.confidence * 100).toFixed(1)}%)
            </div>
          ))
        )}
      </div>
    </div>
  );
}
