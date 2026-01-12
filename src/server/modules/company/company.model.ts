import mongoose, { Schema, model } from "mongoose";
import type { TCompany } from "./company.interface";

const companySchema = new Schema<TCompany>(
  {
    name: { type: String, required: true },
    products: [{ type: String, required: true }],
    isDisabled: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const CompanyModel =
  mongoose.models.Companys || model<TCompany>("Companys", companySchema);

export default CompanyModel;
