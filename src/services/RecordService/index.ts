/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";
import { TRecord } from "@/types";

// Get all records
export const getAllRecords = async (query?: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();

  try {
    const res = await fetch(`${process.env.BASE_API}/records?${queryString}`, {
      next: {
        tags: ["records"],
      },
      headers: {
        Authorization: await getValidToken(),
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Add stock
export const addStock = async (
  stockData: Record<string, any>
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/records/add-stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(stockData),
    });

    updateTag("records");
    updateTag("stocks");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Sell stock
export const sellStock = async (
  sellData: Record<string, any>
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/records/sell-stock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(sellData),
    });

    updateTag("records");
    updateTag("stocks");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Accept add stock request
export const acceptAddStock = async (
  recordId: string,
  payload: { status: TRecord["status"] }
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/records/${recordId}/accept-add-stock`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      }
    );

    updateTag("records");
    updateTag("stocks");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Accept sell stock request
export const acceptSellStock = async (
  recordId: string,
  payload: { status: TRecord["status"] }
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/records/${recordId}/accept-sell-stock`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    updateTag("records");
    updateTag("stocks");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Delete record
export const deleteRecord = async (recordId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/records/${recordId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    updateTag("records");
    return await res.json();
  } catch (error: any) {
    return error;
  }
};
