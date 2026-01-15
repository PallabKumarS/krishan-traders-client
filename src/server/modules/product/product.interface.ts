import { Types } from "mongoose";

export interface TProduct {
  name: string;
  company: Types.ObjectId;
  isDisabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  _id?: Types.ObjectId;
  __v?: number;
}
