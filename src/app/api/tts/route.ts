import { speak } from "@/lib/utils/generateSpeech";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const speechBuffer = await speak(text);
    
    // Create a ReadableStream from the buffer
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(speechBuffer);
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'audio/wav',
        'Transfer-Encoding': 'chunked'
      }
    });
  } catch (error) {
    console.error('TTS error:', error);
    return new Response(
      JSON.stringify({ error: 'TTS generation failed' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
