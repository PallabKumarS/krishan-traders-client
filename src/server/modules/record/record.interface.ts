import type { Types } from "mongoose";

export interface TRecord {
  stock: Types.ObjectId;
  type: "stock_in" | "sale";
  quantity: number;
  stockedBy: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  soldBy?: Types.ObjectId;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;

  _id?: Types.ObjectId;
  __v?: number;
}
