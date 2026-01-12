import mongoose, { Schema, model } from "mongoose";
import type { TSize } from "./size.interface";

const sizeSchema = new Schema<TSize>(
  {
    productName: { type: String, required: true },
    size: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

const SizeModel = mongoose.models.Sizes || model<TSize>("Sizes", sizeSchema);

export default SizeModel;
