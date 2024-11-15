"use client";

export const sendAudioStream = async (
  readable: ReadableStream, 
  conversationId: string,
  userId: string
) => {
  // Convert ReadableStream to Blob
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
      "x-user-id": userId, // Include your metadata here
    },
  });
  return response.json();
};
