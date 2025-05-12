"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";
import { TRecord } from "@/types";

// Get all records
export const getAllRecords = async (query: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();

  try {
    const res = await fetch(`${process.env.BASE_API}/records${queryString}`, {
      next: {
        tags: ["records"],
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Get single record
export const getSingleRecord = async (recordId: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/records/${recordId}`,
      {
        next: {
          tags: ["record"],
        },
        headers: {
          Authorization: token,
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Create record
export const createRecord = async (recordData: TRecord): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/records`, {
      method: "POST",
      body: JSON.stringify(recordData),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });

    revalidateTag("records");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Delete record
export const deleteRecord = async (recordId: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/records/${recordId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );

    revalidateTag("records");
    return await res.json();
  } catch (error: any) {
    return error;
  }
};
