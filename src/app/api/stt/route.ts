import { NextResponse } from "next/server";
import { conversationQueries, userQueries } from "../../../lib/db/queries";
import { messageQueries } from "../../../lib/db/queries";

export async function POST(request: Request) {
  // 1. primsa query to store trascript in Messages table

  // 2. pass this transcript to the LLM
  try {
    const testUserId = "clz58585858585858585858585858585858";
    console.log("testUserId", testUserId);
    const user = await userQueries.getUser(testUserId);
    console.log("user", user);
    if (!user) {
      console.log("creating user");
      await userQueries.createUser(testUserId);
    }

    const audioBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    const result = await transcribeFile(buffer);
    console.log("result", result);

    const conversationId = request.headers.get("x-conversation-id");
    console.log("conversationId", conversationId, typeof conversationId);

    if (!conversationId) {
      console.error("Conversation ID is required");
      return NextResponse.json(
        {
          message: "Conversation ID is required",
          success: false,
        },
        { status: 400 }
      );
    }
    const conversation = await conversationQueries.getConversation(
      testUserId,
      conversationId
    );
    if (!conversation) {
      console.error("Conversation not found/unauthorized access");
      return NextResponse.json(
        {
          message: "Conversation not found/unauthorized access",
          success: false,
        },
        { status: 404 }
      );
    }
    await messageQueries.addMessage(testUserId, conversationId, result, "USER");

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
