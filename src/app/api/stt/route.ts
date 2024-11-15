import { NextResponse } from "next/server";
import { messageQueries } from "../../../lib/db/queries";
import { transcribeFile } from "../../../lib/utils/transcribeFile";
import { generateLLMResponse } from "../../../lib/utils/llm";

export async function POST(request: Request) {

  // * 1. primsa query to store trascript in Messages table
  try {
    // get the user id from the request headers 
    const userId = request.headers.get("x-user-id");
    console.log("userId", userId);

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
    await messageQueries.addMessage(userId, conversationId, result, "USER");

    // ! Is this the correct time/place for this?
    // * 2. pass this transcript to the LLM
    const llmResponse = await generateLLMResponse(result);
    console.log("llmResponse", llmResponse);
    // ? This still needs to be written to the database
    // ! ##

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
