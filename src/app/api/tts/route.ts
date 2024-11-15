import { speakStream } from "../../../lib/utils/generateSpeech";

export async function POST(request: Request) {
  const text = await request.json();
  console.log("text", text);
  const stream = await speakStream(text);
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
  });
  return new Response(webStream);
}
