import type { TProduct } from "./product.interface";
import { ProductModel } from "./product.model";

// get all products
const getAllProductsFromDB = async (query?: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query?.company) {
    filter.company = query.company;
  }

  return ProductModel.find(filter).populate("company");
};

// create product
const createProductIntoDB = async (payload: Partial<TProduct>) => {
  return ProductModel.create(payload);
};

// update product
const updateProductIntoDB = async (id: string, payload: Partial<TProduct>) => {
  return ProductModel.findByIdAndUpdate(id, payload, { new: true });
};

// delete product
const deleteProductFromDB = async (id: string) => {
  return ProductModel.findByIdAndDelete(id);
};

export const ProductService = {
  getAllProductsFromDB,
  createProductIntoDB,
  updateProductIntoDB,
  deleteProductFromDB,
};
