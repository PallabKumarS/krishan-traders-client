import mongoose from "mongoose";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import RecordModel from "./record.model";
import SizeModel from "../size/size.model";
import ProductModel from "../product/product.model";
import CompanyModel from "../company/company.model";
import StockModel from "../stock/stock.model";
import { AccountTransactionService } from "../accountTransactions/transactions.service";
import { SellService } from "../sell/sell.service";

//  GET ALL RECORDS
const getAllRecordFromDB = async (query?: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query?.type) filter.type = query.type;
  if (query?.status) filter.status = query.status;

  return RecordModel.find(filter)
    .populate({
      path: "size",
      model: SizeModel,
      populate: {
        path: "product",
        model: ProductModel,
        populate: {
          path: "company",
          model: CompanyModel,
        },
      },
    })
    .populate("interactedBy")
    .sort("-createdAt");
};

//  DELETE RECORD
const deleteRecordFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const record = await RecordModel.findById(id).session(session);
    if (!record) throw new AppError(httpStatus.NOT_FOUND, "Record not found");

    if (record.saleId) {
      await SellService.deleteSaleFromDB(record.saleId.toString());
      await session.commitTransaction();
      session.endSession();
      return { success: true, message: "Associated sale and records deleted" };
    }

    const stockUpdate =
      record.type === "sale"
        ? { $inc: { quantity: record.quantity } }
        : { $inc: { quantity: -record.quantity } };

    await StockModel.findOneAndUpdate(
      { size: record.size, expiryDate: record.expiryDate },
      stockUpdate,
      { session },
    );

    // 3. Revert Transaction
    if (record.transactionId) {
      await AccountTransactionService.deleteTransaction(
        record.transactionId.toString(),
      );
    }

    // 4. Delete the Record itself
    await RecordModel.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();
    return { success: true };
    // biome-ignore lint/suspicious/noExplicitAny: <>
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const RecordService = {
  getAllRecordFromDB,
  deleteRecordFromDB,
};
