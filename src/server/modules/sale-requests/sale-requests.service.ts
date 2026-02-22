import httpStatus from "http-status";
import { SellService } from "../sell/sell.service";
import SaleRequestModel from "./sale-requests.model";
import { AppError } from "@/server/errors/AppError";
import { TUser } from "../user/user.interface";
import { TSaleRequest } from "./sale-requests.interface";

const createSaleRequest = async (user: TUser, payload:TSaleRequest) => {
  return SaleRequestModel.create({
    ...payload,
    requestedBy: user._id,
  });
};

const getAllSaleRequests = async () => {
  return SaleRequestModel.find()
    .populate("requestedBy")
    .populate("stocks.stock")
    .sort("-createdAt");
};

const acceptSaleRequest = async (id: string, status: string) => {
  const request = await SaleRequestModel.findById(id);

  if (!request) throw new AppError(httpStatus.NOT_FOUND, "Request not found");

  if (request.status !== "pending")
    throw new AppError(httpStatus.BAD_REQUEST, "Already processed");

  if (status === "rejected") {
    request.status = "rejected";
    await request.save();
    return request;
  }

  const sale = await SellService.createSellIntoDB(request.requestedBy, {
    stocks: request.stocks,
    soldTo: request.soldTo,
    accountId: request.accountId,
  });

  request.status = "accepted";
  await request.save();

  return sale;
};

export const SaleRequestService = {
  createSaleRequest,
  getAllSaleRequests,
  acceptSaleRequest,
};
