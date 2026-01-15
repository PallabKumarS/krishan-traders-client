import { Types } from "mongoose";

export interface TSize {
  product: Types.ObjectId;

  label: string;
  unit: "ml" | "gm" | "kg" | "ltr";
  quantityPerUnit?: number;
  unitsPerPack?: number;

  tp?: number;
  mrp?: number;
  cashPrice?: number;
  creditPrice?: number;

  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  _id?: Types.ObjectId;
  __v?: number;
}
