import type { TStock } from "./stock.interface";
import { StockModel } from "./stock.model";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";

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

export const StockService = {
  getAllStockFromDB,
  updateStockInDB,
  deleteStockFromDB,
};
