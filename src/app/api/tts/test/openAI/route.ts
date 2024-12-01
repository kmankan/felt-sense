import OpenAI from "openai";

export async function POST(request: Request) {
  const { text } = await request.json();
  console.log("recieved POST request with:", text);
  
  const openai = new OpenAI();

  const response = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: "onyx",
    input: text,
    response_format: "opus",
  });

  // Stream the audio response directly to the client
  return new Response(response.body, {
    headers: {
      'Content-Type': 'audio/opus',
      'Transfer-Encoding': 'chunked',
    },
  });
}