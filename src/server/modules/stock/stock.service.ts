import type { TStock } from "./stock.interface";
import { StockModel } from "./stock.model";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { Types } from "mongoose";

// get all stock
const getAllStockFromDB = async (query?: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query?.status) filter.status = query.status;
  if (query?.variant) filter.variant = query.variant;

  return StockModel.find(filter)
    .populate({
      path: "variant",
      populate: {
        path: "product",
        populate: { path: "company" },
      },
    })
    .populate("stockedBy")
    .sort((query?.sort as string) || "-createdAt");
};

// update stock
const updateStockInDB = async (id: string, payload: Partial<TStock>) => {
  const stock = await StockModel.findById(id);
  if (!stock) throw new AppError(httpStatus.NOT_FOUND, "Stock not found");

  return StockModel.findByIdAndUpdate(id, payload, { new: true });
};

// delete stock
const deleteStockFromDB = async (id: string) => {
  const stock = await StockModel.findById(id);
  if (!stock) throw new AppError(httpStatus.NOT_FOUND, "Stock not found");

  return StockModel.findByIdAndDelete(id);
};

const getAggregatedStocksByCompany = async (companyId: string) => {
  return StockModel.aggregate([
    // 1️⃣ Join Size
    {
      $lookup: {
        from: "sizes",
        localField: "size",
        foreignField: "_id",
        as: "size",
      },
    },
    { $unwind: "$size" },

    // 2️⃣ Join Product
    {
      $lookup: {
        from: "products",
        localField: "size.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    // 3️⃣ Join Company
    {
      $lookup: {
        from: "companies",
        localField: "product.company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },

    // 4️⃣ Filter by company
    {
      $match: {
        "company._id": new Types.ObjectId(companyId),
      },
    },

    // 5️⃣ Group by PRODUCT + SIZE
    {
      $group: {
        _id: {
          productId: "$product._id",
          sizeId: "$size._id",
        },

        companyId: { $first: "$company._id" },
        companyName: { $first: "$company.name" },

        productId: { $first: "$product._id" },
        productName: { $first: "$product.name" },

        sizeId: { $first: "$size._id" },
        sizeLabel: { $first: "$size.label" },
        unit: { $first: "$size.unit" },
        unitQuantity: { $first: "$size.unitQuantity" },

        buyingPrice: { $first: "$size.buyingPrice" },
        sellingPrice: { $first: "$size.sellingPrice" },

        totalQuantity: { $sum: "$quantity" },
      },
    },

    // 6️⃣ Optional sorting
    {
      $sort: {
        productName: 1,
        unitQuantity: 1,
      },
    },
  ]);
};

export const StockService = {
  getAllStockFromDB,
  updateStockInDB,
  deleteStockFromDB,
  getAggregatedStocksByCompany,
};
