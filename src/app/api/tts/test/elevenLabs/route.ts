import { ElevenLabsClient } from "elevenlabs";

export async function POST(request: Request) {
  const { text } = await request.json();
  
  const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  const audioStream = await client.generate({
    voice: "Brian",
    model_id: "eleven_turbo_v2_5",
    text,
  });

  return new Response(audioStream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    },
  });
}