import { Metadata } from "next";
import SellManagement from "./SellManagement";
import { getAllStocks } from "@/services/StockService";
import { Suspense } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { getAllAccounts } from "@/services/Account";

export const metadata: Metadata = {
  title: "Sell | Krishan Traders",
  description: "Sell your products with Krishan Traders.",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, unknown>>;
}) => {
  const query = await searchParams;
  const getAllStocksPromise = getAllStocks(query);
   const accountPromise = getAllAccounts();

  return (
    <Suspense fallback={<LoadingData />}>
      <SellManagement stocksPromise={getAllStocksPromise} accountPromise={accountPromise} />
    </Suspense>
  );
};

export default page;
