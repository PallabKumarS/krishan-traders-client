/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// Get all company
export const getAllProducts = async (query?: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();

  try {
    const res = await fetch(`${process.env.BASE_API}/products?${queryString}`, {
      next: {
        tags: ["products"],
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

// Get single company
export const getSingleProduct = async (productId: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/products/${productId}`, {
      next: {
        tags: ["product"],
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

// Create company
export const createProduct = async (productData: FieldValues): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/products`, {
      method: "POST",
      body: JSON.stringify(productData),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    updateTag("products");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// update product
export const updateProduct = async (
  productId: string,
  productData: FieldValues
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    updateTag("products");
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Delete product
export const deleteCompany = async (productId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    updateTag("companies");
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

export const getAllProductsByCompany = async (companyId: string) => {
  try {
    const res = await fetch(
      `${process.env.BASE_API}/products?company=${companyId}`,
      {
        next: {
          tags: ["company-products"],
        },
        headers: {
          "Content-type": "application/json",
          Authorization: await getValidToken(),
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return error;
  }
};
