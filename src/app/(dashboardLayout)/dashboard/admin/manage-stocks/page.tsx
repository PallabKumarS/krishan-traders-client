import StockManagement from "@/components/modules/StockManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Stocks | Krishan Traders",
  description: "View and manage existing stock inventory for Krishan Traders",
};

const ManageStocksPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, unknown>>;
}) => {
  const query = await searchParams;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <p className="text-muted-foreground mb-8">
        View current stock levels, update quantities, and manage product
        information.
      </p>

      {/* Stock table will be added here */}
      <StockManagement query={query} />
    </div>
  );
};

export default ManageStocksPage;
