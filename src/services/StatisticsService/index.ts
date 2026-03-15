/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";

export const getCompanyStatistics = async (companyId: string) => {
  try {
    const endpoint =
      companyId === "all"
        ? `${process.env.BASE_API}/statistics/all`
        : `${process.env.BASE_API}/statistics/company/${companyId}`;

    const res = await fetch(endpoint, {
      next: {
        tags: ["statistics"],
      },
      headers: {
        Authorization: await getValidToken(),
      },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch statistics",
      data: { totalProducts: 0, itemsSold: 0 },
    };
  }
};
