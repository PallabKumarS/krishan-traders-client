import { model, models, Schema } from "mongoose";
import { TProduct } from "./product.interface";

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    isDisabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 1, company: 1 });

export const ProductModel =
  models.Products || model<TProduct>("Products", productSchema);
