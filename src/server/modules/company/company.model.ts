import { Schema, model } from "mongoose";
import { TCompany } from "./company.interface";

const companySchema = new Schema<TCompany>(
	{
		name: { type: String, required: true },
		products: [{ type: String, required: true }],
		isDisabled: { type: Boolean, default: false },
	},

	{
		timestamps: true,
	},
);

const CompanyModel = model<TCompany>("Companys", companySchema);

export default CompanyModel;
