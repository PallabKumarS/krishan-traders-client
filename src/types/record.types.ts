import { TSize } from "./size.types";
import { TUser } from "./user.types";

export interface TRecord {
  size: TSize;
  quantity: number;

  expiryDate: Date;

  sellingPrice: number;
  buyingPrice: number;

  batchNo?: string;
  imgUrl?: string;

  interactedBy: TUser;
  interactedDate: Date;

  type: "stock_in" | "sale";

  profit: number;

  createdAt: Date;
  updatedAt: Date;
  _id: string;
  __v: number;
}

export type TRecordStatus = "pending" | "accepted" | "rejected";
