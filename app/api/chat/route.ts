import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, apiKey: companyApiKey } = body;

    const company = await prisma.company.findUnique({
      where: { apiKey: companyApiKey },
    });

    if (!company) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
    }

    const contextRecords = await (prisma as any).websiteContent.findMany({
      where: { companyId: company.id },
      take: 5, 
    });

    let systemInstruction = "";
    
    if (contextRecords.length > 0) {
        const contextText = contextRecords.map((r: { content: string }) => r.content).join("\n\n");
        systemInstruction = `
          You are a helpful AI Support Agent for ${company.name}.
          
          Here is the knowledge base from their website:
          """
          ${contextText}
          """
          
          Instructions:
          1. Answer the user's question based strictly on the knowledge base above.
          2. If the answer is not in the knowledge base, politely say you don't have that information and suggest contacting support.
          3. Keep answers concise and professional.
        `;
    } else {
        systemInstruction = `You are a helpful AI Support Agent for ${company.name}. Answer politely.`;
    }

    const chatSession = await prisma.chatSession.findFirst({
        where: { companyId: company.id },
        orderBy: { createdAt: 'desc' }
    }) || await prisma.chatSession.create({ data: { companyId: company.id } });

    await prisma.message.create({
      data: { chatId: chatSession.id, role: "user", content: message },
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Understood. I am ready to help." }] },
      ],
    });

    const result = await chat.sendMessage(message);
    const botResponse = result.response.text();

    await prisma.message.create({
      data: { chatId: chatSession.id, role: "bot", content: botResponse },
    });

    return NextResponse.json({ response: botResponse });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}