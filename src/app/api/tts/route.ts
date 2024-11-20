import { speak } from "@/lib/utils/generateSpeech";

export async function POST(request: Request) {
  const { text } = await request.json();
  
  // Add response headers for streaming
  const headers = {
    'Content-Type': 'audio/mpeg',
    'Transfer-Encoding': 'chunked'
  };

  try {
    const speechBuffer = await speak(text);
    return new Response(speechBuffer, { headers });
  } catch (error) {
    console.error('TTS error:', error);
    return new Response(
      JSON.stringify({ error: 'TTS generation failed' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
