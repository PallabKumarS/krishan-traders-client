import { TUser } from "./user.types";

export type TStock = {
  brandName: string;
  productName: string;
  size: string;
  status: TStockStatus;
  quantity: number;
  stockDate: Date;
  stockedBy: TUser;
  expiryDate: Date;
  sellDate?: Date;
  soldBy?: TUser;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TStockStatus =
  | "pending"
  | "accepted"
  | "sold"
  | "expired"
  | "rejected";
