import mongoose from "mongoose";
import httpStatus from "http-status";
import StockModel from "../stock/stock.model";
import RecordModel from "../record/record.model";
import StockAddRequestModel from "./stock-requests.model";
import { TStockAddRequest } from "./stock-requests.interface";
import { AppError } from "@/server/errors/AppError";
import { TUser } from "../user/user.interface";

const createStockAddRequest = async (
  user: TUser,
  payload: Partial<TStockAddRequest>,
) => {
  return StockAddRequestModel.create({
    ...payload,
    requestedBy: user._id,
  });
};

const getAllStockAddRequests = async () => {
  return StockAddRequestModel.find()
    .populate("size")
    .populate("requestedBy")
    .sort("-createdAt");
};

const acceptStockAddRequest = async (id: string, status: string) => {
  const request = await StockAddRequestModel.findById(id);
  if (!request) throw new AppError(httpStatus.NOT_FOUND, "Request not found");

  if (request.status !== "pending")
    throw new AppError(httpStatus.BAD_REQUEST, "Already processed");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (status === "rejected") {
      request.status = "rejected";
      await request.save({ session });
      await session.commitTransaction();
      session.endSession();
      return request;
    }

    let stock = await StockModel.findOne({
      size: request.size,
      expiryDate: request.expiryDate,
    }).session(session);

    if (!stock) {
      stock = await StockModel.create([request], { session });
      stock = stock[0];
    } else {
      stock.quantity += request.quantity;
      await stock.save({ session });
    }

    await RecordModel.create(
      [
        {
          size: request.size,
          quantity: request.quantity,
          expiryDate: request.expiryDate,
          sellingPrice: request.sellingPrice,
          buyingPrice: request.buyingPrice,
          batchNo: request.batchNo,
          imgUrl: request.imgUrl,
          interactedBy: request.requestedBy,
          type: "stock_in",
          profit: 0,
        },
      ],
      { session },
    );

    request.status = "accepted";
    await request.save({ session });

    await session.commitTransaction();
    session.endSession();

    return stock;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const StockAddRequestService = {
  createStockAddRequest,
  getAllStockAddRequests,
  acceptStockAddRequest,
};
