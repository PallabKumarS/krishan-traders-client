import { Document, Types } from "mongoose";

export interface TSaleRequest extends Document {
  stocks: {
    stock: Types.ObjectId;
    quantity: number;
    sellingPrice: number;
  }[];

  soldTo:
    | string
    | {
        name?: string;
        email?: string;
        address?: string;
        phoneNumber: string;
      };

  accountId: Types.ObjectId;

  requestedBy: Types.ObjectId;

  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
  __v: number;
}
