import { TMongoose } from ".";
import { TProduct } from "./product.types";

export interface TSize {
  product: TProduct & TMongoose;

  label: string;
  unit: "ml" | "gm" | "kg" | "ltr";
  unitQuantity: number;
  stackCount: number;

  isActive: boolean;
}
