import { TCompany } from "./company.types";

export interface TProduct {
  name: string;
  company: TCompany;
  isDisabled: boolean;

  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
}
