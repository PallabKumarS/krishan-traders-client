"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// 🔹 Get all accounts
export const getAllAccounts = async () => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/accounts`, {
    next: { tags: ["accounts"] },
    headers: {
      Authorization: token,
    },
  });

  return await res.json();
};

// 🔹 Get single account
export const getSingleAccount = async (id: string) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/accounts/${id}`, {
    next: { tags: ["account"] },
    headers: {
      Authorization: token,
    },
  });

  return await res.json();
};

// 🔹 Create account
export const createAccountAction = async (data: FieldValues) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/accounts`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  updateTag("accounts");

  return await res.json();
};

// 🔹 Update account
export const updateAccountAction = async (id: string, data: FieldValues) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/accounts/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  updateTag("accounts");
  updateTag("account");

  return await res.json();
};

// 🔹 Delete account
export const deleteAccountAction = async (id: string) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/accounts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });

  updateTag("accounts");

  return await res.json();
};
