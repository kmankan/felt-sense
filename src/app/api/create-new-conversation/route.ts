import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const conversation = await prisma.conversation.create({
      data: {
        userId: userId,
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
