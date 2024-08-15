"use server";

import { cookies } from "next/headers";

export const createAuthCookie = async (user: {
  id: string;
  email: string;
  apikey: string;
}) => {
  const token = `${user.id}:${user.email}:${user.apikey}`;

  cookies().set("userAuth", token, { secure: true});
};

export const deleteAuthCookie = async () => {
  cookies().delete("userAuth");
};
