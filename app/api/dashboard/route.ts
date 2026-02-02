import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key required" }, { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { apiKey },
    });

    if (!company) {
      return NextResponse.json({ error: "Invalid Company" }, { status: 401 });
    }

    const totalChats = await prisma.chatSession.count({
      where: { companyId: company.id },
    });

    const totalMessages = await prisma.message.count({
      where: {
        chat: {
          companyId: company.id,
        },
      },
    });

    const recentChats = await prisma.chatSession.findMany({
      where: { companyId: company.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }, 
        },
      },
    });

    return NextResponse.json({
      totalChats,
      totalMessages,
      companyName: company.name,
      recentChats: recentChats.map(chat => ({
        id: chat.id,
        lastMessage: chat.messages[0]?.content || "No messages yet",
        date: chat.createdAt,
        status: "Active" 
      }))
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}