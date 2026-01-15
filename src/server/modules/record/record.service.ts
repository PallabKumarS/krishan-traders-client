import mongoose from "mongoose";
import { RecordModel } from "./record.model";
import { StockModel } from "../stock/stock.model";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import type { TRecord } from "./record.interface";

// get all records
// biome-ignore lint/correctness/noUnusedFunctionParameters: <>
const getAllRecordFromDB = async (query: Record<string, unknown>) => {
  return RecordModel.find({})
    .populate({
      path: "stock",
      populate: {
        path: "variant",
        populate: { path: "product", populate: "company" },
      },
    })
    .populate("performedBy")
    .sort("-createdAt");
};

// add stock record
const addStockToDB = async (payload: Partial<TRecord>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const stock = await StockModel.findById(payload.stock).session(session);
    if (!stock) throw new AppError(httpStatus.NOT_FOUND, "Stock not found");

    const record = await RecordModel.create(
      [
        {
          stock: payload.stock,
          type: "stock_in",
          quantity: payload.quantity,
          performedBy: payload.performedBy,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return record[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// sell stock
const sellStockFromDB = async (payload: Partial<TRecord>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const stock = await StockModel.findById(payload.stock).session(session);
    if (!stock) throw new AppError(httpStatus.NOT_FOUND, "Stock not found");

    if (stock.quantity < payload.quantity!) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient stock");
    }

    stock.quantity -= payload.quantity!;
    if (stock.quantity === 0) stock.status = "sold";

    await stock.save({ session });

    const record = await RecordModel.create(
      [
        {
          stock: stock._id,
          type: "sale",
          quantity: payload.quantity,
          performedBy: payload.performedBy,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return record[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// delete record
const deleteRecordFromDB = async (id: string) => {
  return RecordModel.findByIdAndDelete(id);
};

export const RecordService = {
  getAllRecordFromDB,
  addStockToDB,
  sellStockFromDB,
  deleteRecordFromDB,
};
