import type { Document, Types } from "mongoose";

export interface TRecord extends Document {
  imgUrl: string;
  size: Types.ObjectId;
  quantity: number;

  stockedDate: Date;
  expiryDate: Date;
  sellingPrice: number;
  buyingPrice: number;

  status: TRecordStatus;
  batchNo?: string;

  createdAt?: Date;
  updatedAt?: Date;

  _id: Types.ObjectId;
  __v: number;

  interactedBy: Types.ObjectId;
  type: "stock_in" | "sale";
}

export type TRecordStatus = "pending" | "accepted" | "rejected";
