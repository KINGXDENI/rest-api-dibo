"use server";

import { cookies } from "next/headers";

export const createAuthCookie = async (user: {
  id: string;
  email: string;
  apikey: string;
  username: string;
  profil_pic: string;
}) => {
  const token = `${user.id}:${user.email}:${user.apikey}:${user.username}:${user.profil_pic}`;

  cookies().set("userAuth", token, { secure: true });
};

export const deleteAuthCookie = async () => {
  cookies().delete("userAuth");
};
