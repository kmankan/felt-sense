import { spawn } from "child_process";
import { Readable } from "stream";

export async function speak(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const curl = spawn("curl", [
      "-N",
      "-X",
      "POST",
      "https://api.cartesia.ai/tts/bytes",
      "-H",
      "Cartesia-Version: 2024-06-10",
      "-H",
      `X-API-Key: ${process.env.CARTESIA_API_KEY}`,
      "-H",
      "Content-Type: application/json",
      "-d",
      JSON.stringify({
        // context_id: "my-context",
        transcript: text,
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: "79a125e8-cd45-4c13-8a67-188112f4dd22",
          _experimental_controls: {
            speed: "slow",
            emotion: {
              positivity: "high",
              curiosity: "high",
            },
          },
        },
        output_format: {
          container: "wav",
          encoding: "pcm_f32le",
          sample_rate: 44100,
        },
      }),
    ]);

    const chunks: Buffer[] = [];

    curl.stdout.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    curl.stderr.on("data", (data) => {
      console.error(`curl stderr: ${data}`);
    });

    curl.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`curl process exited with code ${code}`));
        return;
      }

      const outputBuffer = Buffer.concat(chunks);
      return outputBuffer;
    });
  });
}

export async function speakStream(text: string): Promise<Readable> {
  return new Promise((resolve, reject) => {
    const curl = spawn("curl", [
      "-N",
      "-X",
      "POST",
      "https://api.cartesia.ai/tts/sse",
      "-H",
      "Cartesia-Version: 2024-06-10",
      "-H",
      `X-API-Key: ${process.env.CARTESIA_API_KEY}`,
      "-H",
      "Content-Type: application/json",
      "-d",
      JSON.stringify({
        // context_id: "my-context",
        transcript: text,
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: "79a125e8-cd45-4c13-8a67-188112f4dd22",
          _experimental_controls: {
            speed: "slow",
            emotion: {
              positivity: "high",
              curiosity: "high",
            },
          },
        },
        output_format: {
          container: "wav",
          encoding: "pcm_f32le",
          sample_rate: 44100,
        },
      }),
    ]);

    const audioStream = new Readable({
      read() {},
    });

    curl.stdout.on("data", (chunk) => {
      audioStream.push(chunk);
    });

    curl.stdout.on("end", () => {
      audioStream.push(null); // Signal the end of the stream
    });

    resolve(audioStream);

    const chunks: Buffer[] = [];

    curl.stdout.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    curl.stderr.on("data", (data) => {
      console.error(`curl stderr: ${data}`);
    });

    curl.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`curl process exited with code ${code}`));
        return;
      }

      const outputBuffer = Buffer.concat(chunks);
      return outputBuffer;
    });
  });
}
