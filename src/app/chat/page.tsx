import { withAuth } from '@workos-inc/authkit-nextjs';
import { AudioRecorder } from "../components/AudioRecorder";
import ShowConversationState from "../components/ShowConversationState";
import SoundVisualizer from "../components/SoundVisualizer";


// This is now a Server Component (no "use client" directive)
export default async function ChatPage() {
  const { user } = await withAuth();
  return (
    <div>
      <AudioRecorder />
      <div className="flex items-center justify-center m-4">
        <div className="backdrop-blur-sm bg-white/30 px-8 py-3 rounded-2xl shadow-lg border border-white/20">
          <span className="text-2xl font-light tracking-wide bg-gradient-to-r from-blue-500/80 to-pink-500/80 bg-clip-text text-transparent">
            Welcome back, {user?.firstName}
          </span>
        </div>
      </div>
      {/* <SoundVisualizer /> */}

      <div className="flex absolute top-1/2 left-1/2 max-sm:bottom-0 max-sm:left-1/2 w-[60%] h-[50%] sm:w-[40%] sm:h-[50%] bg-white rounded-lg transform -translate-x-1/2 sm:-translate-y-28  shadow-lg opacity-50">
        <div className="flex flex-col items-center justify-center self-end mx-auto h-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="mt-auto">
            <defs>
              <path id="heartPath" d="M100,170 C100,170 180,110 180,65 C180,20 140,20 100,60 C60,20 20,20 20,65 C20,110 100,170 100,170 Z" />

              <clipPath id="heartClip">
                <use href="#heartPath" />
              </clipPath>

              <filter id="displacementFilter">
                <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" seed="2" result="turbulence">
                  <animate attributeName="seed" from="0" to="100" dur="15s" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>

              <radialGradient id="heartGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: "#ff1a1a" }}>
                  <animate attributeName="stop-color" values="#ff1a1a;#ff0000;#cc0000;#ff1a1a" dur="5s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" style={{ stopColor: "#990000" }}>
                  <animate attributeName="stop-color" values="#990000;#cc0000;#990000;#990000" dur="5s" repeatCount="indefinite" />
                </stop>
              </radialGradient>
            </defs>

            <g clip-path="url(#heartClip)">
              <use href="#heartPath" fill="url(#heartGradient)" filter="url(#displacementFilter)" />
            </g>


            <use href="#heartPath" fill="none" stroke="#cc0000" stroke-width="1" />
          </svg>
          <ShowConversationState />

          <button className="rounded-full sm:w-24 sm:h-24 w-16 h-16 bg-blue-500 mb-6 hover:bg-blue-600" style={{ aspectRatio: '1 / 1' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-up" style={{ transform: 'scale(0.5)' }}>
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
