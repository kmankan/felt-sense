"use client";
import React, { useState, useEffect } from "react";
import { sendAudioStream } from "../client";

export function AudioRecorder() {
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

  return (
    <div className="flex gap-4 p-4">
      <button
        onClick={recordAudio}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Record Audio
      </button>
      <button
        onClick={stopAudio}
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Stop Audio
      </button>
      <div>
        {isRecording ? "Recording..." : "Not recording"}
      </div>
    </div>
  );
}