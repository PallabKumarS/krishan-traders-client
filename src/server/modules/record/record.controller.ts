import { Request, Response } from "express";
import { RecordService } from "./record.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllRecord = catchAsync(async (req: Request, res: Response) => {
	const data = await RecordService.getAllRecordFromDB(req.query);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Records retrieved successfully",
		data: data.data,
		meta: data.meta,
	});
});

// add stock
const addStock = catchAsync(async (req: Request, res: Response) => {
	const result = await RecordService.addStockToDB(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Stock added successfully",
		data: result,
	});
});
// sell stock
const sellStock = catchAsync(async (req: Request, res: Response) => {
	const result = await RecordService.sellStockFromDB(req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Stock sold successfully",
		data: result,
	});
});

// accept add stock
const acceptAddStock = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id!;

	const result = await RecordService.acceptAddStockInDB(id, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Stock accepted successfully",
		data: result,
	});
});

// accept sell stock
const acceptSellStock = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id!;
	const result = await RecordService.acceptSellStockInDB(id, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Stock accepted successfully",
		data: result,
	});
});

// delete record
const deleteRecord = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id!;
	await RecordService.deleteRecordFromDB(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Record deleted successfully",
		data: null,
	});
});

export const RecordController = {
	getAllRecord,
	addStock,
	sellStock,
	acceptAddStock,
	acceptSellStock,
	deleteRecord,
};
