/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import type { TStock } from "./stock.interface";
import StockModel from "./stock.model";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import mongoose, { Types } from "mongoose";
import SizeModel from "../size/size.model";
import ProductModel from "../product/product.model";
import CompanyModel from "../company/company.model";
import RecordModel from "../record/record.model";

// get all stock
const getAllStockFromDB = async (query?: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query?.status) filter.status = query.status;
  if (query?.size) filter.size = query.size;

  return StockModel.find(filter)
    .populate({
      path: "size",
      populate: {
        path: "product",
        populate: { path: "company" },
      },
    })
    .populate("stockedBy")
    .sort((query?.sort as string) || "-createdAt");
};

const addStockInDB = async (payload: Partial<TStock>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let stock: TStock = {} as TStock;

    const isStockExists = await StockModel.findOne({
      size: payload.size,
      expiryDate: payload.expiryDate,
    });

    if (isStockExists) {
      stock = await StockModel.findOneAndUpdate(
        { size: payload.size, expiryDate: payload.expiryDate },
        { $inc: { quantity: payload.quantity } },
        { new: true },
      ).session(session);

      if (!stock) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "Failed to add stock to existing.",
        );
      }
    } else {
      const newStock = await StockModel.create([payload], { session });

      stock = newStock[0];

      if (!stock) {
        throw new AppError(httpStatus.NOT_FOUND, "Failed to add stock.");
      }
    }
    const newRecord = await RecordModel.create(
      [
        {
          ...payload,
          type: "stock_in",
          interactedBy: payload.stockedBy,
        },
      ],
      { session },
    );

    if (!newRecord[0]) {
      throw new AppError(httpStatus.NOT_FOUND, "Failed to add record.");
    }
    const updatedSize = await SizeModel.findByIdAndUpdate(
      stock.size,
      {
        $set: {
          buyingPrice: stock.buyingPrice,
          sellingPrice: stock.sellingPrice,
        },
      },
      { new: true },
    ).session(session);

    if (!updatedSize) {
      throw new AppError(httpStatus.NOT_FOUND, "Failed to update size.");
    }

    await session.commitTransaction();
    session.endSession();
    return stock;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
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
        from: SizeModel.collection.name,
        localField: "size",
        foreignField: "_id",
        as: "size",
      },
    },
    { $unwind: "$size" },

    // 2️⃣ Join Product
    {
      $lookup: {
        from: ProductModel.collection.name,
        localField: "size.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    // 3️⃣ Join Company
    {
      $lookup: {
        from: CompanyModel.collection.name,
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
  addStockInDB,
  getAggregatedStocksByCompany,
};
