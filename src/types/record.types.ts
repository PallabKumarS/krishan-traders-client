import {} from ".";
import { TSize } from "./size.types";
import { TUser } from "./user.types";

export interface TRecord {
  imgUrl: string;
  size: TSize;
  quantity: number;

  stockedDate: Date;
  expiryDate: Date;
  sellingPrice: number;
  buyingPrice: number;

  status: TRecordStatus;
  batchNo?: string;

  interactedBy: TUser;
  type: "stock_in" | "sale";

  createdAt: Date;
  updatedAt: Date;
  _id: string;
  __v: number;
}

export type TRecordStatus = "pending" | "accepted" | "rejected";
