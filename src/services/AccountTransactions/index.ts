"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// 🔹 Get all transactions
export const getAllTransactions = async () => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/account-transactions`, {
    next: { tags: ["transactions"] },
    headers: {
      Authorization: token,
    },
  });

  return await res.json();
};

// 🔹 Create transaction
export const createTransaction = async (data: FieldValues) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/account-transactions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  // Revalidate related data
  updateTag("transactions");
  updateTag("accounts");

  return await res.json();
};

// 🔹 Update transaction
export const updateTransaction = async (id: string, data: FieldValues) => {
  const token = await getValidToken();

  const res = await fetch(
    `${process.env.BASE_API}/account-transactions/${id}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    },
  );

  updateTag("transactions");
  updateTag("accounts");

  return await res.json();
};

// 🔹 Delete transaction
export const deleteTransaction = async (id: string) => {
  const token = await getValidToken();

  const res = await fetch(
    `${process.env.BASE_API}/account-transactions/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    },
  );

  updateTag("transactions");
  updateTag("accounts");

  return await res.json();
};
