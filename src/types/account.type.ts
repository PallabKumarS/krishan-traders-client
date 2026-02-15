export type TAccountType = "mobile-bank" | "bank" | "cash";

export interface TAccount {
  _id: string;
  name: string;
  type: TAccountType;
  accountNumber?: string;
  bankName?: string;
  openingBalance: number;
  currentBalance: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}