'use client'
import { useChatStore } from "@/app/store/chat";
import DisplayInstructions from "@/app/components/DisplayInstructions";
import DisplayMessages from "@/app/components/DisplayMessages";

export default function ClientWrapper() {
  const { conversationInitiated } = useChatStore();
  console.log('conversationInitiated', conversationInitiated);

  return conversationInitiated ? <DisplayMessages /> : <DisplayInstructions />;
}
