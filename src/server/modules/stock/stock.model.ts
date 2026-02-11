import { Schema, model, models } from "mongoose";
import type { TStock } from "./stock.interface";

const stockSchema = new Schema<TStock>(
  {
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },

    quantity: { type: Number, required: true },

    stockedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockedDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["available", "sold", "expired"],
      default: "available",
    },
    sellingPrice: { type: Number, required: true },
    buyingPrice: { type: Number, required: true },
    imgUrl: { type: String, default: "" },
    batchNo: String,
  },
  { timestamps: true },
);

stockSchema.index({ size: 1, expiryDate: 1 });

const StockModel = models.Stock || model<TStock>("Stock", stockSchema);

export default StockModel;
