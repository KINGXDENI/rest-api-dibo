"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { AcmeIcon } from "../icons/acme-icon";
import { BottomIcon } from "../icons/sidebar/bottom-icon";

// Function to decode and parse the cookie value
const parseUserAuthCookie = (cookieValue: string) => {
  const decodedValue = decodeURIComponent(cookieValue);
  const parts = decodedValue.split(":");
  const name = parts[3];
  const apiKey = parts[2];
  return { name, apiKey };
};

export const CompaniesDropdown = () => {
  const [userData, setUserData] = useState<{ name: string; apiKey: string }>({
    name: "Default User",
    apiKey: "No API Key",
  });

  useEffect(() => {
    const userAuthCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userAuth="))
      ?.split("=")[1];

    if (userAuthCookie) {
      const { name, apiKey } = parseUserAuthCookie(userAuthCookie);
      setUserData({ name, apiKey });
    }
  }, []);

  return (
    <Dropdown
      classNames={{
        base: "w-full min-w-[260px]",
      }}
    >
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          <AcmeIcon />
          <div className="flex flex-col gap-4">
            <h3 className="text-md font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              {userData.name}
            </h3>
            <span className="text-xs font-medium text-default-500">
              {userData.apiKey}
            </span>
          </div>
          <BottomIcon />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Avatar Actions">
        <DropdownSection title="User Details">
          <DropdownItem
            key="1"
            startContent={<AcmeIcon />}
            classNames={{
              base: "py-4",
              title: "text-base font-semibold",
            }}
          >
            Name: {userData.name}
          </DropdownItem>
          <DropdownItem
            key="2"
            startContent={<AcmeIcon />}
            classNames={{
              base: "py-4",
              title: "text-base font-semibold",
            }}
          >
            API Key: {userData.apiKey}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
