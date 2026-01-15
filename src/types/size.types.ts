import { TProduct } from "./product.types";

export interface TSize {
  product: TProduct;

  label: string;
  unit: "ml" | "gm" | "kg" | "ltr";
  unitQuantity: number;
  stackCount: number;

  isActive: boolean;
}
