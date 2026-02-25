"use client";

import { TSell, TStock, TStockSellRequest } from "@/types";
import { use } from "react";
import { Button } from "@/components/ui/button";

const InvoiceClient = ({
  promise,
}: {
  promise: Promise<{ data: TStockSellRequest | TSell } | null>;
}) => {
  const res = use(promise);

  if (!res?.data) {
    return <div className="p-10">Invoice not found</div>;
  }

  const data = res.data;

  const isRequest = "requestedBy" in data;

  // 🔹 Normalize items
  const items = data.stocks.map(
    (item: { stock: TStock; quantity: number; sellingPrice?: number }) => ({
      name: item.stock?.size?.product?.name || "Product",
      quantity: item.quantity,
      price: isRequest ? item.stock?.sellingPrice : item.sellingPrice,
      total:
        item.quantity *
        (isRequest ? item.stock?.sellingPrice : (item?.sellingPrice as number)),
    }),
  );

  const totalAmount = isRequest
    ? items.reduce((acc, i) => acc + i.total, 0)
    : (data as TSell).totalAmount;

  const soldTo =
    typeof data.soldTo === "string" ? "Walk-in Customer" : data.soldTo;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen p-10 print:p-0">
      <div className="max-w-4xl mx-auto border p-8 print:border-none">
        {/* 🔹 Pending Badge */}
        {isRequest && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm inline-block mb-4">
            Pending Approval
          </div>
        )}

        {/* 🔹 Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold">Invoice</h2>
            <p className="text-sm text-muted-foreground">
              Invoice ID: {data._id}
            </p>
            <p className="text-sm">
              Date: {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-bold">Krishan Traders</h1>
            <p className="text-sm text-muted-foreground">Sales Invoice</p>
          </div>
        </div>

        {/* 🔹 Customer */}
        <div className="mb-6">
          <h3 className="font-semibold mb-1">Bill To:</h3>
          {typeof soldTo === "string" ? (
            <p>{soldTo}</p>
          ) : (
            <>
              <p>{soldTo.name || "-"}</p>
              <p>{soldTo.phoneNumber}</p>
              <p>{soldTo.email || "-"}</p>
              <p>{soldTo.address || "-"}</p>
            </>
          )}
        </div>

        {/* 🔹 Table */}
        <table className="w-full border text-sm mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Item</th>
              <th className="text-center p-2">Qty</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="text-center p-2">{item.quantity}</td>
                <td className="text-right p-2">৳{item.price}</td>
                <td className="text-right p-2">৳{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔹 Summary */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>৳{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 🔹 Print Button */}
        <div className="mt-8 text-right print:hidden">
          <Button onClick={handlePrint}>Print Invoice</Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceClient;
