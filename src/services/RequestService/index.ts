/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { TSellBody } from "@/types";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// =============================
// STOCK ADD REQUESTS
// =============================

export const getAllAddStockRequests = async () => {
  try {
    const res = await fetch(`${process.env.BASE_API}/requests/add-stock`, {
      next: { tags: ["stock-add-requests"] },
      headers: {
        Authorization: await getValidToken(),
      },
    });

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

export const createAddStockRequest = async (data: FieldValues) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/requests/add-stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await getValidToken(),
      },
      body: JSON.stringify(data),
    });

    updateTag("stock-add-requests");
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

export const acceptAddStockRequest = async (
  id: string,
  status: "accepted" | "rejected",
) => {
  try {
    const res = await fetch(
      `${process.env.BASE_API}/requests/add-stock/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: await getValidToken(),
        },
        body: JSON.stringify({ status }),
      },
    );

    updateTag("stock-add-requests");
    updateTag("stocks");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// =============================
// SALE REQUESTS
// =============================

export const getAllSellStockRequests = async () => {
  try {
    const res = await fetch(`${process.env.BASE_API}/requests/sell-stock`, {
      next: { tags: ["sale-requests"] },
      headers: {
        Authorization: await getValidToken(),
      },
    });

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

export const createSellStockRequest = async (data: TSellBody) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/requests/sell-stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await getValidToken(),
      },
      body: JSON.stringify(data),
    });

    updateTag("sale-requests");
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

export const acceptSellStockRequest = async (
  id: string,
  status: "accepted" | "rejected",
) => {
  try {
    const res = await fetch(
      `${process.env.BASE_API}/requests/sell-stock/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: await getValidToken(),
        },
        body: JSON.stringify({ status }),
      },
    );

    updateTag("sale-requests");
    updateTag("sales");
    updateTag("records");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

export const getSingleSellRequest = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.BASE_API}/requests/sell-stock/${id}`,
      {
        next: { tags: ["sale-requests"] },
        headers: {
          Authorization: await getValidToken(),
        },
      },
    );

    return await res.json();
  } catch (error: any) {
    return error;
  }
};
