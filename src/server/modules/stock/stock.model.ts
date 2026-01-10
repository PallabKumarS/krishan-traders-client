import { Schema, model } from "mongoose";
import type { TStock } from "./stock.interface";

const stockSchema = new Schema<TStock>(
	{
		companyName: { type: String, required: true },
		productName: { type: String, required: true },
		size: { type: String, required: true },
		quantity: { type: Number, required: true },
		stockedDate: { type: Date, required: true },
		expiryDate: { type: Date, required: true },
		soldDate: { type: Date },
		stockedBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		soldBy: { type: Schema.Types.ObjectId, ref: "Users" },
		status: {
			type: String,
			enum: ["pending", "accepted", "sold", "expired", "rejected"],
			default: "pending",
		},
		message: { type: String },
	},
	{
		timestamps: true,
	},
);

const StockModel = model<TStock>("Stocks", stockSchema);

export default StockModel;
