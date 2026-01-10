import type { TSize } from "./size.interface";
import SizeModel from "./size.model";

// get all product sizes from db
const getAllSizeFromDB = async () => {
  const result = await SizeModel.find({});
  return result;
};

// get single product sizes from db
const getSingleSizeFromDB = async (productName: string) => {
  const result = await SizeModel.findOne({ productName });
  return result;
};

// create new product size
const createSizeIntoDB = async (payload: Partial<TSize>) => {
  const result = await SizeModel.create(payload);
  return result;
};

// update product size
const updateSizeIntoDB = async (
  productName: string,
  payload: Partial<TSize>
) => {
  const result = await SizeModel.findOneAndUpdate({ productName }, payload, {
    new: true,
  });
  return result;
};

// delete product size
const deleteSizeFromDB = async (productName: string) => {
  const result = await SizeModel.findOneAndDelete({ productName });
  return result;
};

export const SizeService = {
  getAllSizeFromDB,
  createSizeIntoDB,
  updateSizeIntoDB,
  deleteSizeFromDB,
  getSingleSizeFromDB,
};
