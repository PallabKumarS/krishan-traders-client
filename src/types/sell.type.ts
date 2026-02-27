import { TStock } from "./stock.types";
import { TUser } from "./user.types";

export type TSell = {
  stocks:
    | {
        quantity: number;
        stock: TStock;
        sellingPrice: number;
        buyingPrice: number;
        profit: number;
      }[]
    | [];

  totalAmount: number;
  totalProfit: number;

  soldTo:
    | {
        name?: string;
        email?: string;
        address?: string;

        phoneNumber: string;
      }
    | string;
  accountId: string;
  soldBy: TUser;

  createdAt: Date;
  updatedAt: Date;
  _id: string;
  __v: number;
};

export type TSellBody = {
  stocks: { quantity: number; stock: string; sellingPrice: number }[] | [];
  soldTo:
    | {
        name?: string;
        email?: string;
        address?: string;

        phoneNumber: string;
      }
    | string;
  accountId: string;
};
