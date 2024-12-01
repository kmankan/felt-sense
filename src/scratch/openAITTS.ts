import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { config } from "dotenv";

const text = "I perceive you're curious about this fascinating historical work. Barbara Tuchman's \"A Distant Mirror\" is an incredible exploration of the 14th century - one of the most turbulent periods in human history. As a friendly companion in this discussion, I find it intriguing that you're drawn to this particular book. What sparked your interest in this period?\n\nThe book uses the life of a French nobleman, Enguerrand de Coucy VII, as a lens to examine what was truly a calamitous century - with the Black Death, the Hundred Years' War, peasant revolts, and the decline of the medieval church all wreaking havoc on society. When Tuchman wrote it in the 1970s, she saw parallels between the 14th century's upheavals and the modern world's challenges.\n\nWould you like to explore any particular aspect of the book or that historical period? I'm curious what draws you to this kind of historical exploration"

// Load .env file from project root (two directories up)
config({ path: path.join(__dirname, "../../.env") });

const openai = new OpenAI();

const speechFile = path.resolve("./speech.mp3");

async function main() {
  const startTime = Date.now();
  console.log('Starting TTS conversion...');
  
  const response = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: "onyx",
    input: text,
  });
  
  console.log("starting streaming write...")
  const stream = response.body;
  const writer = fs.createWriteStream(speechFile);

  for await (const chunk of stream) {
    writer.write(chunk);
  }

  writer.end();

  const totalTime = Date.now() - startTime;
  console.log(`Total process completed in ${totalTime}ms`);
}

main();