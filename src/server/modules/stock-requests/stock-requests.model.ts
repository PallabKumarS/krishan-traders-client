import { Schema, model, models } from "mongoose";
import { TStockAddRequest } from "./stock-requests.interface";

const stockAddRequestSchema = new Schema<TStockAddRequest>(
  {
    size: { type: Schema.Types.ObjectId, ref: "Size", required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },

    sellingPrice: { type: Number, required: true },
    buyingPrice: { type: Number, required: true },

    batchNo: String,
    imgUrl: String,

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const StockAddRequestModel =
  models.StockAddRequest ||
  model<TStockAddRequest>("StockAddRequest", stockAddRequestSchema);

export default StockAddRequestModel;
