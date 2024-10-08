import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createAuthCookie } from "@/actions/auth.action"; // Pastikan path ini benar sesuai dengan struktur project Anda

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
     if (req.method !== "POST") {
       return NextResponse.json(
         { message: "Method not allowed" },
         { status: 405 }
       );
     }
    const { email, password } = await req.json();

    // Cek apakah pengguna terdaftar
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Buat session atau JWT token di sini jika diperlukan
    // Simpan cookie otentikasi
    await createAuthCookie({
      id: String(user.id),
      email: user.email,
      apikey: user.apikey || "",
      username: user.username, // Include the username
      profil_pic: user.profil_pic || "", // Include the profile picture
    });


    // Respons berhasil
    return NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "There was an issue with your login. Please try again." },
      { status: 500 }
    );
  }
}

