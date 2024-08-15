// app/api/menus/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Handle GET request to fetch menus and their submenus
    const menus = await prisma.menu.findMany({
      include: {
        submenus: true, // Include related submenus
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
    // Parse JSON body
    const { title, icon, submenus } = await req.json();

    // Validate the input
    if (!title || !icon) {
      return NextResponse.json(
        { message: "Title and icon are required" },
        { status: 400 }
      );
    }

    // Create a new menu
    const newMenu = await prisma.menu.create({
      data: {
        title,
        icon,
        submenus: {
          create: submenus || [], // Create submenus if provided
        },
      },
      include: {
        submenus: true, // Include related submenus in the response
      },
    });

    return NextResponse.json(newMenu, { status: 201 }); // Return the newly created menu with submenus
  } catch (error) {
    console.error("Error adding menu:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
