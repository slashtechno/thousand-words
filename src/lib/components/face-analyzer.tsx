"use client";
import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { db, moodsTable } from "@/lib/db/schema";

type moodsTable = typeof moodsTable.$inferSelect;

export default function FaceAnalyzer() {
  const webcamRef = useRef<Webcam>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [emotions, setEmotions] = useState<{ emotion: string; confidence: number }[]>([]);

  useEffect(() => {
    async function setup() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0)
        setSelectedDeviceId(videoDevices[0].deviceId);
    }
    setup();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
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
        console.log("Detected emotions:", newEmotions);
      }
    }, 500);
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
