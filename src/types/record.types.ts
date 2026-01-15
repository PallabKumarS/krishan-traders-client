import { TStock } from "./stock.types";
import { TUser } from "./user.types";

export interface TRecord {
  stock: TStock;
  type: "stock_in" | "sale";
  quantity: number;
  stockedBy: TUser;
  status: "pending" | "accepted" | "rejected";
  soldBy?: TUser;
  note: string;
}
