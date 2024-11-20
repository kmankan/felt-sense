import { speak } from "@/lib/utils/generateSpeech";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const speechBuffer = await speak(text);
    
    // Stream the audio data in chunks
    const stream = new ReadableStream({
      start(controller) {
        // 64KB (65536 bytes) is chosen as the chunk size because:
        // - It's large enough to contain several frames of audio data
        // - Small enough to maintain smooth streaming
        // - Common power-of-2 size that works well with memory systems
        const chunkSize = 65536; 
        let offset = 0;
        
        // Loop through the speechBuffer, slicing it into chunks
        while (offset < speechBuffer.length) {
          // subarray() creates a new view into the buffer from offset to offset + chunkSize
          // This doesn't copy the data, making it memory efficient
          const chunk = speechBuffer.subarray(offset, offset + chunkSize);
          
          // Add this chunk to the stream queue
          // The browser can start processing this data immediately
          controller.enqueue(chunk);
          
          // Move to the next chunk
          offset += chunkSize;
        }
        
        // Signal that we're done sending chunks
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
      JSON.stringify({ 
        error: 'TTS generation failed', 
        details: error.message 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
