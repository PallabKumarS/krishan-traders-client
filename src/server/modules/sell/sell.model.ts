import { model, models, Schema } from "mongoose";
import { TSell } from "./sell.interface";

const sellSchema = new Schema<TSell>(
  {
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },

    quantity: { type: Number, required: true },

    sellingPrice: { type: Number, required: true },
    buyingPrice: { type: Number, required: true },

    soldTo: {
      type: Schema.Types.ObjectId || String,
      ref: "Customer",
      required: true,
    },
    soldDate: { type: Date, default: Date.now },

    profit: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const SellModel = models.Sell || model<TSell>("Sell", sellSchema);

export default SellModel;
