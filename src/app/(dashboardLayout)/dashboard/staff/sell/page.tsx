import { Metadata } from "next";
import SellManagement from "./SellManagement";
import { getAllStocks } from "@/services/StockService";
import { Suspense } from "react";
import LoadingData from "@/components/shared/LoadingData";

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

  return (
    <Suspense fallback={<LoadingData />}>
      <SellManagement stocksPromise={getAllStocksPromise} />
    </Suspense>
  );
};

export default page;
