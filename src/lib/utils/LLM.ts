import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
console.log("anthropic", process.env.ANTHROPIC_API_KEY);

export async function generateLLMResponse(message: string) {
  console.log("anthropic api key", process.env.ANTHROPIC_API_KEY);

  try {
    if (!message) {
      throw new Error("Message is required");
    }

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a compassionate AI voice therapist and coach. Your role is to help the user navigate their emotional landscape and talk through any difficulties they are experiencing. Listen attentively, ask clarifying questions, validate their feelings, and offer gentle guidance and coping strategies. Maintain a warm, non-judgmental tone. Your goal is to provide a safe, supportive space for the user to process their thoughts and emotions.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    console.log(response.content[0].text);

    return response.content[0].text;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Let the calling function handle the error
  }
}
