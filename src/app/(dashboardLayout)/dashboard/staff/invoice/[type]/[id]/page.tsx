import { getSingleSellRequest } from "@/services/RequestService";
import { getSingleSell } from "@/services/SellService";
import { TSell, TStockSellRequest } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react";
import InvoiceClient from "./InvoiceClient";
import LoadingData from "@/components/shared/LoadingData";

export const metadata: Metadata = {
  title: "Invoice Details | Krishan Traders",
  description: "View detailed information about a specific invoice",
};

const page = async ({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) => {
  let invoiceDataPromise: Promise<{ data: TStockSellRequest | TSell } | null> =
    Promise.resolve(null);

  const { type, id } = await params;

  if (type === "sell") {
    invoiceDataPromise = getSingleSell(id);
  }
  if (type === "request") {
    invoiceDataPromise = getSingleSellRequest(id);
  }

  return (
    <Suspense fallback={<LoadingData />}>
      <InvoiceClient promise={invoiceDataPromise} />
    </Suspense>
  );
};

export default page;
