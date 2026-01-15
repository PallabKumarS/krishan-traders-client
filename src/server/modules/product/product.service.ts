import { Types } from "mongoose";
import type { TProduct } from "./product.interface";
import ProductModel from "./product.model";

// get all products
const getAllProductsFromDB = async (query?: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query?.company) {
    filter.company = new Types.ObjectId(query.company as string);
  }

  const result = await ProductModel.find(filter).populate("company");
  return result;
};

// create product
const createProductIntoDB = async (payload: Partial<TProduct>) => {
  return await ProductModel.create(payload);
};

// update product
const updateProductIntoDB = async (id: string, payload: Partial<TProduct>) => {
  return await ProductModel.findByIdAndUpdate(id, payload, { new: true });
};

// delete product
const deleteProductFromDB = async (id: string) => {
  return await ProductModel.findByIdAndDelete(id);
};

export const ProductService = {
  getAllProductsFromDB,
  createProductIntoDB,
  updateProductIntoDB,
  deleteProductFromDB,
};
