import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import type { TStock } from "../stock/stock.interface";
import RecordModel from "./record.model";
import StockModel from "../stock/stock.model";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import type { TRecord } from "./record.interface";

// get all records
const getAllRecordFromDB = async (query: Record<string, unknown>) => {
  const recordQuery = new QueryBuilder(RecordModel.find({}), query)
    .paginate()
    .sort()
    .filter();

  const data = await recordQuery.modelQuery
    .populate("stockId")
    .populate("soldBy")
    .populate("stockedBy");

  const meta = await recordQuery.countTotal();

  return {
    meta,
    data,
  };
};

// add stock
const addStockToDB = async (payload: Partial<TStock>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await StockModel.create([payload], { session });

    if (!result.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create new stock");
    }

    const recordResult = await RecordModel.create(
      [
        {
          stockId: result[0]._id,
          stockedDate: result[0].stockedDate,
          stockedBy: result[0].stockedBy,
          quantity: payload.quantity,
        },
      ],
      { session }
    );

    if (!recordResult.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to add to records");
    }

    await session.commitTransaction();
    await session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// sell stock
const sellStockFromDB = async (payload: Partial<TRecord>) => {
  const isStockExist = await StockModel.findOne({
    _id: payload.stockId,
  });

  if (!isStockExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Stock not found");
  }

  if (isStockExist.status === "sold") {
    throw new AppError(httpStatus.BAD_REQUEST, "Stock already sold");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const recordResult = await RecordModel.create(
      [
        {
          stockId: payload.stockId,
          quantity: payload.quantity,
          soldBy: payload.soldBy,
          soldDate: payload.soldDate,
        },
      ],
      { session }
    );

    if (!recordResult.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to add to records");
    }

    await StockModel.findOneAndUpdate(
      { _id: payload.stockId },
      {
        message:
          "Stock added to sell queue, awaiting for approval. Quantity to sell: " +
          payload.quantity!,
      },
      {
        new: true,
        session,
      }
    );

    await session.commitTransaction();
    await session.endSession();

    return recordResult;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// change stock status to accepted
const acceptAddStockInDB = async (
  id: string,
  payload: { status: TRecord["status"] }
) => {
  const isRecordExists = await RecordModel.findOne({ _id: id });
  if (!isRecordExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Record not found");
  }

  const isStockExists = await StockModel.findOne({
    _id: isRecordExists.stockId,
  });
  if (!isStockExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Stock not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // if rejected
    if (payload.status === "rejected") {
      const result = await RecordModel.findOneAndUpdate(
        { _id: id },
        { status: payload.status },
        { new: true, session }
      );

      if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to reject stock");
      }

      const stockResult = await StockModel.findOneAndUpdate(
        { _id: isRecordExists.stockId },
        { status: "rejected" },
        { new: true, session }
      );
      if (!stockResult) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to reject stock");
      }
      await session.commitTransaction();
      await session.endSession();

      return stockResult;
      // if accepted
    } else {
      await RecordModel.findOneAndUpdate(
        { _id: id },
        { status: payload.status },
        { new: true, session }
      );

      const stockResult = await StockModel.find({
        companyName: isStockExists.companyName,
        productName: isStockExists.productName,
        size: isStockExists.size,
        expiryDate: isStockExists.expiryDate,
      });

      const multipleStock = stockResult.length > 1;

      // if same stock added in multiple batch
      if (multipleStock) {
        const totalQuantity = stockResult.reduce((acc, curr) => {
          return acc + curr.quantity;
        }, 0);

        const deleteResult = await StockModel.deleteMany(
          {
            companyName: isStockExists.companyName,
            productName: isStockExists.productName,
            size: isStockExists.size,
            expiryDate: isStockExists.expiryDate,
          },
          { session }
        );

        if (deleteResult.deletedCount === 0) {
          throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete stock");
        }

        const newStock = await StockModel.create(
          [
            {
              companyName: isStockExists.companyName,
              productName: isStockExists.productName,
              size: isStockExists.size,
              expiryDate: isStockExists.expiryDate,
              stockedDate: isStockExists.stockedDate,
              stockedBy: isStockExists.stockedBy,
              quantity: totalQuantity,
              status: "accepted",
            },
          ],
          { session }
        );

        if (!newStock.length) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Failed to create new stock"
          );
        }

        await session.commitTransaction();
        await session.endSession();

        return newStock;

        // if single stock added in single batch
      } else {
        const updatedStock = await StockModel.findOneAndUpdate(
          {
            _id: isStockExists._id,
          },
          { status: "accepted" },
          { new: true, session }
        );

        if (!updatedStock) {
          throw new AppError(httpStatus.BAD_REQUEST, "Failed to update stock");
        }

        await session.commitTransaction();
        await session.endSession();

        return updatedStock;
      }
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// accept sell stock
const acceptSellStockInDB = async (
  id: string,
  payload: { status: TRecord["status"] }
) => {
  const isRecordExists = await RecordModel.findOne({ _id: id });
  if (!isRecordExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Record not found");
  }

  const isStockExists = await StockModel.findOne({
    _id: isRecordExists.stockId,
    status: "accepted",
  });
  if (!isStockExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Stock not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // if rejected
    if (payload.status === "rejected") {
      const result = await RecordModel.findOneAndUpdate(
        { _id: id },
        { status: payload.status },
        { new: true, session }
      );
      if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to reject stock");
      }

      const stockResult = await StockModel.findOneAndUpdate(
        { _id: isRecordExists.stockId },
        { message: "" },
        { new: true, session }
      );

      await session.commitTransaction();
      await session.endSession();

      return stockResult;
    } else {
      const quantity = isStockExists.quantity - isRecordExists.quantity!;

      const stockResult = await StockModel.findOneAndUpdate(
        { _id: isStockExists._id },
        {
          quantity: quantity,
          soldBy: isRecordExists.soldBy,
          soldDate: isRecordExists.soldDate,
          status: quantity === 0 ? "sold" : "accepted",
          message: "",
        },
        {
          new: true,
          session,
        }
      );

      if (!stockResult) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to sell stock");
      }

      const recordResult = await RecordModel.findOneAndUpdate(
        { _id: isRecordExists._id },
        { status: "accepted" },
        { new: true, session }
      );

      if (!recordResult) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to add to records");
      }

      await session.commitTransaction();
      await session.endSession();

      return stockResult;
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// delete record
const deleteRecordFromDB = async (id: string) => {
  const isRecordExists = await RecordModel.findOne({ _id: id });
  if (!isRecordExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Record not found");
  }
  const result = await RecordModel.findOneAndDelete({ _id: id });
  return result;
};

export const RecordService = {
  getAllRecordFromDB,
  addStockToDB,
  sellStockFromDB,
  acceptAddStockInDB,
  acceptSellStockInDB,
  deleteRecordFromDB,
};
