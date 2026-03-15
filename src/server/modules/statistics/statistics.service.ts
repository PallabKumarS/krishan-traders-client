/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { Types } from "mongoose";
import ProductModel from "../product/product.model";
import RecordModel from "../record/record.model";
import SizeModel from "../size/size.model";
import StockModel from "../stock/stock.model";

/**
 * Get statistics for a specific company or all companies
 * @param companyId - The ID of the company, or null/undefined for all companies
 */
const getCompanyStatsFromDB = async (companyId?: string) => {
  const matchFilter: any = {};
  if (companyId && companyId !== "all") {
    matchFilter.company = new Types.ObjectId(companyId);
  }

  // 1. Get Total Products Count
  const totalProducts = await ProductModel.countDocuments(matchFilter);

  // 2. Get Sales Statistics from RecordModel
  const salesPipeline: any[] = [
    { $match: { type: "sale" } },
    {
      $lookup: {
        from: SizeModel.collection.name,
        localField: "size",
        foreignField: "_id",
        as: "sizeDetails",
      },
    },
    { $unwind: "$sizeDetails" },
    {
      $lookup: {
        from: ProductModel.collection.name,
        localField: "sizeDetails.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
  ];

  if (companyId && companyId !== "all") {
    salesPipeline.push({
      $match: { "productDetails.company": new Types.ObjectId(companyId) },
    });
  }

  salesPipeline.push({
    $group: {
      _id: null,
      totalSold: { $sum: "$quantity" },
    },
  });

  const soldResult = await RecordModel.aggregate(salesPipeline);
  const itemsSold = soldResult.length > 0 ? soldResult[0].totalSold : 0;

  // 3. Get Stock Statistics from StockModel (Low Stock, Expiry, Valuation)
  const stockPipeline: any[] = [
    { $match: { quantity: { $gt: 0 } } },
    {
      $lookup: {
        from: SizeModel.collection.name,
        localField: "size",
        foreignField: "_id",
        as: "sizeDetails",
      },
    },
    { $unwind: "$sizeDetails" },
    {
      $lookup: {
        from: ProductModel.collection.name,
        localField: "sizeDetails.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
  ];

  if (companyId && companyId !== "all") {
    stockPipeline.push({
      $match: { "productDetails.company": new Types.ObjectId(companyId) },
    });
  }

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  stockPipeline.push({
    $group: {
      _id: null,
      lowStockCount: {
        $sum: { $cond: [{ $lt: ["$quantity", 10] }, 1, 0] },
      },
      expiringSoonCount: {
        $sum: { $cond: [{ $lte: ["$expiryDate", thirtyDaysFromNow] }, 1, 0] },
      },
      inventoryValue: { $sum: { $multiply: ["$quantity", "$buyingPrice"] } },
      potentialRevenue: { $sum: { $multiply: ["$quantity", "$sellingPrice"] } },
    },
  });

  const stockStatsResult = await StockModel.aggregate(stockPipeline);
  const stockStats = stockStatsResult.length > 0 ? stockStatsResult[0] : {
    lowStockCount: 0,
    expiringSoonCount: 0,
    inventoryValue: 0,
    potentialRevenue: 0,
  };

  return {
    totalProducts,
    itemsSold,
    lowStockCount: stockStats.lowStockCount,
    expiringSoonCount: stockStats.expiringSoonCount,
    inventoryValue: stockStats.inventoryValue,
    potentialRevenue: stockStats.potentialRevenue,
  };
};

const getStoreStatsFromDB = async () => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Profit & Transaction Calculations
  const profitPipeline: any[] = [
    { $match: { type: "sale" } },
    {
      $group: {
        _id: null,
        allTimeProfit: { $sum: "$profit" },
        thisMonthProfit: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", monthStart] }, "$profit", 0],
          },
        },
        todayProfit: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", todayStart] }, "$profit", 0],
          },
        },
        todaySalesCount: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", todayStart] }, 1, 0],
          },
        },
      },
    },
  ];

  const profitResult = await RecordModel.aggregate(profitPipeline);
  const profits = profitResult.length > 0
    ? profitResult[0]
    : { allTimeProfit: 0, thisMonthProfit: 0, todayProfit: 0, todaySalesCount: 0 };

  // 2. Daily Profits Chart (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const chartPipeline: any[] = [
    {
      $match: {
        type: "sale",
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        profit: { $sum: "$profit" },
      },
    },
    { $sort: { _id: 1 } },
  ];

  const chartDataRaw = await RecordModel.aggregate(chartPipeline);
  
  const dailyProfitsChart = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const match = chartDataRaw.find((d) => d._id === dateStr);
    dailyProfitsChart.push({
      date: dateStr,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      profit: match ? match.profit : 0,
    });
  }

  // 3. Inventory Analytics (Value, Low Stock, Expiry)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const inventoryPipeline: any[] = [
    { $match: { quantity: { $gt: 0 } } },
    {
      $group: {
        _id: null,
        totalStockValue: { $sum: { $multiply: ["$quantity", "$buyingPrice"] } },
        lowStockCount: {
          $sum: { $cond: [{ $lt: ["$quantity", 10] }, 1, 0] },
        },
        expiringSoonCount: {
          $sum: { $cond: [{ $lte: ["$expiryDate", thirtyDaysFromNow] }, 1, 0] },
        },
      },
    },
  ];

  const inventoryResult = await StockModel.aggregate(inventoryPipeline);
  const inventoryStats = inventoryResult.length > 0 ? inventoryResult[0] : {
    totalStockValue: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
  };

  // 4. Merge with Company "all" stats (Total Products, Items Sold)
  const allCompanyStats = await getCompanyStatsFromDB("all");

  return {
    ...profits,
    ...inventoryStats,
    totalProducts: allCompanyStats.totalProducts,
    itemsSold: allCompanyStats.itemsSold,
    dailyProfitsChart,
  };
};

export const StatisticsService = {
  getCompanyStatsFromDB,
  getStoreStatsFromDB,
};
