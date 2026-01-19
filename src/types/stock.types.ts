import { TMongoose } from ".";
import { TSize } from "./size.types";
import { TUser } from "./user.types";

export interface TStock {
  size: TSize & TMongoose;
  batchNo?: string;
  quantity: number;

  stockedBy: TUser & TMongoose;
  stockedDate: Date;
  expiryDate: Date;

  status: TStockStatus;
  imgUrl: string;
  sellingPrice: number;
  buyingPrice: number;
}

export type TStockStatus =
  | "pending"
  | "available"
  | "sold"
  | "expired"
  | "rejected";
