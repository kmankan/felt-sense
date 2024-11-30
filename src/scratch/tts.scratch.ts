// 98a34ef2-2140-4c28-9c71-663dc4dd7022

// hello.js
import Cartesia from "@cartesia/cartesia-js"
import fs from "node:fs"
import { spawn } from "node:child_process"
import { config } from "dotenv"
import path from "path"
import { performance } from 'perf_hooks'

// Go up two directories from the current file to reach the project root
const envPath = path.resolve(__dirname, '../../.env')
config({ path: envPath })

const api_key = process.env.CARTESIA_API_KEY

if (!api_key) {
  throw new Error("CARTESIA_API_KEY is not set")
}

async function testTTS() {
  console.log('Starting TTS test...')
  
  // Set up the client.
  const startSetup = performance.now()
  const client = new Cartesia({
    apiKey: api_key,
  })
  console.log(`Client setup time: ${(performance.now() - startSetup).toFixed(2)}ms`)

  // Make the API call.
  const startAPI = performance.now()
  const response = await client.tts.bytes({
    model_id: "sonic-english",
    voice: {
      mode: "id",
      id: "98a34ef2-2140-4c28-9c71-663dc4dd7022",
    },
    output_format: {
      container: "wav",
      encoding: "pcm_f32le",
      sample_rate: 44100,
    },
    transcript: "I perceive you're curious about this fascinating historical work. Barbara Tuchman's \"A Distant Mirror\" is an incredible exploration of the 14th century - one of the most turbulent periods in human history. As a friendly companion in this discussion, I find it intriguing that you're drawn to this particular book. What sparked your interest in this period?\n\nThe book uses the life of a French nobleman, Enguerrand de Coucy VII, as a lens to examine what was truly a calamitous century - with the Black Death, the Hundred Years' War, peasant revolts, and the decline of the medieval church all wreaking havoc on society. When Tuchman wrote it in the 1970s, she saw parallels between the 14th century's upheavals and the modern world's challenges.\n\nWould you like to explore any particular aspect of the book or that historical period? I'm curious what draws you to this kind of historical exploration", // your text here
  })
  const apiTime = performance.now() - startAPI
  console.log(`API call time: ${apiTime.toFixed(2)}ms`)
  console.log(`Response size: ${response.byteLength} bytes`)

  // Write to file and measure
  const startWrite = performance.now()
  fs.writeFileSync("sonic.wav", new Uint8Array(response))
  console.log(`File write time: ${(performance.now() - startWrite).toFixed(2)}ms`)

  // Play the file and measure
  const startPlay = performance.now()
  const player = spawn("ffplay", ["-autoexit", "-nodisp", "sonic.wav"])
  
  // Monitor playback
  player.on('close', () => {
    const playTime = performance.now() - startPlay
    console.log(`Playback time: ${playTime.toFixed(2)}ms`)
    console.log(`Total time: ${(performance.now() - startSetup).toFixed(2)}ms`)
  })

}

// Run the test
testTTS().catch(console.error)
