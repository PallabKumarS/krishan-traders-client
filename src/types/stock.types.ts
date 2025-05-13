import { TUser } from "./user.types";

export type TStock = {
  brandName: string;
  productName: string;
  size: string;
  status: TStockStatus;
  quantity: number;
  stockedDate: Date;
  stockedBy: TUser;
  expiryDate: Date;
  soldDate?: Date;
  soldBy?: TUser;
  message?: string;
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
