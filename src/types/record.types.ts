import { TStock } from "./stock.types";
import { TUser } from "./user.types";

export type TRecord = {
  soldBy?: TUser;
  stockedBy?: TUser;
  soldDate?: string;
  stockDate?: string;
  quantity: number;
  stockId: TStock;
  status: "sold" | "stocked" | "pending" | "rejected" | "accepted";
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};
