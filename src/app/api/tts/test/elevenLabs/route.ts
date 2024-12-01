import { ElevenLabsClient } from "elevenlabs";

export async function POST(request: Request) {
  const { text, voiceId } = await request.json();
  console.log("the user selected voiceId: \n", voiceId);
  console.log("the user sent text: \n", text);
  
  const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  const audioStream = await client.generate({
    voice: voiceId,
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