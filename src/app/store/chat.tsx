import { create } from "zustand";

interface ChatStore {
    conversationState: "listening" | "thinking" | "speaking"
    conversationId: string | null
    setConversationState: (conversationState: ChatStore["conversationState"]) => void
    setConversationId: (conversationId: string | null) => void
}

export const useChatStore = create<ChatStore>((set) => ({
    conversationState: "speaking",
    conversationId: null,
    setConversationState: (conversationState: ChatStore["conversationState"]) => set({ conversationState }),
    setConversationId: (conversationId: string | null) => set({ conversationId }),
}));
