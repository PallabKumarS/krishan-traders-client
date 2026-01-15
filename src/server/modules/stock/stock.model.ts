import { Schema, model, models } from "mongoose";
import type { TStock } from "./stock.interface";

const stockSchema = new Schema<TStock>(
  {
    variant: {
      type: Schema.Types.ObjectId,
      ref: "Variants",
      required: true,
    },

    batchNo: String,
    quantity: { type: Number, required: true },

    stockedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    stockedDate: { type: Date, default: Date.now },
    expiryDate: Date,

    status: {
      type: String,
      enum: ["pending", "available", "sold", "expired", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

stockSchema.index({ variant: 1, expiryDate: 1 });

export const StockModel = models.Stocks || model<TStock>("Stocks", stockSchema);

export default StockModel;
