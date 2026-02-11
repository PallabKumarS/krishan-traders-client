import { TMongoose } from ".";
import { TSize } from "./size.types";
import { TUser } from "./user.types";

export interface TRecord {
  imgUrl: string;
  size: TSize & TMongoose;
  quantity: number;

  stockedDate: Date;
  expiryDate: Date;
  sellingPrice: number;
  buyingPrice: number;

  status: TRecordStatus;
  batchNo?: string;

  createdAt?: Date;
  updatedAt?: Date;

  _id: string;
  __v: number;

  interactedBy: TUser & TMongoose;
  type: "stock_in" | "sale";
}

export type TRecordStatus = "pending" | "accepted" | "rejected";
