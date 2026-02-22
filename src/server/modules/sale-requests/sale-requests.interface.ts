import { Document, Types } from "mongoose";

export interface TSaleRequest extends Document {
  stocks: {
    stock: Types.ObjectId;
    quantity: number;
  }[];

  // biome-ignore lint/suspicious/noExplicitAny: <>
  soldTo: any;

  accountId: Types.ObjectId;

  requestedBy: Types.ObjectId;

  status: "pending" | "accepted" | "rejected";

  createdAt?: Date;
  updatedAt?: Date;
}
