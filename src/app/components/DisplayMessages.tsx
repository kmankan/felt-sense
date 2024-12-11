'use client'
import { useChatStore } from "@/app/store/chat";
import { useEffect, useState } from "react";

interface Message {
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface Conversation {
  messages: Message[];
}

export default function DisplayMessages() {
  const { conversationId, currentMessage } = useChatStore();
  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      console.log('fetching conversation', conversationId, currentMessage);
      if (!conversationId || !currentMessage) return;

      try {
        const response = await fetch(`/api/get-conversation?conversationId=${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch conversation');

        const data = await response.json();
        setConversation(data);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    fetchConversation();
  }, [conversationId, currentMessage]); // Re-fetch when currentMessage changes

  return (
    <div className="h-[220px] w-[90%] mx-auto overflow-y-auto p-4 bg-white/80 rounded-lg shadow-inner opacity-75">
      <div className="space-y-4">
        {conversation?.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
                }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}