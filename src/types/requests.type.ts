import { TAccount } from "./account.type";
import { TSize } from "./size.types";
import { TStock } from "./stock.types";
import { TUser } from "./user.types";

export type TStockSellRequest = {
  stocks: {
    stock: TStock;
    quantity: number;
  }[];

  soldTo:
    | string
    | {
        name?: string;
        email?: string;
        address?: string;
        phoneNumber: string;
      };

  accountId: TAccount;

  requestedBy: TUser;

  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  __v: number;
};

export type TStockAddRequest = {
  size: TSize;
  quantity: number;
  expiryDate: Date;

  sellingPrice: number;
  buyingPrice: number;

  batchNo?: string;
  imgUrl?: string;

  requestedBy: TUser;

  status: "pending" | "accepted" | "rejected";

  createdAt: Date;
  updatedAt: Date;
  _id: string;
  __v: number;
};
