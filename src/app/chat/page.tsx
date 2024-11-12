import { withAuth } from '@workos-inc/authkit-nextjs';
import { AudioRecorder } from "../components/AudioRecorder";

// This is now a Server Component (no "use client" directive)
export default async function ChatPage() {
  const { user } = await withAuth();

  return (
    <div>
      <AudioRecorder />
      <div className="flex items-center justify-center m-4">
        Welcome back {user?.firstName}
      </div>
      <div className="flex absolute top-1/2 left-1/2 w-[60%] h-[50%] bg-white rounded-lg transform -translate-x-1/2 -translate-y-1/2 shadow-lg opacity-50">
        <button className="rounded-full w-36 h-36 bg-blue-500 self-end mx-auto mb-10" style={{ aspectRatio: '1 / 1' }}>
        </button>
      </div>
    </div>
  );
}
