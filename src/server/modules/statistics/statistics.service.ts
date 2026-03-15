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

export const StatisticsService = {
  getCompanyStatsFromDB,
};
