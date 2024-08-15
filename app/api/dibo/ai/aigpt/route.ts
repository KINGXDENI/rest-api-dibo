import { NextRequest, NextResponse } from "next/server";
import { getGroqResponse } from "./groq";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Mendapatkan parameter query dari URL
    const url = new URL(req.url);
    const text = url.searchParams.get("text");
    const apiKey = url.searchParams.get("apikey");

    if (!text) {
      return NextResponse.json(
        { message: "Text parameter is required" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { message: "API key is required" },
        { status: 400 }
      );
    }

    // Memeriksa apakah API key ada di database
     const user = await prisma.user.findFirst({
       where: { apikey: apiKey },
     });

    if (!user) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 403 });
    }

    const response = await getGroqResponse(text);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Menangani metode yang tidak diizinkan
export function onRequest(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}
