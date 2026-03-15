/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";

export const getCompanyStatistics = async (companyId: string) => {
  try {
    const endpoint =
      companyId === "all"
        ? `${process.env.BASE_API}/statistics`
        : `${process.env.BASE_API}/statistics/company/${companyId}`;

    const res = await fetch(endpoint, {
      next: {
        tags: ["statistics", companyId],
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

export const getStoreStatistics = async () => {
  try {
    const res = await fetch(`${process.env.BASE_API}/statistics`, {
      next: {
        tags: ["store-statistics", "records", "stocks"],
      },
      headers: {
        Authorization: await getValidToken(),
      },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch store statistics",
      data: {
        todayProfit: 0,
        thisMonthProfit: 0,
        allTimeProfit: 0,
        dailyProfitsChart: [],
        totalStockValue: 0,
        totalProducts: 0,
        itemsSold: 0,
      },
    };
  }
};
