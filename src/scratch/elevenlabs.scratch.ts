import { ElevenLabsClient } from "elevenlabs";

import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'node:fs';
import player from 'play-sound';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const transcript: string = "I perceive you're curious about this fascinating historical work. Barbara Tuchman's \"A Distant Mirror\" is an incredible exploration of the 14th century - one of the most turbulent periods in human history."

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

const audioStream = await client.generate({
  voice: "Brian",
  model_id: "eleven_turbo_v2_5",
  text: transcript,
});

console.log("audioStream", audioStream);
console.log(typeof audioStream);

const chunks: Buffer[] = [];

for await (const chunk of audioStream) {
  chunks.push(chunk);
}

const audio = Buffer.concat(chunks);
fs.writeFileSync('output.mp3', audio);

const audioPlayer = player({});
audioPlayer.play('output.mp3', (err) => {
  if (err) console.error(`Error playing audio: ${err}`);
});

