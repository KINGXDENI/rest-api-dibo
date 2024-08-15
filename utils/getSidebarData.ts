// Update sidebarData to match Item[] type
export const getSidebarData = async () => {
  try {
    // Mengambil data dari API /api/menus
    const response = await fetch("/api/menus");

    // Mengecek status response
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Mengambil data JSON
    const menus = await response.json();

    // Membentuk data sidebar dari data menus
    const sidebarData = menus.map((menu: any) => ({
      title: menu.title,
      items: menu.submenus.map((submenu: any) => ({
        title: submenu.title,
        href: `api/dibo/${menu.title.toLowerCase().replace(/\s+/g, "-")}/${
          submenu.link
        }`,
      })),
    }));

    return sidebarData;
  } catch (error) {
    console.error("Error fetching sidebar data:", error);
    return [];
  }
};
