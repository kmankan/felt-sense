import { fetchTextToSpeechStream } from "../../../lib/utils/generateSpeech";

export async function POST(request: Request) {
  const { text } = await request.json();
  console.log("text", text);
  const stream = await fetchTextToSpeechStream(text);
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => {
        console.log("pushing chunk enqueue");
        controller.enqueue(chunk);
      });
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
  });
  return new Response(webStream);
}
