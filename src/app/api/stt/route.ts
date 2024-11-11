import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const audioBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    const result = await transcribeFile(buffer);

    return NextResponse.json({
      message: "Audio processed successfully",
      success: true,
      transcript: result,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      {
        message: "Error processing audio",
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}

if (!process.env.DEEPGRAM_API_KEY) {
  throw new Error("DEEPGRAM_API_KEY is not set");
}

export const transcribeFile = async (audioFile: Buffer): Promise<string> => {
  console.log("here");
  console.log("transcribing file");

  const response = await fetch("https://api.deepgram.com/v1/listen", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      "Content-Type": "audio/wav",
    },
    body: audioFile, // Assuming audioFile is a Blob or a Buffer
  });

  if (!response.ok) {
    throw new Error(`Deepgram API error: ${response.statusText}`);
  }

  const result = await response.json();
  console.dir(result, { depth: null });
  return result.results.channels[0].alternatives[0].transcript;
};
