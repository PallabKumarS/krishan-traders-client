import ManageStock from "@/components/modules/ManageStock";
import { Metadata } from "next";

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

  return <ManageStock query={query} />;
};

export default AddStockPage;
