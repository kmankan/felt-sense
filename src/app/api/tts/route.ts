import { speak } from "@/lib/utils/generateSpeech";

export async function POST(request: Request) {
  const { text } = await request.json();
  console.log("text", text);
  const speechBuffer = await speak(text);
  return new Response(speechBuffer);
}
