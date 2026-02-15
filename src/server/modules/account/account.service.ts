import { startSession } from "mongoose";
import { TAccount } from "./account.interface";
import AccountModel from "./account.model";
import AccountTransactionModel from "../accountTransactions/transactions.model";

const createAccount = async (payload: TAccount): Promise<TAccount> => {
  const session = await startSession();
  session.startTransaction();

  try {
    const account = await AccountModel.create(
      [
        {
          ...payload,
          currentBalance: payload.openingBalance || 0,
        },
      ],
      { session },
    );

    if (!account[0]) throw new Error("Failed to create account.");

    if (payload.openingBalance && payload.openingBalance > 0) {
      const accountTransaction = await AccountTransactionModel.create(
        [
          {
            accountId: account[0]._id,
            type: "credit",
            amount: payload.openingBalance,
            reason: "adjustment",
            note: "Opening Balance",
          },
        ],
        { session },
      );

      if (!accountTransaction[0])
        throw new Error("Failed to create account transaction.");
    }

    await session.commitTransaction();
    session.endSession();

    return account[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllAccounts = async () => {
  return await AccountModel.find({}).sort({
    name: 1,
  });
};

const getSingleAccount = async (id: string) => {
  return await AccountModel.findById(id);
};

const updateAccount = async (id: string, payload: Partial<TAccount>) => {
  return await AccountModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteAccount = async (id: string) => {
  return await AccountModel.findByIdAndDelete(id);
};

export const AccountService = {
  createAccount,
  getAllAccounts,
  getSingleAccount,
  updateAccount,
  deleteAccount,
};
