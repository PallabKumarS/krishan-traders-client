"use server";

import { getValidToken } from "@/lib/verifyToken";
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
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/sells/${id}`, {
    next: { tags: ["sell"] },
    headers: { Authorization: token },
  });

  return await res.json();
};

// Create
export const createSellAction = async (data: FieldValues) => {
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
};

// Update
export const updateSellAction = async (id: string, data: FieldValues) => {
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
};

// Delete
export const deleteSellAction = async (id: string) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/sells/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });

  updateTag("sells");

  return await res.json();
};
