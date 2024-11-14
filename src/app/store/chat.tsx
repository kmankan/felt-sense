import { create } from "zustand";

interface ChatStore {
    conversationState: "listening" | "thinking" | "speaking"
    setConversationState: (conversationState: ChatStore["conversationState"]) => void
}

export const useChatStore = create<ChatStore>((set) => ({
    conversationState: "speaking",
    setConversationState: (conversationState: ChatStore["conversationState"]) => set({ conversationState }),
}));
