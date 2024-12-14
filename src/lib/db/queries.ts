// lib/db/queries.ts
import { prisma } from "@/lib/db/prisma";
import { User, Conversation, Message, UsageMetrics } from "@prisma/client";

type ConversationWithMessages = Conversation & {
  messages: Message[];
};

// User Queries
export const userQueries = {
  // Retrieves a user by their userId
  getUser: async function (userId: string): Promise<User | null> {
    console.log("UserId", userId);
    return await prisma.user.findUnique({
      where: { userId },
    });
  },

  // Creates a new user with the given userId
  createUser: async function (userId: string): Promise<User> {
    console.log("creating user", userId);
    return await prisma.user.create({
      data: {
        userId,
      },
    });
  },

};

// Conversation Queries
export const conversationQueries = {
  // Retrieves a conversation and its messages by id
  getConversation: async function (
    userId: string,
    conversationId: string
  ): Promise<ConversationWithMessages | null> {
    const start = performance.now();
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    const end = performance.now();
    console.log(`getConversation query took ${end - start}ms`);
    
    if (!conversation || conversation.user.userId !== userId) {
      console.error("Conversation not found/unauthorized access");
      return null;
    }
    return conversation;
  },

  // Creates a new empty conversation for a user
  createConversation: async function (
    userId: string
  ): Promise<ConversationWithMessages> {
    const conversation = await prisma.conversation.create({
      data: {
        userId,
      },
      include: {
        messages: true,
      },
    });
    return conversation;
  },
};

// Message Queries
export const messageQueries = {
  // Adds a new message to a conversation
  addMessage: async function (
    userId: string,
    conversationId: string,
    content: string,
    role: "user" | "assistant",
    sentiment?: string,
    emotions?: string[]
  ): Promise<Message> {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!conversation || conversation.user.userId !== userId) {
      console.error("Conversation not found/unauthorized access");
      return null;
    }
    console.log(
      "adding message to database",
      conversationId,
      "content",
      content,
      "role",
      role
    );
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          content,
          role,
          sentiment,
          emotions,
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  },

  // Gets the most recent messages from a conversation
  getLatestMessages: async function (
    conversationId: string,
    take: number = 10
  ): Promise<Message[]> {
    return await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take,
    });
  },
};

// Analytics Queries
export const analyticsQueries = {
  // Increments message count for user's monthly metrics
  trackMessage: async function (userId: string): Promise<UsageMetrics> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return await prisma.usageMetrics.upsert({
      where: {
        userId_month: {
          userId,
          month: startOfMonth,
        },
      },
      create: {
        userId,
        month: startOfMonth,
        messageCount: 1,
      },
      update: {
        messageCount: { increment: 1 },
      },
    });
  },
};

// Search/Filter Queries
export const searchQueries = {
  // Searches conversations by text content
  searchConversations: async function (
    userId: string,
    searchTerm: string
  ): Promise<ConversationWithMessages[]> {
    return await prisma.conversation.findMany({
      where: {
        userId,
        OR: [
          {
            messages: {
              some: {
                content: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        messages: {
          where: {
            content: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  // Filters conversations by emotional content
  getConversationsByEmotion: async function (
    userId: string,
    emotion: string
  ): Promise<ConversationWithMessages[]> {
    return await prisma.conversation.findMany({
      where: {
        userId,
        messages: {
          some: {
            emotions: {
              has: emotion,
            },
          },
        },
      },
      include: {
        messages: {
          where: {
            emotions: {
              has: emotion,
            },
          },
        },
      },
    });
  },
};
