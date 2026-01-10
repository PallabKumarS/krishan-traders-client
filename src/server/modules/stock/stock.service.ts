import type { TStock } from "./stock.interface";
import StockModel from "./stock.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

// get all stock
const getAllStockFromDB = async (query?: Record<string, unknown>) => {
	const filter: Record<string, unknown> = {};

	if (query?.status) {
		filter.status = query.status;
	}

	if (query?.productName) {
		filter.productName = { $regex: query.productName, $options: "i" };
	}

	if (query?.companyName) {
		filter.companyName = { $regex: query.companyName, $options: "i" };
	}

	const data = await StockModel.find(filter)
		.sort((query?.sort as string) || "-createdAt")
		.populate("soldBy")
		.populate("stockedBy");

	return data;
};

// update stock
const updateStockInDB = async (id: string, payload: Partial<TStock>) => {
	const isStockExist = await StockModel.findOne({
		_id: id,
	});

	if (!isStockExist) {
		throw new AppError(httpStatus.NOT_FOUND, "Stock not found");
	}

	const result = await StockModel.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});

	return result;
};

// delete stock
const deleteStockFromDB = async (id: string) => {
	const isStockExist = await StockModel.findOne({
		_id: id,
	});

	if (!isStockExist) {
		throw new AppError(httpStatus.NOT_FOUND, "Stock not found");
	}

	const result = await StockModel.findOneAndDelete({ _id: id });

	return result;
};

export const StockService = {
	getAllStockFromDB,
	updateStockInDB,
	deleteStockFromDB,
};
