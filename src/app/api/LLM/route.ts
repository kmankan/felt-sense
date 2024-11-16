import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { conversationQueries, messageQueries } from "../../../lib/db/queries";
import { getSession } from "@workos-inc/authkit-nextjs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
console.log("anthropic api key", process.env.ANTHROPIC_API_KEY);
export async function POST(request: Request) {
  // TODO: Have this take a conversation ID, obtain the conversation history, and then pass it to the LLM
  // add new messsage to database
  console.log("anthropic api key", process.env.ANTHROPIC_API_KEY);

  try {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      console.error("User ID not found");
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }
    const { conversationId } = await request.json();
    const conversation = await conversationQueries.getConversation(
      userId,
      conversationId
    );

    if (!conversation) {
      console.error("Conversation not found");
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }
    const messages = conversation.messages;
    const filteredMessages = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
    if (!filteredMessages) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    console.log("claude-3-5-sonnet-20241022");
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system:
        "You are a compassionate AI voice therapist and coach. Your role is to help the user navigate their emotional landscape and talk through any difficulties they are experiencing. Listen attentively, ask clarifying questions, validate their feelings, and offer gentle guidance and coping strategies. Maintain a warm, non-judgmental tone. Your goal is to provide a safe, supportive space for the user to process their thoughts and emotions. Keep your responses to three sentences or less.",
      messages: filteredMessages,
    });

    const newMessage = await messageQueries.addMessage(
      userId,
      conversationId,
      response.content[0].text,
      "assistant"
    );
    console.log("newMessage", newMessage);

    return NextResponse.json({
      response: response.content[0].text,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
