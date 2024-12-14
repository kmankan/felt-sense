'use client';

import { useState } from 'react';

export default function AudioPlayer() {
  const [text, setText] = useState('');

  const playAudio = async () => {
    try {
      const response = await fetch('/api/tts/test/openAI', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Audio generation failed');

      const mediaSource = new MediaSource();
      const audio = new Audio();
      audio.src = URL.createObjectURL(mediaSource);

      mediaSource.addEventListener('sourceopen', async () => {
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        const MINIMUM_CHUNK_SIZE = 64 * 1024; // 64KB buffer size
        let buffer: Uint8Array = new Uint8Array(0);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value instanceof Uint8Array) {
            buffer = concatenateArrays(buffer, value);
          } else {
            throw new Error('Unexpected chunk type');
          }

          if (buffer.length >= MINIMUM_CHUNK_SIZE) {
            if (!sourceBuffer.updating) {
              sourceBuffer.appendBuffer(buffer);
              buffer = new Uint8Array(0);
            }
          }
        }

        if (buffer.length > 0 && !sourceBuffer.updating) {
          sourceBuffer.appendBuffer(buffer);
        }

        await new Promise(resolve => {
          if (!sourceBuffer.updating) {
            resolve(undefined);
          } else {
            sourceBuffer.addEventListener('updateend', () => resolve(undefined), { once: true });
          }
        });

        mediaSource.endOfStream();
      });

      await audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audio.src);
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

function concatenateArrays(a1: Uint8Array, a2: Uint8Array): Uint8Array {
  const result = new Uint8Array(a1.length + a2.length);
  result.set(a1, 0);
  result.set(a2, a1.length);
  return result;
}