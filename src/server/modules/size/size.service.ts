import type { TSize } from "./size.interface";
import { SizeModel } from "./size.model";

// get all sizes
const getAllSizeFromDB = async (query?: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query?.product) {
    filter.product = query.product;
  }

  return SizeModel.find(filter).populate({
    path: "product",
    populate: { path: "company" },
  });
};

// get sizes by product
const getSizeByProductFromDB = async (productId: string) => {
  return SizeModel.find({ product: productId });
};

// create size
const createSizeIntoDB = async (payload: Partial<TSize>) => {
  return SizeModel.create(payload);
};

// update size
const updateSizeIntoDB = async (id: string, payload: Partial<TSize>) => {
  return SizeModel.findByIdAndUpdate(id, payload, { new: true });
};

// delete size
const deleteSizeFromDB = async (id: string) => {
  return SizeModel.findByIdAndDelete(id);
};

export const SizeService = {
  getAllSizeFromDB,
  getSizeByProductFromDB,
  createSizeIntoDB,
  updateSizeIntoDB,
  deleteSizeFromDB,
};
