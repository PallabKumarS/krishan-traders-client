import { Request, Response } from "express";
import { SizeService } from "./size.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// get all size of a product
const getAllSize = catchAsync(async (req: Request, res: Response) => {
	const data = await SizeService.getAllSizeFromDB();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Sizes retrieved successfully",
		data,
	});
});

// get sizes of a product
const getSingleSize = catchAsync(async (req: Request, res: Response) => {
	const data = await SizeService.getSingleSizeFromDB(req.params.productName);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Size retrieved successfully",
		data,
	});
});

// create new size
const createSize = catchAsync(async (req: Request, res: Response) => {
	const data = await SizeService.createSizeIntoDB(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Size created successfully",
		data,
	});
});

// update size
const updateSize = catchAsync(async (req: Request, res: Response) => {
	const data = await SizeService.updateSizeIntoDB(
		req.params.productName,
		req.body,
	);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Size updated successfully",
		data,
	});
});

// delete size
const deleteSize = catchAsync(async (req: Request, res: Response) => {
	await SizeService.deleteSizeFromDB(req.params.productName);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Size deleted successfully",
		data: null,
	});
});

export const SizeController = {
	getAllSize,
	getSingleSize,
	createSize,
	updateSize,
	deleteSize,
};
