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

    expiryDate: { type: Date, required: true },

    sellingPrice: { type: Number, required: true },
    buyingPrice: { type: Number, required: true },

    batchNo: String,
    imgUrl: String,

    interactedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interactedDate: { type: Date, default: Date.now },

    type: {
      type: String,
      enum: ["stock_in", "sale"],
      required: true,
    },

    profit: { type: Number, default: 0 },
  },
  { timestamps: true },
);

recordSchema.index({ size: 1, expiryDate: 1 });

const RecordModel = models.Record || model<TRecord>("Record", recordSchema);

export default RecordModel;
