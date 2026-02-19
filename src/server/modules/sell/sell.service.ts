import SellModel from "./sell.model";
import { TSell } from "./sell.interface";
import { startSession } from "mongoose";
import AccountModel from "../account/account.model";
import AccountTransactionModel from "../accountTransactions/transactions.model";

// ✅ Create Sell
const createSell = async (payload: TSell & { accountId: string }) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { accountId, sellingPrice, buyingPrice, quantity, ...rest } = payload;

    const profit = (sellingPrice - buyingPrice) * quantity;

    const totalAmount = sellingPrice * quantity;

    // 🔹 1. Create Sell
    const sell = await SellModel.create(
      [
        {
          ...rest,
          quantity,
          sellingPrice,
          buyingPrice,
          profit,
        },
      ],
      { session },
    );

    // 🔹 2. Update Account Balance
    const account = await AccountModel.findById(accountId).session(session);

    if (!account) {
      throw new Error("Account not found");
    }

    account.currentBalance += totalAmount;
    await account.save({ session });

    // 🔹 3. Create Account Transaction
    await AccountTransactionModel.create(
      [
        {
          accountId,
          type: "credit",
          amount: totalAmount,
          reason: "sale",
          note: `Sale #${sell[0]._id}`,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return sell[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ✅ Get All Sells
const getAllSells = async () => {
  return await SellModel.find()
    .populate({
      path: "size",
      populate: {
        path: "product",
        populate: { path: "company" },
      },
    })
    .populate("soldTo")
    .sort({ createdAt: -1 });
};

// ✅ Get Single Sell
const getSell = async (id: string) => {
  return await SellModel.findById(id)
    .populate({
      path: "size",
      populate: {
        path: "product",
        populate: { path: "company" },
      },
    })
    .populate("soldTo");
};

// ✅ Update Sell
const updateSell = async (id: string, payload: Partial<TSell>) => {
  if (payload.quantity && payload.sellingPrice && payload.buyingPrice) {
    payload.profit =
      (payload.sellingPrice - payload.buyingPrice) * payload.quantity;
  }

  return await SellModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

// ✅ Delete Sell
const deleteSell = async (id: string) => {
  return await SellModel.findByIdAndDelete(id);
};

export const SellService = {
  createSell,
  getAllSells,
  getSell,
  updateSell,
  deleteSell,
};
