import { TCustomer } from "./customer.type";
import { TSize } from "./size.types";

export type TSell = {
  size: TSize;
  quantity: number;
  sellingPrice: number;
  buyingPrice: number;
  profit: number;

  soldTo: TCustomer;
  soldDate: Date;

  createdAt: Date;
  updatedAt: Date;
  _id: string;
  __v: number;
};
