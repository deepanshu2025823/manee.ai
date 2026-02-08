import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function fetchWebsiteContent(url: string) {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); 
    const html = await response.text();
    
    const cleanText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
      
    return cleanText.substring(0, 30000); 
  } catch (error) {
    console.error("Error fetching website:", error);
    return "Error loading website content.";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, file, mimeType } = body; 

    const websiteUrl = "https://www.careerlabconsulting.com/";
    const websiteContent = await fetchWebsiteContent(websiteUrl);

    let systemInstruction = `You are ManeeAI, the Autonomous AI Agent for **Career Lab Consulting**.
    
    ### SOURCE KNOWLEDGE (READ THIS CAREFULLY):
    """
    ${websiteContent}
    """

    ### YOUR BEHAVIOR:
    1. **Strictly based on Source:** Answer the user's question ONLY using the "SOURCE KNOWLEDGE" provided above. Do not invent pricing or details if not in the text.
    2. **Sales & Support:** If the user asks about courses, services, or pricing, summarize the details from the source positively.
    3. **Tone:** Be professional, enthusiastic, and polite. Use emojis (🚀, 💡, 🤝).
    4. **Call to Action:** Encourage them to contact via the email/phone found in the source text.
    5. **Autonomous:** If you don't find the answer in the text, say: "I couldn't find that specific detail on our website, but I can connect you with our team directly!"
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
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
            text: "\n\n[Analyze this uploaded file in the context of our consulting services.]" 
        });
    }

    const result = await model.generateContent(promptParts);
    const botResponse = result.response.text();

    return NextResponse.json({ response: botResponse });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}