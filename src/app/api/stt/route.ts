import { NextResponse } from "next/server";
import { messageQueries } from "../../../lib/db/queries";
import { transcribeFile } from "../../../lib/utils/transcribeFile";
import { getSession } from "@workos-inc/authkit-nextjs";

export async function POST(request: Request) {
  // * 1. primsa query to store trascript in Messages table
  try {
    // get the user id from the request headers
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      console.error("User ID is required");
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    // get the conversation id from the request headers
    const conversationId = request.headers.get("x-conversation-id");
    console.log("conversationId", conversationId);

    // get the audio buffer from the request
    const audioBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    // transcribe the audio buffer
    // ? Would it be better to make this a utility function that returns the transcript and also calls the LLM
    const result = await transcribeFile(buffer);
    console.log("result", result);

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

    if (!userId) {
      console.error("User ID is required");
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    // add the message to the database
    console.log("adding message to database", userId, conversationId, result);
    await messageQueries.addMessage(userId, conversationId, result, "user");

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
