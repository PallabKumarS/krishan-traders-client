"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// Get all
export const getAllCustomers = async () => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/customers`, {
    next: { tags: ["customers"] },
    headers: { Authorization: token },
  });

  return await res.json();
};

// Get single
export const getSingleCustomer = async (id: string) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/customers/${id}`, {
    next: { tags: ["customer"] },
    headers: { Authorization: token },
  });

  return await res.json();
};

// Create
export const createCustomerAction = async (data: FieldValues) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/customers`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  updateTag("customers");

  return await res.json();
};

// Update
export const updateCustomerAction = async (id: string, data: FieldValues) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/customers/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  updateTag("customers");
  updateTag("customer");

  return await res.json();
};

// Delete
export const deleteCustomerAction = async (id: string) => {
  const token = await getValidToken();

  const res = await fetch(`${process.env.BASE_API}/customers/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });

  updateTag("customers");

  return await res.json();
};
