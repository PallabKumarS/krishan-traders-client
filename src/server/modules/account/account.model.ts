import { model, models, Schema } from "mongoose";
import { TAccount } from "./account.interface";

const AccountSchema = new Schema<TAccount>(
  {
    name: { type: String, required: true },

    type: {
      type: String,
      enum: ["mobile-bank", "bank", "cash"],
      required: true,
    },

    accountNumber: { type: String },

    bankName: { type: String },

    openingBalance: { type: Number, default: 0 },

    currentBalance: { type: Number, default: 0 },

    note: { type: String },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const AccountModel =
  models.Account || model<TAccount>("Account", AccountSchema);

export default AccountModel;
