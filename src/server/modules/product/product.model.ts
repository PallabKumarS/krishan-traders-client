import { model, models, Schema } from "mongoose";
import { TProduct } from "./product.interface";

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    isDisabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 1, company: 1 });

const ProductModel =
  models.Product || model<TProduct>("Product", productSchema);

export default ProductModel;
