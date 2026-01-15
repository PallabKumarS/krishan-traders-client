import { Schema, model, models } from "mongoose";
import type { TRecord } from "./record.interface";

const recordSchema = new Schema<TRecord>(
  {
    stock: {
      type: Schema.Types.ObjectId,
      ref: "Stocks",
      required: true,
    },

    type: {
      type: String,
      enum: ["stock_in", "sale", "return", "adjustment"],
      required: true,
    },

    quantity: { type: Number, required: true },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    note: String,
  },
  { timestamps: true }
);

recordSchema.index({ stock: 1, type: 1 });

export const RecordModel =
  models.Records || model<TRecord>("Records", recordSchema);

export default RecordModel;
