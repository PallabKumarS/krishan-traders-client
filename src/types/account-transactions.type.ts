import { TAccount } from "./account.type";

export type TTransactionType = "credit" | "debit";

export type TTransactionReason =
  | "sale"
  | "purchase"
  | "expense"
  | "adjustment"
  | "transfer";

export interface TAccountTransaction {
  _id: string;
  accountId: TAccount;
  type: TTransactionType;
  amount: number;
  reason: TTransactionReason;
  transferToAccountInfo?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const accountTransactionReasons = [
  "sale",
  "purchase",
  "expense",
  "adjustment",
  "transfer",
] as const;

export const accountTransactionTypes = ["credit", "debit"];
