import type { TCompany } from "./company.interface";
import { CompanyModel } from "./company.model";

// get all companies
const getAllCompanyFromDB = async (query?: Record<string, unknown>) => {
  const sort = (query?.sort as string)?.split(",").join(" ") || "name";
  return CompanyModel.find({}).sort(sort);
};

// create company
const createCompanyIntoDB = async (payload: Partial<TCompany>) => {
  return CompanyModel.create(payload);
};

// update company
const updateCompanyIntoDB = async (id: string, payload: Partial<TCompany>) => {
  return CompanyModel.findByIdAndUpdate(id, payload, { new: true });
};

// delete company
const deleteCompanyFromDB = async (id: string) => {
  return CompanyModel.findByIdAndDelete(id);
};

export const CompanyService = {
  getAllCompanyFromDB,
  createCompanyIntoDB,
  updateCompanyIntoDB,
  deleteCompanyFromDB,
};
