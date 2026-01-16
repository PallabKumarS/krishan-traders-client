import type { TCompany } from "./company.interface";

import { Schema, model, models } from "mongoose";

const companySchema = new Schema<TCompany>(
  {
    name: { type: String, required: true, unique: true },
    isDisabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CompanyModel =
  models.Company || model<TCompany>("Company", companySchema);

export default CompanyModel;
