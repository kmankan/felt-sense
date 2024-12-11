import { create } from "zustand";

interface ChatStore {
    conversationState: "listening" | "thinking" | "speaking"
    conversationId: string | null
    currentMessage: string
    conversationInitiated: boolean
    setConversationState: (conversationState: ChatStore["conversationState"]) => void
    setConversationId: (conversationId: string | null) => void
    setCurrentMessage: (message: string) => void
    setConversationInitiated: (initiated: boolean) => void
}

export const useChatStore = create<ChatStore>((set) => ({
    conversationState: "speaking",
    conversationId: null,
    currentMessage: "",
    conversationInitiated: false,
    setConversationState: (conversationState: ChatStore["conversationState"]) => set({ conversationState }),
    setConversationId: (conversationId: string | null) => set({ conversationId }),
    setCurrentMessage: (currentMessage: string) => set({ currentMessage }),
    setConversationInitiated: (conversationInitiated: boolean) => set({ conversationInitiated }),
}));
