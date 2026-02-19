import { Model, Types } from "mongoose";

export interface TCustomer {
  name?: string;
  email?: string;

  phoneNumber: string;
  address?: string;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ICustomer extends Model<TCustomer> {
  isCustomerExists(phone: string): Promise<TCustomer | null>;
}
