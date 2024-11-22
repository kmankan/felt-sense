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
  console.log('Client: Starting TTS request');
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text }),
  });

  const chunks: Uint8Array[] = [];
  const reader = response.body.getReader();

  // Collect all chunks first
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      console.log('Client: Received chunk:', chunks.length);
    }

    // Play the complete audio once
    const audioBlob = new Blob(chunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Clean up the URL after playback
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    await audio.play();

  } catch (error) {
    console.error('Client: Error processing audio:', error);
    throw error;
  }
};
