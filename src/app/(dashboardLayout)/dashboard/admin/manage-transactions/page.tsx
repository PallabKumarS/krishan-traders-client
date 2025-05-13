import TransactionManagements from "@/components/modules/TransactionManagements";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Records | Krishan Traders",
  description: "View and manage transaction records for Krishan Traders",
};

const ManageRecordsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, unknown>>;
}) => {
  const query = await searchParams;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Transaction Records</h1>
      <p className="text-muted-foreground mb-8">
        View, filter, and export transaction records for your business.
      </p>

      {/* Records table will be added here */}
      <TransactionManagements query={query} />
    </div>
  );
};

export default ManageRecordsPage;
