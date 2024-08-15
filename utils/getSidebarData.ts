"use server";
import fs from "fs/promises";
import path from "path";

const apiBaseDir = path.join(process.cwd(), "app/api/dibo");

export const getSidebarData = async () => {
  try {
    const folders = (await fs.readdir(apiBaseDir, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const sidebarData = await Promise.all(
      folders.map(async (folder) => {
        const folderPath = path.join(apiBaseDir, folder);
        const subfolders = (
          await fs.readdir(folderPath, { withFileTypes: true })
        )
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

        return {
          title: folder,
          items: subfolders,
        };
      })
    );

    return sidebarData;
  } catch (error) {
    console.error("Error reading sidebar data:", error);
    return [];
  }
};