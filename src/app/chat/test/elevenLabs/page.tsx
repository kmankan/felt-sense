'use client';

import { useState } from 'react';
import { elevenLabsVoices } from '@/lib/api/elevenLabs/voices';

export default function AudioPlayer() {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('Brian');
  const voices = elevenLabsVoices.map(voice => voice.name);

  const handleVoiceChange = (selectedName: string) => {
    const selectedVoice = elevenLabsVoices.find(voice => voice.name === selectedName);
    if (selectedVoice) {
      setVoiceId(selectedVoice.name);
    }
  };

  const playAudio = async () => {
    try {
      const response = await fetch('/api/tts/test/elevenLabs', {
        method: 'POST',
        body: JSON.stringify({ text, voiceId }),
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
    <div className="flex border-2 min-h-screen gap-4 p-4">
      <div className="w-1/4"></div>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 w-1/4">
        <label htmlFor="voiceSelect" className="text-lg font-semibold">Select Voice:</label>
        <select
          id="voiceSelect"
          onChange={(e) => handleVoiceChange(e.target.value)}
          className="w-full max-w-md p-2 border rounded-lg"
          defaultValue="Brian"
        >
          {voices.map((voice) => (
            <option key={voice} value={voice}>
              {voice}
            </option>
          ))}
        </select>

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
      <div className="flex justify-end w-1/2 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg opacity-50">
          <thead className="bg-gray-50 [&_th]:px-1 [&_th]:py-1 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_th]:text-gray-500 [&_th]:uppercase [&_th]:tracking-wider">
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Accent</th>
              <th>Description</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 [&_td]:px-1 [&_td]:py-1 [&_td]:whitespace-nowrap">
            {elevenLabsVoices.map((voice) => (
              <tr key={voice.voice_id} className="hover:bg-gray-50">
                <td>{voice.name}</td>
                <td>{voice.gender}</td>
                <td>{voice.age}</td>
                <td>{voice.accent}</td>
                <td>{voice.description}</td>
                <td>{voice.use_case}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}