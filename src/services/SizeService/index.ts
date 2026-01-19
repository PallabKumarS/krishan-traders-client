/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// Get all sizes
export const getAllSizes = async () => {
  try {
    const res = await fetch(`${process.env.BASE_API}/sizes`, {
      next: {
        tags: ["sizes"],
      },
      headers: {
        "Content-type": "application/json",
        Authorization: await getValidToken(),
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Get single size
export const getSingleSize = async (sizeId: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/sizes/${sizeId}`, {
      next: {
        tags: ["size"],
      },
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Create size
export const createSize = async (sizeData: FieldValues): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/sizes`, {
      method: "POST",
      body: JSON.stringify(sizeData),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    updateTag("sizes");
    updateTag("size");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Update size
export const updateSize = async (
  productId: string,
  sizeData: FieldValues,
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/sizes/${productId}`, {
      method: "PUT",
      body: JSON.stringify(sizeData),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    updateTag("sizes");
    updateTag("size");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Delete size
export const deleteSize = async (productId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/sizes/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    updateTag("sizes");
    updateTag("size");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

export const getSizesByProduct = async (productId: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${process.env.BASE_API}/sizes/${productId}/product`,
      {
        next: {
          tags: ["product-sizes"],
        },
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
      },
    );
    return await res.json();
  } catch (error: any) {
    return error;
  }
};
