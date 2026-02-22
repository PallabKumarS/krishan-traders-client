// sell.interface.ts

import { Types } from "mongoose";

export type TSellItem = {
  stock: Types.ObjectId;
  quantity: number;
  sellingPrice: number;
  buyingPrice: number;
  profit: number;
};

export type TSell = {
  stocks: TSellItem[];

  totalAmount: number;
  totalProfit: number;

  soldTo:
    | string
    | {
        name?: string;
        email?: string;
        address?: string;
        phoneNumber: string;
      };

  accountId: Types.ObjectId;

  createdBy: Types.ObjectId;
};
