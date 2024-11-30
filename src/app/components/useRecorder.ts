import { useState, useEffect } from 'react';
import { transcribeAudioStream, speakText, callLLM } from "../../lib/api/SendAudioStream";

interface UseRecorderProps {
  conversationId: string | null;
  setConversationState: (state: string) => void;
}


export const useRecorder = ({ conversationId, setConversationState }: UseRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [volumeLevels, setVolumeLevels] = useState<number[]>(Array(15).fill(0));
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (conversationId) {
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

            await transcribeAudioStream(audioStream, conversationId);
            const response = await callLLM(conversationId);
            speakText(response.response);
          }
        };
      };

      initMediaRecorder();
      return () => {
        if (audioContext) {
          audioContext.close();
        }
      };
    }
  }, [conversationId, audioContext]);

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

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
      setConversationState("listening");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setConversationState("thinking");
    }
  };

  return {
    isRecording,
    volumeLevels,
    startRecording,
    stopRecording
  };
};