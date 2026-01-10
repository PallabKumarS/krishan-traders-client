import { TCompany } from "./company.interface";
import CompanyModel from "./company.model";
import StockModel from "../stock/stock.model";

// get all company from db
const getAllCompanyFromDB = async (query?: Record<string, unknown>) => {
	const sort = (query?.sort as string)?.split(",")?.join(" ") || "name";

	const result = await CompanyModel.find({}).sort(sort);

	return result;
};

// create company into db
const createCompanyIntoDB = async (payload: Partial<TCompany>) => {
	const result = await CompanyModel.create(payload);
	return result;
};

// edit company into db
const updateCompanyIntoDB = async (id: string, payload: Partial<TCompany>) => {
	const result = await CompanyModel.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});
	return result;
};

// delete company from db
const deleteCompanyFromDB = async (id: string) => {
	const result = await CompanyModel.findByIdAndDelete(id);
	return result;
};

// get products by company name using aggregation
const getProductsNameByCompanyFromDB = async (companyName: string) => {
	const result = await StockModel.aggregate([
		{
			$match: {
				companyName: companyName,
			},
		},
		{
			$group: {
				_id: "$productName",
			},
		},
		{
			$project: {
				_id: 0,
				productName: "$_id",
			},
		},
		{
			$sort: {
				productName: 1,
			},
		},
	]);

	return result.map((item) => item.productName);
};

export const CompanyService = {
	getAllCompanyFromDB,
	createCompanyIntoDB,
	updateCompanyIntoDB,
	deleteCompanyFromDB,
	getProductsNameByCompanyFromDB,
};
