import { speak } from "@/lib/utils/generateSpeech";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    console.log('TTS: Starting request processing');
    const { text } = await request.json();
    console.log('TTS: Received text:', text.substring(0, 50) + '...');
    
    console.log('TTS: Calling speak function');
    const speechBuffer = await speak(text);
    console.log('TTS: Received speech buffer of size:', speechBuffer.length);
    
    // Create a ReadableStream from the buffer
    const stream = new ReadableStream({
      start(controller) {
        console.log('TTS: Stream started');
        controller.enqueue(speechBuffer);
        console.log('TTS: Buffer enqueued to stream');
        controller.close();
        console.log('TTS: Stream closed');
      },
    });

    console.log('TTS: Sending response');
    return new Response(stream, {
      headers: {
        'Content-Type': 'audio/wav',
        'Transfer-Encoding': 'chunked'
      }
    });
  } catch (error) {
    console.error('TTS error:', error);
    return new Response(
      JSON.stringify({ error: 'TTS generation failed', details: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
