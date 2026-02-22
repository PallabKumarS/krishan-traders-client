import { Schema, model, models } from "mongoose";
import { TSaleRequest } from "./sale-requests.interface";

const saleRequestSchema = new Schema<TSaleRequest>(
  {
    stocks: [
      {
        stock: { type: Schema.Types.ObjectId, ref: "Stock" },
        quantity: Number,
      },
    ],

    soldTo: Schema.Types.Mixed,

    accountId: { type: Schema.Types.ObjectId, ref: "Account" },

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const SaleRequestModel =
  models.SaleRequest || model<TSaleRequest>("SaleRequest", saleRequestSchema);

export default SaleRequestModel;
