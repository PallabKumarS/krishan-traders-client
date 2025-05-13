"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// Get all stocks
export const getAllStocks = async (query?: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();

  try {
    const res = await fetch(`${process.env.BASE_API}/stocks?${queryString}`, {
      next: {
        tags: ["stocks"],
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

// Get single stock
export const getSingleStock = async (stockId: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/stocks/${stockId}`, {
      next: {
        tags: ["stock"],
      },
      headers: {
        Authorization: token,
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Update stock
export const updateStock = async (
  stockId: string,
  stockData: FieldValues
): Promise<any> => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/stocks/${stockId}`, {
      method: "PATCH",
      body: JSON.stringify(stockData),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("stock");
    revalidateTag("stocks");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Delete stock
export const deleteStock = async (stockId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/stocks/${stockId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    revalidateTag("stocks");
    return await res.json();
  } catch (error: any) {
    return error;
  }
};
