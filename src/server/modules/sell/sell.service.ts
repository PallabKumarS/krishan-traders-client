// sell.service.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import { startSession } from "mongoose";
import SellModel from "./sell.model";
import StockModel from "../stock/stock.model";
import RecordModel from "../record/record.model";
import AccountModel from "../account/account.model";
import CustomerModel from "../customer/customer.model";
import { TUser } from "../user/user.interface";
import status from "http-status";
import { AppError } from "@/server/errors/AppError";
import AccountTransactionModel from "../accountTransactions/transactions.model";

const createSellIntoDB = async (
  user: TUser,
  payload: {
    stocks: { stock: string; quantity: number }[];
    soldTo:
      | string
      | {
          phoneNumber: string;
          name?: string;
          email?: string;
          address?: string;
        };
    accountId: string;
  },
) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { stocks, soldTo, accountId } = payload;

    if (!stocks.length) {
      throw new AppError(status.BAD_REQUEST, "No stocks provided.");
    }

    let totalAmount = 0;
    let totalProfit = 0;

    const saleItems: {
      stock: string;
      quantity: number;
      sellingPrice: number;
      buyingPrice: number;
      profit: number;
    }[] = [];

    // 🔹 Process each stock
    for (const item of stocks) {
      const stockData = await StockModel.findById(item.stock)
        .session(session)
        .populate("size");

      if (!stockData) {
        throw new AppError(status.NOT_FOUND, "Stock not found.");
      }

      if (stockData.quantity < item.quantity) {
        throw new AppError(
          status.BAD_REQUEST,
          `Insufficient stock for ${stockData._id}`,
        );
      }

      const sellingPrice = stockData.sellingPrice;
      const buyingPrice = stockData.buyingPrice;

      const profit = (sellingPrice - buyingPrice) * item.quantity;

      const lineTotal = sellingPrice * item.quantity;

      totalAmount += lineTotal;
      totalProfit += profit;

      // 🔹 Reduce stock
      stockData.quantity -= item.quantity;
      await stockData.save({ session });

      // 🔹 Create Record (inventory log)
      await RecordModel.create(
        [
          {
            size: stockData.size._id,
            quantity: item.quantity,
            expiryDate: stockData.expiryDate,
            sellingPrice,
            buyingPrice,
            interactedBy: user._id,
            type: "sale",
            imgUrl: stockData.imgUrl,
            batchNo: stockData.batchNo,
            profit,
            status: "accepted",
            soldTo: typeof soldTo === "string" ? soldTo : soldTo.phoneNumber,
          },
        ],
        { session },
      );

      saleItems.push({
        stock: stockData._id,
        quantity: item.quantity,
        sellingPrice,
        buyingPrice,
        profit,
      });
    }

    // 🔹 Handle Customer
    if (typeof soldTo === "object") {
      const existingCustomer = await CustomerModel.findOne({
        phoneNumber: soldTo.phoneNumber,
      }).session(session);

      if (!existingCustomer) {
        await CustomerModel.create([soldTo], { session });
      } else {
        await CustomerModel.findOneAndUpdate(
          { phoneNumber: soldTo.phoneNumber },
          soldTo,
          { new: true, session },
        );
      }
    }

    // 🔹 Update Account
    const account = await AccountModel.findById(accountId).session(session);

    if (!account) {
      throw new AppError(status.NOT_FOUND, "Account not found");
    }

    account.currentBalance += totalAmount;
    await account.save({ session });

    // 🔹 Account Transaction
    await AccountTransactionModel.create(
      [
        {
          accountId,
          type: "credit",
          amount: totalAmount,
          reason: "sale",
          note: `Sale transaction`,
        },
      ],
      { session },
    );

    // 🔹 Create Sale Document
    const sale = await SellModel.create(
      [
        {
          stocks: saleItems,
          totalAmount,
          totalProfit,
          soldTo,
          accountId,
          soldBy: user._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return sale[0];
  } catch (error: any) {
    console.log(error, error.message);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllSalesFromDB = async () => {
  return await SellModel.find()
    .populate("accountId")
    .populate("soldBy")
    .populate("stocks.stock");
};

const getSingleSaleFromDB = async (id: string) => {
  return await SellModel.findById(id)
    .populate("accountId")
    .populate("soldBy")
    .populate("stocks.stock");
};

const deleteSaleFromDB = async (id: string) => {
  return await SellModel.findByIdAndDelete(id);
};

export const SellService = {
  createSellIntoDB,
  getAllSalesFromDB,
  getSingleSaleFromDB,
  deleteSaleFromDB,
};
