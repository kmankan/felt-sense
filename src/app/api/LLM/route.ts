import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { conversationQueries, messageQueries } from "../../../lib/db/queries";
import { getSession, refreshSession } from "@workos-inc/authkit-nextjs";
import type { Session } from "@/types/index"
import { EMOTIONALLY_ATTUNED_COMPANION_PROMPT } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  // add new messsage to database
  try {
    const session = await getSession();
    let userId = session?.user?.id;
    console.log("userId", userId);

    // If initial session check fails, try to refresh the token
    if (!userId) {
      console.log("No user ID found, trying to refresh session");
      try {
        const refreshedSession: Session = await refreshSession({ ensureSignedIn: true });
        userId = refreshedSession.user.id;
      } catch (refreshError) {
        console.error("Session refresh failed:", refreshError);
        return NextResponse.json({ error: "Session expired" }, { status: 401 });
      }
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
    
    // const ORIGINAL_PROMPT = `You are a compassionate therapist and coach. Your role is to help the user navigate their emotional landscape and talk through any difficulties they are experiencing. Listen attentively, ask clarifying questions, validate their feelings, and offer gentle guidance. Maintain a warm, non-judgmental tone. Your goal is to provide a safe, supportive space for the user to explore their emotions and process their feelings. Keep your responses to less than four sentences.`;
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: EMOTIONALLY_ATTUNED_COMPANION_PROMPT,
      messages: filteredMessages,
    });

    // required to check that response is text and not tool_use
    const responseContent = (response.content[0].type === 'text') ? response.content[0].text : '';

    const newMessage = await messageQueries.addMessage(
      userId,
      conversationId,
      responseContent,
      "assistant"
    );
    console.log("newMessage", newMessage);

    return NextResponse.json({
      response: responseContent,
    });
  } catch (error) {
    console.error("LLM API error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
