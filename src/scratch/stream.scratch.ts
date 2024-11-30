import { ElevenLabsClient } from "elevenlabs";

import * as dotenv from "dotenv";
import path from "path";
// Go up two directories from the current file to reach the project root
const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const transcript: string = "I perceive you're curious about this fascinating historical work. Barbara Tuchman's \"A Distant Mirror\" is an incredible exploration of the 14th century - one of the most turbulent periods in human history. As a friendly companion in this discussion, I find it intriguing that you're drawn to this particular book. What sparked your interest in this period?\n\nThe book uses the life of a French nobleman, Enguerrand de Coucy VII, as a lens to examine what was truly a calamitous century - with the Black Death, the Hundred Years' War, peasant revolts, and the decline of the medieval church all wreaking havoc on society. When Tuchman wrote it in the 1970s, she saw parallels between the 14th century's upheavals and the modern world's challenges.\n\nWould you like to explore any particular aspect of the book or that historical period? I'm curious what draws you to this kind of historical exploration"

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

import { spawn } from 'child_process';

export const createAndPlayAudioStream = async (text: string): Promise<void> => {
  const startAPI = performance.now();
  const audioStream = await client.generate({
    voice: "Brian",
    model_id: "eleven_turbo_v2_5",
    text,
  });
  console.log(`API initial response time: ${(performance.now() - startAPI).toFixed(2)}ms`);

  // Track total bytes received
  let totalBytes = 0;

  // Spawn ffplay process (part of ffmpeg)
  const startPlay = performance.now();
  const ffplay = spawn('ffplay', [
    '-autoexit',
    '-nodisp',
    '-i', 'pipe:0'
  ]);

  // Pipe the audio data to ffplay and count bytes
  for await (const chunk of audioStream) {
    totalBytes += chunk.length;
    ffplay.stdin.write(chunk);
  }
  
  ffplay.stdin.end();
  console.log(`Total stream size: ${totalBytes} bytes`);

  // Return a promise that resolves when playback is complete
  return new Promise((resolve, reject) => {
    ffplay.on('close', () => {
      const totalTime = performance.now() - startAPI;
      console.log(`Playback time: ${(performance.now() - startPlay).toFixed(2)}ms`);
      console.log(`Total time: ${totalTime.toFixed(2)}ms`);
      resolve();
    });

    ffplay.stderr.on('data', (data) => {
      console.error(`FFplay error: ${data}`);
    });

    ffplay.on('error', reject);
  });
};

await createAndPlayAudioStream(transcript);