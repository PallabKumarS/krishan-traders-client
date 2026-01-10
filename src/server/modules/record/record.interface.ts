import type { Types } from "mongoose";

export type TRecord = {
	soldBy?: Types.ObjectId;
	stockedBy?: Types.ObjectId;
	soldDate?: string;
	stockedDate?: string;
	quantity: number;
	stockId: Types.ObjectId;
	status: "sold" | "stocked" | "pending" | "rejected" | "accepted";
	_id?: Types.ObjectId;
	createdAt?: Date;
	updatedAt?: Date;
};
