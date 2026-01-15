import mongoose from "mongoose";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { RecordModel } from "./record.model";
import { StockModel } from "../stock/stock.model";

/* =====================================
   GET ALL RECORDS
===================================== */
const getAllRecordFromDB = async (query?: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query?.type) filter.type = query.type;
  if (query?.status) filter.status = query.status;

  return RecordModel.find(filter)
    .populate({
      path: "stock",
      populate: {
        path: "variant",
        populate: {
          path: "product",
          populate: { path: "company" },
        },
      },
    })
    .populate("stockedBy")
    .populate("soldBy")
    .sort("-createdAt");
};

/* =====================================
   CREATE STOCK REQUEST (PENDING)
===================================== */
const requestAddStockToDB = async (payload: {
  stock: string;
  quantity: number;
  stockedBy: string;
}) => {
  return RecordModel.create({
    stock: payload.stock,
    quantity: payload.quantity,
    stockedBy: payload.stockedBy,
    type: "stock_in",
    status: "pending",
  });
};

/* =====================================
   CREATE SELL REQUEST (PENDING)
===================================== */
const requestSellStockFromDB = async (payload: {
  stock: string;
  quantity: number;
  soldBy: string;
}) => {
  const stock = await StockModel.findById(payload.stock);
  if (!stock) throw new AppError(httpStatus.NOT_FOUND, "Stock not found");

  if (stock.quantity < payload.quantity) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient stock");
  }

  return RecordModel.create({
    stock: payload.stock,
    quantity: payload.quantity,
    soldBy: payload.soldBy,
    type: "sale",
    status: "pending",
  });
};

/* =====================================
   ADMIN: ACCEPT / REJECT ADD STOCK
===================================== */
const acceptAddStockInDB = async (
  recordId: string,
  payload: { status: "accepted" | "rejected" }
) => {
  const record = await RecordModel.findById(recordId);
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "Record not found");

  if (record.type !== "stock_in")
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid record type");

  if (record.status !== "pending")
    throw new AppError(httpStatus.BAD_REQUEST, "Record already processed");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (payload.status === "rejected") {
      record.status = "rejected";
      await record.save({ session });

      await session.commitTransaction();
      session.endSession();
      return record;
    }

    const stock = await StockModel.findById(record.stock).session(session);
    if (!stock) throw new AppError(httpStatus.NOT_FOUND, "Stock not found");

    stock.quantity += record.quantity;
    stock.status = "available";
    await stock.save({ session });

    record.status = "accepted";
    await record.save({ session });

    await session.commitTransaction();
    session.endSession();
    return stock;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/* =====================================
   ADMIN: ACCEPT / REJECT SELL STOCK
===================================== */
const acceptSellStockInDB = async (
  recordId: string,
  payload: { status: "accepted" | "rejected" }
) => {
  const record = await RecordModel.findById(recordId);
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "Record not found");

  if (record.type !== "sale")
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid record type");

  if (record.status !== "pending")
    throw new AppError(httpStatus.BAD_REQUEST, "Record already processed");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (payload.status === "rejected") {
      record.status = "rejected";
      await record.save({ session });

      await session.commitTransaction();
      session.endSession();
      return record;
    }

    const stock = await StockModel.findById(record.stock).session(session);
    if (!stock) throw new AppError(httpStatus.NOT_FOUND, "Stock not found");

    if (stock.quantity < record.quantity) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient stock");
    }

    stock.quantity -= record.quantity;
    stock.status = stock.quantity === 0 ? "sold" : "available";
    await stock.save({ session });

    record.status = "accepted";
    await record.save({ session });

    await session.commitTransaction();
    session.endSession();
    return stock;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/* =====================================
   DELETE RECORD
===================================== */
const deleteRecordFromDB = async (id: string) => {
  const record = await RecordModel.findById(id);
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "Record not found");

  if (record.status === "accepted") {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete accepted record");
  }

  return RecordModel.findByIdAndDelete(id);
};

/* =====================================
   EXPORT
===================================== */
export const RecordService = {
  getAllRecordFromDB,

  requestAddStockToDB,
  requestSellStockFromDB,

  acceptAddStockInDB,
  acceptSellStockInDB,

  deleteRecordFromDB,
};
