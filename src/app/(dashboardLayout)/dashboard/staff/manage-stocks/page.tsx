import { Metadata } from "next";
import ManageStock from "./ManageStock";
import { getCompaniesPromise, getStocksPromise, getStatsPromise } from "./utils";

export const metadata: Metadata = {
  title: "Add Stock | Krishan Traders",
  description: "Add new fertilizer and agricultural products to inventory",
};

const AddStockPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, unknown>>;
}) => {
  const query = await searchParams;

  // Pre-fetch initial data
  const initialCompaniesPromise = getCompaniesPromise();
  const initialStocksPromise = getStocksPromise("all");
  const initialStatsPromise = getStatsPromise("all");

  return (
    <ManageStock
      query={query}
      initialCompaniesPromise={initialCompaniesPromise}
      initialStocksPromise={initialStocksPromise}
      initialStatsPromise={initialStatsPromise}
    />
  );
};

export default AddStockPage;

