import type { NextApiRequest, NextApiResponse } from "next";
import { transcribeFile } from "../STT";

type ResponseData = {
  message: string;
  success?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }

  try {
    // Check if the request contains audio data
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "No audio data received", success: false });
    }

    // Create a buffer to hold the audio data
    const chunks: Buffer[] = [];

    // Stream the audio data
    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk); // Collect the audio chunks
    });

    req.on("end", async () => {
      // Once the stream ends, concatenate the chunks into a single Buffer
      const audioBuffer = Buffer.concat(chunks);

      // Process the audio data
      const result = await transcribeFile(audioBuffer);

      return res.status(200).json({
        message: "Audio processed successfully",
        success: true,
      });
    });

    req.on("error", (error) => {
      console.error("Error processing audio stream:", error);
      return res.status(500).json({
        message: "Error processing audio",
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      });
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return res.status(500).json({
      message: "Error processing audio",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    });
  }
}
