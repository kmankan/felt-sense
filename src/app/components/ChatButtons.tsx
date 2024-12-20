"use client";
import { Button } from "@radix-ui/themes";
import Link from 'next/link';

export function ChatButton() {
  return (
    <Link href="/chat" className="text-2xl font-bold text-pink-700 mr-1">
      <Button size="2">New Chat</Button>
    </Link>

  )
}

export function ChatHistoryButton() {
  return (
    <Button size="2">Chat History</Button>
  )
}


// ok