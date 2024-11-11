// import { Orca } from "@picovoice/orca-node";

// if (!process.env.PICOVOICE_ACCESS_KEY) {
//   throw new Error("PICOVOICE_ACCESS_KEY is not set");
// }

// const orca = new Orca(process.env.PICOVOICE_ACCESS_KEY);

// const stream = orca.streamOpen();

// const textChunks = [
//   "Hello, how are you?",
//   "This is a test of the text-to-speech system.",
//   "Let's create multiple text chunks for synthesis.",
//   "Each chunk will be processed individually.",
//   "Thank you for using our service!",
// ];

// for (const textChunk of textChunks) {
//   const pcm = stream.synthesize(textChunk);
//   if (pcm !== null) {
//     // play audio
//     // handle pcm
//   }
// }

// const flushedPcm = stream.flush();
// if (flushedPcm !== null) {
//   // handle flushed pcm
// }

// // const result = orca.synthesize("Hello, how are you?");

// // const alignments = orca.synthesizeToFile("Hello, how are you?", "output.txt");

// orca.release();
