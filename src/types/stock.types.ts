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
}

export type TStockStatus =
  | "pending"
  | "available"
  | "sold"
  | "expired"
  | "rejected";
