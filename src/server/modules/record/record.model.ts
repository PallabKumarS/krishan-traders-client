import { Schema, model, models } from "mongoose";
import { TRecord } from "./record.interface";

const recordSchema = new Schema<TRecord>(
  {
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },

    quantity: { type: Number, required: true },

    stockedDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    sellingPrice: { type: Number, required: true },
    buyingPrice: { type: Number, required: true },
    imgUrl: { type: String, default: "" },
    batchNo: String,

    interactedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, required: true, enum: ["stock_in", "sale"] },
  },
  { timestamps: true },
);

recordSchema.index({ size: 1, expiryDate: 1 });

const RecordModel = models.Record || model<TRecord>("Record", recordSchema);

export default RecordModel;
