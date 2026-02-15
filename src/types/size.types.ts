import {} from ".";
import { TProduct } from "./product.types";

export interface TSize {
  product: TProduct;

  label: string;
  unit: "ml" | "gm" | "kg" | "ltr";
  unitQuantity: number;
  stackCount: number;
  buyingPrice: number;
  sellingPrice: number;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
}
