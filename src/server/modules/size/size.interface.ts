import { Types } from "mongoose";

export interface TSize {
  product: Types.ObjectId;

  label?: string;
  unit: "ml" | "gm" | "kg" | "ltr";
  unitQuantity: number;
  stackCount: number;

  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  _id?: Types.ObjectId;
  __v?: number;
}
