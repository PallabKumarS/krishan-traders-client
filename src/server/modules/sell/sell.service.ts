// sell.service.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import { startSession, Types } from "mongoose";
import SellModel from "./sell.model";
import StockModel from "../stock/stock.model";
import RecordModel from "../record/record.model";
import AccountModel from "../account/account.model";
import CustomerModel from "../customer/customer.model";
import { TUser } from "../user/user.interface";
import status from "http-status";
import { AppError } from "@/server/errors/AppError";
import AccountTransactionModel from "../accountTransactions/transactions.model";
import SizeModel from "../size/size.model";
import ProductModel from "../product/product.model";
import CompanyModel from "../company/company.model";

const createSellIntoDB = async (
  user: TUser,
  payload: {
    stocks: { stock: string; quantity: number; sellingPrice: number }[];
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
    const saleId = new Types.ObjectId();
    const transactionId = new Types.ObjectId();

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

      const sellingPrice = item.sellingPrice;
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
            saleId,
            transactionId,
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
          _id: transactionId,
          accountId,
          type: "credit",
          amount: totalAmount,
          reason: "sale",
          note: `Sale transaction`,
          saleId,
        },
      ],
      { session },
    );

    // 🔹 Create Sale Document
    const sale = await SellModel.create(
      [
        {
          _id: saleId,
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
    .populate({ path: "accountId", model: AccountModel })
    .populate({ path: "soldBy", model: "User" })
    .populate({
      path: "stocks.stock",
      model: StockModel,
      populate: {
        path: "size",
        model: SizeModel,
        populate: {
          path: "product",
          model: ProductModel,
          populate: {
            path: "company",
            model: CompanyModel,
          },
        },
      },
    })
    .sort({ createdAt: -1 });
};

const getSingleSaleFromDB = async (id: string) => {
  return await SellModel.findById(id)
    .populate({ path: "accountId", model: AccountModel })
    .populate({ path: "soldBy", model: "User" })
    .populate({
      path: "stocks.stock",
      model: StockModel,
      populate: {
        path: "size",
        model: SizeModel,
        populate: {
          path: "product",
          model: ProductModel,
          populate: {
            path: "company",
            model: CompanyModel,
          },
        },
      },
    });
};

const deleteSaleFromDB = async (id: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const sale = await SellModel.findById(id).session(session);

    if (!sale) {
      throw new AppError(status.NOT_FOUND, "Sale not found");
    }

    // 1. Restore Stock Quantities
    for (const item of sale.stocks) {
      await StockModel.findByIdAndUpdate(
        item.stock,
        { $inc: { quantity: item.quantity } },
        { session },
      );
    }

    // 2. Revert Account Balance
    await AccountModel.findByIdAndUpdate(
      sale.accountId,
      { $inc: { currentBalance: -sale.totalAmount } },
      { session },
    );

    // 3. Delete Related Account Transactions
    // Try saleId first, fallback to matching properties for older records
    await AccountTransactionModel.deleteMany(
      {
        $or: [
          { saleId: id },
          {
            accountId: sale.accountId,
            amount: sale.totalAmount,
            reason: "sale",
            createdAt: {
              $gte: new Date(sale.createdAt.getTime() - 60000),
              $lte: new Date(sale.createdAt.getTime() + 60000),
            },
          },
        ],
      },
      { session },
    );

    // 4. Delete Related Inventory Records
    await RecordModel.deleteMany(
      {
        $or: [
          { saleId: id },
          {
            type: "sale",
            interactedBy: sale.soldBy,
            createdAt: {
              $gte: new Date(sale.createdAt.getTime() - 60000),
              $lte: new Date(sale.createdAt.getTime() + 60000),
            },
          },
        ],
      },
      { session },
    );

    // 5. Delete the Sale Document
    await SellModel.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const SellService = {
  createSellIntoDB,
  getAllSalesFromDB,
  getSingleSaleFromDB,
  deleteSaleFromDB,
};
