import {} from ".";
import { TSize } from "./size.types";
import { TUser } from "./user.types";

export interface TStock {
  size: TSize;
  batchNo?: string;
  quantity: number;

  stockedBy: TUser;
  stockedDate: Date;
  expiryDate: Date;

  status: TStockStatus;
  imgUrl: string;
  sellingPrice: number;
  buyingPrice: number;

  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TStockStatus = "available" | "sold" | "expired";
