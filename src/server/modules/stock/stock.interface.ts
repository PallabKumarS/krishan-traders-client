import { Types } from "mongoose";

export type TStock = {
	companyName: string;
	productName: string;
	size: string;
	status: TStockStatus;
	quantity: number;
	stockedDate: Date;
	stockedBy: Types.ObjectId;
	expiryDate: Date;
	soldDate?: Date;
	soldBy?: Types.ObjectId;
	message?: string;
	_id?: Types.ObjectId;
	createdAt?: Date;
	updatedAt?: Date;
};

export type TStockStatus =
	| "pending"
	| "accepted"
	| "sold"
	| "expired"
	| "rejected";
