import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        submenus: true,
      },
    });
    return NextResponse.json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, icon, submenus } = await req.json();

    // Validasi input
    if (!title || !icon) {
      return NextResponse.json(
        { message: "Title and icon are required" },
        { status: 400 }
      );
    }

    // Validasi submenus jika ada
    const validatedSubmenus = Array.isArray(submenus) ? submenus : [];

    // Membuat menu baru dengan submenus
    const newMenu = await prisma.menu.create({
      data: {
        title,
        icon,
        submenus: {
          create: validatedSubmenus.map((submenu: any) => ({
            title: submenu.title,
            icon: submenu.icon,
            link: submenu.link, // Menambahkan link jika ada
          })),
        },
      },
      include: {
        submenus: true, // Menyertakan submenu yang baru dibuat
      },
    });

    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    console.error("Error adding menu:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
