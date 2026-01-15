import type { Types } from "mongoose";

export interface TRecord {
  stock: Types.ObjectId;
  type: "stock_in" | "sale" | "return" | "adjustment";
  quantity: number;
  performedBy?: Types.ObjectId;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;

  _id?: Types.ObjectId;
  __v?: number;
}
