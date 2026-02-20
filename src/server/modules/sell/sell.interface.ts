import { Types } from "mongoose";

export type TSell = {
  size: Types.ObjectId;
  quantity: number;
  sellingPrice: number;
  buyingPrice: number;
  profit: number;

  soldTo: Types.ObjectId | string;
  soldDate: Date;

  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
  __v: number;
};
