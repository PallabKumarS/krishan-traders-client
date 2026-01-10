import { Request, Response } from "express";
import { CompanyService } from "./company.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// get all company
const getAllCompany = catchAsync(async (req: Request, res: Response) => {
	const data = await CompanyService.getAllCompanyFromDB(req.query);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Company retrieved successfully",
		data,
	});
});

// create company
const createCompany = catchAsync(async (req: Request, res: Response) => {
	const data = await CompanyService.createCompanyIntoDB(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Company created successfully",
		data,
	});
});

// update company
const updateCompany = catchAsync(async (req: Request, res: Response) => {
	const data = await CompanyService.updateCompanyIntoDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Company updated successfully",
		data,
	});
});

// delete company
const deleteCompany = catchAsync(async (req: Request, res: Response) => {
	await CompanyService.deleteCompanyFromDB(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Company deleted successfully",
		data: null,
	});
});

// get all products name based on company
const getProductsNameByCompany = catchAsync(
	async (req: Request, res: Response) => {
		const data = await CompanyService.getProductsNameByCompanyFromDB(
			req.params.id,
		);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Products retrieved successfully",
			data,
		});
	},
);

export const CompanyController = {
	getAllCompany,
	createCompany,
	updateCompany,
	deleteCompany,
	getProductsNameByCompany,
};
