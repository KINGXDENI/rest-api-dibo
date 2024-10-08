// app/components/SidebarWrapper.tsx
import React, { useEffect, useState } from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
import { getSidebarData } from "@/utils/getSidebarData"; // Import the utility function

export const SidebarWrapper = () => {
  const [sidebarData, setSidebarData] = useState<
    Array<{ title: string; items: Array<{ title: string; href: string }> }>
  >([]);
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        // Fetch sidebar data asynchronously
        const data = await getSidebarData();
        console.log("Fetched sidebar data:", data); // Log the data to check its structure
        setSidebarData(data);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };

    fetchSidebarData();
  }, []);

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed && (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      )}
      <div className={Sidebar({ collapsed })}>
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />

            {/* Render API List dynamically */}
            <SidebarMenu title="API LIST">
              {Array.isArray(sidebarData) &&
                sidebarData.map((menu) => (
                  <CollapseItems
                    key={menu.title}
                    title={menu.title}
                    items={menu.items} // Pastikan items di sini adalah array objek dengan properti title dan href
                    icon={<BalanceIcon />}
                  />
                ))}
            </SidebarMenu>

            {/* Other sidebar items */}
            <SidebarMenu title="Admin Menu">
              <SidebarItem
                isActive={pathname === "/developers"}
                title="Developers"
                icon={<DevIcon />}
                href="/developers"
              />
              <SidebarItem
                isActive={pathname === "/listmenu"}
                title="List Menu"
                icon={<ViewIcon />}
                href="/listmenu"
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={pathname === "/changelog"}
                title="Changelog"
                icon={<ChangeLogIcon />}
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
