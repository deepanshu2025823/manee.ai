import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey, url } = body;

    if (!apiKey || !url) {
      return NextResponse.json({ error: "API Key and URL are required" }, { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { apiKey },
    });

    if (!company) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
    }

    console.log(`Crawling ${url}...`);
    const response = await fetch(url);
    const html = await response.text();
    
    const $ = cheerio.load(html);
    
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();
    
    if (!textContent) {
        return NextResponse.json({ error: "No readable content found on website" }, { status: 400 });
    }

    const chunks = textContent.match(/.{1,2000}/g) || [];

    await (prisma as any).websiteContent.deleteMany({
      where: { companyId: company.id }
    });

    for (const chunk of chunks) {
      await (prisma as any).websiteContent.create({
        data: {
          companyId: company.id,
          url: url,
          content: chunk,
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      chunksProcessed: chunks.length,
      message: "Website analyzed successfully!" 
    });

  } catch (error: any) {
    console.error("Crawl Error:", error);
    return NextResponse.json({ error: "Failed to crawl website. Ensure URL is correct." }, { status: 500 });
  }
}