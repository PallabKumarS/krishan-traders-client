"use client";

import { TSell, TStock, TStockSellRequest } from "@/types";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      label: item.stock?.size?.label || "-",
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
    <div className="bg-white min-h-screen print:min-h-0 print:h-auto p-10 print:p-0 print:bg-white">
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background-color: white !important;
            print-color-adjust: exact;
          }
          * {
            box-shadow: none !important;
            border-color: transparent !important;
          }
          .thermal-content {
            width: 80mm !important;
            padding: 5mm !important;
            margin: 0 auto !important;
            border: none !important;
            font-size: 10px !important;
            min-height: 0 !important;
            background: white !important;
          }
          .thermal-content h1 { font-size: 16px !important; margin: 0 !important; }
          .thermal-content h2 { font-size: 14px !important; margin: 0 !important; }
          .thermal-content p { margin: 2px 0 !important; }
          .thermal-table, .thermal-table * {
            border-color: #000 !important;
          }
          .thermal-table { border-bottom: 1px dashed #ccc !important; margin-bottom: 10px !important; }
          .thermal-table th { border-bottom: 1px solid #000 !important; }
          .print-header {
          display:flex !important;
          flex-direction:column-reverse !important;
          align-items:start !important;
          gap:5px !important;
          }

          .no-print { display: none !important; }
        }
      `}</style>
      <div className="max-w-4xl mx-auto border p-8 print:border-none thermal-content">
        {/* 🔹 Pending Badge */}
        {isRequest && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm inline-block mb-4 no-print">
            Pending Approval
          </div>
        )}

        {/* 🔹 Header */}
        <div className="flex justify-between mb-8 print-header">
          <div className="text-left">
            <h2 className="text-xl font-semibold">Invoice</h2>
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Invoice ID: {data._id}
            </p>
            <p className="text-sm whitespace-nowrap">
              Date: {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right print:text-left">
            <h1 className="text-2xl font-bold">Krishan Traders</h1>
            <p className="text-sm text-muted-foreground no-print">Sales Invoice</p>
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
        <table className="w-full text-sm mb-6 thermal-table">
          <thead>
            <tr className="">
              <th className="text-left p-2 w-full">Item</th>
              <th className="text-center p-2 w-[1%] whitespace-nowrap">Qty</th>
              <th className="text-right p-2 w-[1%] whitespace-nowrap">Price</th>
              <th className="text-right p-2 w-[1%] whitespace-nowrap">Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="">
                <td className="p-2 align-top print:text-xs  whitespace-nowrap">{item.name} <Badge variant={"outline"} className="text-xs print:text-[10px] h-4 px-1">{item.label}</Badge></td>
                <td className="text-center p-2 w-[1%] whitespace-nowrap align-top print:text-xs">{item.quantity}</td>
                <td className="text-right p-2 w-[1%] whitespace-nowrap align-top print:text-xs">৳{item.price}</td>
                <td className="text-right p-2 w-[1%] whitespace-nowrap align-top print:text-xs">৳{item.total.toFixed(2)}</td>
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
