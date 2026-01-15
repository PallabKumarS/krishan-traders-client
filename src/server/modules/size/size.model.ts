import { Schema, model, models } from "mongoose";
import type { TSize } from "./size.interface";

const sizeSchema = new Schema<TSize>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },

    label: { type: String, required: true },
    unit: {
      type: String,
      enum: ["ml", "gm", "kg", "ltr"],
      required: true,
    },
    quantityPerUnit: Number,
    unitsPerPack: Number,

    tp: Number,
    mrp: Number,
    cashPrice: Number,
    creditPrice: Number,

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

sizeSchema.index({ product: 1 });

export const SizeModel = models.Sizes || model<TSize>("Sizes", sizeSchema);

export default SizeModel;
