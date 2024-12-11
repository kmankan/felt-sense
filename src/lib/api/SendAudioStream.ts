"use client";

export const transcribeAudioStream = async (
  // Convert ReadableStream to Blob
  readable: ReadableStream,
  conversationId: string
) => {
  const reader = readable.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const blob = new Blob(chunks, { type: "audio/webm" }); // Adjust mime type if needed

  const response = await fetch("/api/stt", {
    method: "POST",
    body: blob,
    headers: {
      "Content-Type": "audio/webm", // Adjust mime type if needed
      "x-conversation-id": conversationId, // Include your metadata here
    },
  });
  return response.json();
};

export const callLLM = async (conversationId: string) => {
  try {
    const response = await fetch("/api/LLM", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The middleware will automatically add the session header
      },
      body: JSON.stringify({ conversationId }),
      credentials: 'same-origin' // Important for cookie handling
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("LLM call failed:", error);
    throw error;
  }
};

export const speakText = async (text: string) => {
  const response = await fetch("/api/tts", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

  // Read the entire stream instead of just the first chunk

  const chunks = [];
  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log("pushing chunk");
    chunks.push(value);
  }
  console.log(chunks[0], chunks.length);

  const audioBlob = new Blob(chunks, { type: "audio/wav" }); // Adjust mime type if needed
  const audioUrl = URL.createObjectURL(audioBlob);

  const audio = new Audio(audioUrl);
  console.log("about to play audio");
  await audio.play();
  console.log("played audio");
};

export const generateSpeech = async (text: string) => {
  
  function concatenateArrays(a1: Uint8Array, a2: Uint8Array): Uint8Array {
    const result = new Uint8Array(a1.length + a2.length);
    result.set(a1, 0);
    result.set(a2, a1.length);
    return result;
  }
  
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Audio generation failed');

    const mediaSource = new MediaSource();
    const audio = new Audio();
    audio.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', async () => {
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const MINIMUM_CHUNK_SIZE = 64 * 1024; // 64KB buffer size
      let buffer = new Uint8Array(0);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer = concatenateArrays(buffer, value);

        if (buffer.length >= MINIMUM_CHUNK_SIZE) {
          if (!sourceBuffer.updating) {
            sourceBuffer.appendBuffer(buffer);
            buffer = new Uint8Array(0);
          }
        }
      }

      if (buffer.length > 0 && !sourceBuffer.updating) {
        sourceBuffer.appendBuffer(buffer);
      }

      await new Promise(resolve => {
        if (!sourceBuffer.updating) {
          resolve(undefined);
        } else {
          sourceBuffer.addEventListener('updateend', () => resolve(undefined), { once: true });
        }
      });

      mediaSource.endOfStream();
    });

    await audio.play();

    audio.onended = () => {
      URL.revokeObjectURL(audio.src);
    };

  } catch (error) {
    console.error('Error playing audio:', error);
  }
}