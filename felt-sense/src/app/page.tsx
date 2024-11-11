import Image from "next/image";
import STT from "./STT";

// call some helper funtion that does deepgram stuff
const getStt = STT()

export default function Home() {
  return (
    <STT text={getStt} />
  )
}
