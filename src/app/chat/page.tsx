import { withAuth } from '@workos-inc/authkit-nextjs';
import { AudioRecorder } from "../components/AudioRecorder";
import ShowConversationState from "../components/ShowConversationState";
import Heart from "../components/Heart";
import SpeakButton from "../components/SpeakButton";


// This is now a Server Component (no "use client" directive)
export default async function ChatPage() {
  const { user } = await withAuth();
  return (
    <div>
      {/* <AudioRecorder /> */}
      <div className="flex items-center justify-center m-4">
        <div className="backdrop-blur-sm bg-white/30 px-8 py-3 rounded-2xl shadow-lg border border-white/20">
          <span className="text-2xl font-light tracking-wide bg-gradient-to-r from-blue-500/80 to-pink-500/80 bg-clip-text text-transparent">
            Welcome back, {user?.firstName}
          </span>
        </div>
      </div>
      {/* <SoundVisualizer /> */}
      <div>
        <div className="flex absolute top-1/2 left-1/2 max-sm:bottom-0 max-sm:left-1/2 w-[60%] h-[50%] sm:w-[40%] sm:h-[50%] bg-white rounded-lg transform -translate-x-1/2 sm:-translate-y-28  shadow-lg opacity-50">
          <div className="flex flex-col items-center justify-center self-end mx-auto h-full">
            <Heart />
            {/* <ShowConversationState /> */}

            {/* <button className="rounded-full sm:w-24 sm:h-24 w-16 h-16 bg-blue-500 mb-6 hover:bg-blue-600" style={{ aspectRatio: '1 / 1' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-up" style={{ transform: 'scale(0.5)' }}>
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button> */}
            <SpeakButton />
          </div>
        </div>
      </div>
    </div>
  );
}
