import type { Types } from "mongoose";

export interface TStock {
  imgUrl: string;
  size: Types.ObjectId;
  quantity: number;

  stockedBy: Types.ObjectId;
  stockedDate: Date;
  expiryDate: Date;
  sellingPrice: number;
  buyingPrice: number;

  status: TStockStatus;
  batchNo?: string;

  createdAt?: Date;
  updatedAt?: Date;

  _id?: Types.ObjectId;
  __v?: number;
}

export type TStockStatus =
  | "available"
  | "sold"
  | "expired"
