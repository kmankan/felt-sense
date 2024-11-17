import { spawn } from "child_process";
export async function speak(text: string): Promise<Buffer> {
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
          id: "00a77add-48d5-4ef6-8157-71e5437b282d",
          // _experimental_controls: {
          //   speed: "normal",
          //   emotion: {
          //     positivity: "normal",
          //     curiosity: "high",
          //   },
          // },
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
      resolve(outputBuffer);
    });
  });
}

// // Function to create a readable stream from Cartesia's SSE response
// export async function fetchTextToSpeechStream(text: string) {
//   const url = "https://api.cartesia.ai/tts/sse";
//   const apiKey = process.env.CARTESIA_API_KEY;

//   const postData = {
//     model_id: "sonic-english", // Replace with the actual model ID
//     transcript: text,
//     voice: {
//       mode: "id",
//       id: "79a125e8-cd45-4c13-8a67-188112f4dd22", // Replace with the actual voice ID
//     },
//     output_format: {
//       container: "raw",
//       encoding: "pcm_f32le",
//       sample_rate: 44100, // Replace with the desired sample rate
//     },
//   };

//   try {
//     const response = await axios.post(url, postData, {
//       headers: {
//         "X-API-Key": apiKey,
//         "Cartesia-Version": "2024-06-10",
//         "Content-Type": "application/json",
//       },
//       responseType: "stream", // This allows processing the response as a stream
//     });

//     const audioStream = new Readable({
//       read() {}, // No-op read function, we'll push data manually
//     });

//     console.log("starting chunks");
//     response.data.on("data", (chunk) => {
//       //   console.log("pushing chunk");
//       //   audioStream.push(chunk);

//       const chunkStr = chunk.toString("utf8");
//       console.log("chunkStr", chunkStr, chunkStr.length);
//       if (chunkStr.startsWith("event: chunk")) {
//         //find where "data:": is
//         const dataIndex = chunkStr.indexOf('"data:":"');
//         const audioData = chunkStr.slice(dataIndex + 9);
//         const audioBuffer = Buffer.from(audioData, "base64");
//         console.log(audioData);
//         audioStream.push(audioBuffer);
//       } else if (chunkStr.startsWith("event: done")) {
//         audioStream.push(null);
//       } else if (chunkStr.includes('"')) {
//         //get index of the first "
//         const firstQuoteIndex = chunkStr.indexOf('"');
//         const data = chunkStr.slice(0, firstQuoteIndex + 1);
//         console.log(data);
//         audioStream.push(Buffer.from(data, "base64"));
//       }

//       //   console.log("chunkStr", chunkStr.split("\n")[0].length, chunkStr.length);
//       //   const lines = chunkStr.split("\n").slice(1).join("\n"); // Remove the first line
//       //   //   const lines = chunkStr.split("\n").slice(1, -1).join("\n");
//       //   console.log("lines", lines.slice(6), lines.slice(6).length);
//       //   const chunkJson = JSON.parse(lines.slice(6)); // Remove 'data: ' prefix
//       //   if (chunkJson.type === "chunk" && chunkJson.data) {
//       //     // Decode the Base64 data
//       //     const audioData = Buffer.from(chunkJson.data, "base64");
//       //     audioStream.push(audioData);
//       //   } else if (chunkJson.type === "done") {
//       //     audioStream.push(null); // End the stream
//       //   }
//     });

//     response.data.on("end", () => {
//       console.log("stream ended");
//       audioStream.push(null); // Ensure the stream ends
//     });

//     response.data.on("error", (err) => {
//       audioStream.destroy(err);
//     });

//     return audioStream;
//   } catch (error) {
//     console.error("Error fetching TTS stream:", error);
//     throw error;
//   }
// }
