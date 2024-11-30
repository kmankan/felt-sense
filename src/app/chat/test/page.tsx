'use client';

import { useState } from 'react';

export default function AudioPlayer() {
  const [text, setText] = useState('');

  const playAudio = async () => {
    try {
      const response = await fetch('/api/tts/test', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Audio generation failed');

      // Get the audio data as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      console.log("arrayBuffer", arrayBuffer);

      // Create AudioContext
      const audioContext = new AudioContext();
      console.log("audioContext", audioContext);

      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log("audioBuffer", audioBuffer);

      // Create a buffer source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      console.log("source", source);

      // Play the audio
      source.start(0);

      // Cleanup
      source.onended = () => {
        audioContext.close();
      };

    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-md p-2 border rounded-lg"
        placeholder="Enter text to convert to speech..."
        rows={4}
      />
      <button
        onClick={playAudio}
        className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Play Audio
      </button>
    </div>
  );
}