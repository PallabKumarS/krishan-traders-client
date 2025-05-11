import { TUser } from "./user.types";

export type TRecord = {
  soldBy?: TUser;
  stockedBy?: TUser;
  soldDate?: string;
  stockDate?: string;
  quantity: number;
  stockId: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};
