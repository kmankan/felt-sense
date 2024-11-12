"use client";
import React, { useState, useEffect } from "react";
import { sendAudioStream } from "../client";

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [volumeLevels, setVolumeLevels] = useState<number[]>(Array(15).fill(0));
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const initMediaRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const context = new AudioContext();
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 32;

      const source = context.createMediaStreamSource(stream);
      source.connect(analyserNode);

      setAudioContext(context);
      setAnalyser(analyserNode);

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

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateVolumeLevels = () => {
      if (analyser && isRecording) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        const newLevels = Array.from(dataArray)
          .slice(0, 15)
          .map(value => value / 255);

        setVolumeLevels(newLevels);
      }
      animationFrameId = requestAnimationFrame(updateVolumeLevels);
    };

    if (isRecording) {
      updateVolumeLevels();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRecording, analyser]);
  console.log(volumeLevels);

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
      {isRecording && <div className="flex gap-2">
        {volumeLevels.slice(5, 15).map((level, index) => (
          <div
            key={index}
            className="bg-gray-300"
            style={{
              height: `${level * 100}px`, // Scale the height based on the volume level
              width: '10px', // Width of each column
              transition: 'height 0.1s ease-in-out' // Smooth transition for height changes
            }}
          />
        ))}
      </div>}
    </div>
  );
}