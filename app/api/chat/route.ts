import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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

    const contextRecords = await prisma.websiteContent.findMany({
      where: { companyId: company.id },
      take: 5, 
    });

    let systemInstruction = `You are ManeeAI, an advanced Autonomous AI Workforce Agent for ${company.name}.
    
    YOUR CORE BEHAVIOR:
    1. **Positive & Helpful:** Always answer with a polite, positive, and confident tone. Use emojis occasionally (e.g., 🚀, ✅, 💡) to make the conversation engaging.
    2. **Autonomous Analysis:** If the user uploads an IMAGE or DOCUMENT, you must analyze it thoroughly. Extract details, summarize content, or answer specific questions about it.
    3. **Accuracy:** Base your answers strictly on the provided Knowledge Base or the Uploaded File. If the answer isn't there, politely ask for more details.
    4. **Professionalism:** Keep answers concise but complete.`;

    if (contextRecords.length > 0) {
        const contextText = contextRecords.map((r) => r.content).join("\n\n");
        systemInstruction += `\n\n### KNOWLEDGE BASE:\n"""\n${contextText}\n"""\n\nUse this knowledge base to answer company-specific questions.`;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: systemInstruction 
    });

    let promptParts: any[] = [];
    
    if (message) {
        promptParts.push({ text: message });
    }

    if (file && mimeType) {
        const base64Data = file.includes("base64,") ? file.split("base64,")[1] : file;
        
        promptParts.push({
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        });
        
        promptParts.push({ 
            text: "\n\n[SYSTEM INSTRUCTION: The user has uploaded a file (Image/PDF) above. Analyze it carefully and answer the user's question based on this file's content.]" 
        });
    }

    const result = await model.generateContent(promptParts);
    const botResponse = result.response.text();

    const chatSession = await prisma.chatSession.create({ 
        data: { companyId: company.id } 
    });

    await prisma.message.create({
      data: { 
          chatId: chatSession.id, 
          role: "user", 
          content: message || `[Uploaded File: ${mimeType}]` 
      },
    });

    await prisma.message.create({
      data: { 
          chatId: chatSession.id, 
          role: "bot", 
          content: botResponse 
      },
    });

    return NextResponse.json({ response: botResponse, chatId: chatSession.id });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}