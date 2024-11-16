import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    console.log("Creating new conversation for user:", userId);
    const conversation = await prisma.conversation.create({
      data: {
        userId: userId,
      },
    });
    console.log("New conversation created:", conversation);

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
