import { create } from "zustand";

interface ChatStore {
    conversationState: "listening" | "thinking" | "speaking"
}

export const useChatStore = create<ChatStore>((set) => ({
    conversationState: "speaking",
    setConversationState: (conversationState: ChatStore["conversationState"]) => set({ conversationState }),
}));
