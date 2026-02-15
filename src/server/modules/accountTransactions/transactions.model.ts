import { model, models, Schema } from "mongoose";
import { TAccountTransaction } from "./transactions.interface";

const AccountTransactionSchema = new Schema<TAccountTransaction>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    amount: { type: Number, required: true },

    reason: {
      type: String,
      enum: ["sale", "purchase", "expense", "adjustment", "transfer"],
      required: true,
    },

    transferToAccountInfo: {
      type: String,
    },

    note: { type: String },
  },
  { timestamps: true },
);

const AccountTransactionModel =
  models.AccountTransaction ||
  model("AccountTransaction", AccountTransactionSchema);

export default AccountTransactionModel;
