/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { cookies } from "next/headers";

export const setCookies = async (accessToken: string, refreshToken: string) => {
  (await cookies()).set("accessToken", accessToken);
  (await cookies()).set("refreshToken", refreshToken);
};

export const setAccessToken = async (accessToken: string) => {
  (await cookies()).set("accessToken", accessToken);
};

export const deleteCookie = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
};

// login user
export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    await setCookies(resData?.data?.accessToken, resData?.data?.refreshToken);

    return resData;
  } catch (error) {
    console.error("Error logging in:", error);
    return error;
  }
};

// region register user
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    return resData;
  } catch (error) {
    return error;
  }
};

// change password
export const passwordChange = async (userData: any) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/change-password`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: await getValidToken(),
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result.success) {
    }

    return result;
  } catch (error: any) {
    return error;
  }
};
