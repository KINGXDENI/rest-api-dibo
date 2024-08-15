import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {GeminiAI } from "./gemini";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }
    // Get query parameters from URL
    const url = new URL(req.url);
    const text = url.searchParams.get("text");
    const apiKey = url.searchParams.get("apikey");
    const image = url.searchParams.get("image"); // Optional parameter for image URL
    const mode = url.searchParams.get("mode"); // Optional parameter for stream mode

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

    // Check if API key exists in the database
    const user = await prisma.user.findFirst({
      where: { apikey: apiKey },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 403 });
    }

    // Call GeminiAI function
    const response = await GeminiAI(
      user.id.toString(),
      text,
      image || ""
    );

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

