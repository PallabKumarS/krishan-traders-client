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
import UserModel from "../user/user.model";

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

const getAllStockByCompanyFromDB = async (companyId: string) => {
  // Convert the string ID to an ObjectId once at the beginning
  const companyObjectId = new Types.ObjectId(companyId);

  return StockModel.aggregate([
    // Stage 1: Join with the 'sizes' collection
    {
      $lookup: {
        from: SizeModel.collection.name,
        localField: "size",
        foreignField: "_id",
        as: "size",
      },
    },
    // $lookup creates an array, so we deconstruct it to a single object
    { $unwind: "$size" },
    // Stage 2: Join with the 'products' collection
    {
      $lookup: {
        from: ProductModel.collection.name,
        localField: "size.product",
        foreignField: "_id",
        as: "size.product",
      },
    },
    { $unwind: "$size.product" },

    // Stage 3: Join with the 'companies' collection
    {
      $lookup: {
        from: CompanyModel.collection.name,
        localField: "size.product.company",
        foreignField: "_id",
        as: "size.product.company",
      },
    },
    // Deconstruct the company array. We use preserveNullAndEmptyArrays in case a product has no company.
    {
      $unwind: "$size.product.company",
    },
    // Stage 4: FILTER - This is the key step. Now we filter the stocks based on the company ID.
    {
      $match: {
        "size.product.company._id": companyObjectId,
      },
    },
    // Stage 5: Join with the 'users' collection for the 'stockedBy' field
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "stockedBy",
        foreignField: "_id",
        as: "stockedBy",
      },
    },
    { $unwind: "$stockedBy" },
    // Stage 6: Add new fields for UI
    {
      $addFields: {
        companyName: "$size.product.company.name",
        productName: "$size.product.name",
        sizeLabel: "$size.label",
      },
    },
    // Stage 7: Sort the final results by expiry date, descending
    {
      $sort: {
        expiryDate: -1,
      },
    },
  ]);
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

export const StockService = {
  getAllStockFromDB,
  updateStockInDB,
  deleteStockFromDB,
  addStockInDB,
  getAllStockByCompanyFromDB,
};
