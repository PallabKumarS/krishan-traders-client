/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { TSell } from "@/types/sell.type";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// Get all
export const getAllSells = async () => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/sells`, {
    next: { tags: ["sells"] },
    headers: { Authorization: token },
  });

  return await res.json();
};

// Get single
export const getSingleSell = async (id: string) => {
  try {
    const token = await getValidToken();

    const res = await fetch(`${process.env.BASE_API}/sells/${id}`, {
      next: { tags: ["sell"] },
      headers: { Authorization: token },
    });

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Create
export const directlyCreateSell = async (data: FieldValues) => {
  try {
    const token = await getValidToken();

    const res = await fetch(`${process.env.BASE_API}/sells`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    updateTag("sells");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Update
export const updateSell = async (id: string, data: FieldValues) => {
  try {
    const token = await getValidToken();

    const res = await fetch(`${process.env.BASE_API}/sells/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    updateTag("sells");
    updateTag("sell");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Delete
export const deleteSell = async (id: string) => {
  try {
    const token = await getValidToken();

    const res = await fetch(`${process.env.BASE_API}/sells/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    updateTag("sells");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

export const directlySellStock = async (payload: TSell) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/sell`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    updateTag("stocks");
    updateTag("records");
    updateTag("accounts");
    updateTag("account-transactions");
    updateTag("sells");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};
