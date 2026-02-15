import { startSession } from "mongoose";
import { TAccountTransaction } from "./transactions.interface";
import AccountModel from "../account/account.model";
import AccountTransactionModel from "./transactions.model";

const createTransaction = async (payload: TAccountTransaction) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const account = await AccountModel.findById(payload.accountId).session(
      session,
    );

    if (!account) throw new Error("Account not found");

    if (payload.type === "credit") {
      account.currentBalance += payload.amount;
    } else {
      account.currentBalance -= payload.amount;
    }

    await account.save({ session });

    const transaction = await AccountTransactionModel.create([payload], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getTransactions = async () => {
  return await AccountTransactionModel.find()
    .populate("accountId")
    .sort({ createdAt: -1 });
};

const updateTransaction = async (
  id: string,
  payload: Partial<TAccountTransaction>,
) => {
  return await AccountTransactionModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteTransaction = async (id: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const transaction =
      await AccountTransactionModel.findById(id).session(session);
    if (!transaction) throw new Error("Transaction not found");

    const account = await AccountModel.findById(transaction.accountId).session(
      session,
    );
    if (!account) throw new Error("Account not found");

    if (transaction.type === "credit") {
      account.currentBalance -= transaction.amount;
    } else {
      account.currentBalance += transaction.amount;
    }

    await account.save({ session });

    await AccountTransactionModel.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const AccountTransactionService = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
