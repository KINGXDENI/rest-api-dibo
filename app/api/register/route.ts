import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateApiKey } from "@/utils/generateApiKey"; // Buat fungsi generateApiKey secara terpisah

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }
    const { name, email, password } = await req.json();

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 400 }
      );
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate API key
    const apiKey = generateApiKey();

    // Simpan pengguna ke database
    const newUser = await prisma.user.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
        apikey: apiKey,
      },
    });

    // Kembalikan respons sukses
    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        message: "There was an issue with your registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
