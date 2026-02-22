import type { Document, Types } from "mongoose";

export interface TRecord extends Document {
  size: Types.ObjectId;
  quantity: number;

  expiryDate: Date;

  sellingPrice: number;
  buyingPrice: number;

  batchNo?: string;
  imgUrl?: string;

  interactedBy: Types.ObjectId;
  interactedDate: Date;

  type: "stock_in" | "sale";

  profit: number;

  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
  __v: number;
}
