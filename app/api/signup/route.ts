import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, website } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: "Company Name is required" }, { status: 400 });
    }

    const apiKey = `manee-${randomUUID()}`;

    const company = await prisma.company.create({
      data: {
        name: name.trim(),
        website: website || null,
        apiKey: apiKey,
      },
    });

    return NextResponse.json({ success: true, apiKey: company.apiKey });

  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}