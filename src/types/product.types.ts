import { TMongoose } from ".";
import { TCompany } from "./company.types";

export interface TProduct {
  name: string;
  company: TCompany & TMongoose;
  isDisabled: boolean;
}
