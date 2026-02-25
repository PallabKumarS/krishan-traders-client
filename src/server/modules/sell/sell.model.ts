// sell.model.ts

import { Schema, model, models } from "mongoose";
import { TSell } from "./sell.interface";

const sellSchema = new Schema<TSell>(
  {
    stocks: [
      {
        stock: {
          type: Schema.Types.ObjectId,
          ref: "Stock",
          required: true,
        },
        quantity: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
        buyingPrice: { type: Number, required: true },
        profit: { type: Number, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },
    totalProfit: { type: Number, required: true },

    soldTo: {
      type: Schema.Types.Mixed,
      default: "walk-in",
    },

    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    soldBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const SellModel = models.Sell || model<TSell>("Sell", sellSchema);

export default SellModel;
