/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";

// Get all records
export const getAllRecords = async (query?: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>,
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
