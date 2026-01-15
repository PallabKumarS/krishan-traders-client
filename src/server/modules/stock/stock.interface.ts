import type { Types } from "mongoose";

export interface TStock {
  variant: Types.ObjectId;
  batchNo?: string;
  quantity: number;

  stockedBy: Types.ObjectId;
  stockedDate?: Date;
  expiryDate?: Date;

  status?: TStockStatus;
  createdAt?: Date;
  updatedAt?: Date;

  _id?: Types.ObjectId;
  __v?: number;
}

export type TStockStatus =
  | "pending"
  | "available"
  | "sold"
  | "expired"
  | "rejected";
