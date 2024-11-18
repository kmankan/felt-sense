import Heart from "@/app/components/Heart";
import SpeakArea from "@/app/components/SpeakArea";
import { getSession } from "@workos-inc/authkit-nextjs";

const DisplayMessages = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>Instructions: </p>
      <p>Start a session to begin a conversation</p>
      <p>When you&apos;re ready, press the blue arrow and speak </p>
      <p>When you&apos;re done speaking, press the blue arrow again</p>
    </div>
  )
};

export default async function ChatPage() {
  const session = await getSession();
  console.log("session", session);
  const user = session?.user;
  console.log("user is signed in", user);

  if (!user) {
    return <div>User is not signed in</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-center m-4">
        <div className="backdrop-blur-sm bg-white/30 px-8 py-3 rounded-2xl shadow-lg border border-white/20">
          <span className="text-2xl font-light tracking-wide bg-gradient-to-r from-blue-500/80 to-pink-500/80 bg-clip-text text-transparent">
            Welcome back, {user?.firstName}
          </span>
        </div>
      </div>
      <DisplayMessages />
      <div>
        <div className="flex absolute top-1/2 left-1/2 max-sm:bottom-0 max-sm:left-1/2 w-[60%] h-[50%] sm:w-[40%] sm:h-[50%] bg-white rounded-lg transform -translate-x-1/2 sm:-translate-y-28  shadow-lg opacity-75">
          <div className="flex flex-col items-center justify-center self-end mx-auto h-full relative">
            <Heart />
            <SpeakArea />
          </div>
        </div>
      </div>
    </div>
  );
}
