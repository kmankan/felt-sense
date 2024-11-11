"use client";
import React, { useState, useEffect } from "react";
import { sendAudioStream } from "../client";
export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    const initMediaRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const audioBlob = new Blob([event.data], { type: "audio/wav" });
          const audioStream = audioBlob.stream();
          await sendAudioStream(audioStream);
        }
      };
    };

    initMediaRecorder();
  }, []);

  const recordAudio = () => {
    console.log("Recording audio");
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
      console.log("Audio started");
    }
  };

  const stopAudio = () => {
    console.log("Stopping audio");
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Audio stopped");
    }
  };
  console.log("here");
  return (
    <div>
      <h1>Felt Sense</h1>
      <button onClick={recordAudio}>Record Audio</button>
      <button onClick={stopAudio}>Stop Audio</button>
    </div>
  );
}
