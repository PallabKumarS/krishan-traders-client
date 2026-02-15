import { Types } from "mongoose";

export type TTransactionType = "credit" | "debit";

export type TTransactionReason =
  | "sale"
  | "purchase"
  | "expense"
  | "adjustment"
  | "transfer";

export interface TAccountTransaction {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  type: TTransactionType;
  amount: number;
  reason: TTransactionReason;
  transferToAccountInfo?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
