import { Document, Types } from "mongoose";

export interface TStockAddRequest extends Document {
  size: Types.ObjectId;
  quantity: number;
  expiryDate: Date;

  sellingPrice: number;
  buyingPrice: number;

  batchNo?: string;
  imgUrl?: string;

  requestedBy: Types.ObjectId;

  status: "pending" | "accepted" | "rejected";

  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
  __v: number;
}
