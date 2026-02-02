import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminPin } = body;

    if (adminPin !== "manee123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalCompanies = await prisma.company.count();
    const totalChats = await prisma.chatSession.count();
    const totalMessages = await prisma.message.count();

    const companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { chats: true } 
        }
      }
    });

    return NextResponse.json({
      stats: { totalCompanies, totalChats, totalMessages },
      companies: companies.map(c => ({
        id: c.id,
        name: c.name,
        apiKey: c.apiKey,
        website: c.website || "N/A",
        joinedDate: c.createdAt,
        totalChats: c._count.chats
      }))
    });

  } catch (error: any) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}