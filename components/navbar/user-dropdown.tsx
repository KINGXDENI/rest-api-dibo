"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/navigation";
import { deleteAuthCookie } from "@/actions/auth.action";
import { parseUserAuthCookie } from "@/utils/parseUserAuthCookie";

export const UserDropdown = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string }>({
    email: "",
    name: "",
  });

  useEffect(() => {
    const fetchUserFromCookie = () => {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userAuth="));
      if (cookie) {
        const cookieValue = cookie.split("=")[1];
        const userInfo = parseUserAuthCookie(cookieValue);
        setUser({ email: userInfo.email, name: userInfo.name });
      }
    };

    fetchUserFromCookie();
  }, []);

  const handleLogout = useCallback(async () => {
    await deleteAuthCookie();
    router.replace("/login");
  }, [router]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Signed in as</p>
          <p>{user.email}</p>
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          onPress={handleLogout}
        >
          Log Out
        </DropdownItem>
        <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
