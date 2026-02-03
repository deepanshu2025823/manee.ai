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
    const { message, file, mimeType, apiKey: companyApiKey } = body; 

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

    let systemInstruction = `You are a helpful AI Support Agent for ${company.name}.`;
    if (contextRecords.length > 0) {
        const contextText = contextRecords.map((r: { content: string }) => r.content).join("\n\n");
        systemInstruction += `\n\nHere is the knowledge base:\n"""\n${contextText}\n"""\n\nInstructions:\n1. Answer strictly based on the knowledge base if possible.\n2. If user uploads an image, analyze it in context of the company services.`;
    }

    const chatSession = await prisma.chatSession.findFirst({
        where: { companyId: company.id },
        orderBy: { createdAt: 'desc' }
    }) || await prisma.chatSession.create({ data: { companyId: company.id } });

    await prisma.message.create({
      data: { 
          chatId: chatSession.id, 
          role: "user", 
          content: message || "[File Uploaded]" 
      },
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let promptParts: any[] = [];
    
    if (systemInstruction) promptParts.push({ text: "System Context: " + systemInstruction });
    if (message) promptParts.push({ text: message });

    if (file && mimeType) {
        const base64Data = file.split(",")[1];
        promptParts.push({
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        });
    }

    const result = await model.generateContent(promptParts);
    const botResponse = result.response.text();

    await prisma.message.create({
      data: { chatId: chatSession.id, role: "bot", content: botResponse },
    });

    return NextResponse.json({ response: botResponse, chatId: chatSession.id });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Service unavailable or File too large" }, { status: 500 });
  }
}