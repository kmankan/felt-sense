"use client";
import { useChatStore } from '@/app/store/chat';

export default function ShowConversationState() {
    const conversationState = useChatStore((state) => state.conversationState);
    return <div className="text-gray-500 mb-2 mt-auto">{conversationState === "speaking" ? "Speaking..." : conversationState === "thinking" ? "Thinking..." : "Listening..."}</div>;
}
