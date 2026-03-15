import { Metadata } from "next";
import { getAllSells } from "@/services/SellService";
import AllSalesContainer from "./components/AllSalesContainer";

export const metadata: Metadata = {
  title: "All Sales | Krishan Traders",
  description: "View all sales transactions for Krishan Traders",
};

const AllSalesPage = async () => {
  // Fetching data as promise for React.use()
  const salesPromise = getAllSells();

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Sales History</h1>
        <p className="text-muted-foreground">
          View and manage all sales transactions. You can view details and print invoices from here.
        </p>
      </div>

      <AllSalesContainer salesPromise={salesPromise} />
    </div>
  );
};

export default AllSalesPage;
