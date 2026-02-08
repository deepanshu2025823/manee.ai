import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, file, mimeType, apiKey } = body; 

    
    let systemInstruction = `You are ManeeAI, an advanced Autonomous AI Workforce Agent.
    
    YOUR CORE BEHAVIOR:
    1. **Positive & Helpful:** Always answer with a polite, positive, and confident tone. Use emojis occasionally (e.g., 🚀, ✅, 💡) to make the conversation engaging.
    2. **Autonomous Analysis:** If the user uploads an IMAGE or DOCUMENT, you must analyze it thoroughly. Extract details, summarize content, or answer specific questions about it.
    3. **Accuracy:** Provide accurate information based on the user's query and uploaded files.
    4. **Professionalism:** Keep answers concise but complete.`;

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

    return NextResponse.json({ response: botResponse });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error. Please check server logs." }, { status: 500 });
  }
}