import mongoose, { Schema, model } from "mongoose";
import type { TRecord } from "./record.interface";

const recordSchema = new Schema<TRecord>(
  {
    quantity: { type: Number, required: true },
    soldBy: { type: Schema.Types.ObjectId, ref: "Users" },
    soldDate: {
      type: Date,
    },
    stockedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    stockedDate: {
      type: Date,
    },
    stockId: {
      type: Schema.Types.ObjectId,
      ref: "Stocks",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "sold", "expired", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const RecordModel =
  mongoose.models.Records || model<TRecord>("Records", recordSchema);

export default RecordModel;
